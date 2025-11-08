/**
 * API: Delete Dataset Item
 * 
 * DELETE /api/projects/[id]/dataset/items/[itemId] - Delete all fields with item_id
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { type Dataset } from '@/lib/dataset-validation'

function buildMetadata(version: number) {
  const updatedAt = new Date().toISOString()
  return { version, updatedAt }
}

async function findMissingFieldIds(fieldIds: string[]): Promise<string[]> {
  if (!fieldIds.length) {
    return []
  }

  const uniqueIds = Array.from(
    new Set(fieldIds.filter((id) => typeof id === 'string' && id.trim().length > 0))
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
    { status: 400 }
  )
}

/**
 * DELETE /api/projects/[id]/dataset/items/[itemId]
 * Delete all data points with the specified item_id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: projectId, itemId } = await params
    const url = new URL(request.url)
    const datasetVersionParam = url.searchParams.get('datasetVersion')
    
    const datasetVersion = datasetVersionParam
      ? parseInt(datasetVersionParam, 10)
      : undefined

    // Fetch current project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        dataset: true,
        datasetVersion: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check optimistic locking version if provided
    if (datasetVersion !== undefined && datasetVersion !== project.datasetVersion) {
      return NextResponse.json(
        {
          error: 'Dataset version conflict. Please refresh and try again.',
          currentVersion: project.datasetVersion,
        },
        { status: 409 }
      )
    }

    // Get current dataset
    const currentDataset = project.dataset as Dataset | null
    const dataPoints = currentDataset?.data_points || []

    const targetDataPoints = dataPoints.filter((dp) => dp.item_id === itemId)

    if (targetDataPoints.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const missingFieldIds = await findMissingFieldIds(targetDataPoints.map((dp) => dp.field_id))
    if (missingFieldIds.length > 0) {
      return unknownFieldIdResponse(missingFieldIds)
    }

    // Filter out all data points with this item_id
    const filteredDataPoints = dataPoints.filter((dp) => dp.item_id !== itemId)
    const deletedCount = targetDataPoints.length

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        dataset: { data_points: filteredDataPoints } as any,
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
      deletedCount,
      ...metadata,
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
