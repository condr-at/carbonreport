import { parseDatasetSchemaFromCSV, generateFieldIds, generateInitialDataPoints } from '../src/lib/dataset-schema-parser';
import * as path from 'path';

const csvPath = path.join(__dirname, '../docs/REFERENCE_iso_report_data.csv');
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

console.log('\nSample Field IDs (first 20):');
const fieldIds = generateFieldIds(schema);
fieldIds.slice(0, 20).forEach((id) => console.log(`  ${id}`));
console.log(`  ... and ${fieldIds.length - 20} more`);

console.log('\nSample Data Points (first 10):');
const dataPoints = generateInitialDataPoints(schema);
dataPoints.slice(0, 10).forEach((dp) => {
  console.log(`  ${dp.field_id} [${dp.item_id || 'singleton'}]`);
});
console.log(`  ... and ${dataPoints.length - 10} more`);
