import { ReportTemplate } from '../types';

export const SFDRTemplate: ReportTemplate = {
  code: 'SFDR' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'SFDR Entity PAI — Initial Inputs',
  description: 'Initial company and emissions data for PAI preparation.',
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
    fieldId: "organization_revenue_eur",
    isRequired: true
  },
  {
    fieldId: "organization_assets_eur",
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
    isRequired: false
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
    fieldId: "public_filing_documents_list",
    isRequired: false
  },
  {
    fieldId: "hkex_esg_compliance_level",
    isRequired: false
  },
  {
    fieldId: "collective_bargaining_coverage_percent",
    isRequired: true
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
