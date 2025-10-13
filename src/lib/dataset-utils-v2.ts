/**
 * Dataset Transformation Utilities (DB-backed)
 * 
 * Functions to transform dataset data points with field definitions from database.
 * No longer depends on report templates - metadata comes from DatasetFieldDefinition.
 */

export interface DataPoint {
  field_id: string
  item_id: string | null
  value: string
}

export interface FieldDefinition {
  field_id: string
  label: string
  hint: string | null
  type: string
  options: any | null
  validation: any | null
  is_repeatable: boolean
  repeatable_key: string | null
}

export interface EnrichedDataPoint extends DataPoint {
  label: string
  hint: string | null
  type: string
  validation?: any
  is_repeatable: boolean
  repeatable_key: string | null
}

/**
 * Enrich data points with field definitions from database
 */
export function enrichDataPoints(
  dataPoints: DataPoint[],
  fieldDefinitions: FieldDefinition[]
): EnrichedDataPoint[] {
  const fieldDefMap = new Map(
    fieldDefinitions.map(f => [f.field_id, f])
  )

  return dataPoints.map((dp) => {
    const fieldDef = fieldDefMap.get(dp.field_id)

    if (!fieldDef) {
      console.warn(`⚠️ No field definition found for ${dp.field_id}`)
      return {
        ...dp,
        label: dp.field_id, // Fallback to field_id
        hint: null,
        type: 'text',
        validation: undefined,
        is_repeatable: false,
        repeatable_key: null,
      }
    }

    return {
      ...dp,
      label: fieldDef.label,
      hint: fieldDef.hint,
      type: fieldDef.type,
      validation: fieldDef.validation,
      is_repeatable: fieldDef.is_repeatable,
      repeatable_key: fieldDef.repeatable_key,
    }
  })
}

/**
 * Flatten enriched data into table rows for TanStack Table
 */
export interface TableRow {
  id: string // unique row id (field_id + item_id)
  fieldId: string
  fieldLabel: string
  fieldHint: string | null
  itemId: string | null
  value: string
  type: string
  validation?: any
  isRepeatable: boolean
  repeatableKey: string | null
}

export function flattenToTableRows(enrichedData: EnrichedDataPoint[]): TableRow[] {
  // Separate singletons and repeatables
  const singletons = enrichedData.filter(d => !d.is_repeatable)
  const repeatables = enrichedData.filter(d => d.is_repeatable)

  // Sort singletons by label
  singletons.sort((a, b) => a.label.localeCompare(b.label))

  // Sort repeatables by repeatable_key, then item_id, then label
  repeatables.sort((a, b) => {
    if (a.repeatable_key !== b.repeatable_key) {
      return (a.repeatable_key || '').localeCompare(b.repeatable_key || '')
    }
    const itemA = parseInt(a.item_id || '0')
    const itemB = parseInt(b.item_id || '0')
    if (itemA !== itemB) {
      return itemA - itemB
    }
    return a.label.localeCompare(b.label)
  })

  // Convert to table rows
  const rows: TableRow[] = [
    ...singletons.map(d => ({
      id: d.field_id,
      fieldId: d.field_id,
      fieldLabel: d.label,
      fieldHint: d.hint,
      itemId: null,
      value: d.value,
      type: d.type,
      validation: d.validation,
      isRepeatable: false,
      repeatableKey: null,
    })),
    ...repeatables.map(d => ({
      id: `${d.field_id}-${d.item_id}`,
      fieldId: d.field_id,
      fieldLabel: d.label,
      fieldHint: d.hint,
      itemId: d.item_id,
      value: d.value,
      type: d.type,
      validation: d.validation,
      isRepeatable: true,
      repeatableKey: d.repeatable_key,
    })),
  ]

  return rows
}

/**
 * Get fields for a repeatable group (by repeatable_key)
 */
export function getFieldsForRepeatableGroup(
  fieldDefinitions: FieldDefinition[],
  repeatableKey: string
): FieldDefinition[] {
  return fieldDefinitions.filter(
    f => f.is_repeatable && f.repeatable_key === repeatableKey
  )
}

/**
 * Get next available item_id for a repeatable group
 */
export function getNextItemId(
  dataPoints: DataPoint[],
  repeatableKey: string,
  fieldDefinitions: FieldDefinition[]
): string {
  // Get all field_ids for this repeatable group
  const groupFieldIds = fieldDefinitions
    .filter(f => f.is_repeatable && f.repeatable_key === repeatableKey)
    .map(f => f.field_id)

  // Find all existing item_ids
  const itemIds = dataPoints
    .filter(dp => groupFieldIds.includes(dp.field_id) && dp.item_id !== null)
    .map(dp => parseInt(dp.item_id!, 10))

  const maxId = itemIds.length > 0 ? Math.max(...itemIds) : 0
  return (maxId + 1).toString()
}

/**
 * Create empty data points for a new repeatable item
 */
export function createEmptyRepeatableItem(
  fieldDefinitions: FieldDefinition[],
  repeatableKey: string,
  itemId: string
): DataPoint[] {
  const groupFields = getFieldsForRepeatableGroup(fieldDefinitions, repeatableKey)

  return groupFields.map(field => ({
    field_id: field.field_id,
    item_id: itemId,
    value: '',
  }))
}
