# Database Gap Analysis: Data Points Matrix vs Current Schema

**Last Updated:** November 27, 2025  
**Status:** 🔴 Critical gaps identified — ~240 fields missing  
**Priority:** High — required for CSRD/CBAM compliance (2025-2026)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Fields in current DB** | 28 |
| **Fields in CORPORATE matrix** | 205 |
| **Fields in PRODUCT matrix** | 59 |
| **Shared fields (both matrices)** | 16 |
| **Total unique fields required** | ~250 |
| **Gap (missing in DB)** | **~240 fields** |
| **Current coverage** | **~4%** |

The current database schema covers only basic product LCA fields (ISO 14067). 
For full regulatory compliance (CSRD, CBAM, SEC Climate, UK TCFD), significant expansion is required.

---

## Field Scope Classification

Each field must have a `scope` property indicating which report types it applies to.

### Scope Values

| Scope | Description | Count |
|-------|-------------|-------|
| `product` | Product-level reports only (PCF, EPD, CBAM product) | 91 |
| `corporate` | Corporate-level reports only (CSRD, GHG Protocol, TCFD) | 189 |
| `both` | Used in both product and corporate reports | 16 |

### Shared Fields (scope: 'both')

These 16 fields are used across both product and corporate report types:

| fieldId | Description |
|---------|-------------|
| `reporting_period_start` | Start date of reporting period |
| `reporting_period_end` | End date of reporting period |
| `countries_of_operation` | List of countries where organization/product operates |
| `exclusions_scope_explanation` | What is excluded from scope and why |
| `base_year` | Base year for comparisons |
| `base_year_emissions_co2e` | Base year emissions in tonnes CO2e |
| `verification_standard` | Verification standard used (ISO 14064-3, etc.) |
| `verifier_organization_name` | Name of verification body |
| `verifier_scope_statement` | What was verified |
| `verification_level_assurance` | Limited or reasonable assurance |
| `data_quality_assessment_summary` | Summary of data quality assessment |
| `methodology_reference_documents` | List of methodology reference documents |
| `limitations_and_uncertainties_summary` | Summary of limitations and uncertainties |
| `comparability_notes` | Notes on comparability |
| `responsible_officer_name` | Name of responsible officer |
| `responsible_officer_role` | Role of responsible officer |

### Schema Update Required

Update `DatasetFieldDefinition` model in `schema.prisma`:

```prisma
model DatasetFieldDefinition {
  id            String   @id @default(uuid())
  fieldId       String   @unique @map("field_id")
  label         String
  hint          String?
  type          String   @default("text")                      // KEEP for backward compat
  dataType      String   @default("text") @map("data_type")    // NEW: text, textarea, number, currency, percentage, date, year, select, multiselect, country, json
  unit          String?                                        // NEW: "tCO2e", "EUR", "MWh", "m²", "%"
  scope         String   @default("both")                      // NEW: 'product' | 'corporate' | 'both'
  options       Json?
  validation    Json?
  isRepeatable  Boolean  @default(false) @map("is_repeatable")
  repeatableKey String?  @map("repeatable_key")
  isRequired    Boolean  @default(false) @map("is_required")   // NEW: globally required field
  sortOrder     Int      @default(0) @map("sort_order")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  ReportTemplateFieldMapping ReportTemplateFieldMapping[]

  @@index([scope])   // for filtering by scope
  @@map("dataset_field_definitions")
}
```

Update `Project` model to include project type:

```prisma
model Project {
  // ...existing fields
  projectType String @default("product") @map("project_type") // NEW: 'product' | 'corporate'
}
```

**Migration SQL:**

```sql
-- Add new columns to dataset_field_definitions
ALTER TABLE dataset_field_definitions 
ADD COLUMN data_type VARCHAR(20) NOT NULL DEFAULT 'text',
ADD COLUMN unit VARCHAR(20),
ADD COLUMN scope VARCHAR(20) NOT NULL DEFAULT 'both',
ADD COLUMN is_required BOOLEAN NOT NULL DEFAULT false;

-- Add index for scope filtering
CREATE INDEX idx_dataset_field_definitions_scope ON dataset_field_definitions(scope);

-- Add project_type to projects table
ALTER TABLE projects 
ADD COLUMN project_type VARCHAR(20) NOT NULL DEFAULT 'product';

-- Update existing fields scope (all current fields are product-focused)
UPDATE dataset_field_definitions SET scope = 'product' 
WHERE field_id IN (
  'product_name', 'product_description', 'product_functional_unit_definition',
  'product_life_cycle_stages_included', 'product_total_pcf_co2e', 'cfp_result_unit',
  'hotspots_summary', 'material_input_name', 'material_input_amount', 'material_input_unit',
  'material_origin_country', 'material_data_source', 'energy_input_type', 'energy_input_amount',
  'energy_input_unit', 'energy_source_renewable_percent', 'product_transport_mode',
  'product_transport_distance_km', 'transport_load_factor', 'waste_type', 'waste_quantity',
  'waste_treatment_route', 'reviewer_name', 'reviewer_affiliation'
);

-- These remain 'both' (organization-level, used everywhere)
UPDATE dataset_field_definitions SET scope = 'both'
WHERE field_id IN ('organization_name', 'organization_address', 'report_date', 'report_language');

-- Set data_type and unit for existing numeric fields
UPDATE dataset_field_definitions SET data_type = 'number', unit = 'tCO2e' WHERE field_id = 'product_total_pcf_co2e';
UPDATE dataset_field_definitions SET data_type = 'number' WHERE field_id IN ('material_input_amount', 'energy_input_amount', 'transport_load_factor', 'waste_quantity');
UPDATE dataset_field_definitions SET data_type = 'percentage', unit = '%' WHERE field_id = 'energy_source_renewable_percent';
UPDATE dataset_field_definitions SET data_type = 'number', unit = 'km' WHERE field_id = 'product_transport_distance_km';
UPDATE dataset_field_definitions SET data_type = 'date' WHERE field_id = 'report_date';
```

### Field Definition with New Properties

Update `dataset-fields.ts` type and fields:

```typescript
export type DatasetFieldSeed = {
  fieldId: string
  label: string
  hint?: string | null
  type?: string                                    // KEEP for backward compat
  dataType: 'text' | 'textarea' | 'number' | 'currency' | 'percentage' | 'date' | 'year' | 'select' | 'multiselect' | 'country' | 'json'  // NEW
  unit?: string | null                             // NEW: "tCO2e", "EUR", "MWh", "m²", "%"
  scope: 'product' | 'corporate' | 'both'          // NEW
  options?: any | null
  validation?: any | null
  isRepeatable?: boolean
  repeatableKey?: string | null
  isRequired?: boolean                             // NEW: globally required
  sortOrder: number
  legacyFieldIds?: string[]
}

// Examples:
{ fieldId: 'reporting_period_start', dataType: 'date', scope: 'both', isRequired: true, ... },
{ fieldId: 'scope1_total_co2e', dataType: 'number', unit: 'tCO2e', scope: 'corporate', ... },
{ fieldId: 'organization_revenue_eur', dataType: 'currency', unit: 'EUR', scope: 'corporate', ... },
{ fieldId: 'product_total_pcf_co2e', dataType: 'number', unit: 'tCO2e', scope: 'product', ... },
{ fieldId: 'building_floor_area_m2', dataType: 'number', unit: 'm²', scope: 'product', ... },
{ fieldId: 'energy_source_renewable_percent', dataType: 'percentage', unit: '%', scope: 'product', ... },
```

