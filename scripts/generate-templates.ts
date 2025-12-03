
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CORPORATE_CSV_PATH = path.join(PROJECT_ROOT, 'docs/data points guide/datapoints-reports-CORPORATE-2026.csv');
const PRODUCT_CSV_PATH = path.join(PROJECT_ROOT, 'docs/data points guide/datapoints-reports-PRODUCT-2026.csv');
const COMMON_FIELDS_PATH = path.join(PROJECT_ROOT, 'temp/dataset-extra-fields.json');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'src/lib/report-templates/generated');
const TYPES_FILE_PATH = path.join(PROJECT_ROOT, 'src/lib/report-templates/types.ts');
const INDEX_FILE_PATH = path.join(PROJECT_ROOT, 'src/lib/report-templates/index.ts');

interface ReportDefinition {
  code: string;
  scope: 'corporate' | 'product';
  fields: { fieldId: string; isRequired: boolean }[];
}

function parseCSV(filePath: string, scope: 'corporate' | 'product'): ReportDefinition[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) return [];

  const headers = lines[0].split(';').map(h => h.trim());
  const reports: ReportDefinition[] = [];

  // Start from line 1 (second line)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(';').map(v => v.trim());
    const reportCode = values[0];

    if (!reportCode || reportCode === 'hint_for_UI') continue;

    const fields: { fieldId: string; isRequired: boolean }[] = [];

    // Iterate over columns starting from index 1 (assuming index 0 is report code)
    // Wait, headers[0] is 'report_type'. headers[1] is '__reference_urls__'.
    // We need to match values to headers.
    
    for (let j = 1; j < values.length; j++) {
      const header = headers[j];
      const value = values[j];

      if (!header) continue;

      // Skip metadata columns if they are not field IDs
      // The spec says "rows are field_id and metadata".
      // Based on my analysis: Headers are Field IDs.
      // But some headers are metadata like '__reference_urls__'.
      // I should probably skip headers that start with '__' or are known metadata.
      // Looking at CSV: `__reference_urls__`, `data_points_checked_against_reference_url`.
      // Also `reporting_period_start` is a field.
      
      if (header.startsWith('__') || header === 'data_points_checked_against_reference_url') {
        continue;
      }

      if (value === 'M') {
        fields.push({ fieldId: header, isRequired: true });
      } else if (value === 'O') {
        fields.push({ fieldId: header, isRequired: false });
      }
    }

    reports.push({
      code: reportCode,
      scope,
      fields
    });
  }

  return reports;
}

const TEMPLATE_NAME_MAPPING: Record<string, string> = {
  'EPD': 'Environmental Product Declaration (EPD)',
  'ISO_14067': 'Product Carbon Footprint (ISO 14067 Compliant)',
  'RECS_STRATEGY': 'Renewable Energy Certificates (RECs) Strategy',
  'PPA_STRATEGY': 'Power Purchase Agreement (PPA) Strategy',
  'CBAM': 'CBAM (Carbon Border Adjustment Mechanism)',
  'CBAM_REPORT': 'CBAM Quarterly Report',
  'CBAM_MONITORING_ALERT': 'CBAM Monitoring Alert',
  'CBAM_PREP_METHOD': 'CBAM Preparation Method',
  'CBAM_DATA_PACKAGE': 'CBAM Data Package',
  'CBAM_ALLOWANCES': 'CBAM Allowances',
  'CSRD': 'CSRD (Corporate Sustainability Reporting Directive)',
  'EU_ETS': 'EU ETS (Emissions Trading System)',
  'ISO_14064_CERT': 'ISO 14064-1 (Organization Level)',
  'CDP_DISCLOSURE': 'CDP Climate Change Disclosure',
  'IFRS_S2_CLIMATE': 'IFRS S2 Climate-related Disclosures',
  'TCFD_REPORT': 'TCFD Recommendations Report',
  'UK_SECR': 'UK SECR (Streamlined Energy and Carbon Reporting)',
  'SEC_CLIMATE': 'SEC Climate Disclosure',
  'CORSIA': 'CORSIA (Aviation)',
  'EU_MRV': 'EU MRV (Maritime)',
  'SFDR': 'SFDR (Sustainable Finance Disclosure Regulation)',
  'UK_TCFD': 'UK TCFD',
  'HKEX_ESG': 'HKEX ESG Reporting Guide',
  'CORP_GHG': 'Corporate GHG Inventory',
  'CORP_GHG_VERIFIED': 'Verified Corporate GHG Inventory',
  'CORP_GHG_SIMPLIFIED': 'Simplified Corporate GHG Inventory',
  'CORP_GHG_ANNUAL': 'Annual Corporate GHG Report',
  'CORP_GHG_PUBLIC': 'Public Corporate GHG Report',
  'CORP_GHG_INTERNAL': 'Internal Corporate GHG Report',
  'ECOVADIS_SCORE': 'EcoVadis Scorecard',
  'CLIENT_SCOPE3_PACKAGE': 'Client Scope 3 Data Package',
  'CLIENT_TEMPLATE_FILL': 'Client Template Fill',
  'SCOPE3_DETAILED': 'Detailed Scope 3 Report',
  'CARBON_NEUTRAL_CERT': 'Carbon Neutral Certification (PAS 2060)',
  'BANK_TEMPLATE_FILL': 'Bank Data Template Fill',
  'SCOPE123_DATASET': 'Full Scope 1, 2, 3 Dataset',
  'SBTI_COMMITMENT': 'SBTi Commitment Letter',
  'RE100_REPORTING': 'RE100 Reporting',
  'GRESB_ASSESSMENT': 'GRESB Real Estate Assessment',
  'BCORP_IMPACT_ASSESSMENT': 'B Corp Impact Assessment',
  'PREP_GHG': 'Preparation for GHG Inventory',
  'CLIMATE_ACTION_PLAN': 'Climate Action Plan',
  'ENERGY_AUDIT_SCOPE12': 'Energy Audit (Scope 1 & 2)',
  'SCOPE2_DETAILED': 'Detailed Scope 2 Report',
  'SCOPE3_CATEGORY1_SUPPLIERS': 'Scope 3 Category 1 (Suppliers)',
  'PRODUCT_PCF': 'Product Carbon Footprint (GHG Protocol)',
  'BUILDING_CARBON_FOOTPRINT': 'Building Carbon Footprint (EN 15978)'
};

