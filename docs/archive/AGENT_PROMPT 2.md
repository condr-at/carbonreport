# Development Agent Prompt: Multi-Org Testing Implementation

_Created: 2025-11-16_

---

## 🎯 Your Mission

You are a **senior full-stack developer** tasked with implementing **automated test coverage** for the Carbon Report Platform's multi-organization feature. The backend and UI are **already complete and working**. Your job is to **write tests that verify the existing implementation**.

**Current Status**: 85% complete, blocked from production by lack of test coverage.

**Your Goal**: Increase test coverage from 15% to >80% by implementing unit, integration, and E2E tests.

**Timeline**: 1-2 days

**Success Criteria**: All tests pass, coverage >80%, production deployment unblocked.

---

## 📚 Required Reading (in order)

Before writing any code, read these files to understand the system:

1. **docs→IMPLEMENTATION_STATUS.md** — Quick overview of current state (5 min read)
2. **docs→ARCHITECTURE.md** — Multi-org model, entities, relationships (15 min read)
3. **docs→API_REFERENCE.md** — Error codes, endpoint contracts (10 min read)
4. **docs→planning→BACKLOG.md** — Your specific tasks with AC/DoD (5 min read)
5. **docs→DEVELOPMENT.md** — Test plan section, existing helpers (10 min read)

**Total reading time**: ~45 minutes. **Do not skip this.**

---

## 🏗️ Project Context (What Already Exists)

### The System You're Testing

**Carbon Report Platform** = multi-tenant SaaS for carbon footprint reporting.

**Multi-Org Model** (already implemented):
- Users can belong to multiple Organizations
- Organizations have Plans (Free, Pro Beta) with limits
- Plans limit: active projects, editor seats, verifier seats
- Projects have lifecycle: active → archived/reported/deleted (with 30-day retention)
- Soft-delete with restoration capability

**Key Concepts You Must Understand**:

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

## 📋 Your Task List (Priority Order)

### Phase 1: Unit Tests (Priority 1 — Start Here)

**File**: Create `src→__tests__→lib→server-utils.test.ts`

**What to test**:

1. **`assertWithinLimit` function**:
   ```typescript
   // Test scenarios:
   - ✅ Free plan: creating 2nd project → throws PLAN_LIMIT_EXCEEDED
   - ✅ Free plan: inviting editor → throws SEAT_LIMIT_EXCEEDED
   - ✅ Pro Beta: creating 4th project → throws PLAN_LIMIT_EXCEEDED
   - ✅ Pro Beta: inviting 3rd editor → throws SEAT_LIMIT_EXCEEDED
   - ✅ Unlimited resource (viewers) → never throws
   - ✅ Within limit → no error
   ```

   **AC (Acceptance Criteria)**:
   - Error includes `{ limit, current, needed }` details for projects
   - Error includes `{ role, limit, current }` details for seats
   - Owner doesn't count toward editor limit
   - Verifier limit always 0 (future feature)

2. **`assertOrgMembership` function**:
   ```typescript
   // Test scenarios:
   - ✅ User not member → throws FORBIDDEN
   - ✅ User is VIEWER, needs EDITOR → throws FORBIDDEN
   - ✅ User is EDITOR, needs VIEWER → succeeds
   - ✅ User is OWNER → always succeeds
   - ✅ Deleted org → throws NOT_FOUND
   - ✅ Pending invite (not accepted) → throws FORBIDDEN
   ```

3. **`getOrganizationUsage` function**:
   ```typescript
   // Test scenarios:
   - ✅ Counts only active projects (not archived/reported/deleted)
   - ✅ Counts only accepted EDITOR memberships
   - ✅ Counts only accepted VIEWER_VERIFIER memberships
   - ✅ Counts all accepted viewer roles (VIEWER_READONLY + VIEWER_VERIFIER)
   - ✅ Excludes OWNER from editor count
   ```

4. **`computeProjectRetention` function**:
   ```typescript
   // Test scenarios:
   - ✅ null deletedAt → returns null
   - ✅ Deleted 10 days ago → { days_remaining: 20, expires_at: ... }
   - ✅ Deleted 35 days ago → { days_remaining: -5, expires_at: ... }
   - ✅ Uses PROJECT_RETENTION_DAYS constant (30)
   ```

**DoD (Definition of Done)**:
- File created at `src→__tests__→lib→server-utils.test.ts`
- All functions covered
- Tests use actual Prisma client with test database or mocks
- Coverage >80% for `src→lib→server-utils.ts`
- All tests pass: `npm test server-utils.test.ts`

