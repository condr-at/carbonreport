### datapoints-reports matrix.csv

**Last Updated:** November 26, 2025  
**Status:** 🚧 Structure Complete, Mapping In Progress

This file is the **source of truth** for:
1. The canonical list of all data point `fieldId`s (column names = source of truth for naming)
2. Which fields are used by which report types

## 📊 Current State

- **Total Data Points:** 265 columns (excluding 3 service columns)
- **Service Columns:** `report_type`, `__reference_urls__`, `data_points_checked_against_reference_url`
- **Report Types:** 47 rows (42 regulatory/standard reports + 5 utility rows)
- **Mapping Status:** ⏳ Not yet filled — matrix structure is ready, field mappings pending

## 📁 Related Documentation

- `data points expansion plan.md` — semantic definitions and grouping of fields (blocks 1–13)

## File Structure

**Delimiter:** `;` (semicolon)

One **column** = one `fieldId` / data point

**Column layout**:

1. `report_type` — Report type identifier (e.g., CSRD, EU_ETS, CBAM)
2. `__reference_urls__` — Official regulation/standard URL (service column, not a data point)
3. `data_points_checked_against_reference_url` — ✓/❌ verification status (service column)
4–263. Individual data point columns

**Row types**:

1. **Header row**: Data point names (fieldIds) — **source of truth for field naming**
2. **Report rows**: Each regulatory framework/standard with M/O marks for required/optional fields
3. **Utility rows**: `hint_for_UI`, `hint_for_email_request`, `implemented_in_database`

**Cell value scheme for data point columns (col 4+)**:
- `M` — Mandatory: field is required for this report type
- `O` — Optional: field is relevant but not required
- _(empty cell, i.e. `;;`)_ — field not applicable to this report type

**Important:** Only three states are allowed: `M`, `O`, or empty (no spaces, no other markers).

## Report Types Covered

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

### Client/Internal Use (9)
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
- BUILDING_CARBON_FOOTPRINT - Building-specific footprint

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

**Last Updated:** November 26, 2025  
**Next Review:** Annual or when major regulations update