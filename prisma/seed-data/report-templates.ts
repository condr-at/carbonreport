import type {
  ReportTemplate,
  ReportTemplateFieldMapping,
  ReportTemplateSection,
} from '../../src/lib/report-templates/types'

export type ReportTemplateFieldSeed = ReportTemplateFieldMapping
export type ReportTemplateSectionSeed = ReportTemplateSection
export type ReportTemplateSeed = Omit<ReportTemplate, 'mailto'>

export const REPORT_TEMPLATE_SEED: ReportTemplateSeed[] = [
  {
    code: 'ISO14067',
    name: 'ISO 14067 Carbon Footprint Report',
    version: '1.0',
    description: 'International standard for quantifying the carbon footprint of products.',
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
          { fieldId: 'product_life_cycle_stages_included', isRequired: true, displayOrder: 10 },
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
  },
  {
    code: 'CBAM',
    name: 'EU CBAM Compliance Report',
    version: '1.0',
    description: 'Carbon Border Adjustment Mechanism reporting package.',
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
  },
]
