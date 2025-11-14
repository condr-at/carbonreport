# Development Guide

_Last updated: 2025-11-13_

This guide consolidates day-to-day engineering practices, active technical debt, and validation tooling. It replaces the previous `TECHNICAL_DEBT.md` and `IMPLEMENTATION_CHECKLIST.md` as the primary reference for contributors. Historical detail remains in `docs/archive/`.

---

## Quick Start

1. Install dependencies: `npm install`
2. Configure `.env` using `vercel.env.template`
3. Keep Prisma schema in sync:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Start development server: `npm run dev`

Refer to `docs/README.md` for onboarding context and project overview.

---

## Build & Validation Commands

| Purpose | Command | Notes |
| --- | --- | --- |
| Linting | `npm run lint` | ESLint flat config (`eslint.config.mjs`). |
| Type safety | `tsc --noEmit` | Not bundled in scripts; run manually when editing core libs. |
| Template alignment | `npm run templates:check` | Validates field IDs across seed, code, and DB records. |
| Dataset utilities | `npm run db:seed` | Populates `DatasetFieldDefinition` and demo data. |
| Server metrics | `npm run metrics:collect -- <url>` | Captures `x-server-timing` and HAR snapshots. |

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
npm run db:migrate   # alias to npx prisma migrate dev
npm run db:seed      # seeds plans, demo user, demo orgs, memberships
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
| Phase 1 — Database migration | ✅ Complete | Migrations applied, dataset JSONB live. |
| Phase 2 — Type safety layer | ✅ Complete | Zod schemas & helpers shipped. |
| Phase 3 — API routes | 🟡 Mostly done | Remaining tasks tracked in `docs/planning/BACKLOG.md`. |
| Phase 3 — Frontend polish | 🟡 Ongoing | Dataset/report request badges outstanding. |
| Phase 4 — Testing | 🔴 Not started | Unit & integration coverage needed before production. |
| Phase 5 — Documentation | 🟡 Ongoing | Architecture + dev docs refreshed; JSDoc pending. |
| Phase 6 — Deployment prep | 🔴 Not started | No staging checklist or rollback plan yet. |

Detailed task breakdown (including open checklist items) now lives in `docs/planning/BACKLOG.md`.

---

## Active Technical Debt

### 1. Authentication Workaround (Blocker for Production)
- **Location**: `src/app/api/projects/route.ts` POST handler.
- **Issue**: Uses `prisma.user.upsert()` to auto-create users, bypassing real auth.
- **Next steps**:
  1. Implement JWT session extraction middleware.
  2. Replace manual `userId` payloads with authenticated context.
  3. Remove the upsert block and enforce foreign keys.
- **Related docs**: `docs/API_REFERENCE.md` (Authentication section).
- **Tracking**: High priority before any production launch.

### 2. Database Connection Reliability
- **Location**: `.env`, `prisma/schema.prisma`, `prisma/seed.ts`.
- **Issue**: Supabase free tier sleeps; seeds occasionally time out.
- **Next steps**:
  1. Evaluate paid Supabase tier or alternative hosting.
  2. Add retry logic / exponential backoff to Prisma client initialisation.
  3. Document wake-up procedure for local devs.

### 3. SSR Payload Instrumentation
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

1. **Unit tests**
   - Dataset validation helpers (`src/lib/dataset-validation.ts`).
   - Mailto template validators (pending module).
2. **Integration tests**
   - Project creation flow (dataset + mailto defaults).
   - Dataset optimistic locking (409 handling).
   - Data request lifecycle (bulk → complete → revoke).
      - Global requests board filters/actions once the top-level `/requests` view ships (see `docs/planning/BACKLOG.md`).
3. **Manual smoke checklist** (until automated coverage exists)
   - Create project → verify datasetVersion increments.
   - Request data → verify the Responsible column shows the latest pending contact name (fallback "—").
   - Edit mailto template → reset to defaults.

Progress on automated tests should be tracked in `docs/planning/BACKLOG.md`.

---

## Useful Scripts & Locations

| Path | Purpose |
| --- | --- |
| `scripts/check-templates.ts` | Ensures template field IDs stay aligned. |
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

1. **Prep the environment.** Ensure `.env` defines both `DIRECT_URL` (direct Postgres connection) and `DATABASE_URL` (pooled). Append `?sslmode=require` to the direct URL—Supabase rejects plain TCP. Export both variables into your shell (`source .env` or manual `export`) and confirm with `echo $DIRECT_URL` / `echo $DATABASE_URL`.
2. **Validate connectivity.** Run `nc -zv <host> <port>` or `psql "$DIRECT_URL" -c 'select 1'`. Resolve VPN, firewall, or allow-list issues before invoking Prisma so we do not leave half-applied migrations.
3. **Pre-flight data guards.** When adding unique constraints or NOT NULL columns, clean existing records first. Commit that cleanup as its own migration or execute it via `npx prisma db execute --file scripts/<name>.sql`. Avoid editing an already-applied migration; create a new one instead.
4. **Apply safely.** Use `npx prisma migrate dev` for local work (uses `DIRECT_URL`) and `npx prisma migrate deploy` for shared/prod environments. If a migration fails, fix the root cause, mark it rolled back with `npx prisma migrate resolve --rolled-back <migration_name>`, then re-run the apply command.
5. **Smoke-test immediately.** Re-run the relevant integration suite (`npx tsx --test …`) or targeted checks while context is fresh. Remove any temporary SQL helpers (e.g., files under `temp/`) once the migration lands so the repo stays tidy.

---

For questions or historical context, start with `docs/README.md`, then deep dive into the archived specification as needed.