function generateTemplateContent(report: ReportDefinition, commonFields: string[]): string {
  const commonFieldsConfig = commonFields.map(fieldId => ({
    fieldId,
    isRequired: true
  }));

  // Filter out common fields from report fields to avoid duplication if they exist in CSV
  // But spec says "if they are not in CSV".
  // Actually, spec says: "Add Header Section with Common fields... if they are not in CSV".
  // It implies we should check if the report ALREADY has them.
  // If it does, should we move them to Header? Or keep them in Data?
  // Spec: "Перед генерацией списка полей добавить "Header Section"... если их нет в CSV."
  // This phrasing is ambiguous. "Add X if X is not in CSV".
  // If X IS in CSV, do we add it? No.
  // But then where does it go? It stays in "Data" section?
  // Probably we want them in Header section regardless, but maybe we shouldn't duplicate.
  // Let's assume: Always add Header section with Common fields. If a field is also in CSV, remove it from Data section to avoid duplication.
  
  const reportFieldIds = new Set(report.fields.map(f => f.fieldId));
  const commonFieldIds = new Set(commonFields);

  const dataFields = report.fields.filter(f => !commonFieldIds.has(f.fieldId));
  
  // If a common field was in CSV, we use the CSV's requirement? 
  // Spec says Common fields should be `isRequired: true`.
  // So we use the Common definition for them.

  const displayName = TEMPLATE_NAME_MAPPING[report.code] || report.code.replace(/_/g, ' ');

  const template = `import { ReportTemplate } from '../types';

export const ${report.code.replace(/[^a-zA-Z0-9]/g, '')}Template: ReportTemplate = {
  code: '${report.code}' as any, // Cast to any to avoid type errors before types.ts is updated
  name: '${displayName}',
  scope: '${report.scope}',
  sections: [
    {
      key: 'header',
      title: 'Report Header',
      blockComponent: 'default',
      fields: ${JSON.stringify(commonFieldsConfig, null, 2).replace(/"([^"]+)":/g, '$1:')}
    },
    {
      key: 'data',
      title: 'Report Data',
      blockComponent: 'default',
      fields: ${JSON.stringify(dataFields, null, 2).replace(/"([^"]+)":/g, '$1:')}
    }
  ]
};
`;
  return template;
}

