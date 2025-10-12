/**
 * API: Dataset Operations
 * 
 * GET /api/projects/[id]/dataset - Read project dataset
 * PUT /api/projects/[id]/dataset - Update entire dataset (with optimistic locking)
 * 
 * Key requirements from docs/Requirements v0.0.1.md:
 * - All data lives in Project.dataset JSONB
 * - Use optimistic locking via dataset_version counter
 * - Validate with Zod schemas from dataset-validation.ts
 * - Use FieldId enum for type safety
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateDataset, type Dataset } from '@/lib/dataset-validation'
import { z } from 'zod'

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
