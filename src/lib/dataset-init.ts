/**
 * Dataset Initialization Utilities
 * 
 * Functions to initialize complete dataset structure.
 * Uses the master dataset schema (162 fields from CSV) as the base.
 */

import { ReportTemplate } from './report-templates/types';
import { FieldId } from './field-ids';
import { DataPoint } from './dataset-validation';
import datasetSchema from './dataset-schema.json';

/**
 * Initialize complete dataset structure with ALL fields from master schema
 * 
 * This ensures:
 * 1. Users see all 162 fields available in the system
 * 2. Progress tracking works correctly (% of filled fields)
 * 3. Dataset table shows complete structure
 * 4. Report templates can filter/show subsets of these fields
 */
export function initializeFullDataset(
  existingDataPoints: any[] = []
): DataPoint[] {
  // Get complete list of data points from schema
  const schemaDataPoints = datasetSchema.initialDataset.data_points;

  // Create map of existing data points for quick lookup
  const existingMap = new Map<string, any>();
  for (const dp of existingDataPoints) {
    const key = `${dp.field_id}_${dp.item_id}`;
    existingMap.set(key, dp);
  }

  // Build complete dataset, preserving existing values
  const completeDataset: DataPoint[] = [];

  for (const schemaDp of schemaDataPoints) {
    const key = `${schemaDp.field_id}_${schemaDp.item_id}`;
    const existing = existingMap.get(key);

    if (existing) {
      // Keep existing value
      completeDataset.push({
        field_id: existing.field_id as FieldId,
        item_id: existing.item_id,
        value: existing.value || '',
      });
    } else {
      // Add new field with empty value
      completeDataset.push({
        field_id: schemaDp.field_id as FieldId,
        item_id: schemaDp.item_id,
        value: '',
      });
    }
  }

  return completeDataset;
}

/**
 * Determine if a field is repeatable (tabular) based on schema
 */
function isRepeatableField(fieldId: FieldId): boolean {
  // Check in schema
  const schemaDataPoint = datasetSchema.initialDataset.data_points.find(
    (dp) => dp.field_id === fieldId
  );
  return schemaDataPoint ? schemaDataPoint.item_id !== null : false;
}

/**
 * Get all field IDs that belong to a repeatable group
 */
export function getRepeatableFieldsInGroup(group: string): FieldId[] {
  const fields = datasetSchema.initialDataset.data_points
    .filter((dp) => dp.field_id.startsWith(group + '_') && dp.item_id !== null)
    .map((dp) => dp.field_id as FieldId);

  // Remove duplicates
  return Array.from(new Set(fields));
}

/**
 * Ensure dataset has all required fields
 * Used when updating existing projects
 */
export function ensureDatasetCompleteness(currentDataset: any[]): DataPoint[] {
  return initializeFullDataset(currentDataset);
}

/**
 * Calculate completion percentage based on filled fields
 */
export function calculateDatasetCompletion(dataPoints: any[]): number {
  if (dataPoints.length === 0) return 0;

  const filledCount = dataPoints.filter((dp) => dp.value && dp.value.trim() !== '').length;
  return Math.round((filledCount / dataPoints.length) * 100);
}

/**
 * Get metadata about the dataset schema
 */
export function getDatasetSchemaMeta() {
  return datasetSchema.meta;
}