### UI Filtering by Scope

The scope property enables:
1. **Project type filtering** — show only relevant fields based on project type
2. **Report template matching** — auto-filter fields for selected report
3. **Validation rules** — require fields based on report scope

```typescript
// Example: Filter fields for corporate project
const corporateFields = allFields.filter(f => f.scope === 'corporate' || f.scope === 'both');

// Example: Filter fields for product project  
const productFields = allFields.filter(f => f.scope === 'product' || f.scope === 'both');
```

---

## Current Database Fields

Source: `/prisma/seed-data/dataset-fields.ts`

### Existing Fields (28 total)

| Category | fieldId | Type | Repeatable | Matrix Equivalent |
|----------|---------|------|------------|-------------------|
| **Organization** | | | | |
| | `organization_name` | text | no | — (not in matrix) |
| | `organization_address` | text | no | — (not in matrix) |
| **Report Meta** | | | | |
| | `report_date` | date | no | — (internal use) |
| | `report_language` | text | no | — (internal use) |
| **Product** | | | | |
| | `product_name` | text | no | ✅ `product_name` |
| | `product_description` | text | no | ✅ `product_description` |
| | `intended_market` | text | no | ≈ `product_geographic_validity` |
| **LCA Core** | | | | |
| | `functional_unit` | text | no | ✅ `product_functional_unit_definition` |
| | `system_boundary` | text | no | ≈ `product_life_cycle_stages_included` |
| | `total_cfp_co2e` | number | no | ✅ `product_total_pcf_co2e` |
| | `cfp_result_unit` | text | no | — (not in matrix, keep) |
| | `hotspots_summary` | text | no | — (internal use) |
| **Material Inputs** | | | | |
| | `material_input_name` | text | yes | — (LCI detail) |
| | `material_input_amount` | number | yes | — (LCI detail) |
| | `material_input_unit` | text | yes | — (LCI detail) |
| | `material_origin_country` | text | yes | — (LCI detail) |
| | `material_data_source` | text | yes | — (LCI detail) |
| **Energy Inputs** | | | | |
| | `energy_input_type` | text | yes | — (LCI detail) |
| | `energy_input_amount` | number | yes | — (LCI detail) |
| | `energy_input_unit` | text | yes | — (LCI detail) |
| | `energy_source_renewable_percent` | number | yes | — (LCI detail) |
| **Transport** | | | | |
| | `transport_mode` | text | yes | ≈ `product_transport_mode` |
| | `transport_distance` | number | yes | ≈ `product_transport_distance_km` |
| | `transport_load_factor` | number | yes | — (LCI detail) |
| **Waste** | | | | |
| | `waste_type` | text | yes | — (LCI detail) |
| | `waste_quantity` | number | yes | — (LCI detail) |
| | `waste_treatment_route` | text | yes | — (LCI detail) |
| **Review** | | | | |
| | `reviewer_name` | text | yes | ≈ `verifier_organization_name` |
| | `reviewer_affiliation` | text | yes | — (review detail) |

### Fields to Keep (not in matrix but useful)

These fields serve internal purposes and should be retained:

- `organization_name` — basic org identity
- `organization_address` — basic org identity  
- `report_date` — document metadata
- `report_language` — document metadata
- `cfp_result_unit` — result formatting
- `hotspots_summary` — analysis output
- All LCI detail fields (`material_*`, `energy_*`, `waste_*`) — granular inventory data

---

## Required Database Changes

### Phase 1: Core Corporate GHG Inventory (Priority: CRITICAL)

**Timeline:** Immediate — required for GHG Protocol, CSRD base compliance

#### 1.1 Organizational Profile (12 fields)

```typescript
// Add to dataset-fields.ts — scope: 'both' (shared) or 'corporate'
{ fieldId: 'reporting_period_start', label: 'Reporting period start', type: 'date', scope: 'both', sortOrder: 1000 },
{ fieldId: 'reporting_period_end', label: 'Reporting period end', type: 'date', scope: 'both', sortOrder: 1010 },
{ fieldId: 'reporting_scope_type', label: 'Reporting scope type', type: 'select', options: ['consolidated', 'standalone', 'segment'], scope: 'corporate', sortOrder: 1020 },
{ fieldId: 'legal_entity_identifier', label: 'Legal Entity Identifier (LEI)', type: 'text', scope: 'corporate', sortOrder: 1030 },
{ fieldId: 'organization_sector_code', label: 'Sector code (NACE/SIC)', type: 'text', scope: 'corporate', sortOrder: 1040 },
{ fieldId: 'organization_headcount', label: 'Average headcount', type: 'number', scope: 'corporate', sortOrder: 1050 },
{ fieldId: 'organization_revenue_eur', label: 'Annual revenue (EUR)', type: 'number', scope: 'corporate', sortOrder: 1060 },
{ fieldId: 'organization_assets_eur', label: 'Total assets (EUR)', type: 'number', scope: 'corporate', sortOrder: 1070 },
{ fieldId: 'reporting_boundary_approach', label: 'Boundary approach', type: 'select', options: ['equity_share', 'financial_control', 'operational_control'], scope: 'corporate', sortOrder: 1080 },
{ fieldId: 'countries_of_operation', label: 'Countries of operation', type: 'text', isRepeatable: true, repeatableKey: 'country_operation', scope: 'both', sortOrder: 1090 },
{ fieldId: 'consolidated_entities_list', label: 'Consolidated entities', type: 'text', isRepeatable: true, repeatableKey: 'consolidated_entity', scope: 'corporate', sortOrder: 1100 },
{ fieldId: 'exclusions_scope_explanation', label: 'Exclusions explanation', type: 'text', scope: 'both', sortOrder: 1110 },
```

#### 1.2 Scope 1 Emissions (12 fields)

```typescript
// All Scope 1 fields are corporate-only
{ fieldId: 'scope1_total_co2e', label: 'Scope 1 total (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2000 },
{ fieldId: 'scope1_breakdown_stationary_co2e', label: 'Scope 1 stationary combustion', type: 'number', scope: 'corporate', sortOrder: 2010 },
{ fieldId: 'scope1_breakdown_mobile_co2e', label: 'Scope 1 mobile combustion', type: 'number', scope: 'corporate', sortOrder: 2020 },
{ fieldId: 'scope1_breakdown_fugitive_co2e', label: 'Scope 1 fugitive emissions', type: 'number', scope: 'corporate', sortOrder: 2030 },
{ fieldId: 'scope1_breakdown_process_co2e', label: 'Scope 1 process emissions', type: 'number', scope: 'corporate', sortOrder: 2040 },
{ fieldId: 'scope1_co2_emissions', label: 'Scope 1 CO₂ (tonnes)', type: 'number', scope: 'corporate', sortOrder: 2050 },
{ fieldId: 'scope1_ch4_emissions', label: 'Scope 1 CH₄ (tonnes)', type: 'number', scope: 'corporate', sortOrder: 2060 },
{ fieldId: 'scope1_n2o_emissions', label: 'Scope 1 N₂O (tonnes)', type: 'number', scope: 'corporate', sortOrder: 2070 },
{ fieldId: 'scope1_hfcs_emissions', label: 'Scope 1 HFCs (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2080 },
{ fieldId: 'scope1_pfcs_emissions', label: 'Scope 1 PFCs (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2090 },
{ fieldId: 'scope1_sf6_emissions', label: 'Scope 1 SF₆ (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2100 },
{ fieldId: 'scope1_nf3_emissions', label: 'Scope 1 NF₃ (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2110 },
```

