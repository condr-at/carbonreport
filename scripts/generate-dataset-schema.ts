import { parseDatasetSchemaFromCSV, generateInitialDataPoints, generateFieldIds } from '../src/lib/dataset-schema-parser';
import * as path from 'path';
import * as fs from 'fs';

const csvPath = path.join(__dirname, '../docs/REFERENCE_iso_report_data.csv');
const schema = parseDatasetSchemaFromCSV(csvPath);

// Generate complete dataset structure
const dataPoints = generateInitialDataPoints(schema);
const fieldIds = generateFieldIds(schema);

// Create output structure
const output = {
  meta: {
    totalFields: schema.allFields.length,
    totalSections: schema.sections.size,
    generatedAt: new Date().toISOString(),
    source: 'REFERENCE_iso_report_data.csv',
  },
  fieldIds,
  sections: Array.from(schema.sections.entries()).map(([section, fields]) => ({
    name: section,
    fieldCount: fields.length,
    fields: fields.map((f) => ({
      name: f.field,
      isRepeatable: f.isRepeatable,
      fieldId: `${section.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^./, (chr) => chr.toUpperCase())}_${f.field.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^./, (chr) => chr.toUpperCase())}`,
    })),
  })),
  initialDataset: {
    data_points: dataPoints,
  },
};

// Save to JSON
const outputPath = path.join(__dirname, '../src/lib/dataset-schema.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✅ Generated dataset schema with ${schema.allFields.length} fields`);
console.log(`📝 Saved to: ${outputPath}`);
console.log(`\nBreakdown:`);
console.log(`  - Sections: ${schema.sections.size}`);
console.log(`  - Singleton fields: ${dataPoints.filter((dp) => dp.item_id === null).length}`);
console.log(`  - Repeatable fields: ${dataPoints.filter((dp) => dp.item_id !== null).length}`);
