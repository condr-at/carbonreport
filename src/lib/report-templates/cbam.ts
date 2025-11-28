import { ReportTemplate } from './types'

/**
 * EU CBAM (Carbon Border Adjustment Mechanism) Declaration Template
 * 
 * EU regulation requiring importers to report embedded emissions in imported goods.
 * 
 * User Story:
 * - Importer fills out company and shipment details
 * - Provides information about goods being imported
 * - Calculates embedded emissions (direct + indirect)
 * - Submits quarterly declarations to EU authorities
 * 
 * Page Layout:
 * 1. Importer Information - Company details and EORI number
 * 2. Goods Information - CN codes, quantities, origin
 * 3. Embedded Emissions - Direct and indirect emissions calculations
 * 4. Supporting Documentation - Evidence and verification
 * 
 * Output: HTML report ready for CBAM registry submission
 */
export const CBAMTemplate: ReportTemplate = {
  code: 'CBAM',
  name: 'EU CBAM Declaration',
  version: '1.0',
  description: 'Carbon Border Adjustment Mechanism declaration for EU imports',
  scope: 'product',
  layoutMeta: {
    layout: 'tabbed',
  },
  sections: [
    {
      key: 'compliance_overview',
      title: 'Compliance Overview',
      blockComponent: 'cbam-overview',
      fields: [
        { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
        { fieldId: 'product_name', isRequired: true, displayOrder: 20 },
        { fieldId: 'product_description', displayOrder: 30 },
        { fieldId: 'product_functional_unit_definition', displayOrder: 40 },
      ],
    },
    {
      key: 'emissions_summary',
      title: 'Declared Emissions',
      blockComponent: 'ghg-summary',
      fields: [
        { fieldId: 'product_total_pcf_co2e', isRequired: true, displayOrder: 10 },
        { fieldId: 'cfp_result_unit', isRequired: true, displayOrder: 20 },
        { fieldId: 'hotspots_summary', displayOrder: 30 },
      ],
    },
    {
      key: 'material_inputs',
      title: 'Material Composition',
      blockComponent: 'repeatable-table',
      config: {
        repeatableKey: 'material_input',
      },
      fields: [
        { fieldId: 'material_input_name', isRequired: true, displayOrder: 10 },
        { fieldId: 'material_input_amount', displayOrder: 20 },
        { fieldId: 'material_input_unit', displayOrder: 30 },
        { fieldId: 'material_origin_country', displayOrder: 40 },
      ],
    },
    {
      key: 'transport_segments',
      title: 'Transport Segments',
      blockComponent: 'repeatable-table',
      config: {
        repeatableKey: 'transport_segment',
      },
      fields: [
        { fieldId: 'product_transport_mode', isRequired: true, displayOrder: 10 },
        { fieldId: 'product_transport_distance_km', displayOrder: 20 },
        { fieldId: 'transport_load_factor', displayOrder: 30 },
      ],
    },
  ],
  
  mailto: {
    subject: 'Carbon Reporting Data Request',
    body: `Dear {{contact_name}},

We are gathering data for the {{project_name}} carbon footprint report and need your help with the following items:

{{field_list}}

These details populate {{field_display_name}} in our reporting workspace and ensure the assessment reflects accurate upstream information.

Please share the data by {{deadline}}. If any of the items are unclear or you need additional context, feel free to reach out so we can clarify promptly.

Thank you for your support,
{{requester_signature}}`
  }
}