#### 1.3 Scope 2 Emissions (5 fields)

```typescript
// All Scope 2 fields are corporate-only
{ fieldId: 'scope2_total_location_based_co2e', label: 'Scope 2 location-based (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2200 },
{ fieldId: 'scope2_total_market_based_co2e', label: 'Scope 2 market-based (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2210 },
{ fieldId: 'scope2_residual_mix_emissions_co2e', label: 'Scope 2 residual mix (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2220 },
{ fieldId: 'scope2_electricity_consumption_mwh', label: 'Electricity consumption (MWh)', type: 'number', scope: 'corporate', sortOrder: 2230 },
{ fieldId: 'scope2_steam_heat_cold_energy_mwh', label: 'Steam/heat/cooling (MWh)', type: 'number', scope: 'corporate', sortOrder: 2240 },
```

#### 1.4 Scope 3 Emissions (20 fields)

```typescript
// All Scope 3 fields are corporate-only
{ fieldId: 'scope3_category1_purchased_goods_co2e', label: 'Cat 1: Purchased goods & services', type: 'number', scope: 'corporate', sortOrder: 2300 },
{ fieldId: 'scope3_category2_capital_goods_co2e', label: 'Cat 2: Capital goods', type: 'number', scope: 'corporate', sortOrder: 2310 },
{ fieldId: 'scope3_category3_fuel_energy_activities_co2e', label: 'Cat 3: Fuel & energy activities', type: 'number', scope: 'corporate', sortOrder: 2320 },
{ fieldId: 'scope3_category4_upstream_transport_co2e', label: 'Cat 4: Upstream transport', type: 'number', scope: 'corporate', sortOrder: 2330 },
{ fieldId: 'scope3_category5_waste_generated_co2e', label: 'Cat 5: Waste generated', type: 'number', scope: 'corporate', sortOrder: 2340 },
{ fieldId: 'scope3_category6_business_travel_co2e', label: 'Cat 6: Business travel', type: 'number', scope: 'corporate', sortOrder: 2350 },
{ fieldId: 'scope3_category7_employee_commuting_co2e', label: 'Cat 7: Employee commuting', type: 'number', scope: 'corporate', sortOrder: 2360 },
{ fieldId: 'scope3_category8_upstream_leased_assets_co2e', label: 'Cat 8: Upstream leased assets', type: 'number', scope: 'corporate', sortOrder: 2370 },
{ fieldId: 'scope3_category9_downstream_transport_co2e', label: 'Cat 9: Downstream transport', type: 'number', scope: 'corporate', sortOrder: 2380 },
{ fieldId: 'scope3_category10_processing_of_sold_products_co2e', label: 'Cat 10: Processing of sold products', type: 'number', scope: 'corporate', sortOrder: 2390 },
{ fieldId: 'scope3_category11_use_of_sold_products_co2e', label: 'Cat 11: Use of sold products', type: 'number', scope: 'corporate', sortOrder: 2400 },
{ fieldId: 'scope3_category12_end_of_life_treatment_co2e', label: 'Cat 12: End-of-life treatment', type: 'number', scope: 'corporate', sortOrder: 2410 },
{ fieldId: 'scope3_category13_downstream_leased_assets_co2e', label: 'Cat 13: Downstream leased assets', type: 'number', scope: 'corporate', sortOrder: 2420 },
{ fieldId: 'scope3_category14_franchises_co2e', label: 'Cat 14: Franchises', type: 'number', scope: 'corporate', sortOrder: 2430 },
{ fieldId: 'scope3_category15_investments_co2e', label: 'Cat 15: Investments', type: 'number', scope: 'corporate', sortOrder: 2440 },
{ fieldId: 'scope3_upstream_total_co2e', label: 'Scope 3 upstream total', type: 'number', scope: 'corporate', sortOrder: 2450 },
{ fieldId: 'scope3_downstream_total_co2e', label: 'Scope 3 downstream total', type: 'number', scope: 'corporate', sortOrder: 2460 },
{ fieldId: 'scope3_calculation_methodology_per_category', label: 'Scope 3 methodology by category', type: 'text', scope: 'corporate', sortOrder: 2470 },
```

#### 1.5 Totals & Base Year (7 fields)

```typescript
// corporate-only except base_year fields which are 'both'
{ fieldId: 'total_corporate_ghg_co2e', label: 'Total corporate GHG (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 2500 },
{ fieldId: 'esrs_e1_gross_scope123_co2e', label: 'ESRS E1 gross Scope 1+2+3', type: 'number', scope: 'corporate', sortOrder: 2510 },
{ fieldId: 'esrs_e1_ghg_removals_co2e', label: 'ESRS E1 GHG removals', type: 'number', scope: 'corporate', sortOrder: 2520 },
{ fieldId: 'esrs_e1_ghg_mitigation_projects_co2e', label: 'ESRS E1 mitigation projects', type: 'number', scope: 'corporate', sortOrder: 2530 },
{ fieldId: 'base_year', label: 'Base year', type: 'number', scope: 'both', sortOrder: 2540 },
{ fieldId: 'base_year_emissions_co2e', label: 'Base year emissions (tCO2e)', type: 'number', scope: 'both', sortOrder: 2550 },
{ fieldId: 'base_year_recalculation_policy', label: 'Base year recalculation policy', type: 'text', scope: 'corporate', sortOrder: 2560 },
```

**Phase 1 Total: 56 fields**

---

### Phase 2: CBAM Compliance (Priority: HIGH)

**Timeline:** Q1 2026 — CBAM definitive phase starts

#### 2.1 CBAM Core (21 fields)

