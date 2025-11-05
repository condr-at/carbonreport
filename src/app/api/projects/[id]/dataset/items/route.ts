/**
 * API: Dataset Item Operations
 * 
 * POST /api/projects/[id]/dataset/items - Add new repeatable item
 * DELETE /api/projects/[id]/dataset/items/[itemId] - Delete all fields with item_id
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { type Dataset, type DataPoint } from '@/lib/dataset-validation'
import { getFieldsForRepeatableGroup, type FieldDefinition } from '@/lib/dataset-utils-v2'
import { z } from 'zod'

const AddItemSchema = z.object({
  repeatableKey: z.string().min(1, 'repeatable_key is required'),
  datasetVersion: z.number().int().min(0).optional(),
})

function buildMetadata(version: number) {
  const updatedAt = new Date().toISOString()
  return { version, updatedAt }
}

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
    
  const { repeatableKey, datasetVersion } = AddItemSchema.parse(body)

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

  const currentDataset = project.dataset as Dataset | null
  const dataPoints = currentDataset?.data_points || []

  const fieldDefinitions = await prisma.datasetFieldDefinition.findMany({
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
      return NextResponse.json(
        { error: `No repeatable fields found for key ${repeatableKey}` },
        { status: 400 }
      )
    }

    const existingItemIds = new Set(
      dataPoints
        .filter((dp) => groupFields.some((field) => field.field_id === dp.field_id))
        .map((dp) => dp.item_id)
        .filter((id): id is string => id !== null)
    )

    let nextId = 1
    while (existingItemIds.has(nextId.toString())) {
      nextId += 1
    }
    const newItemId = nextId.toString()

    const newDataPoints: DataPoint[] = groupFields.map((field) => ({
      field_id: field.field_id,
      item_id: newItemId,
      value: '',
    }))

    const updatedDataPoints = [...dataPoints, ...newDataPoints]

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
  dataset: { data_points: updatedDataPoints } as any,
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
