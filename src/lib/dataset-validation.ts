/**
 * Dataset Type Definitions and Validation
 * 
 * Zod schemas for validating Project.dataset JSONB structure.
 * Ensures data integrity and type safety throughout the application.
 */

import { z } from 'zod'

/**
 * Data Point Schema
 * 
 * Represents a single data point in the project dataset.
 * field_id + item_id forms a unique key within a project.
 */
export const DataPointSchema = z.object({
  field_id: z.string().min(1, 'field_id is required'),
  item_id: z.string().nullable(), // null for scalar fields, "1", "2", etc. for tabular
  value: z.string(), // Always stored as string; type conversion at app layer
})

export type DataPoint = z.infer<typeof DataPointSchema>

/**
 * Dataset Schema
 * 
 * Complete structure of Project.dataset JSONB field.
 */
export const DatasetSchema = z.object({
  data_points: z.array(DataPointSchema),
  // Corporate fields
  organization_info: z.record(z.unknown()).optional(),
  facilities: z.array(z.unknown()).optional(),
  subsidiaries: z.array(z.unknown()).optional(),
  reporting_period: z.record(z.unknown()).optional(),
  // Product fields
  product_info: z.record(z.unknown()).optional(),
  bom_items: z.array(z.unknown()).optional(),
  processes: z.array(z.unknown()).optional(),
  transport_stages: z.array(z.unknown()).optional(),
}).passthrough()

export type Dataset = z.infer<typeof DatasetSchema>

/**
 * Helper: Validate dataset
 */
export function validateDataset(dataset: unknown): Dataset {
  return DatasetSchema.parse(dataset)
}

/**
 * Helper: Safe dataset validation (returns errors instead of throwing)
 */
export function safeValidateDataset(dataset: unknown): {
  success: boolean
  data?: Dataset
  errors?: z.ZodError
} {
  const result = DatasetSchema.safeParse(dataset)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Helper: Create empty dataset
 */
export function createEmptyDataset(type: 'product' | 'corporate' = 'product'): Dataset {
  const base = { data_points: [] }
  
  if (type === 'corporate') {
    return {
      ...base,
      organization_info: {},
      facilities: [],
      subsidiaries: [],
      reporting_period: {},
    }
  }

  // Product
  return {
    ...base,
    product_info: {},
    bom_items: [],
    processes: [],
    transport_stages: [],
  }
}

/**
 * Helper: Find data point by field_id and item_id
 */
export function findDataPoint(
  dataset: Dataset,
  fieldId: string,
  itemId: string | null = null
): DataPoint | undefined {
  return dataset.data_points.find(
    dp => dp.field_id === fieldId && dp.item_id === itemId
  )
}

/**
 * Helper: Get all data points for a field (useful for tabular data)
 */
export function getDataPointsByField(
  dataset: Dataset,
  fieldId: string
): DataPoint[] {
  return dataset.data_points.filter(dp => dp.field_id === fieldId)
}

/**
 * Helper: Update or insert data point
 */
export function upsertDataPoint(
  dataset: Dataset,
  fieldId: string,
  value: string,
  itemId: string | null = null
): Dataset {
  const existingIndex = dataset.data_points.findIndex(
    dp => dp.field_id === fieldId && dp.item_id === itemId
  )

  if (existingIndex >= 0) {
    // Update existing
    dataset.data_points[existingIndex].value = value
  } else {
    // Insert new
    dataset.data_points.push({ field_id: fieldId, item_id: itemId, value })
  }

  return dataset
}

/**
 * Helper: Remove data point
 */
export function removeDataPoint(
  dataset: Dataset,
  fieldId: string,
  itemId: string | null = null
): Dataset {
  dataset.data_points = dataset.data_points.filter(
    dp => !(dp.field_id === fieldId && dp.item_id === itemId)
  )
  return dataset
}

/**
 * Helper: Get completion percentage for given field IDs
 */
export function calculateCompletion(
  dataset: Dataset,
  requiredFields: string[]
): number {
  if (requiredFields.length === 0) return 100

  const filledFields = requiredFields.filter(fieldId => {
    const dataPoint = findDataPoint(dataset, fieldId)
    return dataPoint && dataPoint.value.trim() !== ''
  })

  return Math.round((filledFields.length / requiredFields.length) * 100)
}

/**
 * Helper: Validate field uniqueness (field_id + item_id)
 */
export function validateFieldUniqueness(dataset: Dataset): {
  valid: boolean
  duplicates: Array<{ field_id: string; item_id: string | null }>
} {
  const seen = new Set<string>()
  const duplicates: Array<{ field_id: string; item_id: string | null }> = []

  for (const dp of dataset.data_points) {
    const key = `${dp.field_id}::${dp.item_id ?? 'null'}`
    if (seen.has(key)) {
      duplicates.push({ field_id: dp.field_id, item_id: dp.item_id })
    }
    seen.add(key)
  }

  return {
    valid: duplicates.length === 0,
    duplicates,
  }
}