```typescript
// All CBAM fields are product-only (product-level embedded emissions)
{ fieldId: 'cbam_importer_eori', label: 'Importer EORI number', type: 'text', scope: 'product', sortOrder: 3000 },
{ fieldId: 'cbam_authorised_declarant_id', label: 'Authorised declarant ID', type: 'text', scope: 'product', sortOrder: 3010 },
{ fieldId: 'cbam_goods_cn_codes', label: 'CN codes (8 digits)', type: 'text', scope: 'product', sortOrder: 3020 },
{ fieldId: 'cbam_reporting_quarter', label: 'Reporting quarter', type: 'text', scope: 'product', sortOrder: 3030 },
{ fieldId: 'cbam_total_embedded_emissions_co2e', label: 'Total embedded emissions (tCO2e)', type: 'number', scope: 'product', sortOrder: 3040 },
{ fieldId: 'cbam_embedded_emissions_direct_co2e', label: 'Direct embedded emissions', type: 'number', scope: 'product', sortOrder: 3050 },
{ fieldId: 'cbam_embedded_emissions_indirect_co2e', label: 'Indirect embedded emissions', type: 'number', scope: 'product', sortOrder: 3060 },
{ fieldId: 'cbam_specific_embedded_emissions_tco2e_per_tonne', label: 'Specific embedded emissions (tCO2e/t)', type: 'number', scope: 'product', sortOrder: 3070 },
{ fieldId: 'cbam_free_allowances_quantity', label: 'Free allowances quantity', type: 'number', scope: 'product', sortOrder: 3080 },
{ fieldId: 'cbam_certificates_purchased_quantity', label: 'Certificates purchased', type: 'number', scope: 'product', sortOrder: 3090 },
{ fieldId: 'cbam_certificates_used_quantity', label: 'Certificates used', type: 'number', scope: 'product', sortOrder: 3100 },
{ fieldId: 'cbam_monitoring_methodology_description', label: 'Monitoring methodology', type: 'text', scope: 'product', sortOrder: 3110 },
{ fieldId: 'cbam_supplier_data_availability', label: 'Supplier data availability', type: 'text', scope: 'product', sortOrder: 3120 },
{ fieldId: 'cbam_third_country_carbon_price_paid_eur', label: 'Third country carbon price (EUR)', type: 'number', scope: 'product', sortOrder: 3130 },
{ fieldId: 'cbam_production_process_description', label: 'Production process description', type: 'text', scope: 'product', sortOrder: 3140 },
{ fieldId: 'cbam_precursor_materials_emissions', label: 'Precursor materials emissions', type: 'number', scope: 'product', sortOrder: 3150 },
{ fieldId: 'cbam_installation_id', label: 'Installation ID', type: 'text', scope: 'product', sortOrder: 3160 },
{ fieldId: 'cbam_installation_country', label: 'Installation country', type: 'text', scope: 'product', sortOrder: 3170 },
{ fieldId: 'cbam_installation_boundaries', label: 'Installation boundaries', type: 'text', scope: 'product', sortOrder: 3180 },
{ fieldId: 'cbam_goods_quantity_tonnes', label: 'Goods quantity (tonnes)', type: 'number', scope: 'product', sortOrder: 3190 },
{ fieldId: 'cbam_emission_factor_electricity', label: 'Electricity emission factor', type: 'number', scope: 'product', sortOrder: 3200 },
```

#### 2.2 CBAM Extended (14 fields)

```typescript
// All CBAM extended fields are product-only
{ fieldId: 'cbam_activity_level_tonnes', label: 'Activity level (tonnes)', type: 'number', scope: 'product', sortOrder: 3210 },
{ fieldId: 'cbam_attributed_emissions_co2e', label: 'Attributed emissions (tCO2e)', type: 'number', scope: 'product', sortOrder: 3220 },
{ fieldId: 'cbam_system_boundaries_description', label: 'System boundaries description', type: 'text', scope: 'product', sortOrder: 3230 },
{ fieldId: 'cbam_installation_location_coordinates', label: 'Installation coordinates', type: 'text', hint: 'Latitude, longitude (6 decimals)', scope: 'product', sortOrder: 3240 },
{ fieldId: 'cbam_installation_main_economic_activity', label: 'Main economic activity', type: 'text', scope: 'product', sortOrder: 3250 },
{ fieldId: 'cbam_operator_name', label: 'Operator name', type: 'text', scope: 'product', sortOrder: 3260 },
{ fieldId: 'cbam_operator_contact', label: 'Operator contact', type: 'text', scope: 'product', sortOrder: 3270 },
{ fieldId: 'cbam_verification_report_date', label: 'Verification report date', type: 'date', scope: 'product', sortOrder: 3280 },
{ fieldId: 'cbam_verifier_name', label: 'Verifier name', type: 'text', scope: 'product', sortOrder: 3290 },
{ fieldId: 'cbam_verifier_accreditation_number', label: 'Verifier accreditation number', type: 'text', scope: 'product', sortOrder: 3300 },
{ fieldId: 'cbam_installation_visit_date', label: 'Installation visit date', type: 'date', scope: 'product', sortOrder: 3310 },
{ fieldId: 'cbam_emission_attribution_method', label: 'Emission attribution method', type: 'text', scope: 'product', sortOrder: 3320 },
{ fieldId: 'cbam_default_value_used', label: 'Default value used', type: 'select', options: ['yes', 'no'], scope: 'product', sortOrder: 3330 },
{ fieldId: 'cbam_country_specific_default_value_source', label: 'Default value source', type: 'text', scope: 'product', sortOrder: 3340 },
```

**Phase 2 Total: 35 fields**

---

### Phase 3: Verification & Assurance (Priority: HIGH)

**Timeline:** Q2 2025 — required for all verified reports

```typescript
// Verification fields are mostly 'both', SEC-specific are 'corporate'
{ fieldId: 'verification_required', label: 'Verification required', type: 'select', options: ['yes', 'no'], scope: 'both', sortOrder: 4000 },
{ fieldId: 'verification_standard', label: 'Verification standard', type: 'select', options: ['ISO_14064_3', 'ISAE_3410', 'ISAE_3000', 'other'], scope: 'both', sortOrder: 4010 },
{ fieldId: 'verifier_organization_name', label: 'Verifier organization', type: 'text', scope: 'both', sortOrder: 4020 },
{ fieldId: 'verifier_scope_statement', label: 'Verification scope', type: 'text', scope: 'both', sortOrder: 4030 },
{ fieldId: 'verification_level_assurance', label: 'Assurance level', type: 'select', options: ['limited', 'reasonable'], scope: 'both', sortOrder: 4040 },
{ fieldId: 'sec_scope1_attestation_level', label: 'SEC Scope 1 attestation', type: 'select', options: ['limited', 'reasonable', 'none'], scope: 'corporate', sortOrder: 4050 },
{ fieldId: 'sec_scope2_attestation_level', label: 'SEC Scope 2 attestation', type: 'select', options: ['limited', 'reasonable', 'none'], scope: 'corporate', sortOrder: 4060 },
{ fieldId: 'sec_ghg_attestation_provider', label: 'SEC attestation provider', type: 'text', scope: 'corporate', sortOrder: 4070 },
{ fieldId: 'verification_opinion_type', label: 'Verification opinion type', type: 'text', scope: 'both', sortOrder: 4080 },
```

**Phase 3 Total: 9 fields**

---

### Phase 4: Climate Governance & Risk (Priority: MEDIUM-HIGH)

**Timeline:** Q3 2025 — CSRD/TCFD compliance

#### 4.1 Governance (6 fields)

