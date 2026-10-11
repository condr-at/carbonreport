# Development Guide

_Last updated: 2025-11-16_

This guide consolidates day-to-day engineering practices, active technical debt, and validation tooling. It replaces the previous `TECHNICAL_DEBT.md` and `IMPLEMENTATION_CHECKLIST.md` as the primary reference for contributors. Historical detail remains in `docs/archive/`.

---

## Quick Start

1. Install dependencies: `npm install`
2. Choose env profile:
   - local dev/runtime: copy `.env.local.example` -> `.env.local`
   - local integration DB: copy `.env.test.local.example` -> `.env.test.local`
   - remote/Supabase profile: keep in `.env` or your secrets manager
3. Keep Prisma schema in sync:
   ```bash
   npm run db:push:local
   ```
   Run `npm run db:seed:local` only when deliberately initializing disposable demo data: the full seed deletes existing records. To enable the CBAM supplier package on an existing database, use the [additive field sync](#cbam-supplier-package-field-definitions) below instead.
4. Start development server: `npm run dev`

Refer to `docs/README.md` for onboarding context and project overview.

---

## Build & Validation Commands

| Purpose | Command | Notes |
| --- | --- | --- |
| Linting | `npm run lint` | ESLint flat config (`eslint.config.mjs`). |
| Type safety | `tsc --noEmit` | Not bundled in scripts; run manually when editing core libs. |
| Local schema sync | `npm run db:push:local` | Uses `.env.local` via `scripts/with-env.ts`. |
| Local seed | `npm run db:seed:local` | Destructive demo seed; not an incremental feature upgrade. |
| CBAM package field definitions | `npm run db:sync-cbam-fields:local` | Additive sync through `.env.local`; preserves existing definitions and project data. |
| Unit/sanity suite | `npm test` / `npm run test:unit` | Includes supplier-package validation, export and route checks. |
| Local integration suite | `npm run test:integration:local` | Uses dedicated `.env.test.local` database. |
| Template alignment | `npm run templates:check` | Validates field IDs across seed, code, and DB records. |
| Full demo seed | `npm run db:seed` | Deletes existing records and rebuilds demo data using the configured environment. |
| Server metrics | `npm run metrics:collect -- <url>` | Captures `x-server-timing` and HAR snapshots. |

## CBAM Supplier Package Field Definitions

The `CBAM_DATA_PACKAGE` profile uses 34 fields: **28 new `cbam_pkg_*` definitions** plus six existing shared definitions (`cbam_operator_name`, `cbam_operator_contact`, `cbam_installation_id`, `cbam_installation_country`, `product_name`, `product_description`). On an existing local database, add only the new definitions:

```bash
npm run db:sync-cbam-fields:local
```

The command loads `.env.local` through `scripts/with-env.ts` and runs `scripts/sync-cbam-package-fields.ts`. It performs one transaction of upserts from `prisma/seed-data/cbam-package-fields.ts`. Missing definitions are created as product-scoped, non-repeatable and not globally required; existing definitions use an empty update and retain their deployed/customized metadata. Re-running the command is safe. It does not change project datasets, reports, users or the six shared definitions, and it does not synchronize report-template records or schema migrations.

**Do not run `db:seed`, `db:seed:local` or a reset command to enable this feature.** `prisma/seed.ts` deletes existing application and catalog records before rebuilding demo data. The additive command is sufficient for the new field definitions. `npm run db:sync-cbam-fields` is the same sync without the `.env.local` wrapper; use it only with the intended environment already configured. Integration databases have their own `.env.test.local` profile.

### Supplier package behavior and validation

The endpoint is `/api/projects/:id/reports/:reportId/supplier-package`; [API Reference](API_REFERENCE.md#cbam-supplier-review-package) specifies the complete GET/PATCH/ZIP contract and error codes. Read/download requires accepted viewer-or-higher membership; save requires editor-or-higher. Draft saves preserve inactive/invalid strings and require the current dataset version. ZIP download requires a matching version and a package without validation errors. Readiness is for recipient review, not regulatory validity or verification.

Keep `PACKAGE_FIELDS`, `isPackageFieldActive`, validation, UI and export aligned. The JSON API retains conditional drafts; the ZIP exports only active fields, normalizes nested evidence/default records to allowed properties and omits unrelated draft content. Do not reintroduce raw structured JSON into an export after filtering only its top-level field ID. Evidence consists of references, not bundled documents. The profile contract is in [CBAM_SUPPLIER_PACKAGE_CONTRACT.md](regulatory-requirements/CBAM_SUPPLIER_PACKAGE_CONTRACT.md).

Relevant checks, without changing a database:

```bash
npx tsc --noEmit
npm run lint -- src/lib/cbam 'src/app/api/projects/[id]/reports/[reportId]/supplier-package'
node --import tsx --test --test-concurrency=1 src/lib/cbam/supplier-package.test.ts src/lib/cbam/supplier-package-export.test.ts 'src/app/api/projects/[id]/reports/[reportId]/supplier-package/route.test.ts'
```

`npm test` and `npm run test:unit` also include these checks. Run `npm run test:integration:local` only against the dedicated test database from `.env.test.local`; the integration harness clears test data. Test results and execution counts belong in the active verification record, not this setup guide.

---

## Multi‑Org: Migrations & Seed (Playbook)

This section documents the schema changes, indices, and seeding steps for the multi‑organization model per `docs→ARCHITECTURE.md`.

### Schema (DDL outline)

New tables:
- `plan_definitions(plan_code PK, label, description, max_active_projects, max_editors, max_verifiers, max_viewers, created_at, updated_at)`
- `organizations(id UUID PK, slug UNIQUE, display_name, description NULL, plan_code FK, plan_assigned_at, plan_valid_until NULL, logo_asset_id FK NULL, logo_url NULL, created_by_user_id FK, status enum, deleted_at NULL, metadata JSONB)`
- `organization_memberships(id UUID PK, organization_id FK, user_id FK, role enum, invite_status enum, invited_by_user_id FK NULL, joined_at, last_active_at)`
- `organization_usage_snapshots(id UUID PK, organization_id FK, computed_at, active_projects, active_editors, active_verifiers, active_viewers)`
- `assets(id UUID PK, type enum, url, file_name, mime_type, file_size_bytes, uploaded_by_user_id FK, created_at)`

`assets.type` currently includes `ORG_LOGO` and `USER_AVATAR`; keep Prisma enum + `AssetType` switch statements in sync when adding more resource types.

Altered tables:
- `projects`: add `organization_id` FK, add `status` enum (`active|archived|reported|deleted`), add `deleted_at`.
- `users`: add nullable `first_name`, `last_name`, `job_title`, `timezone`, `avatar_asset_id` FK (→ `assets`), plus `avatar_url` for legacy uploads.

Indices (critical):
- `organizations.slug` UNIQUE
- `organization_memberships (organization_id, user_id)` UNIQUE
- `organization_memberships (organization_id, role, invite_status)`
- `projects (organization_id, status)`
- `projects (status, deleted_at)`
- `organization_usage_snapshots (organization_id, computed_at DESC)`

### Prisma migration steps

Local dev:
```bash
npm run db:push:local
npm run db:seed:local
```

Deploy/staging:
```bash
npx prisma migrate deploy
node prisma/seed.js  # or npm run db:seed depending on script
```

If a migration fails, use the checklist in the "Database Migration Playbook" below (resolve/rollback/retry) rather than editing applied SQL.

### Seed data (demo user + two orgs)

Seed requirements:
- Plans: `free`, `pro_beta` with limits from docs.
- Demo user with predictable email (e.g., `demo@carbonreport.local`).
- Demo user must now include `firstName`, `lastName`, `jobTitle`, and `timezone` to exercise the settings UI. Store the avatar asset ID when available so PATCH validation has real data.
- Two organizations: one `free`, one `pro_beta` with `plan_valid_until` in near future for UX testing.
- Memberships: user is `OWNER` in both; add a couple of `VIEWER_READONLY` and (on Pro Beta) up to 2 `EDITOR` seats (respecting the limit).
- `ensureDefaultPlans()` runs during seeding to keep plan definitions idempotent—do not remove unless production migration guarantees the records.

Reset seed:
```bash
npm run db:seed:reset
```

### Manual plan changes (beta)

Upgrade to Pro Beta:
```sql
UPDATE organizations
SET plan_code='pro_beta', plan_assigned_at=NOW(), plan_valid_until=NOW() + INTERVAL '30 days'
WHERE id='{org_id}';
```

Downgrade to Free:
```sql
UPDATE organizations
SET plan_code='free', plan_assigned_at=NOW(), plan_valid_until=NULL
WHERE id='{org_id}';
```

### Organization restore & usage recompute

Run these flows whenever support asks for help recovering a tenant or when usage metrics fall out of sync with the database.

1. **Verify retention window** — `organizations.deleted_at` must be within 30 days. Older records require a manual data export; the API will return `410 RETENTION_EXPIRED`.
2. **Restore the org** — call `POST /api/organizations/:organizationId/restore` as an owner. This clears `deleted_at` and flips `status` back to `active`.
3. **Usage snapshots auto-update** — after a restore (и любых изменений проектов/ролей) сервер вызывает `scheduleUsageRecompute()` с дебаунсом (30 секунд). Дополнительно `GET /api/organizations/:id/usage` запускает ленивый пересчёт, если последняя запись старше ~5 минут. Это покрывает большинство сценариев без ручных действий.
4. **Опциональный ручной пересчёт** — при расследовании инцидентов всё ещё можно вызвать `POST /api/organizations/:organizationId/usage/recompute` (admin). Оставьте заметку в тикете, если пользовались этим бэкап-методом.
5. **Коммуникация** — попросите пользователя просто перезагрузить Usage tab; фронтенд подтянет свежий снимок после ленивой проверки.

For CLI-driven recovery you can use `curl` with an authenticated session cookie (see `docs/DEVELOPMENT.md#manual-testing`) until we wire up an admin UI.

### Feature flags

Location: `src/lib/config.ts`

Defaults:
- `verifierRoleEnabled=false`
- `billingUiEnabled=true`
- `approvalsEnabled=false`

Override via env (example):
```bash
export NEXT_PUBLIC_VERIFIER_ROLE_ENABLED=true
```

### User profile & uploads

- `src/app/api/user/settings/route.ts` now exposes GET/PATCH to manage `first_name`, `last_name`, `job_title`, `timezone`, and `avatar_asset_id`. The Zod schema requires at least one field per request—keep this logic in sync with any future UI wizard.
- `src/lib/assets/service.ts` centralizes asset validation (`ensureOrgLogoAsset`, `ensureUserAvatarAsset`). Always call these helpers before writing `*_asset_id` into user/org records so we do not attach the wrong resource type.
- Upload signing (`POST /api/uploads/sign`) only allows `image/png`, `image/jpeg`, or `image/svg+xml` and enforces a 512 KB limit. Avatars/logos must be square (±10% tolerance) before they are accepted by downstream PATCH handlers.
- Missing S3 env vars? In local dev (non-Vercel + `NODE_ENV !== "production"`) we fall back to `public/dev-uploads` and expose a helper route `POST /api/uploads/local` that mirrors the S3 `FormData` contract. Toggle with `ENABLE_LOCAL_UPLOADS`, and customize with `LOCAL_UPLOADS_DIR`, `LOCAL_UPLOADS_PUBLIC_PATH`, `LOCAL_UPLOADS_PUBLIC_URL`.
- Using Cloudflare R2 or any custom S3-compatible host? Set `ASSETS_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com` (or your provider's endpoint). When this is present we force path-style presigned URLs so the browser POSTs directly to that host while public reads continue to use `ASSETS_PUBLIC_BASE_URL` (e.g., `https://pub-<account-id>.r2.dev/<bucket>`).
- `src/lib/uploads.ts` exposes `validateImageDimensions` for any future EXIF or client-side preflight logic—prefer reusing it over duplicating the math in React components.
- `src/components/uploads/square-image-uploader.tsx` is the shared React component (shadcn dialog + `react-easy-crop`) that enforces 1:1 crops, client-side compression/fallbacks, and integrates with `uploadAsset()`. Reuse it for any new avatar/logo surfaces to keep UX consistent.

### Test plan (summary)

Unit:
- Limit checks: active projects, editor seats (owner не учитывается), verifier seats (резерв = 0).
- Role guards: `assertOrgMembership(userId, orgId, minRole)`.
- Plan resolution: `getPlan(orgId)` объединяет `plan_definitions` + `plan_valid_until`.

Integration:
- Create organization → plan `free` + limits в ответе.
- Invite EDITOR на Free → `409 SEAT_LIMIT_EXCEEDED`.
- Delete organization → статус `deleted` + каскад soft-delete проектов.
- Restore project при переполнении → `409 PLAN_LIMIT_EXCEEDED`.
- Accept & decline membership invitations → verify seat enforcement + feature-flagged verifier role guard.
- Restore organization within 30 days → expect `200`, then recompute usage snapshot and assert counts.
- PATCH `/api/user/settings` → name/zone normalization + avatar asset ownership validation.

E2E:
- Organization switcher (переключение, empty/loading/error).
- Expiry banner для Pro Beta (валид <=14 дней).
- Restore из `deleted` после 30 дней → `RETENTION_EXPIRED` (ошибка в UI).
- Membership self-service accept/decline from email deep link.
- Profile editor with avatar upload + timezone search.

---

## Implementation Status Snapshot

| Area | Status | Notes |
| --- | --- | --- |
| Phase 1 — Database migration | ✅ Complete | All multi-org tables, enums, indices in place. |
| Phase 2 — Type safety layer | ✅ Complete | Zod schemas & helpers shipped. |
| Phase 3 — API routes | ✅ Complete | Organizations, Projects, Dataset, Uploads APIs fully implemented. |
| Phase 3 — Frontend polish | 🟡 Mostly done | Settings UI complete; minor UX gaps (expiry warnings, retention countdown). |
| Phase 4 — Testing | 🔴 Critical gap | Only 2 unit test files exist; integration/E2E tests missing. |
| Phase 5 — Documentation | ✅ Complete | Architecture, API, UX, Development docs up-to-date. |
| Phase 6 — Deployment prep | � Partial | Staging ready; production blocked by test coverage. |

**Current Readiness: 85%**

Detailed task breakdown (including open checklist items) now lives in `docs/planning/BACKLOG.md`.

---

## Active Technical Debt

### 1. **Test Coverage (Production Blocker)** 🔴
- **Location**: automated verification stack.
- **Issue**: Local unit/sanity and DB-backed integration coverage now exist, but browser-level production confidence is still missing:
  - Integration tests cover core limit scenarios and project/data-request lifecycle on local Postgres.
  - Unit/sanity tests cover auth, middleware, uploads, data-request service, overview-state, and decision-engine basics.
  - E2E tests for organization switcher, restore flows, data-request actions, and optimistic locking are still missing.
- **Impact**: High risk of regression; cannot safely deploy to production.
- **Next steps**:
  1. **Priority 1 (CI)**: Run `npm test` and `npm run test:integration` in CI with a reproducible Postgres service.
  2. **Priority 2 (E2E)**: Switcher context changes, expiry warnings, restore UX, data-request actions, dataset VERSION_CONFLICT handling.
  3. **Priority 3 (Coverage depth)**: Raise coverage where unit-level guard/service assertions are still thin.
- **Tracking**: Documented in `docs/planning/BACKLOG.md` Epic: Tests.
- **Timeline**: **1-2 days to move from private beta confidence toward production confidence.**

### 2. **UI Warnings & Polish** 🟡
- **Location**: Organization Switcher, Project List, Restore flows.
- **Status**: First pass implemented.
- **Current behavior**:
  - Switcher shows an expiry badge when `plan_valid_until <= NOW() + 14 days`.
  - Project list can include deleted projects and shows retention countdowns.
  - Restore failures caused by `PLAN_LIMIT_EXCEEDED` show actionable guidance.
- **Impact**: Medium — browser-level E2E validation is still needed.
- **Next steps**:
  1. Validate in a seeded/demo browser path.
  2. Add E2E assertions for expiry, deleted retention, and restore limit errors.
- **Timeline**: **~0.5-1 day for E2E validation.**

### 3. Authentication Workaround (Blocker for Production)
- **Location**: `src/app/api/projects/route.ts` POST handler.
- **Issue**: Uses `prisma.user.upsert()` to auto-create users, bypassing real auth.
- **Next steps**:
  1. Implement JWT session extraction middleware.
  2. Replace manual `userId` payloads with authenticated context.
  3. Remove the upsert block and enforce foreign keys.
- **Related docs**: `docs/API_REFERENCE.md` (Authentication section).
- **Tracking**: High priority before any production launch.

### 4. Database Connection Reliability
- **Location**: `.env`, `prisma/schema.prisma`, `prisma/seed.ts`.
- **Issue**: Supabase free tier sleeps; seeds occasionally time out.
- **Next steps**:
  1. Evaluate paid Supabase tier or alternative hosting.
  2. Add retry logic / exponential backoff to Prisma client initialisation.
  3. Document wake-up procedure for local devs.

### 4. Database Connection Reliability
- **Location**: `.env`, `prisma/schema.prisma`, `prisma/seed.ts`.
- **Issue**: Supabase free tier sleeps; seeds occasionally time out.
- **Next steps**:
  1. Evaluate paid Supabase tier or alternative hosting.
  2. Add retry logic / exponential backoff to Prisma client initialisation.
  3. Document wake-up procedure for local devs.

### 5. SSR Payload Instrumentation
- **Location**: `src/app/projects/[id]/dataset/page.tsx`, `src/app/projects/[id]/data-requests/page.tsx`.
- **Issue**: Instrumentation exists, but ongoing monitoring is manual.
- **Next steps**:
  1. Automate HAR capture for regression detection.
  2. Hook metrics into observability stack when available.
   3. Keep `NEXT_PUBLIC_LAZY_DATA_REQUESTS` flagged on until more perf headroom exists.
   4. Investigate why enabling the env var on Vercel did not reduce payload timings; deeper perf tooling analysis required (tracks with `docs/planning/ROADMAP.md`).

---

## Resolved Issues

| Topic | Summary | Verification |
| --- | --- | --- |
| Report template field IDs | Templates now use snake_case DB field IDs; legacy assets removed (commit `ddd0695`). | `npm run templates:check` |
| Template validation tooling | Added `scripts/check-templates.ts` (commit `d7e00c2`) to validate seed + code + DB consistency. | Command exits 0 on success. |
| Server timing tracker | Added lightweight instrumentation in `src/lib/server-data/metrics.ts` (2025-11-06). | Logs `x-server-timing` header & console output. |

Resolved backlog items remain in archived checklists for traceability.

---

## Testing Roadmap

**Current Status**: 🔴 **Critical Gap** — Only 3 test files exist (15% coverage estimate).

Existing tests:
- ✅ `src/lib/data-requests/service.test.ts` — Unit tests for bulk requests (latest pending contact logic)
- ✅ `src/app/api/uploads/sign/route.test.ts` — Unit tests for uploads (MIME validation, size limits, happy path)
- ✅ `src/app/api/uploads/relay/route.test.ts` — Local upload relay tests

**Required for Production** (per BACKLOG.md):

1. **Unit tests** (Priority 1)
   - ✅ Dataset validation helpers (`src/lib/dataset-validation.ts`) — existing coverage
   - ❌ Limits guards: `assertWithinLimit` для project/editor/verifier
   - ❌ Role guards: `assertOrgMembership` с разными ролями
   - ❌ Usage calculations: `getOrganizationUsage`
   - ❌ Retention checks: `computeProjectRetention`
   - ❌ Plan resolution: `getPlan(orgId)`

2. **Integration tests** (Priority 1)
   - ❌ Create organization → plan=free, auto-membership
   - ❌ Invite editor → SEAT_LIMIT_EXCEEDED при исчерпании лимита
   - ❌ Delete organization → cascade soft-delete всех проектов
   - ✅ Restore project → PLAN_LIMIT_EXCEEDED / RETENTION_EXPIRED scenarios
   - ✅ Accept/decline membership invitations → seat enforcement
   - ❌ Uploads: 413 (size), 415 (MIME), happy path с S3
   - ❌ Dataset optimistic locking (409 handling)
   - ❌ Data request lifecycle (bulk → complete → revoke)

3. **E2E tests** (Priority 2)
   - ❌ Organization switcher (смена контекста, empty/loading/error states)
   - ❌ Expiry banner для Pro Beta (plan_valid_until <= 14 дней) browser-level E2E
   - ❌ Restore из deleted после retention window → RETENTION_EXPIRED UI
   - ❌ Dataset VERSION_CONFLICT → refetch и пользовательское уведомление
   - ❌ Membership self-service accept/decline from email deep link
   - ❌ Profile editor with avatar upload + timezone search

4. **Manual smoke checklist** (until automated coverage exists)
   - Create project → verify datasetVersion increments.
   - Request data → verify the Responsible column shows the latest pending contact name (fallback "—").
   - Edit mailto template → reset to defaults.
   - Global requests board filters/actions once the top-level `/requests` view ships (see `docs/planning/BACKLOG.md`).

**Next Steps**:
1. Create `src/__tests__/` directory structure
2. Set up test environment (Vitest or Jest + React Testing Library)
3. Implement Priority 1 tests (integration + unit for guards/limits)
4. Block production deploy until integration tests pass

Progress on automated tests should be tracked in `docs/planning/BACKLOG.md`.

---

## Useful Scripts & Locations

| Path | Purpose |
| --- | --- |
| `scripts/check-templates.ts` | Ensures template field IDs stay aligned. |
| `scripts/sync-cbam-package-fields.ts` | Adds missing CBAM supplier-package field definitions without overwriting existing definitions or project data. |
| `scripts/collect-server-timing.ts` | Gathers timing metrics for pages. |
| `scripts/verify-schema.ts` | Validates Prisma schema vs generated client. |
| `src/lib/server-data/` | Server data loaders, caching, lazy hydration helpers. |
| `src/lib/data-requests/service.ts` | Source of truth for data-request mutations. |
| `src/lib/projects/service.ts` | Shared project status + restore helpers (plan/retention enforcement). |
| `src/lib/organizations/restore.ts` | Organization restore + usage recompute logic. |
| `src/lib/assets/service.ts` | Guards asset ownership/type before attaching to entities. |
| `src/lib/uploads.ts` | MIME/type registry, filename sanitiser, and square image validator. |

---

## Database Migration Playbook

Follow this checklist whenever you add or apply Prisma migrations—skipping pieces is what tripped us up on `20251110120000_enforce_single_pending_requests`.

1. **Prep the environment.** Use `.env.local` for local dev DB and `.env.test.local` for integration tests. Keep Supabase credentials in `.env` or a secret store, not as the only working profile.
2. **Validate connectivity.** Run `nc -zv <host> <port>` or `psql "$DIRECT_URL" -c 'select 1'` when those tools are available. Resolve VPN, firewall, or allow-list issues before invoking Prisma so we do not leave half-applied migrations.
3. **Pre-flight data guards.** When adding unique constraints or NOT NULL columns, clean existing records first. Commit that cleanup as its own migration or execute it via `npx prisma db execute --file scripts/<name>.sql`. Avoid editing an already-applied migration; create a new one instead.
4. **Apply safely.** Use `npm run db:push:local` / `npm run db:seed:local` for local iteration, and `npx prisma migrate deploy` for shared/prod environments. If a migration fails, fix the root cause, mark it rolled back with `npx prisma migrate resolve --rolled-back <migration_name>`, then re-run the apply command.
5. **Smoke-test immediately.** Re-run `npm run test:integration:local` or the relevant targeted checks while context is fresh. Remove any temporary SQL helpers (e.g., files under `temp/`) once the migration lands so the repo stays tidy.

---

For questions or historical context, start with `docs/README.md`, then deep dive into the archived specification as needed.
