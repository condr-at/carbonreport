### datapoints-reports matrix files

**Last Updated:** November 27, 2025  
**Status:** ✅ PRODUCT matrix complete, CORPORATE matrix in progress

This folder contains **two matrix files**:
1. `datapoints-reports-PRODUCT.csv` — Product-level reports (CBAM, EPD, PCF, Building)
2. `datapoints-reports-CORPORATE.csv` — Corporate-level reports (CSRD, EU_ETS, SEC, etc.)

These files are the **source of truth** for:
1. The canonical list of all data point `fieldId`s (column names = source of truth for naming)
2. Which fields are used by which report types

---

## 📊 Current State

### PRODUCT Matrix (`datapoints-reports-PRODUCT.csv`)
- **Total Data Points:** 59 columns (excluding 3 service columns)
- **Report Types:** 9 product reports + 3 utility rows
- **Mapping Status:** ✅ Complete — verified against official sources (Nov 27, 2025)

### CORPORATE Matrix (`datapoints-reports-CORPORATE.csv`)
- **Total Data Points:** 205 columns (excluding 3 service columns)
- **Report Types:** 38 corporate reports + 3 utility rows
- **Mapping Status:** ⏳ In progress — structure ready, field mappings pending

## 📁 Related Documentation

- `data points expansion plan.md` — semantic definitions and grouping of fields (blocks 1–37)

## File Structure

**Delimiter:** `;` (semicolon)

One **column** = one `fieldId` / data point

**Service Columns (col 1–3):**
1. `report_type` — Report type identifier (e.g., CSRD, EU_ETS, CBAM)
2. `__reference_urls__` — Official regulation/standard URL (service column, not a data point)
3. `data_points_checked_against_reference_url` — ✔️/❌ verification status (service column)

**Column layout (col 4+):** Individual data point columns

**Row types:**

1. **Header row**: Data point names (fieldIds) — **source of truth for field naming**
2. **Report rows**: Each regulatory framework/standard with M/O marks for required/optional fields
3. **Utility rows**: `hint_for_UI`, `hint_for_email_request`, `implemented_in_database`

**Cell value scheme for data point columns (col 4+):**
- `M` — Mandatory: field is required for this report type
- `O` — Optional: field is relevant but not required
- _(empty cell, i.e. `;;`)_ — field not applicable to this report type

**Important:** Only three states are allowed: `M`, `O`, or empty (no spaces, no other markers).

---

## 📦 PRODUCT Matrix — Report Types (9)

| Report Type | Description | Reference |
|-------------|-------------|-----------|
| `CBAM` | Carbon Border Adjustment Mechanism (basic) | EU Regulation |
| `EPD_OR_ISO_14067` | Environmental Product Declaration / ISO 14067 | ISO Standard |
| `PRODUCT_PCF` | Product Carbon Footprint (GHG Protocol) | GHG Protocol |
| `BUILDING_CARBON_FOOTPRINT` | Building-specific carbon footprint | EN 15978 / ISO 21930 |
| `CBAM_DATA_PACKAGE` | Full CBAM data package with verification | EU Regulation |
| `CBAM_REPORT` | Quarterly CBAM report submission | EU Regulation |
| `CBAM_ALLOWANCES` | CBAM allowances management | EU Regulation |
| `CBAM_MONITORING_ALERT` | CBAM monitoring compliance alert | EU Regulation |
| `CBAM_PREP_METHOD` | CBAM preparation methodology | EU Regulation |

### PRODUCT Matrix Data Points (59 fields)

**Block: Core/Period (4 fields)**
- `reporting_period_start`, `reporting_period_end`, `countries_of_operation`, `exclusions_scope_explanation`

**Block: Base Year (2 fields)**
- `base_year`, `base_year_emissions_co2e`

**Block: Verification (4 fields)**
- `verification_standard`, `verifier_organization_name`, `verifier_scope_statement`, `verification_level_assurance`

**Block: Building (10 fields)**
- `building_type`, `building_floor_area_m2`, `building_construction_year`, `building_energy_consumption_mwh`
- `building_occupancy_rate_percent`, `building_certifications_existing`, `building_embodied_carbon_co2e`
- `building_operational_carbon_co2e`, `building_reference_study_period_years`, `building_life_cycle_module`

**Block: CBAM (21 fields)**
- `cbam_importer_eori`, `cbam_authorised_declarant_id`, `cbam_goods_cn_codes`, `cbam_reporting_quarter`
- `cbam_total_embedded_emissions_co2e`, `cbam_embedded_emissions_direct_co2e`, `cbam_embedded_emissions_indirect_co2e`
- `cbam_specific_embedded_emissions_tco2e_per_tonne`, `cbam_free_allowances_quantity`
- `cbam_certificates_purchased_quantity`, `cbam_certificates_used_quantity`
- `cbam_monitoring_methodology_description`, `cbam_supplier_data_availability`
- `cbam_third_country_carbon_price_paid_eur`, `cbam_production_process_description`
- `cbam_precursor_materials_emissions`, `cbam_installation_id`, `cbam_installation_country`
- `cbam_installation_boundaries`, `cbam_goods_quantity_tonnes`, `cbam_emission_factor_electricity`