---

### Phase 2: Integration Tests (Priority 1 — Do After Unit)

**File**: Create `src→__tests__→api→organizations.test.ts`

**Setup Required**:
```typescript
// Before each test:
- Clear test database
- Create demo user
- Create demo plans (free, pro_beta)

// After each test:
- Clean up created records
```

**What to test**:

1. **Organization Creation**:
   ```typescript
   describe('POST /api/organizations', () => {
     it('creates org with plan=free by default', async () => {
       // AC: status 201
       // AC: response includes org.id, org.plan_code='free'
       // AC: auto-creates OWNER membership for creator
       // AC: membership.invite_status='accepted'
     })
     
     it('generates unique slug from display_name', async () => {
       // AC: "My Org" → slug="my-org"
       // AC: duplicate name → slug="my-org-2"
     })
   })
   ```

2. **Membership Invites**:
   ```typescript
   describe('POST /api/organizations/:id/invite', () => {
     it('allows inviting editor on Pro Beta', async () => {
       // Setup: Pro Beta org with 1 editor
       // AC: status 201
       // AC: creates membership with invite_status='pending'
     })
     
     it('blocks inviting editor on Free plan', async () => {
       // Setup: Free plan org
       // AC: status 409
       // AC: error.code='SEAT_LIMIT_EXCEEDED'
       // AC: error.details.limit=0, current=0
     })
     
     it('blocks inviting 3rd editor on Pro Beta', async () => {
       // Setup: Pro Beta org with 2 accepted editors
       // AC: status 409
       // AC: error.code='SEAT_LIMIT_EXCEEDED'
       // AC: error.details.role='EDITOR', limit=2, current=2
     })
     
     it('blocks inviting verifier (feature disabled)', async () => {
       // Setup: Any org
       // AC: status 422
       // AC: error.code='VALIDATION_ERROR'
       // AC: error message mentions verifier disabled
     })
   })
   ```

3. **Organization Deletion & Cascade**:
   ```typescript
   describe('DELETE /api/organizations/:id', () => {
     it('soft-deletes org and cascades to projects', async () => {
       // Setup: Org with 2 active projects
       // AC: org.status='deleted', org.deleted_at set
       // AC: both projects.status='deleted', projects.deleted_at set
       // AC: response includes retention metadata
     })
     
     it('only allows OWNER to delete', async () => {
       // Setup: ADMIN user
       // AC: status 403
       // AC: error.code='FORBIDDEN'
     })
   })
   ```

**File**: Create `src→__tests__→api→projects.test.ts`

4. **Project Creation with Limits**:
   ```typescript
   describe('POST /api/projects', () => {
     it('creates project on Free plan', async () => {
       // Setup: Free org with 0 active projects
       // AC: status 201
       // AC: project.status='active'
       // AC: project.organization_id matches
     })
     
     it('blocks 2nd project on Free plan', async () => {
       // Setup: Free org with 1 active project
       // AC: status 409
       // AC: error.code='PLAN_LIMIT_EXCEEDED'
       // AC: error.details.resource='active_projects'
       // AC: error.details.limit=1, current=1, needed=1
     })
     
     it('allows 3 projects on Pro Beta', async () => {
       // Setup: Pro Beta org
       // AC: can create 3 active projects
       // AC: 4th attempt → 409 PLAN_LIMIT_EXCEEDED
     })
     
     it('archived projects dont count toward limit', async () => {
       // Setup: Free org with 1 archived project
       // AC: can create new active project
     })
   })
   ```

5. **Project Restore with Limits**:
   ```typescript
   describe('POST /api/projects/:id/restore', () => {
     it('restores deleted project within retention', async () => {
       // Setup: Deleted project (5 days ago), Free org at 0/1 limit
       // AC: status 200
       // AC: project.status='active'
       // AC: project.deleted_at=null
     })
     
     it('blocks restore when limit exceeded', async () => {
       // Setup: Free org at 1/1 limit, deleted project
       // AC: status 409
       // AC: error.code='PLAN_LIMIT_EXCEEDED'
       // AC: error.details includes limit/current/needed
     })
     
     it('blocks restore after retention window', async () => {
       // Setup: Project deleted 35 days ago
       // AC: status 409
       // AC: error.code='RETENTION_EXPIRED'
       // AC: error.details.window_days=30
     })
     
     it('restores archived project without limit check', async () => {
       // Setup: Archived project (status='archived')
       // AC: status 200
       // AC: restored to 'active' even if at limit
       // (archived was user's choice, not system limit)
     })
   })
   ```

