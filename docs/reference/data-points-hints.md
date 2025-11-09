# Data Point Hints

_Last updated: 2025-11-08_

This reference summarises guidance for commonly used dataset fields. The hints originate from the legacy JSON file (`docs/archive/REFERENCE_data_points_hints.json`). Field identifiers are listed in their historical CamelCase form; map them to current snake_case `DatasetFieldDefinition.fieldId` values before use.

---

## Report Metadata

- **ReportID** — Unique identifier (e.g., `CFP-2025-001`). Compose `YEAR + sequential number`. Coordinate with quality / documentation owner.
- **ReportDate** — Publication date. Confirm with management when the report should be issued.
- **ReportingPeriodStart** — Start date of the data collection window (e.g., `2024-01-01`). Align with primary data period; confirm with production / facilities.
- **ReportingPeriodEnd** — End date of the reporting window (e.g., `2024-12-31`). Align with fiscal calendar or data availability; confirm with finance / management.
- **OrganizationName** — Legal registered entity name. Source via legal or company registry documents.
- **OrganizationAddress** — Registered address. Obtain from legal or HR records.

## Product Definition

- **ProductName** — Commercial name recognised by customers. Ask marketing / product managers.
- **DeclaredUnit** — Reporting unit (e.g., `1 piece`, `1 kg`). Confirm with product / technical teams.
- **ProductDescription** — Brief summary of the product and key features. Align with marketing copy.

## Study Goals & Scope

- **StudyGoal** — Purpose of the study (e.g., customer request, eco-label eligibility). Decide with management / sustainability leads.
- **IntendedAudience** — Target readers (customers, regulators, internal stakeholders). Agree with management.
- **SystemBoundaryType** — Lifecycle boundary (`CradleToGrave`, `CradleToGate`). Confirm feasibility with management.
- **Applications** — Multi-select context (e.g., FootprintCommunication, DesignImprovement).
- **CFPType** — Study type (`FullCFP`, `CommunicationCFP`). Decide based on reporting obligations.
- **ImpactCategory** — Default `Climate change (GWP)` for carbon footprint studies. Confirm with quality / technical teams.
- **LifeCycleStagesIncluded** — Phases covered (RawMaterial, Production, Distribution, Use, EndOfLife). Ensure supporting data availability.
- **AllocationApproach** — Allocation method across co-products (default `Mass`). Align with production on co-product mixes.
- **CutOffCriteria** — Exclusion rules (e.g., `<1% mass & energy`). Confirm with management.
- **KeyAssumptions** — Major assumptions (product lifetime, usage, recycling rates). Source from product management, marketing, industry data.
- **ElectricityMixSelectionMethod** — Methodology for electricity data (e.g., location-based grid mix). Confirm facility region with operations.

## Data Quality & Collection

- **DataCollectionApproach** — Summary of how inputs were collected. Coordinate with production, procurement, facilities.
- **DataQualityRequirements** — Target data quality level. Align with quality and management teams.

## Impact Assessment Configuration

- **ImpactAssessmentMethod** — Method for GWP (recommended: `IPCC AR6 GWP 100`). Older methods for comparability. Confirm with technical experts.
- **GHGsIncluded** — List greenhouse gases considered. Minimum ISO requirement: `CO2; CH4; N2O`; full Kyoto set adds `HFCs; PFCs; SF6; NF3`.
- **GWPTimeHorizonYears** — Characterisation timeframe (default `100`). Document if using 20- or 500-year horizons.

## Results & Hotspots

- **TotalCFP_CO2e** — Total carbon footprint (kg CO2e). Sum lifecycle stage results using calculation engine.
- **UncertaintyRange_CO2e** — Range (e.g., `1.70–2.05`). Derive from uncertainty analysis (Monte Carlo / sensitivity).
- **StageResults_RawMaterial_CO2e** — Emissions from raw materials. Combine material weights (production) with emission factors (procurement / databases).
- **StageResults_Production_CO2e** — Manufacturing emissions. Use energy usage (facilities) + emission factors (utility / databases).
- **StageResults_Distribution_CO2e** — Distribution impact. Gather distances (logistics) + vehicle types (transport coordinator).
- **StageResults_Use_CO2e** — Use-phase impact. Combine usage patterns (marketing / customer support) with product energy data.
- **StageResults_EndOfLife_CO2e** — Disposal/recycling impact. Use waste percentages and government factors; confirm with facilities.
- **DirectEmissionsCO2Fossil** — Direct fossil CO2 (kg). Source from production fuel data.
- **BiogenicCO2Emissions_CO2e** — Biogenic CO2 emissions. Requires biomass composition data.
- **BiogenicCO2Uptake_CO2e** — Biogenic CO2 uptake (negative values). Calculate with sustainability / agronomy inputs.
- **HotspotsSummary** — Narrative of major emission drivers; highlight top contributors.

## Interpretation & Communication

- **Limitations** — Document data gaps, constraints, estimates. Gather from each department.
- **Conclusions** — Key findings; involve finance (cost implications) and production (improvements).
- **Recommendations** — Improvement ideas targeting highest impact stages. Coordinate across production, procurement, management.
- **IntendedCommunicationMode** — Planned disclosure channel (Public, B2B, Internal). Align with marketing / management.
- **ComparativeAssertionPublic** — Whether public comparisons are planned (true/false). Confirm with marketing/legal.
- **ComparativeAssertionRulesFollowed** — Standards governing comparative assertions (e.g., ISO 14044, PCR).

---

> ⚠️ **Reminder**: Map these legacy identifiers to the canonical snake_case IDs in `DatasetFieldDefinition` before wiring them into templates or UI components.
