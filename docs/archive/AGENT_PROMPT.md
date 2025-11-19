# Development Agent Prompt: Optional Enhancements

_Created: 2025-11-16_  
_Updated: 2025-11-17_

---

## 🎯 Your Mission

You are a **senior full-stack developer** working on **optional enhancements** for the Carbon Report Platform's multi-organization feature. The backend, UI, and **test coverage are complete and working**. The system is **production-ready** pending authentication replacement.

**Current Status**: 95% complete, core functionality ready for production.

**Your Goal**: Implement optional UI polish and E2E tests to enhance user experience.

**Timeline**: 1-2 days (optional work)

**Success Criteria**: Enhanced UX for edge cases, E2E coverage for critical user flows.

---

## ✅ What's Already Complete

### Backend & Testing (100%)
- ✅ **Database Schema** — All tables, enums, indices
- ✅ **Server Guards** — assertOrgMembership, assertWithinLimit, getPlan, getOrganizationUsage
- ✅ **Error Handling** — Unified format across all APIs
- ✅ **52 Automated Tests** — Unit (28) + Integration (24) covering all error codes
- ✅ **Test Coverage >80%** — Guards, limits, usage, retention, lifecycle
- ✅ **Test Infrastructure** — Factories, setup, cleanup utilities

### APIs (100%)
- ✅ **Organizations API** — CRUD, members, invite, usage, restore
- ✅ **Projects API** — Lifecycle, limit enforcement, retention
- ✅ **Dataset API** — Optimistic locking with VERSION_CONFLICT handling
- ✅ **Uploads API** — Signed URLs, validation, asset tracking

### Frontend (95%)
- ✅ **Organization Switcher** — Plan pill, usage counter, states
- ✅ **Settings UI** — All tabs (Profile, Members, Usage, Billing, Danger)
- ✅ **Dataset Optimistic Locking** — UI handles VERSION_CONFLICT
- ✅ **Project Lifecycle UI** — Archive, restore, delete actions

### Documentation (100%)
- ✅ **ARCHITECTURE.md** — Multi-org model specification
- ✅ **API_REFERENCE.md** — All endpoints with error codes
- ✅ **DEVELOPMENT.md** — Test execution, migrations, setup
- ✅ **IMPLEMENTATION_STATUS.md** — Current state tracking

---

## 🎨 Optional Work (What You'll Be Doing)

### Priority 1: UI Polish (~4 hours)

**What to implement**:

---

## 📚 Required Reading (in order)

Before writing any code, read these files to understand the system:

1. **docs→IMPLEMENTATION_STATUS.md** — Current state (95% complete, 5 min read)
2. **docs→ARCHITECTURE.md** — Multi-org model (15 min read)
3. **docs→UX_GUIDE.md** — Design patterns for UI polish (10 min read)
4. **docs→planning→BACKLOG.md** — Your optional tasks (5 min read)
5. **docs→DEVELOPMENT.md** — Test execution, existing tests (10 min read)

**Total reading time**: ~45 minutes.

---

## 🏗️ Project Context (What Already Exists)

### The System You're Enhancing

**Carbon Report Platform** = multi-tenant SaaS for carbon footprint reporting.

**Multi-Org Model** (fully implemented and tested):
- Users can belong to multiple Organizations
- Organizations have Plans (Free, Pro Beta) with limits
- Plans limit: active projects, editor seats, verifier seats
- Projects have lifecycle: active → archived/reported/deleted (with 30-day retention)
- Soft-delete with restoration capability

**Test Coverage** (already complete):
- ✅ 28 unit tests for guards, limits, usage calculations
- ✅ 24 integration tests for org/project lifecycle
- ✅ All error codes tested (PLAN_LIMIT_EXCEEDED, SEAT_LIMIT_EXCEEDED, RETENTION_EXPIRED, etc.)
- ✅ Test infrastructure with factories and cleanup utilities

**Key Concepts** (for UX enhancements):

1. **Plans & Limits**:
   - `free`: 1 active project, 0 editors, 0 verifiers, unlimited viewers
   - `pro_beta`: 3 active projects, 2 editors, 0 verifiers, unlimited viewers
   - Owner doesn't count toward editor limit
   - Limits enforced on: project creation, restore, invite acceptance

2. **Roles** (ascending power):
   - `VIEWER_READONLY` — read-only
   - `VIEWER_VERIFIER` — reserved for future (currently read-only)
   - `EDITOR` — can edit projects
   - `ADMIN` — can manage org settings
   - `OWNER` — full control

