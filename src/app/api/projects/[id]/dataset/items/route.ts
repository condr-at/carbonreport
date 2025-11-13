import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { OrganizationMembershipRole, type Prisma } from '@prisma/client'

import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import {
  createEmptyRepeatableItem,
  getFieldsForRepeatableGroup,
  getNextItemId,
  type FieldDefinition,
} from '@/lib/dataset-utils-v2'
import { type Dataset, type DataPoint } from '@/lib/dataset-validation'
import { requireProjectForDataset } from '@/lib/projects/dataset-guards'

const AddItemSchema = z.object({
  repeatableKey: z.string().min(1, 'repeatable_key is required'),
  datasetVersion: z.number().int().min(0).optional(),
})

function buildMetadata(version: number) {
  const updatedAt = new Date().toISOString()
  return { version, updatedAt }
}

function versionConflictResponse(expected: number, current: number | null) {
  return errorResponse(
    new ApiError(409, 'VERSION_CONFLICT', 'Dataset version conflict', {
      expectedVersion: expected,
      currentVersion: current,
    }),
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { id: projectId } = await params
    const payload = await request.json().catch(() => ({}))
    const parsed = AddItemSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset item payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const { repeatableKey, datasetVersion } = parsed.data

    const project = await requireProjectForDataset(user.id, projectId, {
      includeDataset: true,
      requireWritable: true,
      role: OrganizationMembershipRole.EDITOR,
    })

    if (datasetVersion !== undefined && datasetVersion !== project.datasetVersion) {
      return versionConflictResponse(datasetVersion, project.datasetVersion)
    }

    const currentDataset = (project.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset)
    const dataPoints = (currentDataset.data_points ?? []) as DataPoint[]

    const fieldDefinitions = await prisma.datasetFieldDefinition.findMany({
      where: { repeatableKey },
      select: {
        fieldId: true,
        label: true,
        hint: true,
        type: true,
        options: true,
        validation: true,
        isRepeatable: true,
        repeatableKey: true,
        sortOrder: true,
      },
    })

    const normalizedFieldDefinitions: FieldDefinition[] = fieldDefinitions.map((field) => ({
      field_id: field.fieldId,
      label: field.label,
      hint: field.hint,
      type: field.type,
      options: field.options,
      validation: field.validation,
      is_repeatable: field.isRepeatable,
      repeatable_key: field.repeatableKey,
      sort_order: field.sortOrder ?? null,
    }))

    const groupFields = getFieldsForRepeatableGroup(normalizedFieldDefinitions, repeatableKey)

    if (groupFields.length === 0) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', `No repeatable fields found for key ${repeatableKey}`),
      )
    }

    const newItemId = getNextItemId(dataPoints, repeatableKey, normalizedFieldDefinitions)
    const newDataPoints = createEmptyRepeatableItem(
      normalizedFieldDefinitions,
      repeatableKey,
      newItemId,
    )
    const updatedDataPoints = [...dataPoints, ...newDataPoints]

    try {
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
          datasetVersion: project.datasetVersion,
        },
        data: {
          dataset: { data_points: updatedDataPoints } as unknown as Prisma.InputJsonValue,
          datasetVersion: { increment: 1 },
        },
        select: {
          datasetVersion: true,
        },
      })

      const metadata = buildMetadata(updatedProject.datasetVersion)

      return NextResponse.json({
        success: true,
        datasetVersion: updatedProject.datasetVersion,
        itemId: newItemId,
        createdDataPoints: newDataPoints,
        ...metadata,
      })
    } catch (error: any) {
      if (error?.code === 'P2025') {
        const latest = await prisma.project.findUnique({
          where: { id: projectId },
          select: { datasetVersion: true },
        })

        return versionConflictResponse(project.datasetVersion, latest?.datasetVersion ?? null)
      }

      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset item payload', {
          issues: error.flatten(),
        }),
      )
    }

    return errorResponse(ensureApiError(error, 'Failed to add dataset item'))
  }
}

