/**
 * API: Dataset Operations
 * 
 * GET /api/projects/[id]/dataset - Read project dataset
 * PUT /api/projects/[id]/dataset - Update entire dataset (with optimistic locking)
 * PATCH /api/projects/[id]/dataset - Update single data point
 * 
 * Key requirements from docs/Requirements v0.0.1.md:
 * - All data lives in Project.dataset JSONB
 * - Use optimistic locking via dataset_version counter
 * - Validate with Zod schemas from dataset-validation.ts
 * - Validate field identifiers as plain strings
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateDataset, type Dataset, type DataPoint } from '@/lib/dataset-validation'
import { z } from 'zod'

// Schema for PATCH - single field update
const PatchDataPointSchema = z.object({
  field_id: z.string().min(1, 'field_id is required'),
  item_id: z.string().nullable(),
  value: z.string(),
  datasetVersion: z.number().int().min(0).optional(),
})

// Request schema for UPDATE
const UpdateDatasetSchema = z.object({
  dataset: z.any(), // Will be validated with DatasetSchema
  datasetVersion: z.number().int().min(0),
})

/**
 * GET /api/projects/[id]/dataset
 * Returns project dataset with current version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        dataset: true,
        datasetVersion: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Validate dataset structure (optional, for safety)
    try {
      const validatedDataset = validateDataset(project.dataset)
      
      return NextResponse.json({
        projectId: project.id,
        projectName: project.name,
        dataset: validatedDataset,
        datasetVersion: project.datasetVersion,
      })
    } catch (validationError) {
      // Dataset is malformed - return as-is with warning
      console.error('Dataset validation failed:', validationError)
      return NextResponse.json({
        projectId: project.id,
        projectName: project.name,
        dataset: project.dataset,
        datasetVersion: project.datasetVersion,
        warning: 'Dataset structure validation failed',
      })
    }
  } catch (error) {
    console.error('Error fetching dataset:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dataset' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/projects/[id]/dataset
 * Updates dataset with optimistic locking
 * 
 * Requirements:
 * - Validates dataset structure with Zod
 * - Checks datasetVersion to prevent concurrent edits
 * - Increments datasetVersion on successful update
 * - Returns 409 Conflict if version mismatch
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    
    // Validate request body
    const { dataset: rawDataset, datasetVersion: clientVersion } = UpdateDatasetSchema.parse(body)

    // Validate dataset structure with Zod
    let validatedDataset: Dataset
    try {
      validatedDataset = validateDataset(rawDataset)
    } catch (validationError) {
      return NextResponse.json(
        { 
          error: 'Invalid dataset structure', 
          details: validationError instanceof Error ? validationError.message : 'Unknown error'
        },
        { status: 400 }
      )
    }

    // Optimistic locking: update only if version matches
    try {
      const updatedProject = await prisma.project.update({
        where: {
          id: projectId,
          datasetVersion: clientVersion, // This is the key: WHERE clause checks version
        },
        data: {
          dataset: validatedDataset as any, // Prisma accepts JSONB as any
          datasetVersion: { increment: 1 }, // Atomic increment
        },
        select: {
          id: true,
          name: true,
          dataset: true,
          datasetVersion: true,
        },
      })

      return NextResponse.json({
        success: true,
        projectId: updatedProject.id,
        datasetVersion: updatedProject.datasetVersion, // Return new version
        message: 'Dataset updated successfully',
      })
    } catch (prismaError: any) {
      // Check if update failed due to version mismatch (WHERE clause didn't match)
      if (prismaError.code === 'P2025') {
        // P2025 = Record to update not found (version mismatch)
        return NextResponse.json(
          { 
            error: 'Concurrent edit detected', 
            message: 'Someone else has modified this project. Please reload and try again.',
            code: 'VERSION_CONFLICT'
          },
          { status: 409 } // 409 Conflict
        )
      }
      throw prismaError // Re-throw other errors
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating dataset:', error)
    return NextResponse.json(
      { error: 'Failed to update dataset' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/projects/[id]/dataset
 * Update a single data point value (more efficient than PUT for single field edits)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    
    // Validate request body
    const { field_id, item_id, value, datasetVersion } = PatchDataPointSchema.parse(body)

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

    // Find existing data point
    const existingIndex = dataPoints.findIndex(
      (dp) =>
        dp.field_id === field_id &&
        (item_id === null ? dp.item_id === null : dp.item_id === item_id)
    )

    let updatedDataPoint: DataPoint

    if (existingIndex >= 0) {
      // Update existing
  updatedDataPoint = { field_id, item_id, value }
      dataPoints[existingIndex] = updatedDataPoint
    } else {
      // Insert new
  updatedDataPoint = { field_id, item_id, value }
      dataPoints.push(updatedDataPoint)
    }

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
      updatedDataPoint,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating data point:', error)
    return NextResponse.json(
      { error: 'Failed to update data point' },
      { status: 500 }
    )
  }
}
