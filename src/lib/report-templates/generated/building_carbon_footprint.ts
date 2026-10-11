import { ReportTemplate } from '../types';

export const BUILDINGCARBONFOOTPRINTTemplate: ReportTemplate = {
  code: 'BUILDING_CARBON_FOOTPRINT' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'Building Carbon Data',
  description: 'Material, life-cycle module and operational-energy inputs.',
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
    fieldId: "countries_of_operation",
    isRequired: true
  },
  {
    fieldId: "exclusions_scope_explanation",
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
    fieldId: "building_type",
    isRequired: true
  },
  {
    fieldId: "building_floor_area_m2",
    isRequired: true
  },
  {
    fieldId: "building_construction_year",
    isRequired: true
  },
  {
    fieldId: "building_energy_consumption_mwh",
    isRequired: true
  },
  {
    fieldId: "building_occupancy_rate_percent",
    isRequired: true
  },
  {
    fieldId: "building_certifications_existing",
    isRequired: true
  },
  {
    fieldId: "building_embodied_carbon_co2e",
    isRequired: true
  },
  {
    fieldId: "building_operational_carbon_co2e",
    isRequired: true
  },
  {
    fieldId: "building_reference_study_period_years",
    isRequired: true
  },
  {
    fieldId: "building_life_cycle_module",
    isRequired: true
  },
  {
    fieldId: "building_energy_class",
    isRequired: true
  },
  {
    fieldId: "building_energy_consumption_heating_mwh",
    isRequired: false
  },
  {
    fieldId: "building_energy_consumption_cooling_mwh",
    isRequired: false
  },
  {
    fieldId: "building_energy_consumption_electricity_mwh",
    isRequired: false
  },
  {
    fieldId: "building_renewable_energy_share_percent",
    isRequired: false
  },
  {
    fieldId: "building_net_zero_target_year",
    isRequired: false
  },
  {
    fieldId: "building_decarbonisation_pathway",
    isRequired: false
  },
  {
    fieldId: "building_structural_system",
    isRequired: true
  },
  {
    fieldId: "building_facade_type",
    isRequired: false
  },
  {
    fieldId: "building_hvac_system_type",
    isRequired: false
  },
  {
    fieldId: "building_module_a1a3_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_a4_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_a5_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_b_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_c_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "building_module_d_benefits_co2e",
    isRequired: false
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
  }
]
    }
  ]
};
