import { ReportTemplate } from '../types';

export const CDPDISCLOSURETemplate: ReportTemplate = {
  code: 'CDP_DISCLOSURE' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'CDP Climate Change Disclosure',
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
    fieldId: "exclusions_scope_explanation",
    isRequired: true
  },
  {
    fieldId: "scope1_total_co2e",
    isRequired: true
  },
  {
    fieldId: "scope1_breakdown_stationary_co2e",
    isRequired: false
  },
  {
    fieldId: "scope1_breakdown_mobile_co2e",
    isRequired: false
  },
  {
    fieldId: "scope1_breakdown_fugitive_co2e",
    isRequired: false
  },
  {
    fieldId: "scope1_breakdown_process_co2e",
    isRequired: false
  },
  {
    fieldId: "scope1_co2_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_ch4_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_n2o_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_hfcs_emissions",
    isRequired: false
  },
  {
    fieldId: "scope1_pfcs_emissions",
    isRequired: true
  },
  {
    fieldId: "scope1_sf6_emissions",
    isRequired: true
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
    isRequired: false
  },
  {
    fieldId: "scope2_residual_mix_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "scope2_electricity_consumption_mwh",
    isRequired: true
  },
  {
    fieldId: "scope2_steam_heat_cold_energy_mwh",
    isRequired: true
  },
  {
    fieldId: "scope3_category1_purchased_goods_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category2_capital_goods_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category3_fuel_energy_activities_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category4_upstream_transport_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category5_waste_generated_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category6_business_travel_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category7_employee_commuting_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category8_upstream_leased_assets_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category9_downstream_transport_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category10_processing_of_sold_products_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category11_use_of_sold_products_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category12_end_of_life_treatment_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category13_downstream_leased_assets_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category14_franchises_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category15_investments_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_upstream_total_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_downstream_total_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_calculation_methodology_per_category",
    isRequired: true
  },
  {
    fieldId: "total_corporate_ghg_co2e",
    isRequired: true
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
    isRequired: false
  },
  {
    fieldId: "base_year",
    isRequired: false
  },
  {
    fieldId: "base_year_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "base_year_recalculation_policy",
    isRequired: true
  },
  {
    fieldId: "verification_required",
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
    fieldId: "sec_scope1_attestation_level",
    isRequired: true
  },
  {
    fieldId: "sec_scope2_attestation_level",
    isRequired: false
  },
  {
    fieldId: "sec_ghg_attestation_provider",
    isRequired: false
  },
  {
    fieldId: "offsets_purchased_co2e",
    isRequired: false
  },
  {
    fieldId: "offsets_programs_list",
    isRequired: true
  },
  {
    fieldId: "carbon_neutral_claim_boundary",
    isRequired: true
  },
  {
    fieldId: "climate_governance_description",
    isRequired: true
  },
  {
    fieldId: "climate_risk_management_process",
    isRequired: true
  },
  {
    fieldId: "climate_risks_physical_description",
    isRequired: true
  },
  {
    fieldId: "climate_risks_transition_description",
    isRequired: true
  },
  {
    fieldId: "climate_related_opportunities_description",
    isRequired: true
  },
  {
    fieldId: "climate_resilience_assessment",
    isRequired: true
  },
  {
    fieldId: "climate_scenarios_used",
    isRequired: true
  },
  {
    fieldId: "climate_scenario_results_summary",
    isRequired: true
  },
  {
    fieldId: "climate_scenario_analysis_results",
    isRequired: true
  },
  {
    fieldId: "current_period_climate_impacts_financial",
    isRequired: true
  },
  {
    fieldId: "anticipated_climate_impacts_financial",
    isRequired: true
  },
  {
    fieldId: "sec_material_climate_risks_disclosure",
    isRequired: true
  },
  {
    fieldId: "sec_climate_targets_material_impact",
    isRequired: true
  },
  {
    fieldId: "emission_reduction_targets_list",
    isRequired: true
  },
  {
    fieldId: "climate_targets_progress_quantitative",
    isRequired: true
  },
  {
    fieldId: "net_zero_target_year",
    isRequired: true
  },
  {
    fieldId: "decarbonisation_strategy_summary",
    isRequired: true
  },
  {
    fieldId: "transition_plan_description",
    isRequired: true
  },
  {
    fieldId: "energy_efficiency_measures_summary",
    isRequired: true
  },
  {
    fieldId: "renewable_energy_strategy_summary",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_energy_consumption_high_impact_sectors_mwh",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_energy_intensity_per_revenue",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_renewable_energy_production_mwh",
    isRequired: true
  },
  {
    fieldId: "esrs_e1_internal_carbon_pricing_schemes",
    isRequired: true
  },
  {
    fieldId: "climate_financial_impacts_summary",
    isRequired: true
  },
  {
    fieldId: "severe_weather_capitalized_costs_amount",
    isRequired: true
  },
  {
    fieldId: "severe_weather_expensed_costs_amount",
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
    fieldId: "recs_financial_impacts_amount",
    isRequired: true
  },
  {
    fieldId: "sbti_commitment_status",
    isRequired: true
  },
  {
    fieldId: "sbti_scope_coverage",
    isRequired: true
  },
  {
    fieldId: "sbti_target_type",
    isRequired: true
  },
  {
    fieldId: "sfdr_principal_adverse_impacts_metrics",
    isRequired: true
  },
  {
    fieldId: "green_assets_ratio",
    isRequired: true
  },
  {
    fieldId: "taxonomy_aligned_revenue_percent",
    isRequired: true
  },
  {
    fieldId: "taxonomy_aligned_capex_percent",
    isRequired: true
  },
  {
    fieldId: "taxonomy_aligned_opex_percent",
    isRequired: true
  },
  {
    fieldId: "taxonomy_alignment_criteria_details",
    isRequired: true
  },
  {
    fieldId: "banks_data_template_reference",
    isRequired: true
  },
  {
    fieldId: "lenders_investors_list",
    isRequired: true
  },
  {
    fieldId: "listing_exchanges",
    isRequired: true
  },
  {
    fieldId: "issuer_is_sec_registrant",
    isRequired: true
  },
  {
    fieldId: "sec_filer_category",
    isRequired: true
  },
  {
    fieldId: "public_filing_documents_list",
    isRequired: true
  },
  {
    fieldId: "hkex_esg_compliance_level",
    isRequired: true
  },
  {
    fieldId: "client_request_reference",
    isRequired: false
  },
  {
    fieldId: "client_required_categories_scope3_list",
    isRequired: false
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
    fieldId: "renewable_energy_share_percent",
    isRequired: true
  },
  {
    fieldId: "water_stress_areas_identified",
    isRequired: true
  },
  {
    fieldId: "waste_generated_total_tonnes",
    isRequired: true
  },
  {
    fieldId: "csrd_double_materiality_assessment",
    isRequired: true
  }
]
    }
  ]
};