```typescript
// All climate governance fields are corporate-only
{ fieldId: 'climate_governance_description', label: 'Climate governance description', type: 'text', scope: 'corporate', sortOrder: 5000 },
{ fieldId: 'climate_risk_management_process', label: 'Risk management process', type: 'text', scope: 'corporate', sortOrder: 5010 },
{ fieldId: 'climate_risks_physical_description', label: 'Physical risks description', type: 'text', scope: 'corporate', sortOrder: 5020 },
{ fieldId: 'climate_risks_transition_description', label: 'Transition risks description', type: 'text', scope: 'corporate', sortOrder: 5030 },
{ fieldId: 'climate_related_opportunities_description', label: 'Climate opportunities', type: 'text', scope: 'corporate', sortOrder: 5040 },
{ fieldId: 'climate_resilience_assessment', label: 'Climate resilience assessment', type: 'text', scope: 'corporate', sortOrder: 5050 },
```

#### 4.2 Scenarios (5 fields)

```typescript
// All scenario fields are corporate-only
{ fieldId: 'climate_scenarios_used', label: 'Climate scenarios used', type: 'text', scope: 'corporate', sortOrder: 5100 },
{ fieldId: 'climate_scenario_results_summary', label: 'Scenario results summary', type: 'text', scope: 'corporate', sortOrder: 5110 },
{ fieldId: 'climate_scenario_analysis_results', label: 'Scenario analysis results', type: 'text', scope: 'corporate', sortOrder: 5120 },
{ fieldId: 'current_period_climate_impacts_financial', label: 'Current period financial impacts', type: 'text', scope: 'corporate', sortOrder: 5130 },
{ fieldId: 'anticipated_climate_impacts_financial', label: 'Anticipated financial impacts', type: 'text', scope: 'corporate', sortOrder: 5140 },
```

#### 4.3 SEC Specific (2 fields)

```typescript
// SEC-specific fields are corporate-only
{ fieldId: 'sec_material_climate_risks_disclosure', label: 'SEC material climate risks', type: 'text', scope: 'corporate', sortOrder: 5200 },
{ fieldId: 'sec_climate_targets_material_impact', label: 'SEC targets material impact', type: 'text', scope: 'corporate', sortOrder: 5210 },
```

**Phase 4 Total: 13 fields**

---

### Phase 5: Targets & Strategy (Priority: MEDIUM)

**Timeline:** Q4 2025

#### 5.1 Targets (5 fields)

```typescript
// All targets fields are corporate-only
{ fieldId: 'emission_reduction_targets_list', label: 'Emission reduction targets', type: 'text', isRepeatable: true, repeatableKey: 'reduction_target', scope: 'corporate', sortOrder: 6000 },
{ fieldId: 'climate_targets_progress_quantitative', label: 'Targets progress (quantitative)', type: 'text', scope: 'corporate', sortOrder: 6010 },
{ fieldId: 'net_zero_target_year', label: 'Net-zero target year', type: 'number', scope: 'corporate', sortOrder: 6020 },
{ fieldId: 'decarbonisation_strategy_summary', label: 'Decarbonisation strategy', type: 'text', scope: 'corporate', sortOrder: 6030 },
{ fieldId: 'transition_plan_description', label: 'Transition plan description', type: 'text', scope: 'corporate', sortOrder: 6040 },
```

#### 5.2 Energy Strategy (7 fields)

```typescript
// All energy strategy fields are corporate-only
{ fieldId: 'energy_efficiency_measures_summary', label: 'Energy efficiency measures', type: 'text', scope: 'corporate', sortOrder: 6100 },
{ fieldId: 'renewable_energy_strategy_summary', label: 'Renewable energy strategy', type: 'text', scope: 'corporate', sortOrder: 6110 },
{ fieldId: 'esrs_e1_energy_consumption_high_impact_sectors_mwh', label: 'Energy in high-impact sectors (MWh)', type: 'number', scope: 'corporate', sortOrder: 6120 },
{ fieldId: 'esrs_e1_energy_intensity_per_revenue', label: 'Energy intensity per revenue', type: 'number', scope: 'corporate', sortOrder: 6130 },
{ fieldId: 'esrs_e1_renewable_energy_production_mwh', label: 'Renewable energy production (MWh)', type: 'number', scope: 'corporate', sortOrder: 6140 },
{ fieldId: 'esrs_e1_internal_carbon_pricing_schemes', label: 'Internal carbon pricing', type: 'text', scope: 'corporate', sortOrder: 6150 },
```

#### 5.3 Offsets (3 fields)

```typescript
// Offsets are corporate-only (organization-level purchases)
{ fieldId: 'offsets_purchased_co2e', label: 'Offsets purchased (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 6200 },
{ fieldId: 'offsets_programs_list', label: 'Offset programs', type: 'text', isRepeatable: true, repeatableKey: 'offset_program', scope: 'corporate', sortOrder: 6210 },
{ fieldId: 'carbon_neutral_claim_boundary', label: 'Carbon neutral claim boundary', type: 'text', scope: 'corporate', sortOrder: 6220 },
```

**Phase 5 Total: 15 fields**

---

### Phase 6: SBTi & Voluntary Frameworks (Priority: MEDIUM)

**Timeline:** Q1 2026

```typescript
// All SBTi fields are corporate-only
{ fieldId: 'sbti_commitment_status', label: 'SBTi commitment status', type: 'select', options: ['committed', 'targets_set', 'targets_approved', 'none'], scope: 'corporate', sortOrder: 7000 },
{ fieldId: 'sbti_scope_coverage', label: 'SBTi scope coverage', type: 'text', scope: 'corporate', sortOrder: 7010 },
{ fieldId: 'sbti_target_type', label: 'SBTi target type', type: 'select', options: ['near_term', 'long_term', 'net_zero'], scope: 'corporate', sortOrder: 7020 },
{ fieldId: 'sbti_sector_classification', label: 'SBTi sector classification', type: 'text', scope: 'corporate', sortOrder: 7030 },
{ fieldId: 'sbti_flag_target_set', label: 'SBTi FLAG target set', type: 'select', options: ['yes', 'no'], scope: 'corporate', sortOrder: 7040 },
{ fieldId: 'sbti_value_chain_target', label: 'SBTi value chain target', type: 'text', scope: 'corporate', sortOrder: 7050 },
{ fieldId: 'sbti_validation_date', label: 'SBTi validation date', type: 'date', scope: 'corporate', sortOrder: 7060 },
{ fieldId: 'sbti_target_submission_year', label: 'SBTi submission year', type: 'number', scope: 'corporate', sortOrder: 7070 },
{ fieldId: 'sbti_near_term_target_year', label: 'SBTi near-term target year', type: 'number', scope: 'corporate', sortOrder: 7080 },
{ fieldId: 'sbti_long_term_target_year', label: 'SBTi long-term target year', type: 'number', scope: 'corporate', sortOrder: 7090 },
{ fieldId: 'sbti_net_zero_year', label: 'SBTi net-zero year', type: 'number', scope: 'corporate', sortOrder: 7100 },
```

**Phase 6 Total: 11 fields**

---

### Phase 7: Product PCF Extensions (Priority: MEDIUM)

**Timeline:** Q2 2026 — for EPD and detailed PCF reports