3. **Project Statuses**:
   - `active` — counts toward limit, editable
   - `archived` — doesn't count, can restore
   - `reported` — finalized, read-only, doesn't count
   - `deleted` — soft-deleted, 30-day retention, can restore if within window

4. **Error Codes** (you'll be testing these):
   - `PLAN_LIMIT_EXCEEDED` (409) — active project limit reached
   - `SEAT_LIMIT_EXCEEDED` (409) — editor/verifier seat limit reached
   - `RETENTION_EXPIRED` (409) — restore window (30 days) passed
   - `VERSION_CONFLICT` (409) — dataset optimistic locking conflict
   - `VALIDATION_ERROR` (400) — bad input
   - `FORBIDDEN` (403) — insufficient role
   - `NOT_FOUND` (404) — resource doesn't exist

---

## 🗂️ Codebase Structure (Where Things Are)

### Key Files You'll Be Testing

**Server Guards & Utilities** (Priority 1 for unit tests):
```
src→lib→server-utils.ts
├── assertOrgMembership(userId, orgId, minRole)
├── assertWithinLimit(orgId, resource, options)
├── getPlan(orgId)
├── getOrganizationUsage(orgId)
└── getDefaultOrganizationMembership(userId)
```

**Project Service** (Priority 1 for unit tests):
```
src→lib→projects→service.ts
├── changeProjectStatus(...)
├── restoreProject(...)
├── computeProjectRetention(deletedAt)
└── (other project helpers)
```

**API Routes** (Priority 1 for integration tests):
```
src→app→api→
├── organizations→
│   ├── route.ts (POST create, GET list)
│   ├── [organizationId]→
│   │   ├── route.ts (GET, PATCH, DELETE)
│   │   ├── members→route.ts (GET, POST invite)
│   │   ├── invite→route.ts (POST)
│   │   ├── usage→route.ts (GET)
│   │   └── restore→route.ts (POST)
├── projects→
│   ├── route.ts (POST create)
│   ├── [id]→
│   │   ├── route.ts (GET, DELETE)
│   │   ├── status→route.ts (PATCH)
│   │   └── restore→route.ts (POST)
└── uploads→
    └── sign→route.ts (POST)
```

**Frontend Components** (Priority 2 for E2E tests):
```
src→components→layouts→main-sidebar.tsx (org switcher)
src→app→projects→page.tsx (project list, restore action)
src→app→settings→** (org settings tabs)
```

**Database Schema**:
```
prisma→schema.prisma (read this to understand data model)
```

**Existing Tests** (your examples):
```
src→lib→data-requests→service.test.ts (unit test example)
src→app→api→uploads→sign→route.test.ts (API test example)
```

---

## 📋 Your Task List (Optional Enhancements)

### Priority 1: UI Polish (~4 hours)

**Enhancement 1: Expiry Warning in Switcher**

**File**: `src/components/layouts/main-sidebar.tsx`

**What to implement**:
```typescript
// When plan_valid_until is within 14 days, show warning badge
if (org.plan_valid_until) {
  const daysUntilExpiry = differenceInDays(org.plan_valid_until, new Date())
  if (daysUntilExpiry <= 14 && daysUntilExpiry > 0) {
    // Show badge: "Expires in {X} days"
  }
}
```

**AC (Acceptance Criteria)**:
- Badge visible when `plan_valid_until <= NOW() + 14 days`
- Shows exact days remaining
- Visual distinction (warning color)
- Only applies to Pro Beta orgs with expiry date

**DoD (Definition of Done)**:
- Badge component implemented
- Styling matches design system
- Manual test with org expiring in 10 days
- No impact on orgs without expiry (Free plan)

---

**Enhancement 2: Restore Error with Suggestions**

**File**: `src/app/projects/page.tsx`

**What to implement**:
```typescript
// In restore mutation error handler
if (error.code === 'PLAN_LIMIT_EXCEEDED') {
  // Show actionable error message:
  // "You've reached your plan limit (X/Y active projects)."
  // "To restore this project, try:"
  // - Archive another project
  // - Upgrade to Pro Beta (3 projects)
}
```

**AC**:
- Error dialog shows current/limit from error.details
- Lists actionable suggestions (archive or upgrade)
- Upgrade link navigates to /settings/billing
- Error is user-friendly, not technical

**DoD**:
- Enhanced error component created
- Uses existing error.details structure
- Tested with Free plan at 1/1 limit
- Verified link navigation works

---

**Enhancement 3: Retention Countdown for Deleted Projects**

**File**: `src/app/projects/page.tsx`

**What to implement**:
```typescript
// For projects with status='deleted'
const retention = computeProjectRetention(project.deleted_at)
// Show badge: "Deleted 5 days ago • Expires in 25 days"
```

**AC**:
- Badge shows days since deletion and days remaining
- Warning color when <7 days remain
- Only visible for deleted projects
- Uses existing `computeProjectRetention` helper

**DoD**:
- Badge component matches design system
- Color transitions at 7-day threshold
- Manual test with deleted project
- Countdown updates on page refresh

---

### Priority 2: E2E Tests (Optional, ~1 day)

**Tool**: Playwright (recommended) or Cypress

**Setup Required**:
```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Create playwright.config.ts
# Create e2e/ directory
```

**File**: Create `e2e/multi-org.spec.ts`

**What to test**:

1. **Organization Switcher Context Change**:
   ```typescript
   test('switching orgs updates context and reloads data', async ({ page }) => {
     // Setup: User with 2 orgs
     // 1. Login
     // 2. Verify default org in switcher
     // 3. Open switcher dropdown
     // 4. Click different org
     // 5. Verify switcher updates
     // 6. Verify projects list reloaded with new org's projects
   })
   ```

   **AC**:
   - Switcher dropdown opens
   - All user's orgs listed
   - Clicking org updates URL param
   - Page content updates without full refresh
   - Selected org persists on page reload

2. **Expiry Warning Banner** (if Enhancement 1 implemented):
   ```typescript
   test('shows expiry warning for Pro Beta <14 days', async ({ page }) => {
     // Setup: Pro Beta org with plan_valid_until in 10 days
     // 1. Login as member of that org
     // 2. Open switcher
     // 3. Verify warning badge visible
     // 4. Verify text: "Expires in 10 days"
   })
   ```

3. **Dataset VERSION_CONFLICT Handling**:
   ```typescript
   test('handles concurrent edits gracefully', async ({ browser }) => {
     // Setup: Project with dataset
     // 1. Open dataset page in 2 browser contexts
     // 2. Edit field in context 1 → save (version 0→1)
     // 3. Edit different field in context 2 → save (expects version 0)
     // 4. Verify context 2 shows error notification
     // 5. Verify context 2 refetches data
     // 6. Verify context 2 now shows context 1's changes
   })
   ```

   **AC**:
   - 409 VERSION_CONFLICT triggers error UI
   - Error notification user-friendly
   - Page automatically refetches
   - User can retry save after refetch
   - No data loss

4. **Restore Flow with Limit Exceeded**:
   ```typescript
   test('restore shows helpful error at limit', async ({ page }) => {
     // Setup: Free org at 1/1, deleted project
     // 1. Navigate to projects page
     // 2. Find deleted project
     // 3. Click restore button
     // 4. Verify error modal appears
     // 5. Verify error mentions current limit
     // 6. Verify error suggests archiving or upgrade
   })
   ```

**DoD (Definition of Done)**:
- File created: `e2e/multi-org.spec.ts`
- Tests run headless: `npx playwright test`
- All 4 tests pass
- Screenshots captured on failure
- Can run in CI environment
- Added `test:e2e` script to package.json

---

## 🗂️ Codebase Structure (Key Files)

### Files You'll Be Editing

**UI Components**:
```
src/components/layouts/main-sidebar.tsx — Organization switcher
src/app/projects/page.tsx — Project list with restore/delete
src/app/settings/billing/page.tsx — Upgrade link destination
```

**Existing Helpers** (use these):
```
src/lib/projects/service.ts
  └── computeProjectRetention(deletedAt) — Returns { days_remaining, expires_at }

src/lib/server-utils.ts
  └── getPlan(orgId) — Returns plan with expiry date
```

**Test Files** (examples):
```
src/__tests__/lib/server-utils.test.ts — Unit test patterns
src/__tests__/api/organizations.test.ts — Integration test patterns
```

---

## 🛠️ Technical Setup

### For UI Enhancements

**Design System**:
- Use existing shadcn/ui components from `src/components/ui/`
- Badge component: `import { Badge } from '@/components/ui/badge'`
- Colors: Use `bg-yellow-100 text-yellow-800` for warnings
- Follow patterns from existing components

**Date Utilities**:
```typescript
import { differenceInDays } from 'date-fns'

// Calculate days until expiry
const daysUntil = differenceInDays(futureDate, new Date())
```

**Existing Helpers to Use**:
```typescript
// From src/lib/projects/service.ts
import { computeProjectRetention } from '@/lib/projects/service'

// Returns: { days_remaining: number, expires_at: Date } | null
const retention = computeProjectRetention(deletedAt)
```

### For E2E Tests (Optional)

**Install Playwright**:
```bash
npm install -D @playwright/test
npx playwright install
```

**Create `playwright.config.ts`**:
```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
})
```

**Add test script to `package.json`**:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## 🚨 Common Pitfalls (What NOT to Do)

### ❌ DON'T: Break existing tests
```typescript
// BAD: Modifying existing working code without running tests
// Always run npm test after changes
```

### ❌ DON'T: Hardcode dates
```typescript
// BAD: const expiryDate = new Date('2025-12-01')
// GOOD: const expiryDate = addDays(new Date(), 10)
```

### ❌ DON'T: Ignore edge cases
```typescript
// BAD: Only testing happy path
// GOOD: Test negative days_remaining, null dates, etc.
```

### ❌ DON'T: Skip manual testing
```typescript
// Always test UI enhancements manually in browser
// Check responsive design, different data states
```

---

## 📊 Success Metrics

Your work is **complete** when:

### Priority 1: UI Polish
- [ ] `src/components/layouts/main-sidebar.tsx` updated with expiry warning
- [ ] `src/app/projects/page.tsx` enhanced with restore error suggestions
- [ ] `src/app/projects/page.tsx` shows retention countdown for deleted projects
- [ ] Manual testing confirms all enhancements work
- [ ] Styling matches existing design system

### Priority 2: E2E Tests (Optional)
- [ ] `e2e/multi-org.spec.ts` created
- [ ] Organization switcher context change tested
- [ ] Dataset VERSION_CONFLICT handling tested
- [ ] Restore with limit exceeded tested
- [ ] All tests pass: `npm run test:e2e`
- [ ] Tests run in headless mode

### Overall
- [ ] No console errors during manual testing
- [ ] All existing tests still pass (52 tests)
- [ ] Documentation updated in `docs/IMPLEMENTATION_STATUS.md`
- [ ] Git commit with clear message

---

## ✅ Final Checklist (Before Submitting)

Run these commands:
```bash
# 1. All existing tests still pass
npm test

# 2. Linting passes
npm run lint

# 3. Types check
npx tsc --noEmit

# 4. Build succeeds
npm run build

# 5. If E2E tests implemented
npm run test:e2e
```

Verify:
- [ ] No console.error in browser DevTools
- [ ] UI enhancements work as described
- [ ] No regressions in existing functionality
- [ ] E2E tests (if implemented) run in CI
- [ ] Git commit message clear: `feat: add UI polish for limits and expiry`

---

## 🎯 Your Deliverables

When you're done, you should have:

1. **Enhanced UI files**:
   - `src/components/layouts/main-sidebar.tsx` (expiry warning)
   - `src/app/projects/page.tsx` (restore suggestions + retention countdown)
   - Optional: New badge/dialog components

2. **E2E test files** (optional):
   - `e2e/multi-org.spec.ts` (~200 lines)
   - `playwright.config.ts` (test config)

3. **Updated docs**:
   - `docs/IMPLEMENTATION_STATUS.md` — Mark UI polish as complete
   - Optional: `docs/planning/BACKLOG.md` — Mark E2E epic as complete

4. **Passing checks**:
   - All existing tests green (52 tests)
   - Build successful
   - Optional: E2E tests passing

---

## 💡 Pro Tips

1. **Start with UI polish**: Quick wins before E2E setup
2. **Use existing patterns**: Check other badge components for styling
3. **Test with real data**: Use seed data with expiring org
4. **Playwright is recommended**: Better Next.js support than Cypress
5. **Mock time for expiry**: Use date-fns to simulate org expiring in X days
6. **Screenshot on failure**: Helps debugging E2E issues
7. **Don't break existing tests**: Run `npm test` frequently

---

## 🚀 Let's Go!

You have everything you need:
- ✅ Clear task breakdown (UI polish + optional E2E)
- ✅ AC/DoD for each enhancement
- ✅ Code examples and patterns
- ✅ File structure and existing helpers
- ✅ Success metrics

**Your first task**: Add expiry warning badge to organization switcher in `src/components/layouts/main-sidebar.tsx`.

**Timeline**: Aim for UI polish (~4 hours), then E2E tests if time permits (~1 day).

**Questions?** Re-read the relevant doc section above or check existing code.

**Note**: This work is **optional**. The system is already production-ready pending authentication replacement. These enhancements improve UX but are not blockers.

Good luck! 🎉
