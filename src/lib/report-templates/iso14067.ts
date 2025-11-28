import { ReportTemplate } from './types'

/**
 * ISO 14067 Carbon Footprint Report Template
 * 
 * International standard for quantifying and reporting the carbon footprint of products.
 * 
 * User Story:
 * - User fills out general information about their product
 * - Defines system boundaries (cradle-to-gate, cradle-to-grave)
 * - Calculates GHG emissions across lifecycle stages
 * - Optionally gets third-party verification
 * 
 * Page Layout:
 * 1. General Information - Company and product details
 * 2. System Boundary - Scope definition
 * 3. GHG Calculation - Emissions data
 * 4. Verification - Third-party validation
 * 
 * Output: HTML report with all sections, exportable to PDF
 */
export const ISO14067Template: ReportTemplate = {
  code: 'ISO14067',
  name: 'ISO 14067 Carbon Footprint Report',
  version: '1.0',
  description: 'International standard for quantifying the carbon footprint of products',
  scope: 'product',
  layoutMeta: {
    layout: 'stacked-sections',
  },
  sections: [
    {
      key: 'general_information',
      title: 'General Information',
      description: 'Organization and product details',
      blockComponent: 'general-info',
      fields: [
        { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
        { fieldId: 'report_date', isRequired: true, displayOrder: 20 },
        { fieldId: 'report_language', displayOrder: 30 },
        { fieldId: 'product_name', isRequired: true, displayOrder: 40 },
        { fieldId: 'product_description', displayOrder: 50 },
        { fieldId: 'product_geographic_validity', displayOrder: 60 },
        { fieldId: 'product_functional_unit_definition', isRequired: true, displayOrder: 70 },
      ],
    },
    {
      key: 'system_boundary',
      title: 'System Boundary & Scope',
      blockComponent: 'boundary',
      fields: [
        { fieldId: 'product_system_boundary_description', isRequired: true, displayOrder: 10 },
        { fieldId: 'hotspots_summary', displayOrder: 20 },
      ],
    },
    {
      key: 'ghg_results',
      title: 'GHG Emissions Results',
      blockComponent: 'ghg-summary',
      fields: [
        { fieldId: 'product_total_pcf_co2e', isRequired: true, displayOrder: 10 },
        { fieldId: 'cfp_result_unit', isRequired: true, displayOrder: 20 },
      ],
    },
    {
      key: 'material_inputs',
      title: 'Material Inputs',
      blockComponent: 'repeatable-table',
      config: {
        repeatableKey: 'material_input',
      },
      fields: [
        { fieldId: 'material_input_name', isRequired: true, displayOrder: 10 },
        { fieldId: 'material_input_amount', displayOrder: 20 },
        { fieldId: 'material_input_unit', displayOrder: 30 },
        { fieldId: 'material_origin_country', displayOrder: 40 },
        { fieldId: 'material_data_source', displayOrder: 50 },
      ],
    },
    {
      key: 'energy_inputs',
      title: 'Energy Inputs',
      blockComponent: 'repeatable-table',
      config: {
        repeatableKey: 'energy_input',
      },
      fields: [
        { fieldId: 'energy_input_type', isRequired: true, displayOrder: 10 },
        { fieldId: 'energy_input_amount', displayOrder: 20 },
        { fieldId: 'energy_input_unit', displayOrder: 30 },
        { fieldId: 'energy_source_renewable_percent', displayOrder: 40 },
      ],
    },
  ],
  
  mailto: {
    subject: 'Carbon Reporting Data Request',
    body: `Dear {{contact_name}},

We are compiling data for the {{project_name}} carbon footprint report and would appreciate your help with the following items:

{{field_list}}

These inputs populate {{field_display_name}} so the report can reflect the latest and most accurate information.

Please send the requested data by {{deadline}}. If you have questions or need clarification, let me know and we will gladly assist.

Best regards,
{{requester_signature}}`
  }
}
