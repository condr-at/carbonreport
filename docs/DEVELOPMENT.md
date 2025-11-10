# Development Guide

_Last updated: 2025-11-08_

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
