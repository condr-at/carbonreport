/**
 * API: Dataset Item Operations
 * 
 * POST /api/projects/[id]/dataset/items - Add new repeatable item
 * DELETE /api/projects/[id]/dataset/items/[itemId] - Delete all fields with item_id
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { type Dataset, type DataPoint } from '@/lib/dataset-validation'
import { z } from 'zod'

const AddItemSchema = z.object({
  group: z.string(), // e.g., "Material"
  fieldIds: z.array(z.string().min(1, 'field_id is required')), // Field IDs to create for this item
  datasetVersion: z.number().int().min(0).optional(),
})

/**
 * POST /api/projects/[id]/dataset/items
 * Add new repeatable item with empty values for specified fields
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    
    const { group, fieldIds, datasetVersion } = AddItemSchema.parse(body)

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

    // Find max item_id for this group
    const groupDataPoints = dataPoints.filter((dp) =>
      dp.field_id.startsWith(group + '_')
    )
    const itemIds = groupDataPoints
      .map((dp) => dp.item_id)
      .filter((id): id is string => id !== null)
      .map((id) => parseInt(id, 10))
    const maxItemId = itemIds.length > 0 ? Math.max(...itemIds) : 0
    const newItemId = (maxItemId + 1).toString()

    // Create new data points for this item
    const newDataPoints: DataPoint[] = fieldIds.map((fieldId) => ({
      field_id: fieldId,
      item_id: newItemId,
      value: '',
    }))

    // Add to dataset
    dataPoints.push(...newDataPoints)

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        dataset: { data_points: dataPoints } as any,
        datasetVersion: { increment: 1 },
      },
      select: {
        datasetVersion: true,
      },
    })

    return NextResponse.json({
      success: true,
      datasetVersion: updatedProject.datasetVersion,
      itemId: newItemId,
      createdDataPoints: newDataPoints,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding item:', error)
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 }
    )
  }
}