6. **Uploads Validation**:
   ```typescript
   describe('POST /api/uploads/sign', () => {
     it('rejects file >512KB', async () => {
       // AC: status 413
       // AC: error.code='VALIDATION_ERROR'
       // AC: error.details.max_bytes=524288
     })
     
     it('rejects unsupported MIME type', async () => {
       // Setup: mime_type='application/pdf'
       // AC: status 415
       // AC: error.code='VALIDATION_ERROR'
       // AC: error.details.supported includes PNG/JPEG/SVG
     })
     
     it('generates signed URL for valid request', async () => {
       // Setup: PNG, 100KB
       // AC: status 201
       // AC: response.upload.asset_id exists
       // AC: response.upload.url is valid S3 URL
       // AC: response.upload.expires_at is future timestamp
     })
   })
   ```

**DoD (Definition of Done)**:
- Files created: `organizations.test.ts`, `projects.test.ts`
- All error codes tested (PLAN_LIMIT_EXCEEDED, SEAT_LIMIT_EXCEEDED, etc.)
- Tests use actual HTTP requests to API routes
- Test database isolated (separate from dev/prod)
- All tests pass: `npm test api/*.test.ts`
- Can run in CI environment

---

### Phase 3: E2E Tests (Priority 2 — Do If Time Permits)

**Tool**: Playwright or Cypress (check existing setup in repo)

**File**: Create `e2e→multi-org.spec.ts`

**What to test**:

1. **Organization Switcher**:
   ```typescript
   test('switching orgs updates context', async () => {
     // Setup: User with 2 orgs
     // 1. Login
     // 2. Verify default org shown in switcher
     // 3. Click switcher dropdown
     // 4. Select different org
     // 5. Verify switcher updates
     // 6. Verify navigation reloads (projects list changes)
   })
   
   test('switcher shows plan and usage', async () => {
     // Setup: Free org with 1/1 active projects
     // 1. Open switcher
     // 2. Verify shows "Free" badge
     // 3. Verify shows "1 / 1" counter
   })
   
   test('empty state when no orgs', async () => {
     // Setup: User with no accepted memberships
     // 1. Login
     // 2. Verify redirected to /no-organization
     // 3. Verify can create org from empty state
   })
   ```

2. **Dataset Optimistic Locking**:
   ```typescript
   test('handles VERSION_CONFLICT gracefully', async () => {
     // Setup: Project with dataset
     // 1. Open dataset page in 2 tabs
     // 2. Edit field in tab 1 → save (version 0→1)
     // 3. Edit different field in tab 2 → save (expects version 0)
     // 4. Verify tab 2 shows error notification
     // 5. Verify tab 2 refetches data
     // 6. Verify tab 2 now shows tab 1's changes
   })
   ```

3. **Expiry Warning** (if implemented):
   ```typescript
   test('shows expiry warning for Pro Beta <14 days', async () => {
     // Setup: Pro Beta org with plan_valid_until in 10 days
     // 1. Login
     // 2. Verify switcher shows warning badge
     // 3. Verify badge text: "Expires in 10 days"
   })
   ```

4. **Restore Flow**:
   ```typescript
   test('restore with limit exceeded shows suggestion', async () => {
     // Setup: Free org at 1/1, deleted project
     // 1. Navigate to projects page
     // 2. Find deleted project
     // 3. Click restore
     // 4. Verify error modal/toast
     // 5. Verify error mentions archiving or upgrade
   })
   ```

**DoD (Definition of Done)**:
- File created: `e2e→multi-org.spec.ts`
- Tests run headless in CI
- All critical flows covered
- Screenshots on failure
- Tests pass: `npm run test:e2e`

---

## 🛠️ Technical Setup

### Test Framework

**Check existing setup first**:
```bash
# Look for:
cat package.json | grep -E "(jest|vitest|playwright|cypress)"
```

**If no test framework**:
1. Install Vitest (recommended for Next.js):
   ```bash
   npm install -D vitest @vitejs/plugin-react
   npm install -D @testing-library/react @testing-library/jest-dom
   ```

