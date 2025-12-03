import { ReportTemplate } from '../types';

export const CSRDTemplate: ReportTemplate = {
  code: 'CSRD' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'CSRD (Corporate Sustainability Reporting Directive)',
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
    fieldId: "reporting_scope_type",
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
    fieldId: "organization_assets_eur",
    isRequired: false
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
    isRequired: false
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
    isRequired: false
  },
  {
    fieldId: "scope3_category9_downstream_transport_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category10_processing_of_sold_products_co2e",
    isRequired: false
  },
  {
    fieldId: "scope3_category11_use_of_sold_products_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category12_end_of_life_treatment_co2e",
    isRequired: false
  },
  {
    fieldId: "scope3_category13_downstream_leased_assets_co2e",
    isRequired: true
  },
  {
    fieldId: "scope3_category14_franchises_co2e",
    isRequired: false
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
    isRequired: true
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
    isRequired: false
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
    isRequired: false
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
    isRequired: false
  },
  {
    fieldId: "esrs_e1_renewable_energy_production_mwh",
    isRequired: false
  },
  {
    fieldId: "esrs_e1_internal_carbon_pricing_schemes",
    isRequired: false
  },
  {
    fieldId: "climate_financial_impacts_summary",
    isRequired: false
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
    fieldId: "sbti_sector_classification",
    isRequired: true
  },
  {
    fieldId: "sbti_flag_target_set",
    isRequired: false
  },
  {
    fieldId: "sbti_value_chain_target",
    isRequired: true
  },
  {
    fieldId: "sbti_validation_date",
    isRequired: true
  },
  {
    fieldId: "sbti_target_submission_year",
    isRequired: true
  },
  {
    fieldId: "sbti_near_term_target_year",
    isRequired: true
  },
  {
    fieldId: "sbti_long_term_target_year",
    isRequired: true
  },
  {
    fieldId: "sbti_net_zero_year",
    isRequired: true
  },
  {
    fieldId: "financed_emissions_total_co2e",
    isRequired: true
  },
  {
    fieldId: "portfolio_coverage_percent",
    isRequired: true
  },
  {
    fieldId: "sfdr_pai_indicator_entries",
    isRequired: true
  },
  {
    fieldId: "sfdr_article_classification",
    isRequired: true
  },
  {
    fieldId: "sfdr_do_no_significant_harm_assessment",
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
    fieldId: "re100_commitment_scope",
    isRequired: false
  },
  {
    fieldId: "re100_target_year",
    isRequired: false
  },
  {
    fieldId: "gresb_portfolio_description",
    isRequired: true
  },
  {
    fieldId: "gresb_previous_score",
    isRequired: true
  },
  {
    fieldId: "bcorp_assessment_scope_description",
    isRequired: true
  },
  {
    fieldId: "bcorp_target_certification_year",
    isRequired: true
  },
  {
    fieldId: "aviation_total_fuel_consumption_tonnes",
    isRequired: false
  },
  {
    fieldId: "aviation_total_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "aviation_routes_coverage_description",
    isRequired: true
  },
  {
    fieldId: "aviation_offset_programs",
    isRequired: false
  },
  {
    fieldId: "renewable_energy_share_percent",
    isRequired: true
  },
  {
    fieldId: "ppa_contracts_list",
    isRequired: true
  },
  {
    fieldId: "recs_certificates_purchased_mwh",
    isRequired: true
  },
  {
    fieldId: "energy_audit_scope_description",
    isRequired: true
  },
  {
    fieldId: "energy_saving_potential_estimate_percent",
    isRequired: true
  },
  {
    fieldId: "climate_action_measures_list",
    isRequired: true
  },
  {
    fieldId: "data_quality_assessment_summary",
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
    isRequired: false
  },
  {
    fieldId: "eu_ets_compliance_year",
    isRequired: false
  },
  {
    fieldId: "eu_ets_phase",
    isRequired: false
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
  },
  {
    fieldId: "sustainability_officer_exists",
    isRequired: true
  },
  {
    fieldId: "due_diligence_statement",
    isRequired: true
  },
  {
    fieldId: "materiality_assessment_process",
    isRequired: true
  },
  {
    fieldId: "stakeholder_engagement_description",
    isRequired: true
  },
  {
    fieldId: "value_chain_description",
    isRequired: true
  },
  {
    fieldId: "internal_carbon_price_eur_tco2e",
    isRequired: true
  },
  {
    fieldId: "locked_in_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "avoided_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "climate_related_capex_eur",
    isRequired: true
  },
  {
    fieldId: "climate_related_opex_eur",
    isRequired: true
  },
  {
    fieldId: "physical_risk_financial_impact_eur",
    isRequired: true
  },
  {
    fieldId: "transition_risk_financial_impact_eur",
    isRequired: true
  },
  {
    fieldId: "air_pollutants_nox_tonnes",
    isRequired: true
  },
  {
    fieldId: "air_pollutants_sox_tonnes",
    isRequired: true
  },
  {
    fieldId: "air_pollutants_pm_tonnes",
    isRequired: true
  },
  {
    fieldId: "water_withdrawals_m3",
    isRequired: true
  },
  {
    fieldId: "water_discharges_m3",
    isRequired: true
  },
  {
    fieldId: "water_consumption_m3",
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
    fieldId: "waste_hazardous_tonnes",
    isRequired: true
  },
  {
    fieldId: "waste_recycled_tonnes",
    isRequired: true
  },
  {
    fieldId: "circular_economy_measures",
    isRequired: true
  },
  {
    fieldId: "own_employees_permanent_headcount",
    isRequired: true
  },
  {
    fieldId: "own_employees_temporary_headcount",
    isRequired: true
  },
  {
    fieldId: "collective_bargaining_coverage_percent",
    isRequired: false
  },
  {
    fieldId: "adequate_wages_assessment",
    isRequired: true
  },
  {
    fieldId: "training_hours_total",
    isRequired: true
  }
]
    }
  ]
};
