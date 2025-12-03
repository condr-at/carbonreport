# Agent Prompt: Database Fields Upgrade

## Task

Upgrade `DatasetFieldDefinition` schema and seed data to match the data points matrices.

## Strict Requirements

1. **Source of truth for field names:** 
   - `docs/data points guide/datapoints-reports-CORPORATE-2026.csv`
   - `docs/data points guide/datapoints-reports-PRODUCT-2026.csv`

2. **Source of truth for implementation details:**
   - `docs/data points guide/DATABASE_GAP_ANALYSIS.md`

3. **Files to modify:**
   - `prisma/schema.prisma` — update `DatasetFieldDefinition` model, update `Project` model
   - `prisma/seed-data/dataset-fields.ts` — update type and all field definitions

## Steps

### Step 1: Schema Update

Update `DatasetFieldDefinition` model in `prisma/schema.prisma` — add these columns:
- `dataType String @default("text") @map("data_type")` — values: text, textarea, number, currency, percentage, date, year, select, multiselect, country, json
- `unit String?` — e.g., "tCO2e", "EUR", "MWh", "m²", "%"
- `scope String @default("both")` — values: product, corporate, both
- `isRequired Boolean @default(false) @map("is_required")`
- Add index: `@@index([scope])`

Update `Project` model — add:
- `projectType String @default("product") @map("project_type")` — values: product, corporate

See exact schema in DATABASE_GAP_ANALYSIS.md § "Schema Update Required"

Run: `npx prisma migrate dev --name add_datatype_unit_scope_to_fields`

### Step 2: Update TypeScript Type

In `dataset-fields.ts`, update `DatasetFieldSeed` type:
```typescript
dataType: 'text' | 'textarea' | 'number' | 'currency' | 'percentage' | 'date' | 'year' | 'select' | 'multiselect' | 'country' | 'json'
unit?: string | null
scope: 'product' | 'corporate' | 'both'
isRequired?: boolean
```

### Step 3: Rename Existing Fields

Rename these fields (keep old names in `legacyFieldIds`):
- `functional_unit` → `product_functional_unit_definition`
- `system_boundary` → `product_life_cycle_stages_included`
- `total_cfp_co2e` → `product_total_pcf_co2e`
- `intended_market` → `product_geographic_validity`
- `transport_mode` → `product_transport_mode`
- `transport_distance` → `product_transport_distance_km`

### Step 4: Add Properties to All Existing Fields

For all 28 existing fields, add:
- `dataType` — use `number` for amounts, `date` for dates, `percentage` for percents, `text` for rest
- `unit` — add where applicable (e.g., `tCO2e`, `km`, `%`)
- `scope` — `product` for product/material/energy/transport/waste fields, `both` for organization/report fields
- `isRequired` — `true` for `reporting_period_start`, `reporting_period_end`

### Step 5: Add New Fields (Phase 1 only)

Add fields from DATABASE_GAP_ANALYSIS.md § "Phase 1: Core Corporate GHG Inventory":
- § 1.1 Organizational Profile (12 fields)
- § 1.2 Scope 1 Emissions (12 fields)
- § 1.3 Scope 2 Emissions (5 fields)
- § 1.4 Scope 3 Emissions (18 fields)
- § 1.5 Totals & Base Year (7 fields)

For each field include: `fieldId`, `label`, `hint`, `dataType`, `unit`, `scope`, `sortOrder`, `isRequired` (if applicable).

### Step 6: Seed Database

Run: `npx prisma db seed`

## Constraints

- Do NOT invent field names — use only names from CSV matrices
- Do NOT skip required properties (`dataType`, `scope`) on any field
- Do NOT change `sortOrder` values from the document
- Do NOT add fields from Phase 2+ (CBAM, Building, etc.) — only Phase 1
- Preserve all `legacyFieldIds` for backward compatibility
- Use correct `unit` for all numeric fields

## Unit Reference

| dataType | unit examples |
|----------|---------------|
| number (emissions) | `tCO2e`, `kgCO2e` |
| number (energy) | `MWh`, `kWh`, `GJ` |
| number (area) | `m²` |
| number (distance) | `km` |
| number (mass) | `t`, `kg` |
| currency | `EUR`, `USD` |
| percentage | `%` |
| year | — (no unit) |
| date | — (no unit) |

## Validation

After completion:
1. `npx prisma validate` — must pass
2. `npx prisma db seed` — must succeed
3. Count fields in DB should be ~80 (28 existing + ~54 new from Phase 1)
4. All fields must have `dataType` and `scope` set
