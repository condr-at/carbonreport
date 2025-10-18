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
        { fieldId: 'functional_unit', displayOrder: 40 },
      ],
    },
    {
      key: 'emissions_summary',
      title: 'Declared Emissions',
      blockComponent: 'ghg-summary',
      fields: [
        { fieldId: 'total_cfp_co2e', isRequired: true, displayOrder: 10 },
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
        { fieldId: 'transport_mode', isRequired: true, displayOrder: 10 },
        { fieldId: 'transport_distance', displayOrder: 20 },
        { fieldId: 'transport_load_factor', displayOrder: 30 },
      ],
    },
  ],
  
  mailto: {
    subject: 'CBAM Data Request for EU Import Declaration',
    body: `Dear {{contact_name}},

We are preparing our EU CBAM (Carbon Border Adjustment Mechanism) declaration and require the following information from your facility:

**Data Point:** {{data_point_label}}

This data is mandatory for our quarterly CBAM reporting to EU customs authorities. We need verified emissions data for the goods we are importing.

Please provide this information by {{deadline}}.

If you need clarification on what data is required, please contact us immediately as CBAM reporting deadlines are strict.

Best regards,
{{user_name}}`
  }
}