```typescript
// All product PCF fields are product-only
{ fieldId: 'product_system_boundary_description', label: 'System boundary description', type: 'text', scope: 'product', sortOrder: 8000 },
{ fieldId: 'product_life_cycle_stages_included', label: 'Life cycle stages included', type: 'text', scope: 'product', sortOrder: 8010 },
{ fieldId: 'product_allocation_methodology', label: 'Allocation methodology', type: 'select', options: ['mass', 'economic', 'energy', 'other'], scope: 'product', sortOrder: 8020 },
{ fieldId: 'product_cutoff_criteria', label: 'Cut-off criteria', type: 'text', scope: 'product', sortOrder: 8030 },
{ fieldId: 'product_data_quality_indicators', label: 'Data quality indicators', type: 'text', scope: 'product', sortOrder: 8040 },
{ fieldId: 'product_pcf_per_functional_unit', label: 'PCF per functional unit', type: 'number', scope: 'product', sortOrder: 8050 },
{ fieldId: 'product_biogenic_carbon_co2e', label: 'Biogenic carbon (tCO2e)', type: 'number', scope: 'product', sortOrder: 8060 },
{ fieldId: 'product_pcf_modules_breakdown_json', label: 'PCF modules breakdown', type: 'text', hint: 'JSON format', scope: 'product', sortOrder: 8070 },
{ fieldId: 'product_pcf_co2_emissions', label: 'Product CO₂ emissions', type: 'number', scope: 'product', sortOrder: 8080 },
{ fieldId: 'product_pcf_ch4_emissions', label: 'Product CH₄ emissions', type: 'number', scope: 'product', sortOrder: 8090 },
{ fieldId: 'product_pcf_n2o_emissions', label: 'Product N₂O emissions', type: 'number', scope: 'product', sortOrder: 8100 },
{ fieldId: 'product_pcf_other_ghg_emissions', label: 'Product other GHG emissions', type: 'number', scope: 'product', sortOrder: 8110 },
{ fieldId: 'product_primary_data_percentage', label: 'Primary data percentage', type: 'number', scope: 'product', sortOrder: 8120 },
{ fieldId: 'product_lca_database_used', label: 'LCA database used', type: 'text', scope: 'product', sortOrder: 8130 },
{ fieldId: 'product_lca_software_used', label: 'LCA software used', type: 'text', scope: 'product', sortOrder: 8140 },
{ fieldId: 'product_declared_unit', label: 'Declared unit (EPD)', type: 'text', scope: 'product', sortOrder: 8150 },
{ fieldId: 'product_reference_service_life_years', label: 'Reference service life (years)', type: 'number', scope: 'product', sortOrder: 8160 },
{ fieldId: 'product_end_of_life_scenario', label: 'End-of-life scenario', type: 'text', scope: 'product', sortOrder: 8170 },
{ fieldId: 'product_transport_distance_km', label: 'Transport distance (km)', type: 'number', scope: 'product', sortOrder: 8180 },
{ fieldId: 'product_transport_mode', label: 'Transport mode', type: 'select', options: ['road', 'rail', 'sea', 'air', 'multimodal'], scope: 'product', sortOrder: 8190 },
{ fieldId: 'product_packaging_emissions_co2e', label: 'Packaging emissions', type: 'number', scope: 'product', sortOrder: 8200 },
{ fieldId: 'product_use_phase_emissions_co2e', label: 'Use phase emissions', type: 'number', scope: 'product', sortOrder: 8210 },
{ fieldId: 'product_pcr_or_pefcr_reference', label: 'PCR/PEFCR reference', type: 'text', scope: 'product', sortOrder: 8220 },
{ fieldId: 'product_geographic_validity', label: 'Geographic validity', type: 'text', scope: 'product', sortOrder: 8230 },
{ fieldId: 'product_temporal_validity', label: 'Temporal validity', type: 'text', scope: 'product', sortOrder: 8240 },
{ fieldId: 'product_technology_coverage', label: 'Technology coverage', type: 'text', scope: 'product', sortOrder: 8250 },
```

**Phase 7 Total: 26 fields**

---

### Phase 8: Building Carbon Footprint (Priority: LOW-MEDIUM)

**Timeline:** Q3 2026 — for EN 15978 reports

```typescript
// All building fields are product-only (building = product)
{ fieldId: 'building_type', label: 'Building type', type: 'select', options: ['office', 'residential', 'warehouse', 'retail', 'industrial', 'mixed', 'other'], scope: 'product', sortOrder: 9000 },
{ fieldId: 'building_floor_area_m2', label: 'Floor area (m²)', type: 'number', scope: 'product', sortOrder: 9010 },
{ fieldId: 'building_construction_year', label: 'Construction year', type: 'number', scope: 'product', sortOrder: 9020 },
{ fieldId: 'building_energy_consumption_mwh', label: 'Energy consumption (MWh)', type: 'number', scope: 'product', sortOrder: 9030 },
{ fieldId: 'building_occupancy_rate_percent', label: 'Occupancy rate (%)', type: 'number', scope: 'product', sortOrder: 9040 },
{ fieldId: 'building_certifications_existing', label: 'Existing certifications', type: 'text', scope: 'product', sortOrder: 9050 },
{ fieldId: 'building_embodied_carbon_co2e', label: 'Embodied carbon (tCO2e)', type: 'number', scope: 'product', sortOrder: 9060 },
{ fieldId: 'building_operational_carbon_co2e', label: 'Operational carbon (tCO2e)', type: 'number', scope: 'product', sortOrder: 9070 },
{ fieldId: 'building_reference_study_period_years', label: 'Reference study period (years)', type: 'number', scope: 'product', sortOrder: 9080 },
{ fieldId: 'building_life_cycle_module', label: 'Life cycle module', type: 'text', scope: 'product', sortOrder: 9090 },
{ fieldId: 'building_energy_class', label: 'Energy class', type: 'select', options: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], scope: 'product', sortOrder: 9100 },
{ fieldId: 'building_energy_consumption_heating_mwh', label: 'Heating consumption (MWh)', type: 'number', scope: 'product', sortOrder: 9110 },
{ fieldId: 'building_energy_consumption_cooling_mwh', label: 'Cooling consumption (MWh)', type: 'number', scope: 'product', sortOrder: 9120 },
{ fieldId: 'building_energy_consumption_electricity_mwh', label: 'Electricity consumption (MWh)', type: 'number', scope: 'product', sortOrder: 9130 },
{ fieldId: 'building_renewable_energy_share_percent', label: 'Renewable energy share (%)', type: 'number', scope: 'product', sortOrder: 9140 },
{ fieldId: 'building_net_zero_target_year', label: 'Net-zero target year', type: 'number', scope: 'product', sortOrder: 9150 },
{ fieldId: 'building_decarbonisation_pathway', label: 'Decarbonisation pathway', type: 'text', scope: 'product', sortOrder: 9160 },
{ fieldId: 'building_structural_system', label: 'Structural system', type: 'select', options: ['concrete', 'steel', 'timber', 'masonry', 'hybrid'], scope: 'product', sortOrder: 9170 },
{ fieldId: 'building_facade_type', label: 'Facade type', type: 'text', scope: 'product', sortOrder: 9180 },
{ fieldId: 'building_hvac_system_type', label: 'HVAC system type', type: 'text', scope: 'product', sortOrder: 9190 },
{ fieldId: 'building_module_a1a3_emissions_co2e', label: 'Module A1-A3 (production)', type: 'number', scope: 'product', sortOrder: 9200 },
{ fieldId: 'building_module_a4_emissions_co2e', label: 'Module A4 (transport)', type: 'number', scope: 'product', sortOrder: 9210 },
{ fieldId: 'building_module_a5_emissions_co2e', label: 'Module A5 (construction)', type: 'number', scope: 'product', sortOrder: 9220 },
{ fieldId: 'building_module_b_emissions_co2e', label: 'Module B (use)', type: 'number', scope: 'product', sortOrder: 9230 },
{ fieldId: 'building_module_c_emissions_co2e', label: 'Module C (end-of-life)', type: 'number', scope: 'product', sortOrder: 9240 },
{ fieldId: 'building_module_d_benefits_co2e', label: 'Module D (benefits)', type: 'number', scope: 'product', sortOrder: 9250 },
```

