# Report Templates Architecture

Last Updated: 2025-10-18

This document explains how report templates are modeled, stored, and used across code and database. It also lists do/don't rules to avoid drift and breakages.

---

## Overview

We support multiple report standards (e.g., ISO14067, CBAM). A report is a view over `Project.dataset` (JSONB) filtered by the template's required fields. Template metadata lives in the database for runtime flexibility, and we also keep code-based defaults for local development and seed data.

Key models (Prisma):
- ReportTemplate(code, name, version, description, layoutMeta)
- ReportTemplateSection(templateId, key, title, description, blockType, config, sortOrder)
- ReportTemplateFieldMapping(sectionId, datasetFieldDefinitionId, displayLabel, isRequired, displayOrder, config)

Dataset fields are stored in `DatasetFieldDefinition` and referenced by `fieldId` (snake_case string like `product_name`).

---

## Data flow

1) Author or seed templates (TypeScript seed): `prisma/seed-data/report-templates.ts`
2) Seed script writes templates to DB: `prisma/seed.ts` → ReportTemplate → Sections → FieldMappings
3) APIs load template by `templateCode` to filter `Project.dataset`
4) Frontend renders sections using `blockType` (aka `blockComponent` in code types) and maps fields by `fieldId`

---

## Source of truth

- Dataset field definitions: DB (`DatasetFieldDefinition`), seeded by `prisma/seed-data/dataset-fields.ts`
- Report templates (runtime): DB (`ReportTemplate*` tables)
- Code templates (`src/lib/report-templates/*.ts`): dev defaults used for generating mailto defaults and for offline validation; not the runtime source of truth.

Always validate alignment via:

```
npm run templates:check
```

This checks:
- Seed templates reference existing dataset `fieldId`s
- Code templates reference existing dataset `fieldId`s
- DB templates reference existing dataset `fieldId`s

---

## Type contracts

Shared types in `src/lib/report-templates/types.ts`:
- ReportTemplate: { code, name, version?, description?, layoutMeta?, sections, mailto? }
- ReportTemplateSection: { key, title, description?, blockComponent, config?, fields }
- ReportTemplateFieldMapping: { fieldId, displayLabel?, isRequired?, displayOrder?, config? }

Important: field mapping uses `fieldId` (string), never DB UUIDs.

---

## Naming and IDs

- `fieldId`: snake_case string, stable, human-typed, used across dataset and templates
- DB primary keys are UUIDs; not exposed in template code and not compared in validators
- Section `key` must be unique per template (DB unique on [templateId, key])

---

## Block components

- `blockType` in DB corresponds to `blockComponent` in code; it’s a render hint (e.g., `ghg-summary`, `repeatable-table`)
- `config` can hold rendering hints such as `repeatableKey`

### Repeatable blocks (dataset UI contract)
- Любой блок с `repeatableKey` рендерится как одна строка в основной таблице, а фактические поля раскрываются внутри nested-table.
- Nested-table содержит колонки `Field`, `Value`, `Responsible`, `Status / Deadline`, `Actions`; порядок полей задаётся `sortOrder` в `dataset_field_definitions`.
- `Actions` покрывает добавление и удаление `item_id`, а также запуск Request Data по отдельным полям.
- Появление новых полей в группе не требует кода: UI читает `dataset_field_definitions` и автоматически расширяет nested-table.

---

## Mailto defaults

- Project stores a single template `Project.mailtoTemplate` (JSONB with `subject`/`body`).
- On project creation or when resetting the template we seed it from the first selected report template that defines `mailto` defaults.
- Body supports placeholders: `{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}`.
- Bulk requests rely on `{{field_list}}`, rendering a bullet list of selected fields.

---

## Do / Don't

Do:
- Use `fieldId` everywhere in code for matching dataset data_points and template fields
- Re-run `npm run templates:check` after changing dataset fields or templates
- Add new sections using unique `key` and explicit `sortOrder` increments (e.g., 100, 200)
- Keep code templates readable and minimal; the DB is the runtime source of truth

Don't:
- Compare or store DB UUIDs in code templates
- Mix legacy `id` on fields (old shape) with the new `fieldId`
- Edit DB schema without updating the seed and the checker

---

## Troubleshooting

- Checker fails with missing fields: ensure the `fieldId` exists in `DATASET_FIELD_SEED` and was seeded to DB
- Prisma types missing new models: run `npx prisma generate`

---

## References

- `prisma/schema.prisma`
- `prisma/seed-data/dataset-fields.ts`
- `prisma/seed-data/report-templates.ts`
- `prisma/seed.ts`
- `src/lib/report-templates/types.ts`
- `src/lib/report-templates/*`
- `scripts/check-templates.ts`