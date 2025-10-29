/**
 * API: Delete Dataset Item
 * 
 * DELETE /api/projects/[id]/dataset/items/[itemId] - Delete all fields with item_id
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { type Dataset } from '@/lib/dataset-validation'

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

    // Filter out all data points with this item_id
    const filteredDataPoints = dataPoints.filter((dp) => dp.item_id !== itemId)
    const deletedCount = dataPoints.length - filteredDataPoints.length

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

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

    return NextResponse.json({
      success: true,
      datasetVersion: updatedProject.datasetVersion,
      deletedCount,
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
