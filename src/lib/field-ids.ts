import datasetSchema from './dataset-schema.json'

/**
 * Field identifiers are now stored as plain strings.
 * This helper exposes common utilities backed by the master dataset schema
 * until the normalized database definitions are fully adopted.
 */
export type FieldId = string

const schemaFieldIds = Array.from(
  new Set(
    datasetSchema.initialDataset.data_points.map((dp) => dp.field_id)
  )
)

/**
 * Helper to check if a string looks like a valid field id.
 * Uses the canonical dataset schema as the source of truth.
 */
export function isValidFieldId(value: string): value is FieldId {
  if (!value || typeof value !== 'string') {
    return false
  }
  return schemaFieldIds.includes(value)
}

/**
 * Get all known field ids from the master schema.
 */
export function getAllFieldIds(): FieldId[] {
  return schemaFieldIds
}
