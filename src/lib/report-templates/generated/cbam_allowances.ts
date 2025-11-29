import { ReportTemplate } from '../types';

export const CBAMALLOWANCESTemplate: ReportTemplate = {
  code: 'CBAM_ALLOWANCES' as any, // Cast to any to avoid type errors before types.ts is updated
  name: 'CBAM Allowances',
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
    fieldId: "building_module_d_benefits_co2e",
    isRequired: true
  },
  {
    fieldId: "cbam_goods_cn_codes",
    isRequired: true
  },
  {
    fieldId: "cbam_reporting_quarter",
    isRequired: true
  },
  {
    fieldId: "cbam_total_embedded_emissions_co2e",
    isRequired: true
  },
  {
    fieldId: "cbam_embedded_emissions_direct_co2e",
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
    fieldId: "cbam_installation_country",
    isRequired: true
  },
  {
    fieldId: "cbam_installation_boundaries",
    isRequired: true
  },
  {
    fieldId: "cbam_goods_quantity_tonnes",
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
    fieldId: "product_total_pcf_co2e",
    isRequired: true
  },
  {
    fieldId: "product_pcf_per_functional_unit",
    isRequired: true
  }
]
    }
  ]
};
