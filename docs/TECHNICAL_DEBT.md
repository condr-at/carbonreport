# Technical Debt & TODOs

**Last Updated**: October 17, 2025

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

---

## 🟢 Low Priority (Nice to Have)

### 4. Request Data Modal — Single-Field Limitation

**Location**: `src/components/request-data-modal.tsx`

**Current State**:
- Modal accepts only one `fieldId` and `itemId`
- Generates `{{field_list}}` with a single bullet point
- Cannot handle bulk/multi-field data requests

**Impact**:
- Users must open modal separately for each field
- No support for "Request all materials data" or similar grouped requests

**Action Required**:
1. Extend modal props to accept `fieldIds: string[]` and `itemIds: (string | null)[]`
2. Update `{{field_list}}` generation to iterate over selected fields
3. Add multi-select UI to DatasetTable (checkboxes + bulk action bar)

**Related**: IMPLEMENTATION_CHECKLIST.md § Data Requests (multi-select flow)

**Estimated Effort**: 3-4 hours

---

### 5. DatasetTable — No Multi-Select Support

**Location**: `src/components/dataset-table.tsx`

**Current State**:
- Table renders rows with inline actions only
- No checkboxes or selection state management
- "Request Data" button opens modal for single field only

**Impact**:
- Cannot select multiple fields for bulk mailto generation
- Poor UX for requesting related data (e.g., all material inputs at once)

**Action Required**:
1. Add checkbox column with `react-table` row selection
2. Show bulk action bar when selections exist (e.g., "Request Data for 5 fields")
3. Pass selected field array to RequestDataModal

**Related**: IMPLEMENTATION_CHECKLIST.md § Data Requests (multi-select flow)

**Estimated Effort**: 2-3 hours

---

### 6. Data Requests Logging — Not Implemented

**Location**: `src/components/request-data-modal.tsx` (after mailto link opened)

**Current State**:
- Modal generates mailto link and opens email client
- No API call to log the request in `data_requests` table
- No tracking of which fields were requested from which contacts

**Impact**:
- Cannot display "Last requested from [Contact]" badges in tables
- No data-request history for contacts or projects
- Cannot implement reminder/follow-up flows

**Action Required**:
1. Implement `POST /api/data-requests/bulk` endpoint
2. Call API after `window.location.href = mailtoLink` to log requests
3. Handle revoke logic (set `revoked_at` on old requests when contact changes)

**Related**: API_REFERENCE.md § Data Requests, IMPLEMENTATION_CHECKLIST.md

**Estimated Effort**: 2-3 hours

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