2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: './src/__tests__/setup.ts',
     },
   })
   ```

3. Create `src→__tests__→setup.ts`:
   ```typescript
   import '@testing-library/jest-dom'
   import { beforeAll, afterAll, afterEach } from 'vitest'
   import { prisma } from '@/lib/db'
   
   beforeAll(async () => {
     // Setup test database
   })
   
   afterEach(async () => {
     // Clean test data
   })
   
   afterAll(async () => {
     await prisma.$disconnect()
   })
   ```

### Test Database

**Option 1**: Separate test database (recommended)
```bash
# .env.test
DATABASE_URL="postgresql://user:pass@localhost:5432/carbonreport_test"
```

**Option 2**: In-memory SQLite (faster, but schema differences)
```bash
DATABASE_URL="file:./test.db"
```

**Before tests**:
```bash
npm run db:push  # Apply schema to test DB
npm run db:seed  # Seed plans
```

### Running Tests

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest src/__tests__/lib",
    "test:integration": "vitest src/__tests__/api",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 📝 Writing Good Tests (Best Practices)

### 1. AAA Pattern (Arrange-Act-Assert)

```typescript
test('blocks 2nd project on Free plan', async () => {
  // ARRANGE: Setup preconditions
  const org = await createTestOrg({ planCode: 'free' })
  const user = await createTestUser()
  await createTestMembership({ org, user, role: 'OWNER' })
  await createTestProject({ org, status: 'active' }) // 1st project
  
  // ACT: Perform action
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ organization_id: org.id, name: 'Project 2' }),
  })
  
  // ASSERT: Verify outcome
  expect(response.status).toBe(409)
  const body = await response.json()
  expect(body.code).toBe('PLAN_LIMIT_EXCEEDED')
  expect(body.details.limit).toBe(1)
  expect(body.details.current).toBe(1)
})
```

### 2. Use Factories (DRY)

Create `src→__tests__→factories.ts`:
```typescript
export async function createTestOrg(overrides = {}) {
  return prisma.organization.create({
    data: {
      slug: `test-org-${Date.now()}`,
      displayName: 'Test Org',
      planCode: 'free',
      planAssignedAt: new Date(),
      createdByUserId: '...',
      ...overrides,
    },
  })
}

export async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      passwordHash: 'dummy',
      ...overrides,
    },
  })
}
```

### 3. Test Error Details Structure

```typescript
// BAD: Only checks status code
expect(response.status).toBe(409)

// GOOD: Verifies full error contract
expect(response.status).toBe(409)
const error = await response.json()
expect(error).toMatchObject({
  error: expect.any(String),
  code: 'PLAN_LIMIT_EXCEEDED',
  details: {
    resource: 'active_projects',
    limit: 1,
    current: 1,
    needed: 1,
  },
})
```

### 4. Cleanup After Tests

```typescript
afterEach(async () => {
  // Clean in reverse FK order
  await prisma.dataRequest.deleteMany()
  await prisma.project.deleteMany()
  await prisma.organizationMembership.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
})
```

### 5. Use Descriptive Test Names

```typescript
// BAD
test('limit works', ...)

// GOOD
test('blocks 2nd project creation on Free plan with PLAN_LIMIT_EXCEEDED', ...)
```

---

## 🚨 Common Pitfalls (What NOT to Do)

### ❌ DON'T: Test implementation details
```typescript
// BAD: Testing internal function names
expect(assertWithinLimit).toHaveBeenCalled()

// GOOD: Testing observable behavior
expect(response.status).toBe(409)
expect(response.body.code).toBe('PLAN_LIMIT_EXCEEDED')
```

### ❌ DON'T: Share state between tests
```typescript
// BAD: Tests depend on each other
let sharedOrg
test('create org', () => { sharedOrg = ... })
test('delete org', () => { delete sharedOrg ... })

// GOOD: Each test is independent
test('create org', () => { const org = await create... })
test('delete org', () => { const org = await create... })
```

### ❌ DON'T: Hardcode IDs
```typescript
// BAD
const orgId = '123e4567-e89b-12d3-a456-426614174000'

// GOOD
const org = await createTestOrg()
const orgId = org.id
```

### ❌ DON'T: Skip error message checks
```typescript
// BAD: Only checks status
expect(response.status).toBe(400)