async function main() {
  console.log('Starting template generation...');

  // 1. Read Common Fields
  const commonFields = JSON.parse(fs.readFileSync(COMMON_FIELDS_PATH, 'utf-8')) as string[];
  console.log(`Loaded ${commonFields.length} common fields.`);

  // 2. Parse CSVs
  const corporateReports = parseCSV(CORPORATE_CSV_PATH, 'corporate');
  const productReports = parseCSV(PRODUCT_CSV_PATH, 'product');
  const allReports = [...corporateReports, ...productReports];

  console.log(`Found ${allReports.length} reports.`);

  // 3. Generate Files
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const generatedFiles = new Set<string>();

  for (const report of allReports) {
    const fileName = `${report.code.toLowerCase()}.ts`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    const content = generateTemplateContent(report, commonFields);
    fs.writeFileSync(filePath, content);
    generatedFiles.add(fileName);
    console.log(`Generated ${fileName}`);
  }

  // 4. Generate Index
  // const indexContent = generatedFiles.map(f => `export * from './${f.replace('.ts', '')}';`).join('\n');
  // fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  // console.log('Generated index.ts');

  // 5. Update types.ts
  // We need to add new codes to ReportTemplateCode
  const currentTypesContent = fs.readFileSync(TYPES_FILE_PATH, 'utf-8');
  const newCodes = allReports.map(r => `'${r.code}'`);
  
  // Find the ReportTemplateCode type definition
  // It looks like: export type ReportTemplateCode = \n | 'A' \n | 'B' ...
  
  // We will just replace the whole type definition with a new one containing all codes found + existing ones?
  // Or just append?
  // Let's try to parse existing codes.
  
  const typeRegex = /export type ReportTemplateCode =([\s\S]*?)(?=\n\n|$)/;
  const match = currentTypesContent.match(typeRegex);
  
  if (match) {
    const existingBlock = match[1];
    const existingCodes = existingBlock.split('|')
      .map(s => s.trim())
      .filter(s => s.startsWith("'") && s.endsWith("'"))
      .map(s => s.replace(/'/g, ''));
      
    const allCodesSet = new Set([...existingCodes, ...allReports.map(r => r.code)]);
    const sortedCodes = Array.from(allCodesSet).sort();
    
    const newTypeBlock = '\n' + sortedCodes.map(c => `  | '${c}'`).join('\n');
    const newTypesContent = currentTypesContent.replace(typeRegex, `export type ReportTemplateCode =${newTypeBlock}`);
    
    fs.writeFileSync(TYPES_FILE_PATH, newTypesContent);
    console.log('Updated types.ts with new report codes.');
  } else {
    console.warn('Could not find ReportTemplateCode definition in types.ts');
  }

  // 6. Update main index.ts
  // We need to import * from './generated' and add them to REPORT_TEMPLATES
  
  let mainIndexContent = fs.readFileSync(INDEX_FILE_PATH, 'utf-8');
  
  // Check if we already import from generated
  if (!mainIndexContent.includes("from './generated'")) {
    mainIndexContent = `import * as Generated from './generated';\n` + mainIndexContent;
  }

  const generatedFilesArray = Array.from(generatedFiles);

  const imports = generatedFilesArray.map(f => {
    const code = allReports.find(r => `${r.code.toLowerCase()}.ts` === f)?.code;
    const varName = `${code?.replace(/[^a-zA-Z0-9]/g, '')}Template`;
    return `import { ${varName} } from './${f.replace('.ts', '')}';`;
  }).join('\n');
  
  const exports = generatedFilesArray.map(f => `export * from './${f.replace('.ts', '')}';`).join('\n');
  
  const map = `
export const GeneratedReportTemplates = {
${generatedFilesArray.map(f => {
    const code = allReports.find(r => `${r.code.toLowerCase()}.ts` === f)?.code;
    if (!code) return '';
    const varName = `${code.replace(/[^a-zA-Z0-9]/g, '')}Template`;
    return `  '${code}': ${varName},`;
}).join('\n')}
} as const;
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), `${imports}\n\n${exports}\n\n${map}`);
  
  // Now update main index.ts
  // We want to replace `export const REPORT_TEMPLATES ... = { ... }`
  // with something that includes GeneratedReportTemplates.
  
  // Or we can just add `...GeneratedReportTemplates` inside the object.
  
  if (!mainIndexContent.includes('GeneratedReportTemplates')) {
     mainIndexContent = `import { GeneratedReportTemplates } from './generated';\n` + mainIndexContent;
     mainIndexContent = mainIndexContent.replace(
       /export const REPORT_TEMPLATES: Partial<Record<ReportTemplateCode, ReportTemplate>> = {/,
       `export const REPORT_TEMPLATES: Partial<Record<ReportTemplateCode, ReportTemplate>> = {\n  ...GeneratedReportTemplates,`
     );
     fs.writeFileSync(INDEX_FILE_PATH, mainIndexContent);
     console.log('Updated index.ts to include generated templates.');
  } else {
    console.log('index.ts already includes GeneratedReportTemplates.');
  }

  console.log('Done.');
}

main().catch(console.error);
