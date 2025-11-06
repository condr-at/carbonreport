# Technical Debt & TODOs

**Last Updated**: November 6, 2025

This document tracks known shortcuts, workarounds, and "TODO" items that need to be addressed before production deployment.

---

## 🔴 Critical (Must Fix Before Production)

### 1. Authentication Workaround in Project Creation

**Location**: `src/app/api/projects/route.ts` (POST handler, line ~92)

**Current State**:
```typescript
// Auto-create user via upsert to bypass foreign key constraint
const user = await prisma.user.upsert({
  where: { id: userId },
  update: {},
  create: {
    id: userId,
    name: 'Dev User',
    email: 'dev@carbonreport.app',
    passwordHash: 'dev-hash',
  },
})
```

**Why This Exists**:
- Development workaround to test project creation without implementing full auth system
- Allows frontend to pass any UUID as `userId` without pre-registering users

**Action Required**:
1. Implement proper JWT-based authentication (`/api/auth/login`, `/api/auth/register`)
2. Add middleware to extract `userId` from session token
3. Remove the `upsert` block entirely
4. Update frontend to use real user sessions

**Related Files**:
- `docs/API_REFERENCE.md` (Authentication section)
- `docs/IMPLEMENTATION_CHECKLIST.md` (Technical Debt section)

**Estimated Effort**: 4-6 hours

---

## 🟡 Medium Priority

### 2. Report Template Field ID Mismatch

**Location**: `src/lib/report-templates/*.ts`

**Issue**: Report templates use hardcoded field IDs like `company_name`, `assessment_date` that don't match the DB-backed field definitions (`organization_name`, `report_date`, etc.)

**Impact**: 
- Templates currently don't populate `mailtoTemplates` correctly
- Future report generation will fail when filtering dataset by template fields

**Action Required**:
1. Audit all field IDs in `iso14067.ts` and `cbam.ts`
2. Align with `prisma/seed-data/dataset-fields.ts` field IDs
3. OR update seed data to match template conventions

**Estimated Effort**: 2-3 hours

---

### 3. Database Connection Reliability

**Location**: `.env`, `prisma/schema.prisma`, `prisma/seed.ts`

**Current State**:
- Using Supabase pooled connection (`DATABASE_URL` on port 6543)
- Separate direct connection (`DIRECT_URL` on port 5432) for migrations/seed
- Supabase free tier auto-pauses after inactivity

**Issues**:
- Seed script occasionally fails with connection timeout
- Need to manually unpause Supabase project

**Action Required**:
1. Consider upgrading Supabase tier for production (or migrate to self-hosted Postgres)
2. Add connection retry logic in Prisma client
3. Document database wake-up procedure for developers

**Estimated Effort**: 1-2 hours (if keeping Supabase)

### 4. SSR Payload Instrumentation Gap

**Location**: `src/app/projects/[id]/dataset/page.tsx`, `src/app/projects/[id]/data-requests/page.tsx`

**Issue**: Heavy HTML responses (~40KB gzip) previously slowed dataset/data-request initial loads. Instrumentation hooks now emit to an `x-server-timing` header plus console logs, but we must keep capturing HAR snapshots to detect regressions.

**Action Required**:
1. ✅ Implement lightweight `serverTiming()` helpers in `src/lib/server-data/*` to expose Prisma query timings and render cost (`ServerTimingTracker`, 2025-11-06) — now emitting via `x-server-timing` with console fallback.
2. ✅ Add per-route logging (console + telemetry stub) for payload size and hydration cost (dataset/data-requests pages now emit payload totals).
3. ✅ Document baseline measurements in `docs/Loading perfomance optimization plan.md` (dataset 153 KB raw / 16.4 KB transferred, data-requests 56 KB raw / 8.7 KB transferred with lazy flag on). Keep `NEXT_PUBLIC_LAZY_DATA_REQUESTS` enabled in staging/production and wire alerting once metrics pipeline exists.

**Estimated Effort**: 2-3 hours to instrument, plus follow-up for alerting once observability stack lands.

### 5. Lazy Payload Helper & Metric Automation

**Location**: `src/app/projects/[id]/dataset/page.tsx`, `src/app/projects/[id]/data-requests/page.tsx`, `src/lib/server-data/metrics.ts`

**Issue**: Lazy SSR + client hydration pattern is duplicated inline and gated by a single feature flag. There is no shared helper or codified adoption checklist, so extending the optimization to new routes risks drift, and payload checks rely on manual HAR collection.

**Action Required**:
1. ✅ Extract reusable helper covering flag detection + deferred hydration logging (`src/lib/server-data/lazy-hydration.ts`, 2025-11-06).
2. ✅ Publish command sequence via `npm run metrics:collect -- <url>` and update docs so teams log `x-server-timing` snapshots consistently.
3. 🚧 Consider deeper automation (scheduled Lighthouse/HAR run) if manual snapshots stop scaling; evaluate tooling once observability budget allows.

**Estimated Effort**: Remaining automation exploration ~2 hours to scope; full CI integration TBD.

---

## 🟢 Low Priority (Nice to Have)

### 4. Request Data Modal — Multi-Field Support

**Status**: ✅ Completed (Oct 2025)

**Details**:
- Modal accepts multi-field payloads, populates contact info, and logs via bulk endpoint.
- Edge cases and UX rules captured in `docs/BULK_DATA_REQUESTS_PLAN.md`.

---

### 5. DatasetTable — Multi-Select Support

**Status**: ✅ Completed (Oct 2025)

**Details**:
- Checkbox column + bulk toolbar in place; integrates with request modal multi-field flow.
- Remaining enhancements (badges, reminders) tracked in `docs/NEXT_STEPS.md`.

---

### 6. Data Requests Logging — Service Layer

**Status**: ✅ Completed (Nov 2025)

**Details**:
- Bulk endpoint, complete, and revoke routes now use shared service with cache invalidation.
- Remaining work: reminders + dataset/report badge surfacing (see `docs/NEXT_STEPS.md`).

---

### 7. Lint Warnings Cleanup

**Location**: Various files throughout codebase

**Current State**: 23 ESLint warnings (unused imports, variables)

**Files with warnings**:
- `src/app/api/dataset-fields/route.ts` - unused `request` parameters
- `src/app/projects/[id]/page.tsx` - unused UI imports
- `src/components/blocks/project-card.tsx` - unused `statusIcon` variable

**Action Required**: 
- Clean up unused imports/variables
- Consider stricter ESLint config for production

**Estimated Effort**: 30 minutes

---

## 🟢 Resolved

### 5. CSV Schema Artifacts ✅ RESOLVED (Oct 27, 2025)

**Previous Location**: `zz__legacy_csv_schema__DO_NOT_USE/`

**Resolution**: 
- ✅ Verified no active imports from archived folder
- ✅ Deleted entire `zz__legacy_csv_schema__DO_NOT_USE/` directory
- ✅ Updated `tsconfig.json` to remove exclusion

**Completed**: October 27, 2025

---

### 6. Dataset Initialization Performance

**Location**: `src/lib/dataset-init.ts`, dataset page

**Issue**: Initializes ALL 162 fields on every project load, even if user only needs subset

**Future Optimization**:
- Lazy-load fields based on selected report templates
- Only initialize fields when user expands a section
- Add pagination to dataset table

**Estimated Effort**: 3-4 hours

---

## Tracking

**Total Critical Items**: 1  
**Total Medium Priority**: 3  
**Total Low Priority**: 6

**Next Review**: Before deploying to staging/production