// GOOD: Verifies helpful error message
expect(response.body.error).toContain('exceeded')
```

---

## 📊 Success Metrics

Your work is **complete** when:

### Phase 1: Unit Tests
- [ ] `src→__tests__→lib→server-utils.test.ts` created
- [ ] All 4 functions tested (assertWithinLimit, assertOrgMembership, getOrganizationUsage, computeProjectRetention)
- [ ] Coverage >80% for `src→lib→server-utils.ts`
- [ ] All tests pass: `npm run test:unit`

### Phase 2: Integration Tests
- [ ] `src→__tests__→api→organizations.test.ts` created
- [ ] `src→__tests__→api→projects.test.ts` created
- [ ] All error codes tested (PLAN_LIMIT_EXCEEDED, SEAT_LIMIT_EXCEEDED, RETENTION_EXPIRED)
- [ ] Cascade soft-delete verified
- [ ] Upload validation tested (413, 415)
- [ ] All tests pass: `npm run test:integration`

### Phase 3: E2E Tests (Optional)
- [ ] `e2e→multi-org.spec.ts` created
- [ ] Switcher context change tested
- [ ] VERSION_CONFLICT refetch tested
- [ ] All tests pass: `npm run test:e2e`

### Overall
- [ ] Total coverage >80% (check with `npm run test:coverage`)
- [ ] All tests pass in CI
- [ ] No console errors during test runs
- [ ] Test execution time <5 minutes
- [ ] Documentation updated in `docs→DEVELOPMENT.md` (add "Tests implemented" to status)

---

## 🆘 When You Get Stuck

### Read the Docs (in order)
1. `docs→IMPLEMENTATION_STATUS.md` — What's implemented
2. `docs→ARCHITECTURE.md` — How it works
3. `docs→API_REFERENCE.md` — Error codes
4. `docs→DEVELOPMENT.md` — Setup

### Check Existing Code
1. `src→lib→data-requests→service.test.ts` — Unit test example
2. `src→app→api→uploads→sign→route.test.ts` — API test example
3. `src→lib→server-utils.ts` — Functions you're testing
4. `prisma→schema.prisma` — Data model

### Debug Test Failures
```typescript
// Add console.log to see what's happening
console.log('Response:', await response.json())

// Use --verbose flag
npm test -- --verbose

// Run single test
npm test -- server-utils.test.ts -t "blocks 2nd project"
```

### Ask Questions
If specification unclear:
1. Check `docs→API_REFERENCE.md` for endpoint contracts
2. Check `docs→ARCHITECTURE.md` for business rules
3. Look at actual implementation in `src→app→api→**`
4. Write test based on observed behavior, add TODO if unsure

---

## ✅ Final Checklist (Before Submitting)

Run these commands:
```bash
# 1. All tests pass
npm test

# 2. Coverage meets target
npm run test:coverage
# Check coverage >80% for server-utils.ts and project service

# 3. Linting passes
npm run lint

# 4. Types check
npx tsc --noEmit

# 5. Build succeeds
npm run build
```

Verify:
- [ ] No console.error in test output
- [ ] No skipped tests (.skip or .todo)
- [ ] No hardcoded credentials or IDs
- [ ] Test cleanup (afterEach) working
- [ ] README updated if added new scripts
- [ ] Git commit with clear message: `test: implement multi-org coverage (unit + integration)`

---

## 🎯 Your Deliverables

When you're done, you should have:

1. **New test files**:
   - `src→__tests__→lib→server-utils.test.ts` (~200-300 lines)
   - `src→__tests__→api→organizations.test.ts` (~300-400 lines)
   - `src→__tests__→api→projects.test.ts` (~300-400 lines)
   - Optional: `e2e→multi-org.spec.ts` (~200 lines)

2. **Helper files**:
   - `src→__tests__→factories.ts` (test data factories)
   - `src→__tests__→setup.ts` (global test setup)
   - `vitest.config.ts` (test config)

3. **Updated docs**:
   - `docs→DEVELOPMENT.md` — Add test execution instructions
   - Optional: `docs→planning→BACKLOG.md` — Mark test epic as complete

4. **Passing CI**:
   - All tests green
   - Coverage >80%
   - Build successful

---

## 💡 Pro Tips

1. **Start small**: Write 1 test, make it pass, then expand
2. **Copy patterns**: Use existing tests as templates
3. **Test happy path first**: Basic success cases before edge cases
4. **Use TypeScript**: Leverage types for API contracts
5. **Mock external APIs**: Don't call real S3 in tests
6. **Parallel execution**: Tests should be independent
7. **Meaningful assertions**: Check structure, not just status codes
8. **Document weird behavior**: Add comments for non-obvious tests

---

## 🚀 Let's Go!

You have everything you need:
- ✅ Clear task breakdown
- ✅ AC/DoD for each test
- ✅ Code examples
- ✅ File structure
- ✅ Success metrics

**Your first task**: Create `src→__tests__→lib→server-utils.test.ts` and test `assertWithinLimit` with the Free plan project limit scenario.

**Timeline**: Aim for Phase 1 (unit tests) today, Phase 2 (integration) tomorrow.

**Questions?** Re-read the relevant doc section above or check existing code.

Good luck! 🎉
