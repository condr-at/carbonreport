import { ReportTemplate } from '../types';

export const RE100REPORTINGTemplate: ReportTemplate = {
  code: 'RE100_REPORTING' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'RE100 Electricity Data',
  description: 'Renewable-electricity consumption and procurement inputs.',
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
    fieldId: "climate_risks_transition_description",
    isRequired: true
  },
  {
    fieldId: "climate_related_opportunities_description",
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
    fieldId: "own_employees_temporary_headcount",
    isRequired: true
  },
  {
    fieldId: "collective_bargaining_coverage_percent",
    isRequired: true
  }
]
    }
  ]
};
