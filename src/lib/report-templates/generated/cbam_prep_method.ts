import { ReportTemplate } from '../types';

export const CBAMPREPMETHODTemplate: ReportTemplate = {
  code: 'CBAM_PREP_METHOD' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'CBAM Preparation Method',
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
    isRequired: false
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
    fieldId: "building_module_a4_emissions_co2e",
    isRequired: false
  },
  {
    fieldId: "building_module_a5_emissions_co2e",
    isRequired: false
  },
  {
    fieldId: "building_module_b_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_d_benefits_co2e",
    isRequired: true
  },
  {
    fieldId: "cbam_importer_eori",
    isRequired: true
  },
  {
    fieldId: "cbam_authorised_declarant_id",
    isRequired: false
  },
  {
    fieldId: "cbam_goods_cn_codes",
    isRequired: true
  },
  {
    fieldId: "cbam_embedded_emissions_indirect_co2e",
    isRequired: true
  },
  {
    fieldId: "cbam_specific_embedded_emissions_tco2e_per_tonne",
    isRequired: true
  },
  {
    fieldId: "cbam_free_allowances_quantity",
    isRequired: true
  },
  {
    fieldId: "cbam_certificates_purchased_quantity",
    isRequired: true
  },
  {
    fieldId: "cbam_certificates_used_quantity",
    isRequired: true
  },
  {
    fieldId: "cbam_monitoring_methodology_description",
    isRequired: true
  },
  {
    fieldId: "cbam_supplier_data_availability",
    isRequired: true
  },
  {
    fieldId: "cbam_third_country_carbon_price_paid_eur",
    isRequired: true
  },
  {
    fieldId: "cbam_production_process_description",
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
    isRequired: false
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
    isRequired: true
  },
  {
    fieldId: "cbam_emission_attribution_method",
    isRequired: true
  },
  {
    fieldId: "cbam_default_value_used",
    isRequired: true
  },
  {
    fieldId: "cbam_country_specific_default_value_source",
    isRequired: true
  },
  {
    fieldId: "product_pcf_other_ghg_emissions",
    isRequired: true
  },
  {
    fieldId: "product_primary_data_percentage",
    isRequired: true
  },
  {
    fieldId: "product_lca_database_used",
    isRequired: true
  },
  {
    fieldId: "product_lca_software_used",
    isRequired: false
  },
  {
    fieldId: "product_declared_unit",
    isRequired: false
  },
  {
    fieldId: "product_reference_service_life_years",
    isRequired: false
  }
]
    }
  ]
};
