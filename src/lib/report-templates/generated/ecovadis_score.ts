import { ReportTemplate } from '../types';

export const ECOVADISSCORETemplate: ReportTemplate = {
  code: 'ECOVADIS_SCORE' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'EcoVadis Scorecard',
  scope: 'corporate',
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
    fieldId: "legal_entity_identifier",
    isRequired: true
  },
  {
    fieldId: "organization_sector_code",
    isRequired: true
  },
  {
    fieldId: "organization_headcount",
    isRequired: true
  },
  {
    fieldId: "organization_revenue_eur",
    isRequired: true
  },
  {
    fieldId: "reporting_boundary_approach",
    isRequired: true
  },
  {
    fieldId: "countries_of_operation",
    isRequired: true
  },
  {
    fieldId: "consolidated_entities_list",
    isRequired: true
  },
  {
    fieldId: "scope1_total_co2e",
    isRequired: true
  },
  {
    fieldId: "scope1_co2_emissions",
    isRequired: true
  },
  {
    fieldId: "scope1_ch4_emissions",
    isRequired: true
  },
  {
    fieldId: "scope1_n2o_emissions",
    isRequired: true
  },
  {
    fieldId: "scope1_hfcs_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_pfcs_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_sf6_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_nf3_emissions",
    isRequired: false
  },
  {
    fieldId: "scope2_total_location_based_co2e",
    isRequired: true
  },
  {
    fieldId: "scope2_total_market_based_co2e",
    isRequired: true
  },
  {
    fieldId: "scope2_residual_mix_emissions_co2e",
    isRequired: false
  },
  {
    fieldId: "scope2_electricity_consumption_mwh",
    isRequired: true
  },
  {
    fieldId: "scope2_steam_heat_cold_energy_mwh",
    isRequired: false
  },
  {
    fieldId: "esrs_e1_gross_scope123_co2e",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_ghg_removals_co2e",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_ghg_mitigation_projects_co2e",
    isRequired: true
  },
  {
    fieldId: "sec_scope2_attestation_level",
    isRequired: true
  },
  {
    fieldId: "sec_ghg_attestation_provider",
    isRequired: true
  },
  {
    fieldId: "offsets_purchased_co2e",
    isRequired: true
  },
  {
    fieldId: "severe_weather_losses_amount",
    isRequired: true
  },
  {
    fieldId: "carbon_offsets_financial_impacts_amount",
    isRequired: true
  },
  {
    fieldId: "taxonomy_alignment_criteria_details",
    isRequired: false
  },
  {
    fieldId: "banks_data_template_reference",
    isRequired: false
  },
  {
    fieldId: "client_required_categories_scope3_list",
    isRequired: true
  },
  {
    fieldId: "client_reporting_format",
    isRequired: true
  },
  {
    fieldId: "client_data_delivery_deadline",
    isRequired: true
  },
  {
    fieldId: "client_data_delivery_channels",
    isRequired: true
  },
  {
    fieldId: "data_package_coverage_description",
    isRequired: true
  },
  {
    fieldId: "energy_total_consumption_mwh",
    isRequired: true
  },
  {
    fieldId: "methodology_reference_documents",
    isRequired: true
  },
  {
    fieldId: "limitations_and_uncertainties_summary",
    isRequired: true
  },
  {
    fieldId: "comparability_notes",
    isRequired: true
  },
  {
    fieldId: "responsible_officer_name",
    isRequired: true
  },
  {
    fieldId: "responsible_officer_role",
    isRequired: true
  },
  {
    fieldId: "eu_ets_compliance_year",
    isRequired: true
  },
  {
    fieldId: "eu_ets_phase",
    isRequired: true
  },
  {
    fieldId: "eu_ets_installations_list",
    isRequired: true
  },
  {
    fieldId: "eu_ets_verified_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "eu_ets_allowances_surrendered_quantity",
    isRequired: true
  },
  {
    fieldId: "eu_ets_free_allowances_quantity",
    isRequired: true
  },
  {
    fieldId: "eu_ets_market_allowances_purchased_quantity",
    isRequired: true
  },
  {
    fieldId: "eu_ets_market_allowances_sold_quantity",
    isRequired: true
  },
  {
    fieldId: "eu_ets_balance_surplus_quantity",
    isRequired: true
  },
  {
    fieldId: "eu_ets_verification_body_name",
    isRequired: true
  },
  {
    fieldId: "eu_ets_compliance_statement",
    isRequired: true
  },
  {
    fieldId: "eu_ets_monitoring_methodology_reference",
    isRequired: true
  },
  {
    fieldId: "eu_ets_benchmark_values",
    isRequired: true
  },
  {
    fieldId: "eu_ets_carbon_leakage_exposure",
    isRequired: true
  },
  {
    fieldId: "eu_ets_innovation_fund_eligible",
    isRequired: true
  },
  {
    fieldId: "eu_ets_installation_permit_numbers",
    isRequired: true
  },
  {
    fieldId: "eu_ets_activity_level_data",
    isRequired: true
  },
  {
    fieldId: "eu_ets_fall_back_methodology_used",
    isRequired: true
  },
  {
    fieldId: "board_gender_diversity_percent",
    isRequired: true
  },
  {
    fieldId: "board_independence_percent",
    isRequired: true
  }
]
    }
  ]
};
