/**
 * Dataset Initialization Utilities
 *
 * Initializes dataset structures using field definitions stored in the database.
 */

import type { DataPoint } from './dataset-validation'
import type { FieldDefinition } from './dataset-utils-v2'

function buildExistingMap(existing: DataPoint[]) {
  const map = new Map<string, DataPoint>()
  for (const dp of existing) {
    const key = `${dp.field_id}::${dp.item_id ?? 'null'}`
    map.set(key, dp)
  }
  return map
}

function collectRepeatableItemIds(
  fieldDefinitions: FieldDefinition[],
  existingDataPoints: DataPoint[]
) {
  const fieldById = new Map(fieldDefinitions.map((def) => [def.field_id, def]))
  const groupItems = new Map<string, Set<string>>()

  for (const dp of existingDataPoints) {
    if (dp.item_id === null) continue
    const def = fieldById.get(dp.field_id)
    if (!def || !def.is_repeatable) continue

    const groupKey = def.repeatable_key ?? def.field_id
    if (!groupItems.has(groupKey)) {
      groupItems.set(groupKey, new Set())
    }
    groupItems.get(groupKey)!.add(dp.item_id)
  }

  return groupItems
}

export function initializeFullDataset(
  fieldDefinitions: FieldDefinition[],
  existingDataPoints: DataPoint[] = []
): DataPoint[] {
  const existingMap = buildExistingMap(existingDataPoints)
  const repeatableItems = collectRepeatableItemIds(fieldDefinitions, existingDataPoints)
  const result: DataPoint[] = []

  for (const def of fieldDefinitions) {
    if (def.is_repeatable) {
      const groupKey = def.repeatable_key ?? def.field_id
      const items = repeatableItems.get(groupKey)
      const itemIds = items && items.size > 0 ? Array.from(items) : ['1']
      itemIds.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

      for (const itemId of itemIds) {
        const key = `${def.field_id}::${itemId}`
        const existing = existingMap.get(key)
        result.push({
          field_id: def.field_id,
          item_id: itemId,
          value: existing?.value ?? '',
        })
      }
    } else {
      const key = `${def.field_id}::null`
      const existing = existingMap.get(key)
      result.push({
        field_id: def.field_id,
        item_id: null,
        value: existing?.value ?? '',
      })
    }
  }

  // Preserve legacy data points for fields that no longer exist in definitions
  for (const dp of existingDataPoints) {
    if (fieldDefinitions.some((def) => def.field_id === dp.field_id)) continue
    result.push(dp)
  }

  return result
}

export function ensureDatasetCompleteness(
  fieldDefinitions: FieldDefinition[],
  currentDataset: DataPoint[]
): DataPoint[] {
  return initializeFullDataset(fieldDefinitions, currentDataset)
}

export function calculateDatasetCompletion(dataPoints: DataPoint[]): number {
  if (dataPoints.length === 0) return 0
  const filledCount = dataPoints.filter((dp) => dp.value && dp.value.trim() !== '').length
  return Math.round((filledCount / dataPoints.length) * 100)
}