**Phase 8 Total: 26 fields**

---

### Phase 9: EU ETS (Priority: LOW)

**Timeline:** Q4 2026 — for industrial installations only

```typescript
// All EU ETS fields are corporate-only (installation-level, reported by organization)
{ fieldId: 'eu_ets_compliance_year', label: 'EU ETS compliance year', type: 'number', scope: 'corporate', sortOrder: 10000 },
{ fieldId: 'eu_ets_phase', label: 'EU ETS phase', type: 'number', scope: 'corporate', sortOrder: 10010 },
{ fieldId: 'eu_ets_installations_list', label: 'EU ETS installations', type: 'text', isRepeatable: true, repeatableKey: 'ets_installation', scope: 'corporate', sortOrder: 10020 },
{ fieldId: 'eu_ets_verified_emissions_co2e', label: 'Verified emissions (tCO2e)', type: 'number', scope: 'corporate', sortOrder: 10030 },
{ fieldId: 'eu_ets_allowances_surrendered_quantity', label: 'Allowances surrendered', type: 'number', scope: 'corporate', sortOrder: 10040 },
{ fieldId: 'eu_ets_free_allowances_quantity', label: 'Free allowances', type: 'number', scope: 'corporate', sortOrder: 10050 },
{ fieldId: 'eu_ets_market_allowances_purchased_quantity', label: 'Market allowances purchased', type: 'number', scope: 'corporate', sortOrder: 10060 },
{ fieldId: 'eu_ets_market_allowances_sold_quantity', label: 'Market allowances sold', type: 'number', scope: 'corporate', sortOrder: 10070 },
{ fieldId: 'eu_ets_balance_surplus_quantity', label: 'Balance/surplus', type: 'number', scope: 'corporate', sortOrder: 10080 },
{ fieldId: 'eu_ets_verification_body_name', label: 'Verification body', type: 'text', scope: 'corporate', sortOrder: 10090 },
{ fieldId: 'eu_ets_compliance_statement', label: 'Compliance statement', type: 'text', scope: 'corporate', sortOrder: 10100 },
{ fieldId: 'eu_ets_monitoring_methodology_reference', label: 'Monitoring methodology', type: 'text', scope: 'corporate', sortOrder: 10110 },
{ fieldId: 'eu_ets_benchmark_values', label: 'Benchmark values', type: 'text', scope: 'corporate', sortOrder: 10120 },
{ fieldId: 'eu_ets_carbon_leakage_exposure', label: 'Carbon leakage exposure', type: 'text', scope: 'corporate', sortOrder: 10130 },
{ fieldId: 'eu_ets_innovation_fund_eligible', label: 'Innovation Fund eligible', type: 'select', options: ['yes', 'no'], scope: 'corporate', sortOrder: 10140 },
{ fieldId: 'eu_ets_installation_permit_numbers', label: 'Installation permit numbers', type: 'text', scope: 'corporate', sortOrder: 10150 },
{ fieldId: 'eu_ets_activity_level_data', label: 'Activity level data', type: 'text', scope: 'corporate', sortOrder: 10160 },
{ fieldId: 'eu_ets_fall_back_methodology_used', label: 'Fall-back methodology used', type: 'select', options: ['yes', 'no'], scope: 'corporate', sortOrder: 10170 },
```

**Phase 9 Total: 18 fields**

---

### Phase 10: Additional Regulatory & ESG (Priority: LOW)

**Timeline:** 2026+ — as needed

#### 10.1 Financial Sector (13 fields)
#### 10.2 Listing & Regulatory (7 fields)
#### 10.3 Rating Platforms (14 fields)
#### 10.4 Aviation/Shipping (5 fields)
#### 10.5 Client Requirements (6 fields)
#### 10.6 Energy Details (6 fields)
#### 10.7 ESG Governance (6 fields)
#### 10.8 Value Chain (6 fields)
#### 10.9 Environmental (Air, Water, Waste, Biodiversity) (16 fields)
#### 10.10 Social/HR (10 fields)
#### 10.11 Financial Impacts (8 fields)
#### 10.12 Quality Metrics (7 fields)
#### 10.13 CSRD Specific (5 fields)
#### 10.14 CORSIA/MRV (7 fields)

**Phase 10 Total: ~116 fields**

---

## Implementation Summary

| Phase | Description | Fields | Priority | Timeline |
|-------|-------------|--------|----------|----------|
| 1 | Core Corporate GHG | 56 | CRITICAL | Immediate |
| 2 | CBAM | 35 | HIGH | Q1 2026 |
| 3 | Verification | 9 | HIGH | Q2 2025 |
| 4 | Climate Governance | 13 | MEDIUM-HIGH | Q3 2025 |
| 5 | Targets & Strategy | 15 | MEDIUM | Q4 2025 |
| 6 | SBTi | 11 | MEDIUM | Q1 2026 |
| 7 | Product PCF | 26 | MEDIUM | Q2 2026 |
| 8 | Building | 26 | LOW-MEDIUM | Q3 2026 |
| 9 | EU ETS | 18 | LOW | Q4 2026 |
| 10 | Additional | ~116 | LOW | 2026+ |
| **TOTAL** | | **~325** | | |

---

## Migration Notes

### Step 0: Rename Existing Fields to Match Matrix

**CRITICAL:** Before adding new fields, rename existing fields to match matrix naming convention.

| Current fieldId | New fieldId (from matrix) | Reason |
|-----------------|---------------------------|--------|
| `functional_unit` | `product_functional_unit_definition` | Matrix naming convention |
| `system_boundary` | `product_life_cycle_stages_included` | Clarifies this is stages list |
| `total_cfp_co2e` | `product_total_pcf_co2e` | Matrix uses PCF terminology |
| `intended_market` | `product_geographic_validity` | Aligns with ISO 14067 terminology |
| `transport_mode` | `product_transport_mode` | Product prefix for consistency |
| `transport_distance` | `product_transport_distance_km` | Product prefix + explicit unit |

**Migration SQL:**