**Block: Product LCA/PCF (11 fields)**
- `product_name`, `product_description`, `product_functional_unit_definition`
- `product_system_boundary_description`, `product_life_cycle_stages_included`
- `product_allocation_methodology`, `product_cutoff_criteria`, `product_data_quality_indicators`
- `product_total_pcf_co2e`, `product_pcf_per_functional_unit`, `product_biogenic_carbon_co2e`

**Block: Meta/Quality (6 fields)**
- `data_quality_assessment_summary`, `methodology_reference_documents`
- `limitations_and_uncertainties_summary`, `comparability_notes`
- `responsible_officer_name`, `responsible_officer_role`

---

## 🏢 CORPORATE Matrix — Report Types Covered

### EU Regulations (11)
- CSRD - Corporate Sustainability Reporting Directive
- EU_ETS - Emissions Trading System
- CBAM (5 variants) - Carbon Border Adjustment Mechanism
- EU_MRV - Maritime Reporting & Verification
- SFDR - Sustainable Finance Disclosure Regulation

### UK Regulations (2)
- UK_SECR - Streamlined Energy and Carbon Reporting
- UK_TCFD - TCFD Mandatory Disclosure

### US Regulations (1)
- SEC_CLIMATE - SEC Climate Disclosure Rules

### International Standards (8)
- CORSIA - Aviation carbon offsetting (ICAO)
- ISO_14064_CERT - GHG verification standard
- CDP_DISCLOSURE - Carbon Disclosure Project
- TCFD_REPORT - Task Force on Climate-related Financial Disclosures
- EPD_OR_ISO_14067 - Environmental Product Declarations
- PRODUCT_PCF - Product Carbon Footprint (GHG Protocol)
- CARBON_NEUTRAL_CERT - Carbon neutrality certification
- HKEX_ESG - Hong Kong Exchange ESG Reporting

### GHG Protocol Variants (6)
- CORP_GHG - Corporate Standard
- CORP_GHG_VERIFIED - With third-party verification
- CORP_GHG_SIMPLIFIED - Simplified version
- CORP_GHG_ANNUAL - Annual reporting
- CORP_GHG_PUBLIC - Public disclosure
- CORP_GHG_INTERNAL - Internal use

### Voluntary Frameworks (5)
- SBTI_COMMITMENT - Science Based Targets initiative
- RE100_REPORTING - Renewable Energy 100%
- GRESB_ASSESSMENT - Real Estate Sustainability
- BCORP_IMPACT_ASSESSMENT - B Corporation Certification
- ECOVADIS_SCORE - Supplier sustainability rating

### Client/Internal Use (12)
- CLIENT_SCOPE3_PACKAGE - Client Scope 3 data delivery
- CLIENT_TEMPLATE_FILL - Client template completion
- BANK_TEMPLATE_FILL - Financial institution template
- SCOPE123_DATASET - Complete emissions dataset
- SCOPE3_DETAILED - Detailed Scope 3 reporting
- SCOPE2_DETAILED - Detailed Scope 2 reporting
- SCOPE3_CATEGORY1_SUPPLIERS - Supplier engagement
- PREP_GHG - Preparatory inventory
- CLIMATE_ACTION_PLAN - Climate strategy document
- RECS_OR_PPA_STRATEGY - Renewable energy strategy
- ENERGY_AUDIT_SCOPE12 - Energy audit

> **Note:** `BUILDING_CARBON_FOOTPRINT` is in the PRODUCT matrix, not CORPORATE.

---

## Division of Responsibilities

- **Field naming (source of truth)** → column headers in `datapoints-reports matrix.csv`
- **Field semantics and definitions** → `data points expansion plan.md`
- **Implementation status** → `implemented_in_database` row in this matrix
- **Field-to-report mapping** → `M`/`O` marks in report rows

## Workflow

### When adding new fields:

1. Research regulatory/standard requirements
2. Add field definition to `data points expansion plan.md`
3. Add column to `datapoints-reports matrix.csv` (this defines canonical name)
4. Mark `M`/`O` in relevant report type rows
5. Implement in database (update `implemented_in_database` row to ✓)

### When updating for new regulations:

1. Add new report type row
2. Add reference URL in `__reference_urls__` column
3. Research requirements thoroughly
4. Mark required fields with `M`, optional with `O`
5. Identify any missing fields → add as new columns
6. Mark `data_points_checked_against_reference_url` as ✓ when done

## Conditional Logic

Many fields are conditional based on:
- **Sector:** Aviation, Maritime, Financial Services, Manufacturing
- **Geography:** EU, UK, US, Asia
- **Company size:** Large undertakings, SMEs, Listed companies
- **Report type:** Regulatory vs. voluntary

UI and validation logic should use this matrix to determine which fields to show/require.

## Related Files

- `/prisma/schema.prisma` - Database schema definition
- `/prisma/seed-data/dataset-fields.ts` - Field seed data
- `/docs/API_REFERENCE.md` - API documentation
- `/docs/ARCHITECTURE.md` - System architecture

---

**Last Updated:** November 27, 2025  
**Next Review:** When CBAM definitive phase starts (Jan 2026) or major regulations update