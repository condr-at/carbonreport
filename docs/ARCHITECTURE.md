# Architecture Overview

_Last updated: 2025-11-08_

This document summarises the current product and technical architecture of the Carbon Report Platform. It replaces the long-form "Requirements v0.0.1" and "Report Templates Architecture" documents, which are preserved in `docs/archive/` for historical reference.

---

## How to Use This Document

- **New to the project?** Read the "System Overview" and "Domain Model" sections first.
- **Extending APIs or data flows?** Focus on "Application Layers" and "Report Template Architecture".
- **Changing dataset definitions or templates?** Review "Data Validation & Tooling" before editing code or seeds.
- **Need the original deep dive?** See `docs/archive/Requirements v0.0.1.md` and `docs/archive/REPORT_TEMPLATES_ARCHITECTURE.md`.

---

## System Overview

1. **Goal**: help teams plan, collect, and report carbon footprint data across multiple reporting standards.
2. **User Flow**:
   - Create a project via the questionnaire or manual template selection.
   - Populate a shared dataset (JSONB) that powers all reports.
   - Request data from contacts directly from dataset/report tables.
   - Generate report views per standard (ISO 14067, CBAM, ...).
3. **Key Concepts**:
   - **Projects**: own the dataset, reports, mailto template, contacts, and requests.
   - **Dataset**: JSON structure with `data_points` array; each entry references a `field_id` defined in the database.
   - **Report Templates**: configuration that maps sections and fields to dataset definitions.
   - **Data Requests**: workflow records that track external data collection.

---

## Domain Model

| Entity | Purpose | Notes |
| --- | --- | --- |
| `User` | Owns projects, contacts, requests. | Auth still uses development stub (see `DEVELOPMENT.md`). |
| `Project` | Container for dataset, reports, mailto template, checklist. | Uses optimistic locking via `datasetVersion`. |
| `DatasetFieldDefinition` | Canonical list of data points. | Seeded from `prisma/seed-data/dataset-fields.ts`; referenced everywhere by `fieldId`. |
| `ReportTemplate` | Per-standard metadata (sections, field mappings). | Stored in DB, seeded from TypeScript config. |
| `DataRequest` | Records outgoing data requests (contact, field, status). | Used by dataset & data-requests pages to show "Responsible" summary. |

Additional supporting entities (Contacts, ReportTemplateSection, ReportTemplateFieldMapping) follow Prisma definitions in `prisma/schema.prisma`.

---

## Application Layers

1. **Frontend (Next.js App Router)**
      - Pages under `src/app/` use server components for data fetching and hydration boundaries for React Query caches.
      - Shared layouts are in `src/components/layouts/`; UI primitives in `src/components/ui/`.
   - Feature flags (e.g., lazy data requests) live in `src/lib/config.ts`.

2. **API Layer**
   - REST-style handlers under `src/app/api/` follow "route handler" conventions.
   - Validation uses Zod schemas (`src/lib/dataset-validation.ts`, `src/lib/data-requests/types.ts`).
   - Caching/instrumentation helpers sit in `src/lib/server-data/` and `src/lib/cache.ts`.

3. **Database Layer**
   - Prisma schema kept in sync with migrations + seeds (`prisma/migrations`, `prisma/seed.ts`).
   - Optimistic locking for datasets via `datasetVersion` integer column.
   - Seed scripts populate dataset field definitions, report templates, contacts demo data.

---

## Report Template Architecture

1. **Source of Truth**
   - Runtime templates live in Postgres tables (`report_templates`, `report_template_sections`, `report_template_field_mappings`).
   - TypeScript seed files (`prisma/seed-data/report-templates.ts`) and runtime helpers (`src/lib/report-templates/`) generate defaults and mailto content.

2. **Section Structure**
   - Each section defines `key`, `title`, `blockComponent`, optional config (e.g., `repeatableKey`).
   - Fields within sections reference `DatasetFieldDefinition` via `fieldId` (snake_case).

3. **Rendering Path**
   - API fetches template metadata, filters `Project.dataset` to required fields, then returns data to the client.
   - Frontend components map `blockComponent` to React components for form/table rendering.

4. **Mailto Templates**
   - Each report template can provide subject/body defaults for data requests.
   - Project-level `mailtoTemplate` stored on `Project` record; defaults seeded from first report template.

---

## Data Validation & Tooling

| Task | Command | Notes |
| --- | --- | --- |
| Sync schema | `npm run db:push` | Uses `DIRECT_URL` for direct connection. |
| Seed data | `npm run db:seed` | Populates dataset fields, templates, demo contacts. |
| Validate templates | `npm run templates:check` | Ensures every template fieldId matches DB definitions (seed + code + DB). |
| Collect server metrics | `npm run metrics:collect -- <url>` | Captures HAR snapshots and `x-server-timing` instrumentation. |

Additional automation lives in `scripts/`.

---

## Additional References

- Full historical specification: `docs/archive/Requirements v0.0.1.md`
- Legacy template architecture deep dive: `docs/archive/REPORT_TEMPLATES_ARCHITECTURE.md`
- Dataset field hints (legacy CamelCase IDs): `docs/archive/REFERENCE_data_points_hints.json`
- Project backlog & roadmap: see `docs/planning/`
