import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { OrganizationMembershipRole, type Prisma } from '@prisma/client'

import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { type Dataset } from '@/lib/dataset-validation'
import { requireProjectForDataset } from '@/lib/projects/dataset-guards'

function buildMetadata(version: number) {
  const updatedAt = new Date().toISOString()
  return { version, updatedAt }
}

async function findMissingFieldIds(fieldIds: string[]): Promise<string[]> {
  if (!fieldIds.length) {
    return []
  }

  const uniqueIds = Array.from(
    new Set(fieldIds.filter((id) => typeof id === 'string' && id.trim().length > 0)),
  )

  if (!uniqueIds.length) {
    return []
  }

  const definitions = await prisma.datasetFieldDefinition.findMany({
    where: { fieldId: { in: uniqueIds } },
    select: { fieldId: true },
  })

  const known = new Set(definitions.map((definition) => definition.fieldId))
  return uniqueIds.filter((id) => !known.has(id))
}

function unknownFieldIdResponse(missingFieldIds: string[]) {
  return NextResponse.json(
    {
      error: 'Unknown dataset field_id',
      code: 'UNKNOWN_FIELD_ID',
      fieldIds: missingFieldIds,
    },
    { status: 400 },
  )
}

function versionConflictResponse(expected: number | undefined, current: number | null) {
  return errorResponse(
    new ApiError(409, 'VERSION_CONFLICT', 'Dataset version conflict', {
      expectedVersion: expected ?? null,
      currentVersion: current,
    }),
  )
}

const DatasetVersionQuerySchema = z
  .object({ datasetVersion: z.coerce.number().int().min(0).optional() })
  .catch(() => ({ datasetVersion: undefined }))

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { id: projectId, itemId } = await params

    const query = DatasetVersionQuerySchema.parse({
      datasetVersion: request.nextUrl.searchParams.get('datasetVersion'),
    })

    const project = await requireProjectForDataset(user.id, projectId, {
      includeDataset: true,
      requireWritable: true,
      role: OrganizationMembershipRole.EDITOR,
    })

    if (query.datasetVersion !== undefined && query.datasetVersion !== project.datasetVersion) {
      return versionConflictResponse(query.datasetVersion, project.datasetVersion)
    }

    const currentDataset = (project.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset)
    const dataPoints = currentDataset.data_points ?? []
    const targetDataPoints = dataPoints.filter((dp) => dp.item_id === itemId)

    if (targetDataPoints.length === 0) {
      return errorResponse(new ApiError(404, 'NOT_FOUND', 'Dataset item not found'))
    }

    const missingFieldIds = await findMissingFieldIds(targetDataPoints.map((dp) => dp.field_id))
    if (missingFieldIds.length > 0) {
      return unknownFieldIdResponse(missingFieldIds)
    }

    const filteredDataPoints = dataPoints.filter((dp) => dp.item_id !== itemId)

    try {
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
          datasetVersion: project.datasetVersion,
        },
        data: {
          dataset: { data_points: filteredDataPoints } as unknown as Prisma.InputJsonValue,
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
        deletedCount: targetDataPoints.length,
        ...metadata,
      })
    } catch (error: any) {
      if (error?.code === 'P2025') {
        const latest = await prisma.project.findUnique({
          where: { id: projectId },
          select: { datasetVersion: true },
        })

        return versionConflictResponse(query.datasetVersion, latest?.datasetVersion ?? null)
      }

      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset version query parameter', {
          issues: error.flatten(),
        }),
      )
    }

    return errorResponse(ensureApiError(error, 'Failed to delete dataset item'))
  }
}

