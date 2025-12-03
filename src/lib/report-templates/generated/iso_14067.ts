import { ReportTemplate } from '../types';

export const ISO14067Template: ReportTemplate = {
  code: 'ISO_14067' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'Product Carbon Footprint (ISO 14067 Compliant)',
  scope: 'product',
  sections: [
    {
      key: 'header',
      title: 'Report Header',
      blockComponent: 'default',
      fields: [
  {
    fieldId: "cfp_result_unit",
    isRequired: true
  },
  {
    fieldId: "energy_input_amount",
    isRequired: true
  },
  {
    fieldId: "energy_input_type",
    isRequired: true
  },
  {
    fieldId: "energy_input_unit",
    isRequired: true
  },
  {
    fieldId: "energy_source_renewable_percent",
    isRequired: true
  },
  {
    fieldId: "hotspots_summary",
    isRequired: true
  },
  {
    fieldId: "material_data_source",
    isRequired: true
  },
  {
    fieldId: "material_input_amount",
    isRequired: true
  },
  {
    fieldId: "material_input_name",
    isRequired: true
  },
  {
    fieldId: "material_input_unit",
    isRequired: true
  },
  {
    fieldId: "material_origin_country",
    isRequired: true
  },
  {
    fieldId: "organization_address",
    isRequired: true
  },
  {
    fieldId: "organization_name",
    isRequired: true
  },
  {
    fieldId: "report_date",
    isRequired: true
  },
  {
    fieldId: "report_language",
    isRequired: true
  },
  {
    fieldId: "transport_load_factor",
    isRequired: true
  },
  {
    fieldId: "waste_quantity",
    isRequired: true
  },
  {
    fieldId: "waste_treatment_route",
    isRequired: true
  },
  {
    fieldId: "waste_type",
    isRequired: true
  }
]
    },
    {
      key: 'data',
      title: 'Report Data',
      blockComponent: 'default',
      fields: [
  {
    fieldId: "reporting_period_start",
    isRequired: true
  },
  {
    fieldId: "reporting_period_end",
    isRequired: true
  },
  {
    fieldId: "base_year",
    isRequired: true
  },
  {
    fieldId: "base_year_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "verification_standard",
    isRequired: true
  },
  {
    fieldId: "verifier_organization_name",
    isRequired: true
  },
  {
    fieldId: "verifier_scope_statement",
    isRequired: true
  },
  {
    fieldId: "verification_level_assurance",
    isRequired: true
  },
  {
    fieldId: "cbam_precursor_materials_emissions",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_id",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_country",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_boundaries",
    isRequired: true
  },
  {
    fieldId: "cbam_goods_quantity_tonnes",
    isRequired: true
  },
  {
    fieldId: "cbam_emission_factor_electricity",
    isRequired: true
  },
  {
    fieldId: "cbam_activity_level_tonnes",
    isRequired: true
  },
  {
    fieldId: "cbam_attributed_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "cbam_system_boundaries_description",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_location_coordinates",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_main_economic_activity",
    isRequired: true
  },
  {
    fieldId: "cbam_operator_name",
    isRequired: true
  },
  {
    fieldId: "cbam_operator_contact",
    isRequired: true
  },
  {
    fieldId: "cbam_verification_report_date",
    isRequired: true
  },
  {
    fieldId: "cbam_verifier_name",
    isRequired: true
  },
  {
    fieldId: "cbam_verifier_accreditation_number",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_visit_date",
    isRequired: false
  },
  {
    fieldId: "cbam_emission_attribution_method",
    isRequired: false
  },
  {
    fieldId: "cbam_default_value_used",
    isRequired: false
  },
  {
    fieldId: "cbam_country_specific_default_value_source",
    isRequired: true
  },
  {
    fieldId: "product_name",
    isRequired: true
  },
  {
    fieldId: "product_description",
    isRequired: false
  },
  {
    fieldId: "product_functional_unit_definition",
    isRequired: false
  },
  {
    fieldId: "product_system_boundary_description",
    isRequired: false
  },
  {
    fieldId: "product_life_cycle_stages_included",
    isRequired: false
  },
  {
    fieldId: "product_allocation_methodology",
    isRequired: false
  },
  {
    fieldId: "product_cutoff_criteria",
    isRequired: true
  },
  {
    fieldId: "product_data_quality_indicators",
    isRequired: true
  },
  {
    fieldId: "product_total_pcf_co2e",
    isRequired: true
  },
  {
    fieldId: "product_pcf_per_functional_unit",
    isRequired: true
  },
  {
    fieldId: "product_biogenic_carbon_co2e",
    isRequired: true
  },
  {
    fieldId: "product_pcf_modules_breakdown_json",
    isRequired: true
  },
  {
    fieldId: "product_pcf_co2_emissions",
    isRequired: true
  },
  {
    fieldId: "product_pcf_ch4_emissions",
    isRequired: true
  },
  {
    fieldId: "product_pcf_n2o_emissions",
    isRequired: true
  }
]
    }
  ]
};
