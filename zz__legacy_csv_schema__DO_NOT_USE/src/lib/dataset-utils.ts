/**
 * Dataset Transformation Utilities
 * 
 * Functions to transform and group dataset data points with template metadata
 * for display in the unified dataset table.
 */

import { ReportTemplate, ReportField } from './report-templates/types';

export interface DataPoint {
  field_id: string;
  item_id: string | null;
  value: string;
}

export interface EnrichedDataPoint extends DataPoint {
  label: string;
  type: string;
  group: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface GroupedData {
  group: string;
  singletons: EnrichedDataPoint[];
  repeatables: Map<string, EnrichedDataPoint[]>; // item_id -> fields
}

/**
 * Group configuration with visual properties
 */
export interface GroupConfig {
  name: string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export const GROUP_CONFIGS: Record<string, GroupConfig> = {
  Product: {
    name: 'Product',
    icon: '📦',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
  },
  Material: {
    name: 'Materials',
    icon: '🔩',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  Energy: {
    name: 'Energy',
    icon: '⚡',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  Transport: {
    name: 'Transport',
    icon: '🚚',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  Emission: {
    name: 'Emissions',
    icon: '💨',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  Manufacturing: {
    name: 'Manufacturing',
    icon: '🏭',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  Packaging: {
    name: 'Packaging',
    icon: '📦',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  UsePhase: {
    name: 'Use Phase',
    icon: '🔄',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
  },
  EndOfLife: {
    name: 'End of Life',
    icon: '♻️',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
  },
  Company: {
    name: 'Company',
    icon: '🏢',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
};

const DEFAULT_GROUP_CONFIG: GroupConfig = {
  name: 'Other',
  icon: '📊',
  bgColor: 'bg-gray-50',
  textColor: 'text-gray-700',
};

/**
 * Extract group name from field_id (e.g., "Material_Name" -> "Material")
 */
export function getGroupFromFieldId(fieldId: string): string {
  const parts = fieldId.split('_');
  return parts[0] || 'Other';
}

/**
 * Get group configuration with visual properties
 */
export function getGroupConfig(group: string): GroupConfig {
  return GROUP_CONFIGS[group] || DEFAULT_GROUP_CONFIG;
}

/**
 * Find template field definition by field_id across multiple templates
 */
export function findTemplateField(
  fieldId: string,
  templates: ReportTemplate[]
): ReportField | null {
  for (const template of templates) {
    for (const section of template.sections) {
      const field = section.fields.find((f) => f.id === fieldId);
      if (field) return field;
    }
  }
  return null;
}

/**
 * Enrich data points with template metadata
 */
export function enrichDataPoints(
  dataPoints: DataPoint[],
  templates: ReportTemplate[]
): EnrichedDataPoint[] {
  return dataPoints.map((dp) => {
    const field = findTemplateField(dp.field_id, templates);
    const group = getGroupFromFieldId(dp.field_id);

    return {
      ...dp,
      label: field?.label || dp.field_id,
      type: field?.type || 'text',
      group,
      required: field?.required || false,
      options: field?.options,
      validation: field?.validation,
    };
  });
}

/**
 * Group enriched data points by field prefix
 */
export function groupDataPoints(
  enrichedDataPoints: EnrichedDataPoint[]
): GroupedData[] {
  // First, group by prefix
  const grouped = new Map<string, EnrichedDataPoint[]>();

  for (const dp of enrichedDataPoints) {
    const group = dp.group;
    if (!grouped.has(group)) {
      grouped.set(group, []);
    }
    grouped.get(group)!.push(dp);
  }

  // Then, within each group, separate singletons from repeatables
  const result: GroupedData[] = [];

  for (const [group, dataPoints] of grouped.entries()) {
    const singletons = dataPoints.filter((dp) => dp.item_id === null);
    const repeatableData = dataPoints.filter((dp) => dp.item_id !== null);

    // Group repeatables by item_id
    const repeatables = new Map<string, EnrichedDataPoint[]>();
    for (const dp of repeatableData) {
      const itemId = dp.item_id!;
      if (!repeatables.has(itemId)) {
        repeatables.set(itemId, []);
      }
      repeatables.get(itemId)!.push(dp);
    }

    result.push({
      group,
      singletons,
      repeatables,
    });
  }

  // Sort groups in preferred order
  const groupOrder = [
    'Product',
    'Material',
    'Energy',
    'Transport',
    'Emission',
    'Manufacturing',
    'Packaging',
    'UsePhase',
    'EndOfLife',
    'Company',
  ];

  result.sort((a, b) => {
    const indexA = groupOrder.indexOf(a.group);
    const indexB = groupOrder.indexOf(b.group);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return result;
}

/**
 * Get all unique field definitions from a group of repeatables
 * Used when adding new items or displaying column headers
 */
export function getUniqueFieldsInGroup(
  dataPoints: EnrichedDataPoint[]
): EnrichedDataPoint[] {
  const fieldMap = new Map<string, EnrichedDataPoint>();

  for (const dp of dataPoints) {
    if (!fieldMap.has(dp.field_id)) {
      fieldMap.set(dp.field_id, dp);
    }
  }

  return Array.from(fieldMap.values());
}

/**
 * Get next available item_id for a group
 */
export function getNextItemId(repeatables: Map<string, EnrichedDataPoint[]>): string {
  const itemIds = Array.from(repeatables.keys()).map((id) => parseInt(id, 10));
  const maxId = itemIds.length > 0 ? Math.max(...itemIds) : 0;
  return (maxId + 1).toString();
}

/**
 * Create empty data points for a new repeatable item
 */
export function createEmptyRepeatableItem(
  fieldDefinitions: EnrichedDataPoint[],
  itemId: string
): DataPoint[] {
  return fieldDefinitions.map((field) => ({
    field_id: field.field_id,
    item_id: itemId,
    value: '',
  }));
}

/**
 * Flatten grouped data into a table row format for TanStack Table
 */
export interface TableRow {
  id: string; // unique row id (field_id + item_id)
  group: string;
  fieldId: string;
  fieldLabel: string;
  itemId: string | null;
  value: string;
  type: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  isSingleton: boolean;
  isFirstInGroup: boolean;
  isFirstInItem: boolean;
  groupConfig: GroupConfig;
}

export function flattenToTableRows(groupedData: GroupedData[]): TableRow[] {
  const rows: TableRow[] = [];

  for (const groupData of groupedData) {
    const groupConfig = getGroupConfig(groupData.group);
    let isFirstInGroup = true;

    // Add singleton rows
    for (const dp of groupData.singletons) {
      rows.push({
        id: `${dp.field_id}`,
        group: groupData.group,
        fieldId: dp.field_id,
        fieldLabel: dp.label,
        itemId: null,
        value: dp.value,
        type: dp.type,
        required: dp.required,
        options: dp.options,
        validation: dp.validation,
        isSingleton: true,
        isFirstInGroup,
        isFirstInItem: true,
        groupConfig,
      });
      isFirstInGroup = false;
    }

    // Add repeatable rows (sorted by item_id)
    const sortedItemIds = Array.from(groupData.repeatables.keys()).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );

    for (const itemId of sortedItemIds) {
      const fields = groupData.repeatables.get(itemId)!;
      let isFirstInItem = true;

      // Sort fields within item for consistent display
      fields.sort((a, b) => a.field_id.localeCompare(b.field_id));

      for (const dp of fields) {
        rows.push({
          id: `${dp.field_id}-${itemId}`,
          group: groupData.group,
          fieldId: dp.field_id,
          fieldLabel: dp.label,
          itemId,
          value: dp.value,
          type: dp.type,
          required: dp.required,
          options: dp.options,
          validation: dp.validation,
          isSingleton: false,
          isFirstInGroup,
          isFirstInItem,
          groupConfig,
        });
        isFirstInGroup = false;
        isFirstInItem = false;
      }
    }
  }

  return rows;
}
