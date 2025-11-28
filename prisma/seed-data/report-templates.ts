import type {
  ReportTemplate,
  ReportTemplateFieldMapping,
  ReportTemplateSection,
} from '../../src/lib/report-templates/types'

export type ReportTemplateFieldSeed = ReportTemplateFieldMapping
export type ReportTemplateSectionSeed = ReportTemplateSection
export type ReportTemplateSeed = Omit<ReportTemplate, 'mailto'>

export const REPORT_TEMPLATE_SEED: ReportTemplateSeed[] = [
  // ===========================================================================
  // PRODUCT SCOPE TEMPLATES
  // ===========================================================================
  {
    code: 'ISO14067',
    name: 'ISO 14067 Carbon Footprint Report',
    version: '1.0',
    description: 'International standard for quantifying the carbon footprint of products',
    scope: 'product',
    layoutMeta: {
      layout: 'stacked-sections',
    },
    sections: [
      {
        key: 'general_information',
        title: 'General Information',
        description: 'Organization and product details',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'report_date', isRequired: true, displayOrder: 20 },
          { fieldId: 'report_language', displayOrder: 30 },
          { fieldId: 'product_name', isRequired: true, displayOrder: 40 },
          { fieldId: 'product_description', displayOrder: 50 },
          { fieldId: 'product_geographic_validity', displayOrder: 60 },
          { fieldId: 'product_functional_unit_definition', isRequired: true, displayOrder: 70 },
        ],
      },
      {
        key: 'system_boundary',
        title: 'System Boundary & Scope',
        blockComponent: 'boundary',
        fields: [
          { fieldId: 'product_system_boundary_description', isRequired: true, displayOrder: 10 },
          { fieldId: 'hotspots_summary', displayOrder: 20 },
        ],
      },
      {
        key: 'ghg_results',
        title: 'GHG Emissions Results',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'product_total_pcf_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'cfp_result_unit', isRequired: true, displayOrder: 20 },
        ],
      },
      {
        key: 'material_inputs',
        title: 'Material Inputs',
        blockComponent: 'repeatable-table',
        config: {
          repeatableKey: 'material_input',
        },
        fields: [
          { fieldId: 'material_input_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'material_input_amount', displayOrder: 20 },
          { fieldId: 'material_input_unit', displayOrder: 30 },
          { fieldId: 'material_origin_country', displayOrder: 40 },
          { fieldId: 'material_data_source', displayOrder: 50 },
        ],
      },
      {
        key: 'energy_inputs',
        title: 'Energy Inputs',
        blockComponent: 'repeatable-table',
        config: {
          repeatableKey: 'energy_input',
        },
        fields: [
          { fieldId: 'energy_input_type', isRequired: true, displayOrder: 10 },
          { fieldId: 'energy_input_amount', displayOrder: 20 },
          { fieldId: 'energy_input_unit', displayOrder: 30 },
          { fieldId: 'energy_source_renewable_percent', displayOrder: 40 },
        ],
      },
    ],
  },
  {
    code: 'CBAM',
    name: 'EU CBAM Declaration',
    version: '1.0',
    description: 'Carbon Border Adjustment Mechanism declaration for EU imports',
    scope: 'product',
    layoutMeta: {
      layout: 'tabbed',
    },
    sections: [
      {
        key: 'compliance_overview',
        title: 'Compliance Overview',
        blockComponent: 'cbam-overview',
        fields: [
          { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'product_name', isRequired: true, displayOrder: 20 },
          { fieldId: 'product_description', displayOrder: 30 },
          { fieldId: 'product_functional_unit_definition', displayOrder: 40 },
        ],
      },
      {
        key: 'emissions_summary',
        title: 'Declared Emissions',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'product_total_pcf_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'cfp_result_unit', isRequired: true, displayOrder: 20 },
          { fieldId: 'hotspots_summary', displayOrder: 30 },
        ],
      },
      {
        key: 'material_inputs',
        title: 'Material Composition',
        blockComponent: 'repeatable-table',
        config: {
          repeatableKey: 'material_input',
        },
        fields: [
          { fieldId: 'material_input_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'material_input_amount', displayOrder: 20 },
          { fieldId: 'material_input_unit', displayOrder: 30 },
          { fieldId: 'material_origin_country', displayOrder: 40 },
        ],
      },
      {
        key: 'transport_segments',
        title: 'Transport Segments',
        blockComponent: 'repeatable-table',
        config: {
          repeatableKey: 'transport_segment',
        },
        fields: [
          { fieldId: 'product_transport_mode', isRequired: true, displayOrder: 10 },
          { fieldId: 'product_transport_distance_km', displayOrder: 20 },
          { fieldId: 'transport_load_factor', displayOrder: 30 },
        ],
      },
    ],
  },
  {
    code: 'BUILDING_LCA',
    name: 'Building LCA (EN 15978)',
    version: '1.0',
    description: 'Life Cycle Assessment for buildings according to EN 15978.',
    scope: 'product',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'building_info',
        title: 'Building Information',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'building_type', isRequired: true, displayOrder: 10 },
          { fieldId: 'building_floor_area_m2', isRequired: true, displayOrder: 20 },
          { fieldId: 'building_construction_year', displayOrder: 30 },
          { fieldId: 'building_reference_study_period_years', displayOrder: 40 },
        ],
      },
      {
        key: 'lca_results',
        title: 'LCA Results',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'building_embodied_carbon_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'building_operational_carbon_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'building_module_a1a3_emissions_co2e', displayOrder: 30 },
          { fieldId: 'building_module_a4_emissions_co2e', displayOrder: 40 },
          { fieldId: 'building_module_b_emissions_co2e', displayOrder: 50 },
          { fieldId: 'building_module_c_emissions_co2e', displayOrder: 60 },
          { fieldId: 'building_module_d_benefits_co2e', displayOrder: 70 },
        ],
      },
    ],
  },

  // ===========================================================================
  // CORPORATE SCOPE TEMPLATES
  // ===========================================================================
  {
    code: 'GHG_PROTOCOL_CORPORATE',
    name: 'GHG Protocol Corporate Standard',
    version: '1.0',
    description: 'Standardized corporate-level GHG inventory report.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'org_info',
        title: 'Organizational Boundaries',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'reporting_period_start', isRequired: true, displayOrder: 20 },
          { fieldId: 'reporting_period_end', isRequired: true, displayOrder: 30 },
          { fieldId: 'reporting_boundary_approach', isRequired: true, displayOrder: 40 },
          { fieldId: 'consolidated_entities_list', displayOrder: 50 },
        ],
      },
      {
        key: 'scope1_2',
        title: 'Scope 1 & 2 Emissions',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope2_total_location_based_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'scope2_total_market_based_co2e', displayOrder: 30 },
          { fieldId: 'scope1_breakdown_stationary_co2e', displayOrder: 40 },
          { fieldId: 'scope1_breakdown_mobile_co2e', displayOrder: 50 },
        ],
      },
      {
        key: 'scope3',
        title: 'Scope 3 Emissions',
        blockComponent: 'scope3-summary',
        fields: [
          { fieldId: 'scope3_upstream_total_co2e', displayOrder: 10 },
          { fieldId: 'scope3_downstream_total_co2e', displayOrder: 20 },
          { fieldId: 'scope3_category1_purchased_goods_co2e', displayOrder: 30 },
          { fieldId: 'scope3_category6_business_travel_co2e', displayOrder: 40 },
          // Add other categories as needed
        ],
      },
    ],
  },
  {
    code: 'CSRD',
    name: 'CSRD (ESRS E1)',
    version: '1.0',
    description: 'Corporate Sustainability Reporting Directive - Climate Change.',
    scope: 'corporate',
    layoutMeta: { layout: 'tabbed' },
    sections: [
      {
        key: 'general_disclosures',
        title: 'General Disclosures',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'csrd_double_materiality_assessment', isRequired: true, displayOrder: 20 },
          { fieldId: 'csrd_value_chain_mapping', displayOrder: 30 },
        ],
      },
      {
        key: 'climate_change_mitigation',
        title: 'Climate Change Mitigation',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'esrs_e1_gross_scope123_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'scope2_total_market_based_co2e', isRequired: true, displayOrder: 30 },
          { fieldId: 'scope3_upstream_total_co2e', displayOrder: 40 },
          { fieldId: 'scope3_downstream_total_co2e', displayOrder: 50 },
          { fieldId: 'esrs_e1_ghg_removals_co2e', displayOrder: 60 },
          { fieldId: 'esrs_e1_ghg_mitigation_projects_co2e', displayOrder: 70 },
        ],
      },
      {
        key: 'energy',
        title: 'Energy',
        blockComponent: 'energy-summary',
        fields: [
          { fieldId: 'energy_total_consumption_mwh', isRequired: true, displayOrder: 10 },
          { fieldId: 'renewable_energy_share_percent', isRequired: true, displayOrder: 20 },
          { fieldId: 'esrs_e1_energy_intensity_per_revenue', displayOrder: 30 },
        ],
      },
      {
        key: 'financial_effects',
        title: 'Financial Effects',
        blockComponent: 'financial-summary',
        fields: [
          { fieldId: 'climate_financial_impacts_summary', displayOrder: 10 },
          { fieldId: 'physical_risk_financial_impact_eur', displayOrder: 20 },
          { fieldId: 'transition_risk_financial_impact_eur', displayOrder: 30 },
        ],
      },
    ],
  },
  {
    code: 'CDP',
    name: 'CDP Climate Change',
    version: '2024',
    description: 'CDP Climate Change Questionnaire.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'governance',
        title: 'Governance',
        blockComponent: 'governance',
        fields: [
          { fieldId: 'climate_governance_description', isRequired: true, displayOrder: 10 },
          { fieldId: 'board_gender_diversity_percent', displayOrder: 20 },
        ],
      },
      {
        key: 'risks_opportunities',
        title: 'Risks & Opportunities',
        blockComponent: 'risks',
        fields: [
          { fieldId: 'climate_risk_management_process', isRequired: true, displayOrder: 10 },
          { fieldId: 'climate_risks_physical_description', displayOrder: 20 },
          { fieldId: 'climate_risks_transition_description', displayOrder: 30 },
          { fieldId: 'climate_related_opportunities_description', displayOrder: 40 },
        ],
      },
      {
        key: 'emissions',
        title: 'Emissions Data',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope2_total_location_based_co2e', displayOrder: 20 },
          { fieldId: 'scope2_total_market_based_co2e', displayOrder: 30 },
          { fieldId: 'scope3_upstream_total_co2e', displayOrder: 40 },
        ],
      },
      {
        key: 'targets',
        title: 'Targets',
        blockComponent: 'targets',
        fields: [
          { fieldId: 'emission_reduction_targets_list', displayOrder: 10 },
          { fieldId: 'net_zero_target_year', displayOrder: 20 },
        ],
      },
    ],
  },
  {
    code: 'SEC_CLIMATE',
    name: 'SEC Climate Disclosure',
    version: '1.0',
    description: 'US SEC Climate-Related Disclosures.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'registrant_info',
        title: 'Registrant Information',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'organization_name', isRequired: true, displayOrder: 10 },
          { fieldId: 'sec_filer_category', isRequired: true, displayOrder: 20 },
          { fieldId: 'issuer_is_sec_registrant', isRequired: true, displayOrder: 30 },
        ],
      },
      {
        key: 'climate_risks',
        title: 'Climate-Related Risks',
        blockComponent: 'risks',
        fields: [
          { fieldId: 'sec_material_climate_risks_disclosure', isRequired: true, displayOrder: 10 },
          { fieldId: 'current_period_climate_impacts_financial', displayOrder: 20 },
        ],
      },
      {
        key: 'ghg_metrics',
        title: 'GHG Metrics',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope2_total_location_based_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'sec_scope1_attestation_level', displayOrder: 30 },
          { fieldId: 'sec_scope2_attestation_level', displayOrder: 40 },
        ],
      },
    ],
  },
  {
    code: 'IFRS_S2',
    name: 'IFRS S2 Climate-related Disclosures',
    version: '1.0',
    description: 'ISSB IFRS S2 Standard.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'governance',
        title: 'Governance',
        blockComponent: 'governance',
        fields: [
          { fieldId: 'climate_governance_description', isRequired: true, displayOrder: 10 },
        ],
      },
      {
        key: 'strategy',
        title: 'Strategy',
        blockComponent: 'strategy',
        fields: [
          { fieldId: 'climate_resilience_assessment', isRequired: true, displayOrder: 10 },
          { fieldId: 'climate_scenario_analysis_results', displayOrder: 20 },
        ],
      },
      {
        key: 'metrics_targets',
        title: 'Metrics & Targets',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope2_total_location_based_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'scope3_upstream_total_co2e', isRequired: true, displayOrder: 30 },
          { fieldId: 'financed_emissions_total_co2e', displayOrder: 40 },
        ],
      },
    ],
  },
  {
    code: 'TCFD',
    name: 'TCFD Report',
    version: '1.0',
    description: 'Task Force on Climate-related Financial Disclosures.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'governance',
        title: 'Governance',
        blockComponent: 'governance',
        fields: [
          { fieldId: 'climate_governance_description', isRequired: true, displayOrder: 10 },
        ],
      },
      {
        key: 'strategy',
        title: 'Strategy',
        blockComponent: 'strategy',
        fields: [
          { fieldId: 'climate_risks_physical_description', displayOrder: 10 },
          { fieldId: 'climate_risks_transition_description', displayOrder: 20 },
          { fieldId: 'climate_scenarios_used', displayOrder: 30 },
        ],
      },
      {
        key: 'risk_management',
        title: 'Risk Management',
        blockComponent: 'risks',
        fields: [
          { fieldId: 'climate_risk_management_process', isRequired: true, displayOrder: 10 },
        ],
      },
      {
        key: 'metrics_targets',
        title: 'Metrics & Targets',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'scope1_total_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'scope2_total_location_based_co2e', isRequired: true, displayOrder: 20 },
          { fieldId: 'scope3_upstream_total_co2e', displayOrder: 30 },
          { fieldId: 'internal_carbon_price_eur_tco2e', displayOrder: 40 },
        ],
      },
    ],
  },
  {
    code: 'EU_ETS',
    name: 'EU ETS Annual Report',
    version: '1.0',
    description: 'EU Emissions Trading System annual report.',
    scope: 'corporate',
    layoutMeta: { layout: 'stacked-sections' },
    sections: [
      {
        key: 'installation_info',
        title: 'Installation Information',
        blockComponent: 'general-info',
        fields: [
          { fieldId: 'eu_ets_installations_list', isRequired: true, displayOrder: 10 },
          { fieldId: 'eu_ets_installation_permit_numbers', isRequired: true, displayOrder: 20 },
        ],
      },
      {
        key: 'emissions',
        title: 'Verified Emissions',
        blockComponent: 'ghg-summary',
        fields: [
          { fieldId: 'eu_ets_verified_emissions_co2e', isRequired: true, displayOrder: 10 },
          { fieldId: 'eu_ets_compliance_year', isRequired: true, displayOrder: 20 },
        ],
      },
      {
        key: 'allowances',
        title: 'Allowances',
        blockComponent: 'allowances',
        fields: [
          { fieldId: 'eu_ets_allowances_surrendered_quantity', isRequired: true, displayOrder: 10 },
          { fieldId: 'eu_ets_free_allowances_quantity', displayOrder: 20 },
        ],
      },
    ],
  },
]