```sql
-- Step 0: Rename fields in dataset_field_definitions table
UPDATE dataset_field_definitions SET field_id = 'product_functional_unit_definition' WHERE field_id = 'functional_unit';
UPDATE dataset_field_definitions SET field_id = 'product_life_cycle_stages_included' WHERE field_id = 'system_boundary';
UPDATE dataset_field_definitions SET field_id = 'product_total_pcf_co2e' WHERE field_id = 'total_cfp_co2e';
UPDATE dataset_field_definitions SET field_id = 'product_geographic_validity' WHERE field_id = 'intended_market';
UPDATE dataset_field_definitions SET field_id = 'product_transport_mode' WHERE field_id = 'transport_mode';
UPDATE dataset_field_definitions SET field_id = 'product_transport_distance_km' WHERE field_id = 'transport_distance';

-- Update labels to match
UPDATE dataset_field_definitions SET label = 'Functional unit definition' WHERE field_id = 'product_functional_unit_definition';
UPDATE dataset_field_definitions SET label = 'Life cycle stages included' WHERE field_id = 'product_life_cycle_stages_included';
UPDATE dataset_field_definitions SET label = 'Total PCF (tCO2e)' WHERE field_id = 'product_total_pcf_co2e';
UPDATE dataset_field_definitions SET label = 'Geographic validity' WHERE field_id = 'product_geographic_validity';
UPDATE dataset_field_definitions SET label = 'Transport mode' WHERE field_id = 'product_transport_mode';
UPDATE dataset_field_definitions SET label = 'Transport distance (km)' WHERE field_id = 'product_transport_distance_km';
```

**Update dataset-fields.ts:**

```typescript
// BEFORE
{ fieldId: 'functional_unit', label: 'Functional unit', ... },
{ fieldId: 'system_boundary', label: 'System boundary', ... },
{ fieldId: 'total_cfp_co2e', label: 'Total CFP (kg CO2e)', ... },
{ fieldId: 'intended_market', label: 'Intended market', ... },
{ fieldId: 'transport_mode', label: 'Transport mode', ... },
{ fieldId: 'transport_distance', label: 'Transport distance (km)', ... },

// AFTER
{ fieldId: 'product_functional_unit_definition', label: 'Functional unit definition', hint: 'Complete definition of the functional unit per ISO 14067.', type: text, sortOrder: 300, legacyFieldIds: ['functional_unit', 'GoalAndScope_FunctionalUnitDefinition'] },
{ fieldId: 'product_life_cycle_stages_included', label: 'Life cycle stages included', hint: 'Life cycle stages included (e.g., A1-A3, cradle-to-gate).', type: text, sortOrder: 310, legacyFieldIds: ['system_boundary', 'GoalAndScope_SystemBoundaryDescription'] },
{ fieldId: 'product_total_pcf_co2e', label: 'Total PCF (tCO2e)', hint: 'Total product carbon footprint result.', type: number, sortOrder: 400, legacyFieldIds: ['total_cfp_co2e', 'ImpactAssessmentResults_TotalCFPCO2e'] },
{ fieldId: 'product_geographic_validity', label: 'Geographic validity', hint: 'Regions or markets where the PCF is valid.', type: text, sortOrder: 220, legacyFieldIds: ['intended_market', 'ProductDescription_Market'] },
{ fieldId: 'product_transport_mode', label: 'Transport mode', hint: 'Mode of transport (road, sea, air, rail).', type: text, isRepeatable: true, repeatableKey: 'transport_segment', sortOrder: 700, legacyFieldIds: ['transport_mode', 'Transportation_TransportMode'] },
{ fieldId: 'product_transport_distance_km', label: 'Transport distance (km)', hint: 'Distance covered in the transport segment.', type: number, isRepeatable: true, repeatableKey: 'transport_segment', sortOrder: 710, legacyFieldIds: ['transport_distance', 'Transportation_TransportDistance'] },
```

**JSONB Data Migration:**

Existing project datasets store data using old field IDs. Run migration to update:

```sql
-- Update field_id references in Project.dataset JSONB
UPDATE projects 
SET dataset = (
  SELECT jsonb_agg(
    CASE 
      WHEN elem->>'field_id' = 'functional_unit' THEN jsonb_set(elem, '{field_id}', '"product_functional_unit_definition"')
      WHEN elem->>'field_id' = 'system_boundary' THEN jsonb_set(elem, '{field_id}', '"product_life_cycle_stages_included"')
      WHEN elem->>'field_id' = 'total_cfp_co2e' THEN jsonb_set(elem, '{field_id}', '"product_total_pcf_co2e"')
      WHEN elem->>'field_id' = 'intended_market' THEN jsonb_set(elem, '{field_id}', '"product_geographic_validity"')
      WHEN elem->>'field_id' = 'transport_mode' THEN jsonb_set(elem, '{field_id}', '"product_transport_mode"')
      WHEN elem->>'field_id' = 'transport_distance' THEN jsonb_set(elem, '{field_id}', '"product_transport_distance_km"')
      ELSE elem
    END
  )
  FROM jsonb_array_elements(dataset->'data_points') AS elem
)
WHERE dataset->'data_points' IS NOT NULL;
```

**Application Code Changes:**

Search and replace in codebase:
- `functional_unit` → `product_functional_unit_definition`
- `system_boundary` → `product_life_cycle_stages_included`
- `total_cfp_co2e` → `product_total_pcf_co2e`
- `intended_market` → `product_geographic_validity`
- `transport_mode` → `product_transport_mode`
- `transport_distance` → `product_transport_distance_km`

---

### Recommended Approach

1. **Rename existing fields first** (Step 0 above)
2. **Add fields incrementally** — don't add all 325 fields at once
3. **Use feature flags** — enable field groups per organization/plan
4. **Use legacyFieldIds** — for backward compatibility with old data

### Repeatable Fields Structure

Fields marked as `isRepeatable: true` should use existing `repeatableKey` pattern:

```typescript
// Example: emission_reduction_targets_list
{
  fieldId: 'reduction_target_base_year',
  isRepeatable: true,
  repeatableKey: 'reduction_target',
  sortOrder: 6001,
},
{
  fieldId: 'reduction_target_year',
  isRepeatable: true,
  repeatableKey: 'reduction_target',
  sortOrder: 6002,
},
{
  fieldId: 'reduction_target_scope_coverage',
  isRepeatable: true,
  repeatableKey: 'reduction_target',
  sortOrder: 6003,
},
{
  fieldId: 'reduction_target_percent',
  isRepeatable: true,
  repeatableKey: 'reduction_target',
  sortOrder: 6004,
},
{
  fieldId: 'reduction_target_status',
  isRepeatable: true,
  repeatableKey: 'reduction_target',
  sortOrder: 6005,
},
```

### Database Migration Script

For each phase, create a Prisma seed update:

```bash
# After updating dataset-fields.ts
npx prisma db seed
```

---

## Related Documentation

- `datapoints-reports-CORPORATE-2026.csv` — source of truth for corporate field names
- `datapoints-reports-PRODUCT-2026.csv` — source of truth for product field names
- `data points expansion plan.md` — semantic definitions and regulatory references
- `matrix readme.md` — how to use the matrix files

---

**Document Owner:** Engineering Team  
**Last Updated:** November 27, 2025  
**Next Review:** Q1 2026 (post-CBAM definitive phase)
