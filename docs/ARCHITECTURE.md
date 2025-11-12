# Architecture Overview

_Last updated: 2025-11-12_

This document summarises the current product and technical architecture of the Carbon Report Platform. It replaces the long-form "Requirements v0.0.1" and "Report Templates Architecture" documents, which are preserved in `docs/archive/` for historical reference.

---

## Table of Contents

1. [How to Use This Document](#how-to-use-this-document)
2. [System Overview](#system-overview)
3. [Domain Model](#domain-model)
4. [Multi-Organization Model](#multi-organization-model)
   - [Entities & Fields](#entities--fields)
   - [Relationships](#relationships)
   - [Plans & Limits](#plans--limits)
   - [Roles & Permissions Matrix](#roles--permissions-matrix)
   - [Project Status Lifecycle](#project-status-lifecycle)
   - [Soft-Delete & Retention Policy](#soft-delete--retention-policy)
   - [Usage Tracking & Limit Enforcement](#usage-tracking--limit-enforcement)
   - [Assets & Uploads](#assets--uploads)
   - [Feature Flags](#feature-flags)
5. [Application Layers](#application-layers)
6. [Report Template Architecture](#report-template-architecture)
7. [Data Validation & Tooling](#data-validation--tooling)
8. [Open Questions & Risks](#open-questions--risks)

---

## How to Use This Document

- **New to the project?** Read the "System Overview" and "Domain Model" sections first.
- **Extending APIs or data flows?** Focus on "Application Layers" and "Report Template Architecture".
- **Implementing the multi-organization model?** Use the "Multi-Organization Model" section as the source of truth.
- **Changing dataset definitions or templates?** Review "Data Validation & Tooling" before editing code or seeds.
- **Need the original deep dive?** See `docs/archive/Requirements v0.0.1.md` and `docs/archive/REPORT_TEMPLATES_ARCHITECTURE.md`.

---

## System Overview

1. **Goal**: help teams plan, collect, and report carbon footprint data across multiple reporting standards.
2. **Primary Flow**:
   - Users belong to one or more organizations; each organization owns projects, contacts, and usage limits.
   - Create a project via the questionnaire or manual template selection.
   - Populate a shared dataset (JSONB) that powers all reports.
   - Request data from contacts directly from dataset/report tables.
   - Generate report views per standard (ISO 14067, CBAM, ...).
3. **Key Concepts**:
   - **Organizations**: multi-tenant boundary with plan, limits, and membership roles.
   - **Projects**: own the dataset, reports, mailto template, contacts, and requests for a single organization.
   - **Dataset**: JSON structure with `data_points` array; each entry references a `field_id` defined in the database.
   - **Report Templates**: configuration that maps sections and fields to dataset definitions.
   - **Data Requests**: workflow records that track external data collection.

---

## Domain Model

| Entity | Purpose | Notes |
| --- | --- | --- |
| `User` | Represents an individual account. | Auth still uses development stub (see `docs→DEVELOPMENT.md`). |
| `Organization` | Tenant boundary for projects, contacts, usage limits. | Soft-deletable, plan-aware, logo via assets. |
| `OrganizationMembership` | Junction table linking users to organizations with role metadata. | Enforces plan-based limits on editor/verifier seats. |
| `PlanDefinition` | Catalog of available tariffs. | Seeded (Free, Pro Beta); referenced by organizations. |
| `OrganizationUsageSnapshot` | Historical usage metrics per organization. | Populated via cron or on-demand calculations. |
| `Asset` | Metadata for uploaded logos/avatars. | Stored in object storage via signed URLs. |
| `Project` | Container for dataset, reports, mail templates, checklist. | Scoped to organization; uses optimistic locking via `datasetVersion`. |
| `Contact` | Organization-level address book entry. | Projects reference contacts via foreign keys. |
| `DataRequest` | Records outgoing data requests (contact, field, status). | Remains scoped to the owning project. |
| `ReportTemplate` | Per-standard metadata (sections, field mappings). | Stored in DB, seeded from TypeScript config. |
| `DatasetFieldDefinition` | Canonical list of data points. | Seeded from `prisma/seed-data/dataset-fields.ts`; referenced everywhere by `fieldId`. |

Additional supporting entities (ReportTemplateSection, ReportTemplateFieldMapping, mail templates) follow Prisma definitions in `prisma/schema.prisma`. `DataRequest` and mail template records remain children of `Project` and do not move to organization scope in this phase.

---

## Multi-Organization Model

The platform adopts a multi-organization model without an intermediate `Account` entity. Organizations own all business data; users can participate in multiple organizations with role-based access control. Plans define quotas and manual billing operations during beta.

### Entities & Fields

**Database tables introduced or extended in this initiative:**

| Table | Key Columns | Notes |
| --- | --- | --- |
| `plan_definitions` | `plan_code` (PK, text), `label`, `description`, `max_active_projects` (int), `max_editors` (int), `max_verifiers` (int), `max_viewers` (int or `NULL` = unlimited), `created_at` (timestamptz), `updated_at` | Seed with `free`, `pro_beta`. `max_viewers` is stored for flexibility, even when unlimited. |
| `organizations` | `id` (UUID, PK), `slug` (unique), `display_name` (text, required), `description` (text, nullable), `plan_code` (FK → `plan_definitions.plan_code`), `plan_assigned_at` (timestamptz), `plan_valid_until` (timestamptz, nullable), `logo_asset_id` (FK → `assets.id`, nullable), `logo_url` (text, nullable fallback), `created_by_user_id` (FK → `users.id`), `status` (enum: `active`, `deleted`, `pending_transfer`), `deleted_at` (timestamptz, nullable), `metadata` (JSONB) | Soft-delete tracked via `status` + `deleted_at`. `slug` used for internal routing/SEO. |
| `organization_memberships` | `id` (UUID, PK), `organization_id` (FK), `user_id` (FK), `role` (enum), `invite_status` (enum: `pending`, `accepted`, `declined`, `revoked`), `invited_by_user_id` (FK), `joined_at`, `last_active_at` | Unique index on (`organization_id`, `user_id`). Enforce seat limits before transitions to `accepted` or role change. |
| `organization_usage_snapshots` | `id` (UUID, PK), `organization_id` (FK), `computed_at`, `active_projects` (int), `active_editors` (int), `active_verifiers` (int), `active_viewers` (int) | Supports historical reporting, billing reconciliation, warning thresholds. |
| `assets` | `id` (UUID, PK), `type` (enum: `org_logo`, `user_avatar`), `url` (text), `file_name` (text), `mime_type` (text), `file_size_bytes` (int), `uploaded_by_user_id` (FK), `created_at` (timestamptz) | Abstracts file storage. Extend later with checksum/metadata. |

**Existing tables updated:**

- `projects`: add `organization_id` (FK → `organizations.id`), expand `status` enum (`active`, `archived`, `reported`, `deleted`), add `deleted_at`. Index combinations (`organization_id`, `status`) for fast limit checks.
- `contacts`, `data_requests`, `mailto_templates`, and other project children inherit `organization_id` via the project relationship; no direct FK change required unless query patterns demand it.
- `users`: ensure profile metadata (first/last name, job title, avatar relationship) align with `docs→DEVELOPMENT.md`.

### Relationships

- A `User` can belong to many `Organization`s through `OrganizationMembership` records. There is no limit on memberships in beta.
- An `Organization` has one active `PlanDefinition` referenced via `plan_code`. Plan changes are captured inline; future work may introduce `organization_plan_assignments` history for auditing.
- `Project`s, `Contact`s, `DataRequest`s, and related records belong to a single organization via `organization_id` on `projects`.
- `Asset`s reference either an organization logo or user avatar. Deleting an asset requires ensuring nothing references it (no automatic cleanup in beta).

### Plans & Limits

| Plan | Code | Max Active Projects | Max Editors (excl. owner) | Max Verifiers | Max Viewers | Validity |
| --- | --- | --- | --- | --- | --- | --- |
| Free | `free` | 1 | 0 | 0 | Unlimited (store as `NULL`) | No expiry. |
| Pro Beta | `pro_beta` | 3 | 2 | 0 | Unlimited | `plan_valid_until` required; set manually in DB. |

- `plan_assigned_at` timestamps the latest plan assignment. Update whenever `plan_code` is changed.
- `plan_valid_until` is nullable. Populate for expiring plans (e.g., Pro Beta) to surface countdowns and automated downgrades.
- Plan upgrades/downgrades are manual in beta. `POST /api/organizations/:id/plan/upgrade` returns `501` but captures the contract for future billing automation.

### Roles & Permissions Matrix

| Capability | OWNER | ADMIN | EDITOR | VIEWER_READONLY | VIEWER_VERIFIER | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Create/delete organization | ✅ | ❌ | ❌ | ❌ | ❌ | Creation happens implicitly for owners; deletion allowed only for owner. |
| Update organization profile (name, description, logo) | ✅ | ✅ | ❌ | ❌ | ❌ | Admin inherits full profile edit rights. |
| View organization settings | ✅ | ✅ | ✅ | ✅ | ✅ | Read access required for all members. |
| Manage plan metadata (view limits, request upgrade) | ✅ | ✅ | ❌ | ❌ | ❌ | Upgrade CTA available to owner/admin; still manual. |
| Invite members / change roles | ✅ | ✅ | ❌ | ❌ | ❌ | Invites enforce seat limits for Editors/Verifiers. |
| Remove members | ✅ | ✅ | ❌ | ❌ | ❌ | Owner cannot remove self; transfer flow deferred. |
| Create projects | ✅ | ✅ | ✅ | ❌ | ❌ | Guarded by active project limit. |
| Update project dataset | ✅ | ✅ | ✅ | ❌ | ❌ | Editors share dataset/report edit rights with admins. |
| Archive/report projects | ✅ | ✅ | ✅ | ❌ | ❌ | Editors can finalise projects. |
| Restore projects | ✅ | ✅ | ✅ | ❌ | ❌ | Restoration checks active project limit. |
| Read-only project access | ✅ | ✅ | ✅ | ✅ | ✅ | Verifier currently mirrors viewer read scope. |
| Future verifier approvals | 🔒 | 🔒 | 🔒 | 🔒 | 🔜 | Behind `verifierRoleEnabled` flag. |

### Project Status Lifecycle

- **active**: counts toward `max_active_projects`. Default for new projects. Full editing, data requests, and reporting enabled.
- **archived**: excluded from limits. Users can restore to `active` if the limit allows. Dataset becomes editable again after restore.
- **reported**: renamed from `submitted`. Represents finalised projects; dataset/report editing locked. Does not count toward limits. Restoration to `active` requires explicit confirmation and limit checks.
- **deleted**: soft-deleted. Record retained for 30 days (`deleted_at`). Hidden from default listings. Restoration allowed within retention window if limits permit.

Transitions enforce limit checks whenever a project becomes `active`. If limits are exceeded, the API returns `PLAN_LIMIT_EXCEEDED` with structured metadata so the UI can prompt the user (remove/archived other projects or request upgrade).

### Soft-Delete & Retention Policy

- **Organizations**: `status=deleted`, `deleted_at=now()`. Cascade soft-delete all descendant projects by setting their status to `deleted` and `deleted_at`. Retain data for 30 days; restoration requires manual intervention (owner/admin contacting support). Purge job (future) will permanently delete expired records.
- **Projects**: `status=deleted`, `deleted_at=now()`. Restoration allowed within 30 days if the active project limit permits. Cascades to dependent records follow existing behaviour; no hard delete.
- UI surfaces retention messaging and next steps in `docs→UX_GUIDE.md` flows.

### Usage Tracking & Limit Enforcement

- **Real-time checks**:
   - Project creation and status transitions call `assertWithinLimit(orgId, 'project')`.
   - Membership creation/role change for `EDITOR` or `VIEWER_VERIFIER` uses `assertWithinLimit(orgId, 'editor' | 'verifier')`.
- **Counters** per organization:
   - Active projects: count of `projects` where `status='active'`.
   - Editors: count of `organization_memberships` with `role='EDITOR'` and `invite_status='accepted'`.
   - Verifiers: analogous; currently capped at zero until feature flag flips.
   - Viewers: tracked but not limited; store `NULL` for unlimited.
- **Snapshots**: `organization_usage_snapshots` populated nightly or after major changes (creation, invite acceptance) to support trending and future billing.
- **Plan expiry**: daily job checks `plan_valid_until` and demotes expired Pro Beta organizations back to `free` while notifying owner/admin via UI banner (email automation tracked in `docs→BILLING_PLAYBOOK.md`).

### Assets & Uploads

- **Storage approach**: prefer external object storage (S3, Cloudflare R2). UI requests a signed upload URL via `POST /api/uploads/sign` specifying resource type (`org_logo`, `user_avatar`). Client uploads directly; backend persists the `assets` record.
- **Validation**: file size ≤ 512 KB, MIME type limited to PNG, JPEG, SVG. UI enforces square ratio guidance; backend checks MIME and size.
- **Fallback**: temporary `logo_url`/`avatar_url` fields permitted for MVP if storage is unavailable; mark as technical debt.
- **Security**: signed URLs expire quickly (≤60 seconds). Store only HTTPS URLs. Future CDN integration optional.

### Feature Flags

| Flag | Default | Purpose |
| --- | --- | --- |
| `verifierRoleEnabled` | `false` | Gates the ability for `VIEWER_VERIFIER` to perform approval actions. Keeps role in read-only mode during beta. |
| `billingUiEnabled` | `true` | Enables plan cards, limits UI, and manual upgrade modal. Does not process payments. |
| `approvalsEnabled` | `false` | Placeholder for future workflow once verifier tooling lands. |

Flags live in `src/lib/config.ts` with environment overrides. Document flips in `docs→DEVELOPMENT.md`.

---

## Application Layers

1. **Frontend (Next.js App Router)**
   - Pages under `src/app/` use server components for data fetching and hydration boundaries for React Query caches.
   - Shared layouts are in `src/components/layouts/`; UI primitives in `src/components/ui/`.
   - Feature flags (multi-org, billing UI, verifier role) live in `src/lib/config.ts`.

2. **API Layer**
   - REST-style handlers under `src/app/api/` follow Next.js "route handler" conventions.
   - Validation uses Zod schemas (`src/lib/dataset-validation.ts`, `src/lib/data-requests/types.ts`, forthcoming `src/lib/organizations/validation.ts`).
   - Limit enforcement helpers (`assertOrgMembership`, `assertWithinLimit`, `getPlan`) reside in `src/lib/server-utils.ts`.

3. **Database Layer**
   - Prisma schema kept in sync with migrations + seeds (`prisma/migrations`, `prisma/seed.ts`).
   - Optimistic locking for datasets via `datasetVersion` integer column.
   - Seed scripts populate dataset field definitions, report templates, demo contacts, plan definitions, and demo organizations.

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
   - Each report template provides subject/body defaults for data requests.
   - Project-level `mailtoTemplate` stored on `Project` record; defaults seeded from the first report template. No organization-level override in this phase.

---

## Data Validation & Tooling

| Task | Command | Notes |
| --- | --- | --- |
| Sync schema | `npm run db:migrate` | Applies Prisma migrations (multi-org tables + enums). |
| Seed data | `npm run db:seed` | Populates dataset fields, templates, demo contacts, plans, demo organizations, memberships. |
| Reset demo data | `npm run db:seed:reset` | Clears seeded orgs and replays defaults (see `docs→DEVELOPMENT.md`). |
| Validate templates | `npm run templates:check` | Ensures every template `fieldId` matches DB definitions. |
| Collect server metrics | `npm run metrics:collect -- <url>` | Captures HAR snapshots and `x-server-timing` instrumentation. |

Additional automation lives in `scripts/`. Update commands if new scripts are added during multi-org rollout.


---

## Open Questions & Risks

- **Ownership transfer**: owner handoff UX/API is deferred. Document interim manual process in `docs→DEVELOPMENT.md` once decided.
- **Verifier workflow**: approval tooling and notifications remain future scope. Keep `verifierRoleEnabled=false` until requirements mature.
- **Storage provider**: finalise S3 vs R2 vs Supabase Storage. Decision impacts infrastructure work and CDN strategy.
- **Project status terminology**: `reported` selected for external delivery semantics; revisit if regulatory standards prefer `finalized`.
- **Plan history**: current schema lacks `organization_plan_assignments` history. Future billing may require append-only table to audit plan changes.
- **Retention purge**: no automated job deletes expired soft-deleted records. Track follow-up in `docs→planning→BACKLOG.md`.

Refer to `docs→BILLING_PLAYBOOK.md` for future billing integration strategy and `docs→UX_GUIDE.md` for user-facing flows.

