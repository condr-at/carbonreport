### datapoints-reports matrix.csv

**Last Updated:** November 26, 2025  
**Status:** ✅ Complete Coverage Achieved (100%)

This file is the **source of truth** for how each data point (`fieldId`) is
used across report types and products.

## 📊 Current State

- **Total Data Points:** 261 (was 213, +48 added Nov 2025)
- **Report Types:** 47 rows (42 regulatory/standard reports + 5 utility rows)
- **Coverage:** ✅ 100% verified for all regulatory frameworks
- **Last Audit:** November 26, 2025

## 📁 Related Documentation Files

**START HERE:**
- `COVERAGE_COMPLETE_SUMMARY.md` - Executive summary of Nov 2025 audit
- `DATA_POINTS_COVERAGE_ANALYSIS.md` - Detailed analysis and findings
- `NEW_DATA_POINTS_REFERENCE.md` - Complete reference for 48 new fields
- `IMPLEMENTATION_CHECKLIST.md` - Developer implementation guide
- `VISUAL_SUMMARY.txt` - Visual charts and stats

## File Structure

One **column** = one `fieldId` / data point

**Column semantics**:

1. `data_point`: Report type identifier (e.g., CSRD, EU_ETS, CBAM)
2. `__reference_urls__`: Official regulation/standard URL
3. `regulatory_requirements_checked`: ✓ if verified against actual requirements
4-261. Individual data point columns: `x` = required for this report type

**Row types**:

1. **Header row**: Data point names (fieldIds)
2. **Report rows**: Each regulatory framework/standard with `x` marks for required fields
3. **Utility rows**: `hint_for_UI`, `hint_for_email_request`, `implemented_in_dataset`

**Updated marking scheme (Nov 2025)**:
- `x` — field is required/relevant for this report type
- ✓ — (in column 3) report has been verified against regulatory requirements
- Empty — field not applicable to this report

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

## Major Updates (November 2025)

### Added 48 New Data Points:
- **CSRD essentials** (6): Double materiality, ESRS requirements, value chain mapping
- **Product LCA** (6): Functional unit, system boundaries, allocation methods
- **Sector-specific** (8): Aviation (CORSIA), Maritime (EU MRV)
- **Financial** (5): SFDR, TCFD extensions
- **Compliance** (23): EU ETS, CBAM, UK SECR, SEC Climate extensions

### Verification Status:
All 42 regulatory/standard report types now have ✓ in `regulatory_requirements_checked` column, confirming they've been audited against actual regulatory requirements.

## Division of Responsibilities

- **Field semantics and definitions** → `data points expansion plan.md` (source of truth)
- **Implementation status** → `implemented_in_dataset` row in this matrix
- **Field-to-report mapping** → This matrix (`x` marks)
- **Regulatory verification** → ✓ marks in column 3
- **Field specifications** → `NEW_DATA_POINTS_REFERENCE.md` (for new fields)

## Workflow

### When adding new fields:

1. Research regulatory/standard requirements
2. Add field definition to `data points expansion plan.md`
3. Add column to `datapoints-reports matrix.csv`
4. Mark `x` in relevant report type rows
5. Document in `NEW_DATA_POINTS_REFERENCE.md` if major addition
6. Implement in database (update `implemented_in_dataset` row)
7. Mark report as checked (✓) after verification

### When updating for new regulations:

1. Add new report type row
2. Add reference URL
3. Research requirements thoroughly
4. Mark required fields with `x`
5. Identify any missing fields → add as new columns
6. Mark as ✓ when verification complete
7. Update documentation

## Implementation Priority

Not all 261 fields need immediate implementation. See `IMPLEMENTATION_CHECKLIST.md`:

- 🔴 **Wave 1** (15 critical fields): 2 weeks
- 🟡 **Wave 2** (18 high priority): 4 weeks
- 🟢 **Wave 3** (15 medium priority): 8 weeks
- ⚪ **Existing** (213 fields): Already in system

## Conditional Logic

Many fields are conditional based on:
- **Sector:** Aviation, Maritime, Financial Services, Manufacturing
- **Geography:** EU, UK, US, Asia
- **Company size:** Large undertakings, SMEs, Listed companies
- **Report type:** Regulatory vs. voluntary

UI and validation logic should use this matrix to determine which fields to show/require.

## 🚀 Next Steps (Post-Audit)

1. [ ] Team review of 48 new fields
2. [ ] Confirm implementation priorities
3. [ ] Update Prisma schema for Wave 1
4. [ ] Create database migrations
5. [ ] Implement UI forms
6. [ ] Add validation rules
7. [ ] Update API endpoints
8. [ ] Test report generation

## Related Files

- `/prisma/schema.prisma` - Database schema definition
- `/prisma/seed-data/dataset-fields.ts` - Field seed data
- `/docs/API_REFERENCE.md` - API documentation
- `/docs/ARCHITECTURE.md` - System architecture

---

**Audit Date:** November 26, 2025  
**Coverage Status:** ✅ 100% Complete  
**Next Review:** Annual or when major regulations update