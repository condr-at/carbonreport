import { ReportTemplate } from '../types';

export const EUETSTemplate: ReportTemplate = {
  code: 'EU_ETS' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'EU ETS Installation Data',
  description: 'Installation emissions and monitoring inputs for annual reporting.',
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
    fieldId: "reporting_boundary_approach",
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
    fieldId: "scope2_total_location_based_co2e",
    isRequired: true
  },
  {
    fieldId: "scope2_total_market_based_co2e",
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
    fieldId: "re100_current_renewable_share_percent",
    isRequired: true
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
    isRequired: false
  },
  {
    fieldId: "aviation_total_fuel_consumption_tonnes",
    isRequired: true
  },
  {
    fieldId: "aviation_total_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "aviation_routes_coverage_description",
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
  }
]
    }
  ]
};
