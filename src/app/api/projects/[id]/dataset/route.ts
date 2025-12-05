/**
 * API: Dataset Operations
 *
 * - GET /api/projects/[id]/dataset
 * - PUT /api/projects/[id]/dataset
 * - PATCH /api/projects/[id]/dataset
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { validateDataset, type Dataset, type DataPoint } from '@/lib/dataset-validation'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { OrganizationMembershipRole, type Prisma } from '@prisma/client'
import { requireProjectForDataset } from '@/lib/projects/dataset-guards'

const PatchDataPointSchema = z.object({
  field_id: z.string().min(1, 'field_id is required'),
  item_id: z.string().nullable(),
  value: z.string(),
  datasetVersion: z.number().int().min(0).optional(),
})

const UpdateDatasetSchema = z.object({
  dataset: z.any(),
  datasetVersion: z.number().int().min(0),
})

const LEGACY_FIELD_IDS = new Set(['custom_client_fields'])

function buildMetadata(version: number) {
  const updatedAt = new Date().toISOString()
  return { version, updatedAt }
}

async function findMissingFieldIds(fieldIds: string[]): Promise<string[]> {
  if (!fieldIds.length) {
    return []
  }

  const filteredIds = fieldIds.filter((id) => id && id.trim().length > 0 && !LEGACY_FIELD_IDS.has(id))
  if (!filteredIds.length) {
    return []
  }

  const uniqueIds = Array.from(new Set(filteredIds))
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

function versionConflictResponse(expected: number, current: number | null) {
  return errorResponse(
    new ApiError(409, 'VERSION_CONFLICT', 'Dataset version conflict', {
      expectedVersion: expected,
      currentVersion: current,
    }),
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { id: projectId } = await params

    const project = await requireProjectForDataset(user.id, projectId, {
      includeDataset: true,
      includeName: true,
      role: OrganizationMembershipRole.VIEWER_READONLY,
    })

    const rawDataset = (project.dataset as unknown) ?? { data_points: [] }

    try {
      const validatedDataset = validateDataset(rawDataset)
      const metadata = buildMetadata(project.datasetVersion)

      return NextResponse.json({
        projectId: project.id,
        projectName: project.name ?? 'Project',
        dataset: validatedDataset,
        datasetVersion: project.datasetVersion,
        ...metadata,
      })
    } catch (validationError) {
      console.error('Dataset validation failed:', validationError)
      const metadata = buildMetadata(project.datasetVersion)
      return NextResponse.json({
        projectId: project.id,
        projectName: project.name ?? 'Project',
        dataset: rawDataset,
        datasetVersion: project.datasetVersion,
        warning: 'Dataset structure validation failed',
        ...metadata,
      })
    }
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to fetch dataset'))
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { id: projectId } = await params
    const payload = await request.json().catch(() => ({}))
    const parsed = UpdateDatasetSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const project = await requireProjectForDataset(user.id, projectId, {
      requireWritable: true,
      role: OrganizationMembershipRole.EDITOR,
    })

    const { dataset: rawDataset, datasetVersion: clientVersion } = parsed.data

    if (clientVersion !== project.datasetVersion) {
      return versionConflictResponse(clientVersion, project.datasetVersion)
    }

    let validatedDataset: Dataset
    try {
      validatedDataset = validateDataset(rawDataset)
    } catch (validationError) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset structure', {
          message:
            validationError instanceof Error ? validationError.message : 'Unknown validation error',
        }),
      )
    }

    const missingFieldIds = await findMissingFieldIds(
      validatedDataset.data_points.map((dataPoint) => dataPoint.field_id),
    )

    if (missingFieldIds.length > 0) {
      return unknownFieldIdResponse(missingFieldIds)
    }

    try {
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
          datasetVersion: clientVersion,
        },
        data: {
          dataset: validatedDataset as unknown as Prisma.InputJsonValue,
          datasetVersion: { increment: 1 },
        },
        select: {
          id: true,
          datasetVersion: true,
        },
      })

      const metadata = buildMetadata(updatedProject.datasetVersion)

      return NextResponse.json({
        success: true,
        projectId: updatedProject.id,
        datasetVersion: updatedProject.datasetVersion,
        message: 'Dataset updated successfully',
        ...metadata,
      })
    } catch (error: any) {
      if (error?.code === 'P2025') {
        const latest = await prisma.project.findUnique({
          where: { id: projectId },
          select: { datasetVersion: true },
        })

        return versionConflictResponse(clientVersion, latest?.datasetVersion ?? null)
      }

      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset payload', {
          issues: error.flatten(),
        }),
      )
    }

    return errorResponse(ensureApiError(error, 'Failed to update dataset'))
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { id: projectId } = await params
    const payload = await request.json().catch(() => ({}))
    const parsed = PatchDataPointSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset update payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const project = await requireProjectForDataset(user.id, projectId, {
      includeDataset: true,
      requireWritable: true,
      role: OrganizationMembershipRole.EDITOR,
    })

    const { field_id: fieldId, item_id: itemId, value, datasetVersion } = parsed.data

    if (datasetVersion !== undefined && datasetVersion !== project.datasetVersion) {
      return versionConflictResponse(datasetVersion, project.datasetVersion)
    }

    const missingFieldIds = await findMissingFieldIds([fieldId])
    if (missingFieldIds.length > 0) {
      return unknownFieldIdResponse(missingFieldIds)
    }

    const currentDataset = (project.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset)
    const dataPoints = currentDataset.data_points ?? []

    const existingIndex = dataPoints.findIndex(
      (dp) => dp.field_id === fieldId && (itemId === null ? dp.item_id === null : dp.item_id === itemId),
    )

    const updatedDataPoint: DataPoint = {
      field_id: fieldId,
      item_id: itemId,
      value,
    }

    if (existingIndex >= 0) {
      dataPoints[existingIndex] = updatedDataPoint
    } else {
      dataPoints.push(updatedDataPoint)
    }

    try {
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
          datasetVersion: project.datasetVersion,
        },
        data: {
          dataset: { data_points: dataPoints } as unknown as Prisma.InputJsonValue,
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
        updatedDataPoint,
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
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid dataset update payload', {
          issues: error.flatten(),
        }),
      )
    }

    return errorResponse(ensureApiError(error, 'Failed to update data point'))
  }
}
