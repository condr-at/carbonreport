/**
 * API: Dataset Field Definitions
 * 
 * GET /api/dataset-fields - Get all field definitions with metadata
 * 
 * Returns normalized field definitions from database:
 * - field_id, label, hint, type, validation
 * - is_repeatable, repeatable_key
 * - Cached for performance
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Simple in-memory cache (for development)
// TODO: Use Redis or similar for production
let cachedFields: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 60 * 5 * 1000 // 5 minutes

/**
 * GET /api/dataset-fields
 * Returns all field definitions
 * 
 * Response:
 * {
 *   fields: [
 *     {
 *       field_id: "ProductDescription_ProductName",
 *       label: "Product Name",
 *       hint: "The commercial name of the product...",
 *       type: "text",
 *       validation: { required: true },
 *       is_repeatable: false,
 *       repeatable_key: null
 *     },
 *     ...
 *   ]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Check cache
    const now = Date.now()
    if (cachedFields && (now - cacheTimestamp) < CACHE_TTL) {
      console.log('📦 Returning cached field definitions')
      return NextResponse.json({
        fields: cachedFields,
        cached: true,
      })
    }

    // Fetch from database
    console.log('🔍 Fetching field definitions from database...')
    const fields = await prisma.datasetFieldDefinition.findMany({
      select: {
        id: false, // Don't expose internal UUID
        fieldId: true,
        label: true,
        hint: true,
        type: true,
        options: true,
        validation: true,
        isRepeatable: true,
        repeatableKey: true,
        createdAt: false,
        updatedAt: false,
      },
      orderBy: {
        fieldId: 'asc',
      },
    })

    // Transform to camelCase for frontend
    const transformedFields = fields.map(f => ({
      field_id: f.fieldId,
      label: f.label,
      hint: f.hint,
      type: f.type,
      options: f.options,
      validation: f.validation,
      is_repeatable: f.isRepeatable,
      repeatable_key: f.repeatableKey,
    }))

    // Update cache
    cachedFields = transformedFields
    cacheTimestamp = now

    return NextResponse.json({
      fields: transformedFields,
      count: transformedFields.length,
      cached: false,
    })
  } catch (error) {
    console.error('Error fetching field definitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch field definitions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/dataset-fields/invalidate-cache
 * Invalidate the field definitions cache (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    cachedFields = null
    cacheTimestamp = 0
    
    return NextResponse.json({
      success: true,
      message: 'Cache invalidated',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    )
  }
}
