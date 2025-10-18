/**
 * Full Dataset Schema Parser
 * 
 * Parses REFERENCE_iso_report_data.csv to extract complete field structure.
 * This creates the master dataset schema with all possible fields.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface DatasetFieldDefinition {
  section: string;
  field: string;
  isRepeatable: boolean;
  sampleValue?: string;
}

export interface ParsedDatasetSchema {
  sections: Map<string, DatasetFieldDefinition[]>;
  allFields: DatasetFieldDefinition[];
}

/**
 * Parse the reference CSV to extract all field definitions
 */
export function parseDatasetSchemaFromCSV(csvPath: string): ParsedDatasetSchema {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n').slice(1); // Skip header: Section,Field,ItemID,Value

  const sections = new Map<string, DatasetFieldDefinition[]>();
  const fieldMap = new Map<string, DatasetFieldDefinition>();

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split(',');
    if (parts.length < 2) continue;

    const section = parts[0]?.trim();
    const field = parts[1]?.trim();
    const itemId = parts[2]?.trim();
    const value = parts[3]?.trim();

    if (!section || !field) continue;

    const fieldKey = `${section}__${field}`;

    if (!fieldMap.has(fieldKey)) {
      const fieldDef: DatasetFieldDefinition = {
        section,
        field,
        isRepeatable: !!itemId,
        sampleValue: value,
      };
      fieldMap.set(fieldKey, fieldDef);

      if (!sections.has(section)) {
        sections.set(section, []);
      }
      sections.get(section)!.push(fieldDef);
    } else {
      // If we see an itemId for this field, mark it as repeatable
      if (itemId) {
        fieldMap.get(fieldKey)!.isRepeatable = true;
      }
    }
  }

  return {
    sections,
    allFields: Array.from(fieldMap.values()),
  };
}

/**
 * Generate field identifier strings from parsed schema
 * Converts "Product Description" / "ProductName" -> "ProductDescription_ProductName"
 */
export function generateFieldIds(schema: ParsedDatasetSchema): string[] {
  const fieldIds: string[] = [];

  for (const fieldDef of schema.allFields) {
    // Convert section and field names to PascalCase and combine
    const sectionPascal = toPascalCase(fieldDef.section);
    const fieldPascal = toPascalCase(fieldDef.field);
    const fieldId = `${sectionPascal}_${fieldPascal}`;
    fieldIds.push(fieldId);
  }

  return fieldIds;
}

/**
 * Convert string to PascalCase
 * "Product Description" -> "ProductDescription"
 * "End-of-Life" -> "EndOfLife"
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^./, (chr) => chr.toUpperCase());
}

/**
 * Generate DataPoint structure for initialization
 * 
 * Important: For repeatable fields, creates ONE empty item as minimum.
 * This item uses item_id: "1" as a placeholder (will be replaced with UUID on first save).
 */
export function generateInitialDataPoints(schema: ParsedDatasetSchema): Array<{
  field_id: string;
  item_id: string | null;
  value: string;
}> {
  const dataPoints: Array<{
    field_id: string;
    item_id: string | null;
    value: string;
  }> = [];

  for (const fieldDef of schema.allFields) {
    const fieldId = `${toPascalCase(fieldDef.section)}_${toPascalCase(fieldDef.field)}`;

    if (fieldDef.isRepeatable) {
      // Repeatable field: always create at least ONE item (even if empty)
      // This ensures users can immediately start filling data
      dataPoints.push({
        field_id: fieldId,
        item_id: '1', // Placeholder, will be replaced with UUID on save
        value: '',
      });
    } else {
      // Singleton field: item_id is always null
      dataPoints.push({
        field_id: fieldId,
        item_id: null,
        value: '',
      });
    }
  }

  return dataPoints;
}

// CLI usage
if (require.main === module) {
  const csvPath = path.join(__dirname, '../../docs/REFERENCE_iso_report_data.csv');
  const schema = parseDatasetSchemaFromCSV(csvPath);

  console.log('Dataset Schema Summary:');
  console.log('='.repeat(60));
  console.log(`Total fields: ${schema.allFields.length}`);
  console.log(`Total sections: ${schema.sections.size}`);
  console.log('\nSections:');

  for (const [section, fields] of schema.sections) {
    const repeatableCount = fields.filter((f) => f.isRepeatable).length;
    const singletonCount = fields.length - repeatableCount;
    console.log(
      `  ${section}: ${fields.length} fields (${singletonCount} singleton, ${repeatableCount} repeatable)`
    );
  }

  console.log('\nSample Field IDs:');
  const fieldIds = generateFieldIds(schema);
  fieldIds.slice(0, 10).forEach((id) => console.log(`  ${id}`));
  console.log(`  ... and ${fieldIds.length - 10} more`);
}
