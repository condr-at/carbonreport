import { ReportTemplate } from '../types';

export const CLIENTTEMPLATEFILLTemplate: ReportTemplate = {
  code: 'CLIENT_TEMPLATE_FILL' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'Client Questionnaire Preparation',
  description: 'Source data for a customer-provided form or portal.',
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
    isRequired: true
  },
  {
    fieldId: "scope1_breakdown_mobile_co2e",
    isRequired: true
  },
  {
    fieldId: "scope1_breakdown_fugitive_co2e",
    isRequired: true
  },
  {
    fieldId: "scope1_breakdown_process_co2e",
    isRequired: true
  },
  {
    fieldId: "scope1_co2_emissions",
    isRequired: true
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
    isRequired: false
  },
  {
    fieldId: "scope1_sf6_emissions",
    isRequired: true
  },
  {
    fieldId: "scope1_nf3_emissions",
    isRequired: true
  },
  {
    fieldId: "scope2_total_location_based_co2e",
    isRequired: false
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
    isRequired: true
  },
  {
    fieldId: "aviation_total_fuel_consumption_tonnes",
    isRequired: true
  },
  {
    fieldId: "eu_mrv_ice_class_notation",
    isRequired: true
  }
]
    }
  ]
};
