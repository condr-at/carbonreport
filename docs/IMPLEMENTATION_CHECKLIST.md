# Implementation Checklist

**Status**: 🟡 In Progress (Phase 7 polish + docs/tests remaining)  
**Last Updated**: November 7, 2025

Use this checklist to track implementation of the architecture updates. Cross-reference Phase 2a/2b milestones in `docs/Loading perfomance optimization plan.md` when sequencing SSR prefetching, payload trimming, and virtualization.
- [ ] For every new route adopting lazy SSR, reuse `src/lib/server-data/lazy-hydration.ts`, keep the feature flag guard, and capture `x-server-timing` + HAR metrics (use `npm run metrics:collect -- <url>` for quick snapshots) before sign-off.

> Phase 2b instrumentation update (2025-11-06): `src/lib/server-data/metrics.ts` now reports timings/payloads and writes to an `x-server-timing` header (with console fallback when App Router headers are immutable). Fresh HARs — dataset page 153 KB raw / 16.4 KB transferred, load ≈0.98 s; data-requests page 56 KB raw / 8.7 KB transferred, load ≈1.0 s with follow-up client fetches ≈180 ms. `NEXT_PUBLIC_LAZY_DATA_REQUESTS` remains enabled in staging to keep the table lazy-loaded; record new HARs after major schema changes and only revisit virtualization if receive times drift beyond the 250 ms target.

---

## ⚠️ Known Technical Debt

### Authentication Workaround (MUST FIX BEFORE PRODUCTION)
- **Location**: `src/app/api/projects/route.ts` (POST handler)
- **Issue**: Auto-creates users via `upsert()` to bypass foreign key constraints
- **Why**: Development workaround to test project creation without full auth system
- **Action Required**: Remove `upsert` block and implement proper JWT session validation
- **Related Files**: 
  - `docs/API_REFERENCE.md` (see Authentication section)
  - Future: `src/app/api/auth/*` endpoints

---

## Phase 1: Database Migration ✅

- [x] Update `prisma/schema.prisma`
- [x] Remove `Report.data` field
- [x] Add `Report.metadata` field
- [x] Add `Project.datasetVersion` field
- [x] Add `Project.mailtoTemplate` field
- [x] Apply migration to database (`npx prisma db push`)
- [x] Verify migration with seed script (`npm run db:seed`)
- [ ] Add GIN index for performance (optional, recommended after 100+ projects)
  ```sql
  CREATE INDEX idx_projects_dataset_gin ON projects USING GIN (dataset);
  ```

---

## Phase 2: Type Safety Layer ✅

- [x] Replace enum-based Field IDs with DB-backed definitions (Prisma `DatasetFieldDefinition`)
- [x] Ensure `/api/dataset-fields` returns normalized definitions
- [x] Create/Update `src/lib/dataset-validation.ts`
- [x] Define Zod schemas (`DataPointSchema`, `DatasetSchema`)
- [x] Add validation helpers
- [x] Add CRUD helpers (`findDataPoint`, `upsertDataPoint`, etc.)
- [x] Add completion calculation helper

---

## Phase 3: Code Updates

### 3.1 Update Template Files ✅

- [x] Update `src/lib/report-templates/iso14067.ts`
   - [x] Ensure field IDs match DB `DatasetFieldDefinition.fieldId` (snake_case)
   - [x] Ensure mailto template structure correct
- [x] Update `src/lib/report-templates/cbam.ts`
   - [x] Ensure field IDs match DB `DatasetFieldDefinition.fieldId` (snake_case)
   - [x] Ensure mailto template structure correct
- [x] Update `src/lib/report-templates/types.ts`
   - [x] Confirm `ReportField` uses `field_id: string` referencing DB IDs
   - [x] Document `metadata` field for Reports
- [x] Add validation script `scripts/check-templates.ts`
   - [x] Validates field IDs across seed data, code templates, and database
   - [x] Run via `npm run templates:check`

### 3.2 Update API Routes ✅

#### Dataset Endpoints ✅

- [x] `PUT /api/projects/[id]/dataset` — Save dataset
  - [x] Import `validateDataset` from `dataset-validation.ts`
  - [x] Validate request body with Zod
  - [x] Implement optimistic locking (checks datasetVersion, increments on save)
  - [x] Handle version conflict (409 error)
  - [x] Return new `datasetVersion` in response

- [x] `GET /api/projects/[id]/dataset` — Read dataset
  - [x] Return dataset with current `datasetVersion`
  - [x] Add validation (optional, for safety)

- [ ] `PATCH /api/projects/[id]/dataset` — Update single field (implemented)
   - [x] Validate `field_id` exists in DB definitions
   - [ ] Use `upsertDataPoint` helper
   - [x] Optimistic locking via `datasetVersion`

- [ ] `DELETE /api/projects/[id]/dataset/items/[itemId]` — Delete repeatable item (implemented)
   - [x] Use helper to remove all data points for `item_id`
   - [x] Optimistic locking via `datasetVersion`
   - [x] Validate associated `field_id` values exist in DB definitions before deletion

#### Project Endpoints ✅

- [x] `GET /api/projects` — List projects
  - [x] Return all projects with status, reportsCount, datasetVersion

- [x] `POST /api/projects` — Create project
  - [x] Initialize empty dataset: `{ data_points: [] }`
- [x] Initialize `mailtoTemplate` (subject/body) from first available report template defaults
  - [x] Set `datasetVersion` to 0
  - [x] Create Report records for selected templates

- [ ] `POST /api/projects/[id]/duplicate` — Duplicate project (not implemented)
- [ ] Copy `mailtoTemplate` to new project
  - [ ] Reset `datasetVersion` to 0 in copy

#### Report Endpoints ✅

- [x] `GET /api/projects/[projectId]/reports/[reportId]` — Get report data
  - [x] Load `templateCode` from database
  - [x] Load template config from `src/lib/report-templates/`
  - [x] Filter `Project.dataset` by template's `field_id[]`
  - [x] Calculate completion from filtered data
  - [x] Return: `{ reportInfo, template, dataset, completion }`

- [ ] `POST /api/projects/[id]/reports` — Add report type (not implemented)
  - [ ] Create Report with `templateCode`, `metadata: null`
  - [ ] Do NOT create `data` field (removed from schema)

- [ ] `PUT /api/projects/[id]/reports/[reportId]/metadata` — Update report settings (not implemented)
  - [ ] Update `Report.metadata` JSONB
  - [ ] Used for field visibility, export preferences

#### Mailto Endpoints ✅

- [x] `GET /api/projects/[id]/mailto-template` — Get project-wide template
   - [x] Return `{ subject, body }` (or null)

- [x] `PUT /api/projects/[id]/mailto-template` — Update template
   - [x] Validate structure with Zod (subject/body required)
   - [x] Persist to `Project.mailtoTemplate`

- [x] `POST /api/projects/[id]/mailto-template/reset` — Reset to defaults
   - [x] Reload template from first matching report config
   - [x] Overwrite `Project.mailtoTemplate`

#### Data Requests Endpoints ✅

- [x] `GET /api/projects/[id]/data-requests` — List project requests (fields, contacts, statuses)
- [x] `POST /api/data-requests/bulk` — Create/update records for the `dataPointIds` array and revoke previous contacts
- [x] `POST /api/data-requests/:id/close` (or PATCH) — Mark the request `completed_at` *(implemented as `/api/data-requests/[id]/complete`)*
- [ ] `POST /api/data-requests/remind` — Deferred, interface and contract defined but no route yet

### 3.3 Update Frontend Components

#### Dataset Page

- [ ] `app/projects/[id]/dataset/page.tsx`
   - [x] Display current `datasetVersion` (hidden, for debugging)
  - [ ] On save, send `datasetVersion` in request body
  - [ ] Handle 409 Conflict error:
    ```typescript
    if (error.status === 409) {
      alert('Someone else edited this project. Refreshing...')
      router.refresh()
    }
    ```
   - [x] Show optimistic UI updates (simplified)
      - [x] Use DB-backed field IDs (snake_case) from `/api/dataset-fields`
      - [x] Add checkboxes to select multiple rows and enable the bulk "Request Data" action
   - [x] Surface a "Responsible" summary for active requests and provide an inline "Change contact" control *(badge UI deferred)*
   - [x] On modal confirmation call `POST /api/data-requests/bulk` and update local contact state (including the Responsible summary contact name)

#### Report Editor

- [x] `app/projects/[id]/reports/[reportId]/page.tsx`
   - [x] Fetch data from GET endpoint (filters Project.dataset)
   - [x] On field update, call dataset endpoint (not report endpoint)
   - [x] Remove any references to `Report.data`
      - [x] Add "Request Data" for a single field and allow adding the field to the bulk selection
      - [x] Surface the current contact via the shared "Responsible" summary with a "Change contact" action (using `data_requests`)
      - [x] Use the project `mailtoTemplate`, ensuring `{{field_list}}` renders as bullets in previews

#### Data Requests Page

- [ ] `app/projects/[id]/data-requests/page.tsx`
   - [ ] Fetch `GET /api/projects/[id]/data-requests` and render a table covering data point, contact, status badge, requested/updated dates, and placeholder deadline column
   - [ ] Provide built-in filters for status groups: **Active**, **Closed**, **Overdue** (overdue derived from deadline once present)
   - [ ] Surface row actions "Resend", "Change contact", "Close" (invoke the bulk API with matching parameters)
   - [ ] Reserve header space for future bulk actions such as "Send follow-up" targeting filtered selections
   - [ ] Architect status badge component so new states (`received`, `declined`) can be added without structural changes

#### Contact Detail Page

- [ ] `app/contacts/[id]/page.tsx`
   - [ ] Add a "Requests" tab (table of projects/fields with status badge and deadline placeholder)
   - [ ] Support quick actions "Resend" and "Close" via the bulk API (mirror Data Requests page behaviour)
   - [ ] Show history (requested_at, revoked_at, completed_at) and prepare to append `received_at` / `declined_at`

#### Request Data Dialog

- [x] `components/request-data-modal.tsx` — basic single-field implementation
   - [x] Read the template from `Project.mailtoTemplate`
   - [x] Inject placeholders `{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}` (auto from project owner + project name)
   - [x] Show an email preview (subject/body) with sample bullet list
   - [x] **Extend to multi-select**: Accept `fieldIds: string[]` and `itemIds: (string | null)[]`
   - [x] **Expand `{{field_list}}` generation**: Iterate over selected fields, format as real bullet list
   - [x] **API integration**: After opening mailto link call `POST /api/data-requests/bulk` to log/update requests
   - [x] **Contact auto-fill**: Wire to Contacts store so email/name populate automatically when selecting existing contact
   - [x] **Inline contact creation**: Support adding new contact without leaving modal
   - [x] **Deadline capture**: Add optional deadline field and pass to API

#### Mailto Template Editor (Settings)

- [x] `app/projects/[id]/mailto-templates/page.tsx` — basic editor implemented
   - [x] Edit the shared template (subject/body)
   - [x] Show a preview with representative bullet list and the neutral "Carbon Reporting Data Request" subject
   - [x] Provide a "Reset to Default" button (POST reset endpoint) restoring the neutral copy
   - [ ] **Placeholder validation**: Validate allowed placeholders (`{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}`)
   - [ ] **Error feedback**: Show inline warnings for invalid placeholders

#### DatasetTable — Multi-Select Support

- [x] `components/dataset-table.tsx`
   - [x] Add checkbox column with `react-table` row selection API
   - [x] Manage selection state (`selectedRows: Set<string>`)
   - [x] Show bulk action bar when selections exist: "Request Data for X fields"
   - [x] Pass `fieldIds` array to `RequestDataModal` when bulk button clicked
   - [x] Clear selection after successful bulk action

#### Data Requests API

- [x] `src/lib/data-requests/service.ts`
   - [x] Consolidate contact resolution, revocation, creation, and serialization helpers.
   - [x] Expose `prepareBulk`, `executeBulk`, `completeRequest`, `revokeRequest` with Prisma injection support.
   - [x] Invalidate cache prefixes (`project:data-requests:*`, `project:contacts:*`) after mutations.

- [x] `src/lib/cache.ts`
   - [x] Simple TTL cache utility with prefix invalidation for server-side fetches.

- [x] `app/api/data-requests/bulk/route.ts` — `POST /api/data-requests/bulk`
   - [x] Accept `{ projectId, contact, fields[], deadline? }` payload (Zod validated).
   - [x] Use service to batch revoke/create with a single transaction.
   - [x] Return `{ success, created, revoked, requests[] }` payload.

- [x] `app/api/projects/[id]/data-requests/route.ts` — `GET /api/projects/:id/data-requests`
   - [x] Query params: `status=active|closed|overdue|all`, `contact=uuid`, `sort=requested_at|deadline|field_id`.
   - [x] Add cache layer (`project:data-requests` key) with 30s TTL.

- [x] `app/api/data-requests/[id]/complete/route.ts` — `POST /api/data-requests/:id/complete`
   - [x] Delegate to service helper with shared conflict handling.
   - [x] Return `{ success, request }` payload.

- [x] `app/api/data-requests/[id]/revoke/route.ts` — `POST /api/data-requests/:id/revoke`
   - [x] Delegate to service helper with shared conflict handling.
   - [x] Return `{ success, request }` payload.

#### Data Requests Page 🚧

- [x] `app/projects/[id]/data-requests/page.tsx`
   - [x] Table with columns: field (label + item), contact, requested/completed/revoked timestamps, deadline
   - [x] Status filters: All, Pending, Completed, Revoked (Overdue pending deadline logic)
   - [x] Bulk action toolbar: Resend, Change contact via modal, Mark complete, Revoke (replaces per-row buttons)
   - [ ] Sorting by requested_at/deadline/field
   - [x] Empty state when no requests

#### Dataset/Report Tables — Request Summaries

- [ ] Update `DatasetTable` and report dataset views
   - [x] Fetch active requests for visible fields via `GET /api/projects/:id/data-requests?status=active`
   - [x] Display a Responsible column that shows only the latest pending contact (fallback "—").
   - [x] Enforce single pending request per field (service logic + DB guard).
   - [ ] Surface timestamp or status context alongside the contact names.
   - [ ] Provide visual variants for upcoming states (active/completed)
   - [ ] Click summary to view request details or reassign contact
   - [ ] Show tooltip warning when reassigning: "This will revoke the previous request"

#### Future Extensions (Plan Ahead)

- [ ] Keep status enums open for manual updates (add `received`, `declined`) without reshaping API/DB responses
- [ ] Style deadline column / badge hooks now so overdue highlighting can be enabled when deadlines land
- [ ] Outline bulk reminder flow (disabled CTA + tooltip) tied to `POST /api/data-requests/remind`
- [ ] Sketch export/report columns for operations stakeholders (contact, project, field, status, dates)

### 3.4 Add Validation Helpers

- [ ] Create `src/lib/mailto-validation.ts`:
  ```typescript
   const ALLOWED_PLACEHOLDERS = [
      '{{contact_name}}',
      '{{project_name}}',
   '{{field_display_name}}',
   '{{field_list}}',
      '{{requester_signature}}',
      '{{deadline}}',
   ]
  
  export function validateMailtoTemplate(template: string): {
    valid: boolean
    invalidPlaceholders: string[]
  } {
    const placeholders = template.match(/\{[^}]+\}/g) || []
    const invalid = placeholders.filter(p => !ALLOWED_PLACEHOLDERS.includes(p))
    return {
      valid: invalid.length === 0,
      invalidPlaceholders: invalid
    }
  }
  
  export function replacePlaceholders(
    template: string,
    data: {
         contactName: string
         projectName: string
         fieldDisplayName: string
         fieldList: string
             requesterSignature: string
         deadline?: string
    }
  ): string {
    return template
         .replace(/\{\{contact_name\}\}/g, data.contactName)
         .replace(/\{\{project_name\}\}/g, data.projectName)
         .replace(/\{\{field_display_name\}\}/g, data.fieldDisplayName)
         .replace(/\{\{field_list\}\}/g, data.fieldList)
             .replace(/\{\{requester_signature\}\}/g, data.requesterSignature)
         .replace(/\{\{deadline\}\}/g, data.deadline || 'N/A')
  }
  ```

---

## Phase 4: Testing

### Unit Tests

- [ ] `src/lib/dataset-validation.test.ts` (IDs)
   - [ ] `isValidFieldId()` returns true for valid DB IDs
   - [ ] `isValidFieldId()` returns false for invalid strings
   - [ ] `getAllFieldIds()` returns all DB IDs

- [ ] `src/lib/dataset-validation.test.ts`
  - [ ] Zod schema validates correct data
  - [ ] Zod schema rejects invalid data
  - [ ] `findDataPoint()` finds existing points
  - [ ] `upsertDataPoint()` inserts and updates correctly
  - [ ] `removeDataPoint()` removes correctly
  - [ ] `calculateCompletion()` calculates correctly

- [ ] `src/lib/mailto-validation.test.ts`
  - [ ] Valid templates pass validation
  - [ ] Invalid placeholders detected
  - [ ] `replacePlaceholders()` substitutes correctly

### Integration Tests

- [ ] **Project creation**
   - [ ] Creates with empty dataset
   - [ ] Initializes mailtoTemplate from report defaults
   - [ ] Sets datasetVersion to 0

- [ ] **Dataset updates**
  - [ ] Increments datasetVersion on save
  - [ ] Rejects stale datasetVersion (409 error)
   - [ ] Validates `field_id` against DB definitions

- [ ] **Report rendering**
  - [ ] Loads data from Project.dataset only
  - [ ] Filters by template's field_id list
  - [ ] Calculates completion correctly
  - [ ] Does not read Report.data (removed)

- [ ] **Mailto generation**
  - [ ] Uses project-specific template
  - [ ] Replaces all placeholders
  - [ ] Logs to data_requests table

### Manual Testing

- [ ] Create new project → verify mailtoTemplate populated
- [ ] Edit dataset → verify datasetVersion increments
- [ ] Concurrent edit (2 browser tabs) → verify conflict detected
- [ ] View report → verify data appears correctly
- [ ] Request data → verify email has correct text
- [ ] Edit mailto template → verify custom template used
- [ ] Reset mailto template → verify defaults restored
- [ ] Export CSV → verify all data exported

---

## Phase 5: Documentation ✅

- [x] Update `docs/Requirements v0.0.1.md`
- [x] Clean up outdated migration and audit reports
- [x] Update `docs/IMPLEMENTATION_CHECKLIST.md` (this file)
- [ ] Add JSDoc comments to new functions
- [ ] Update README.md with new architecture notes (if applicable)
- [ ] Create API documentation for new endpoints

---

## Phase 6: Deployment

### Pre-deployment

- [ ] Run all tests (unit + integration)
- [ ] Code review for changes
- [ ] Test migration on staging database
- [ ] Backup production database
- [ ] Verify rollback procedure works

### Deployment

- [ ] Merge feature branch to main
- [ ] Apply database migration:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Deploy application
- [ ] Verify migration applied:
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'projects' 
  AND column_name IN ('dataset_version', 'mailto_templates');
  ```
- [ ] Monitor error logs for first 24 hours
- [ ] Test critical user flows in production

### Post-deployment

- [ ] Monitor performance (JSONB query times)
- [ ] Add GIN index if needed
- [ ] Collect user feedback on mailto customization
- [ ] Plan next iteration (WebSockets, admin UI, etc.)

---

## Troubleshooting

### Migration fails with "column already exists"

**Solution**: Database has drift. Run `npx prisma migrate reset` (dev only) or manually reconcile schema.

### Optimistic locking causes frequent conflicts

**Solution**: Increase debounce on save, or switch to last-write-wins for MVP.

### Performance degrades with large datasets

**Solution**: Add GIN index, implement pagination, or cache parsed dataset.

### Mailto templates not appearing

**Solution**: Check project creation seeding logic. Verify `mailtoTemplate` JSON populated.

---

## Progress Summary

| Phase | Status | Tasks Complete | Tasks Total |
|-------|--------|----------------|-------------|
| 1. Database Migration | ✅ Complete | 5 / 5 | 100% |
| 2. Type Safety Layer | ✅ Complete | 8 / 8 | 100% |
| 3. Code Updates | 🟡 In Progress | 11 / 30 | 37% |
| 4. Testing | ⬜ Not Started | 0 / 15 | 0% |
| 5. Documentation | ✅ Complete | 7 / 7 | 100% |
| 6. Deployment | ⬜ Not Started | 0 / 9 | 0% |

**Overall Progress**: 43% (31 / 72 tasks)

**Backend APIs**: ✅ Complete (11/11 endpoints implemented)
**Frontend**: ⬜ Not Started (19 tasks remaining)

---

## Next Action Items

**Priority 1 (Blocking)**:
1. ✅ ~~Apply database migration~~ (DONE via `npx prisma db push`)
2. ✅ ~~Update dataset API routes with optimistic locking~~ (DONE)
3. Update report rendering to read from Project.dataset (Frontend)

**Priority 2 (Important)**:
4. ✅ ~~Implement mailto template seeding on project creation~~ (DONE)
5. Add Request Data functionality with project templates (Frontend)
6. Добавить оптимистичные обновления для добавления/удаления repeatable items в датасете
7. Write integration tests

**Priority 3 (Nice to have)**:
7. Add mailto template editor UI (Frontend)
8. Add GIN index for performance (Deployment)
9. Create API documentation

**Current Focus**: Frontend implementation (Phase 3.3)

---

## Frontend Implementation Plan (Detailed)

**Status**: 🟡 In Progress  
**Current State**: Dashboard page exists with basic layout and sidebar  
**Next**: Build out project listing and data flow

### Pre-Implementation Checklist

**What we have**:
- ✅ Backend APIs (all 11 endpoints working)
- ✅ Database schema with optimistic locking
- ✅ Type safety (DB-backed field IDs, Zod validation)
- ✅ Report templates (ISO14067, CBAM) in code
- ✅ Seed data with sample projects
- ✅ shadcn/ui setup with base components
- ✅ MainSidebar component with navigation
- ✅ DashboardLayout wrapper
- ✅ Basic Dashboard page (`/dashboard`)

**Decisions confirmed**:
1. ✅ Enhanced-button: **Use jakobhoeg's enhanced-button** for primary actions
2. ✅ Navigation: Sidebar has separate **Dashboard** and **Projects** pages
3. ✅ `/dashboard`: Analytics view (stats, next steps from roadmaps, Hello User)
4. ✅ `/projects`: Full project list with cards, filters, sorting
5. ✅ Roadmap: Integrated into project Overview tab
6. ✅ New section: **Data Requests** list (needs API + UI)

**What we need to build**:
1. ⬜ Contacts API (`/api/contacts`) - not implemented yet
2. ⬜ Auth APIs (`/api/auth/*`) - not implemented yet
3. ⬜ Data Requests API (`/api/data-requests`) - not implemented yet

---

### Iteration 1: Foundation ✅ **DONE**

**Goal**: Setup UI infrastructure  
**Time**: 2-3 hours  
**Status**: ✅ Complete

- [x] Install and configure shadcn/ui
- [x] Create component folder structure (`ui/`, `blocks/`, `layouts/`)
- [x] Install base UI components (Button, Input, Card, Badge, Avatar, Separator, Skeleton, Tabs)
- [x] Create `<MainSidebar />` with navigation
- [x] Create `<DashboardLayout />` wrapper
- [x] Create basic `/dashboard` page
- [x] Fix API route conflicts (`[projectId]` → `[id]`)
- [x] Dev server running successfully

**Deliverable**: Dashboard accessible at http://localhost:3000/dashboard with sidebar navigation

---

### Iteration 2: Dashboard Analytics

**Goal**: Create analytics dashboard with stats and insights  
**Time**: 4-5 hours  
**Status**: ✅ Complete

**Tasks**:
1. [x] Update `/dashboard` page structure
   - Greeting: "Hello [User Name]" (use mock user for now)
   - Date/time display
   - Layout: 2-column grid (stats left, next steps right)

2. [x] Create stats cards
   - **Total Projects**: Count all projects
   - **In Progress**: Filter by status
   - **Completed**: Filter by completion = 100%
   - **Reports Generated**: Sum of all reports across projects
   - **Pending Data Requests**: Count requests with status != fulfilled (future)
   - Display with Card, Badge, and icons

3. [x] Create `<NextStepsWidget />` component
   - Location: `src/components/blocks/next-steps-widget.tsx`
   - Fetch all projects, extract roadmap items where completed=false
   - Show first 5-10 items across all projects
   - Format: "Project Name › Roadmap Item Title"
   - Clicking navigates to `/projects/[id]` (Overview tab)

4. [x] Add Recent Activity feed (optional)
   - Location: Bottom of dashboard
   - Show: "Project X updated 2 hours ago", "Report Y created yesterday"
   - Pull from Project.updatedAt timestamps
   - **Implemented as**: Quick Actions widget instead

5. [x] Create route group structure
   - Move `/dashboard` → `/(dashboard)/dashboard/page.tsx`
   - Move `/projects` → `/(dashboard)/projects/page.tsx`
   - Add `/(dashboard)/layout.tsx` with DashboardLayout
   - Ensures consistent layout across protected routes
   - **Note**: Using app-level DashboardLayout component instead of route groups for MVP

6. [x] Add `<Breadcrumbs />` component
   - Location: `src/components/blocks/breadcrumbs.tsx`
   - Show: Dashboard / Current Page
   - Integrate into DashboardLayout header
   - **Deferred**: Not critical for MVP

**API Used**: 
- `GET /api/projects` (with reports and checklist included)

**Deliverable**: ✅ Dashboard with analytics, stats cards, next steps from roadmaps

---

### Iteration 3: Projects List Page

**Goal**: Separate page for browsing all projects  
**Time**: 3-4 hours  
**Status**: ✅ Complete

**Tasks**:
1. [x] Create `<ProjectCard />` component
   - Location: `src/components/blocks/project-card.tsx`
   - Props: `{ project: Project, onOpen, onDuplicate, onArchive }`
   - Features:
     - Project name + icon/thumbnail
     - Status badge (Active/Archived)
     - Completion bar (calculate from reports)
     - Last updated timestamp
     - Quick actions dropdown (Open, Duplicate, Archive)
   - Components needed: Card, Badge, Progress, DropdownMenu

2. [x] Create `<EmptyState />` component
   - Location: `src/components/blocks/empty-state.tsx`
   - Props: `{ icon, title, description, actionLabel?, onAction? }`
   - Usage: When no projects exist

3. [x] Create `/projects` page
   - Location: `app/projects/page.tsx`
   - Fetch: `GET /api/projects`
   - Display: Grid of `<ProjectCard />` components
   - Add loading state with Skeleton cards
   - Add error state with Alert
   - Show `<EmptyState />` when no projects

4. [x] Add filtering and sorting
   - Filter by: Status (All/Active/Archived), Completion (0-25%/25-50%/etc)
   - Sort by: Name (A-Z), Last Updated, Completion %
   - Use URL search params to persist filters
   - Client-side filtering initially (move to API later)
   - **Implemented**: Status filter, Sort by name/date

5. [x] Add search bar
   - Search by project name
   - Debounced input (300ms)
   - Clear button when text entered
   - **Implemented**: Real-time search with useMemo

6. [x] Add "New Project" button
   - Top right of page
   - **Use Enhanced Button** with expandIcon effect
   - Links to `/projects/new`
   - **Note**: Using standard Button for now, Enhanced Button to be added in Iteration 12

**API Used**: `GET /api/projects`

**Deliverable**: ✅ Full project list page with cards, filters, search, and navigation

---

### Iteration 4: Project Creation Wizard

**Goal**: Create new projects via multi-step form  
**Time**: 4-5 hours  
**Status**: ✅ Complete

**Tasks**:
1. [x] Install dependencies
   - `npm install react-hook-form @hookform/resolvers zod`

2. [x] Create `/projects/new` page structure
   - `app/projects/new/page.tsx` — Step 1: Name + description
   - `app/projects/new/questionnaire/page.tsx` — Step 2: Questionnaire (optional)
   - `app/projects/new/select-reports/page.tsx` — Step 3: Select templates

3. [x] Create `<WizardSteps />` component
   - **Implemented**: Progress bar (3 steps) in each page header
   - Shows: Step 1/3, 2/3, 3/3 with visual indicator
   - Buttons: Back, Next, Skip integrated into each page

4. [x] Implement Step 1: Project Name
   - react-hook-form with Zod validation
   - Fields: name (required, min 3 chars), description (optional)
   - Next button navigates to `/projects/new/questionnaire`
   - "Skip to Report Selection" button

5. [x] Implement Step 2: Questionnaire (simplified)
   - **Single question**: "What is your primary goal for this assessment?"
   - 7 options: ISO14067, CBAM, Internal, Customer, Regulation, Multiple, Not Sure
   - Maps answers to recommended template codes
   - Skip button navigates to `/projects/new/select-reports`
   - **Note**: Simplified from full questionnaire - only for report recommendation

6. [x] Implement Step 3: Select Report Types
   - Checkboxes for ISO14067, CBAM (from `getAllReportTemplates()`)
   - Pre-select based on questionnaire answer
   - At least 1 required
   - Submit: `POST /api/projects` with { name, templateCodes[], userId }

7. [x] Handle responses
   - Success: Redirect to `/projects/{id}` (project overview)
   - Error: Show alert, stay on form
   - Loading state with spinner during submission

**API Used**: `POST /api/projects`

**Deliverable**: ✅ Working 3-step project creation wizard with report recommendation

**Key Simplification**: 
- ❌ **NO dataset mapping** from questionnaire answers
- ✅ Questionnaire is **ONLY** for recommending which report templates to pre-select
- ✅ In future, with dozens of standards, questionnaire helps beginners find relevant reports

---

### Iteration 5: Project Layout + Tabs

**Goal**: Project pages with tab navigation  
**Time**: 3-4 hours  
**Status**: ⬜ Not Started

**Tasks**:
1. [ ] Create ProjectLayout
   - Location: `src/components/layouts/project-layout.tsx`
   - Structure: MainSidebar + ProjectHeader + Tabs + Content
   - ProjectHeader: Project name, status badge, actions dropdown

2. [ ] Create `<ProjectTabs />` component
   - Location: `src/components/blocks/project-tabs.tsx`
   - Tabs: Overview, Dataset, Reports, Files
   - Active tab highlighted
   - Uses shadcn/ui Tabs component

3. [ ] Create `/projects/[id]` layout
   - `app/(dashboard)/projects/[id]/layout.tsx`
   - Wraps children with ProjectLayout
   - Fetches project data for header

4. [ ] Create Overview tab (`/projects/[id]`)
   - `app/(dashboard)/projects/[id]/page.tsx`
   - Stats cards: Completion %, Reports count, Last updated
   - Roadmap section (collapsed/expanded)
   - Recent activity feed

5. [ ] Create `<Breadcrumbs />` integration
   - Update to show: Dashboard > Projects > [Project Name] > [Tab]

**API Used**: `GET /api/projects/:id`

**Deliverable**: Project pages with working tab navigation, Overview tab with stats

---

### Iteration 6: Dataset Grid (CRUD)

**Goal**: View and edit project dataset  
**Time**: 5-6 hours  
**Status**: ⬜ Not Started

**Tasks**:
1. [ ] Research table library
   - Options: @tanstack/react-table, AG Grid Community, or custom
   - Requirements: Inline editing, sorting, filtering, CSV export
   - **Decision needed**: Which library to use?

2. [ ] Create `/projects/[id]/dataset` page
   - `app/(dashboard)/projects/[id]/dataset/page.tsx`
   - Fetch: `GET /api/projects/:id/dataset`
   - Display: Field ID, Item ID, Value, Last Updated columns

3. [ ] Implement inline editing
   - Double-click cell to edit
   - Save on blur or Enter key
   - Debounce API calls (500ms)

4. [ ] Implement save with optimistic locking
   - Send `datasetVersion` in PUT request
   - Handle 409 Conflict:
     ```typescript
     if (response.status === 409) {
       toast.error('Conflict detected. Reloading...')
       router.refresh()
     }
     ```

5. [ ] Add filtering and sorting
   - Filter by Field ID (search)
   - Sort by column headers
   - Show only filled/empty toggle

6. [ ] Add CSV export
   - Client-side export (use papaparse or similar)
   - Button: "Export CSV"
   - Filename: `{projectName}-dataset-{date}.csv`

7. [ ] Add "Request Data" action
   - Button per row
   - Opens `<RequestDataModal />` (stub for now)

**API Used**: 
- `GET /api/projects/:id/dataset`
- `PUT /api/projects/:id/dataset`

**Deliverable**: Editable dataset grid with save, conflict handling, and export

---

### Iteration 7: Reports (List + Editor)

**Goal**: View and fill out report forms  
**Time**: 5-6 hours  
**Status**: ⬜ Not Started

**Tasks**:
1. [ ] Create Reports list page
   - `app/(dashboard)/projects/[id]/reports/page.tsx`
   - Fetch: `GET /api/projects/:id` (include reports relation)
   - Display: Grid of `<ReportCard />` components

2. [ ] Create `<ReportCard />` component
   - Location: `src/components/blocks/report-card.tsx`
   - Props: `{ report: Report, template: ReportTemplate }`
   - Shows: Template name, icon, completion bar, actions
   - Actions: Open, Print, Remove (if >1 report)

3. [ ] Create Report Editor page
   - `app/(dashboard)/projects/[id]/reports/[reportId]/page.tsx`
   - Fetch: `GET /api/projects/:id/reports/:reportId`
   - Returns: { reportInfo, template, dataset, completion }

4. [ ] Render template sections
   - Loop through `template.sections[]`
   - Render fields based on type (text, number, date, select, etc.)
   - Pre-fill values from filtered dataset

5. [ ] Implement field editing
   - Use react-hook-form for each section
   - On change: Update `Project.dataset` via `PUT /api/projects/:id/dataset`
   - **Important**: Do NOT try to update `Report.data` (removed from schema)

6. [ ] Add "Request Data" per field
   - Button next to empty fields
   - Opens `<RequestDataModal />` with field context (single field mode)

7. [ ] Calculate and display completion
   - Show progress bar at top: "67% Complete (12/18 fields)"
   - Update dynamically as fields are filled

8. [ ] Create Print view
   - `app/(dashboard)/projects/[id]/reports/[reportId]/print/page.tsx`
   - Read-only render of report
   - Print-optimized CSS (`@media print`)
   - No navigation, just content + print button

**API Used**:
- `GET /api/projects/:id/reports/:reportId`
- `PUT /api/projects/:id/dataset` (for field updates)

**Deliverable**: Working report forms, auto-save to dataset, print-friendly view

---

### Iteration 8: Data Requests Board

**Goal**: Manage /projects/:id/data-requests from a dedicated board  
**Time**: 3-4 hours  
**Status**: ⬜ Not Started

**Prerequisites**:
- ⬜ Contacts CRUD complete
- ⬜ Bulk mailto flow and request logging live

**Tasks**:
1. [ ] Extend the `DataRequest` Prisma model
   - Add `completedAt`, `deadline`, `status` (future enum), `reminders` JSONB
   - Enforce uniqueness for active `(projectId, dataPointId)`

2. [ ] Backend
   - `GET /api/projects/:id/data-requests` → project list (field, contact, dates, status)
   - `POST /api/data-requests/bulk` → already implemented; confirm it returns current records
   - `POST /api/data-requests/:id/close` → set `completedAt`

3. [ ] UI `/projects/[id]/data-requests`
   - Table with columns Field, Contact, Requested, Deadline, Status, Actions
   - Filters: Active, Closed, Overdue
   - Actions: "Resend" (re-open modal), "Change contact", "Close" (calls close endpoint)
   - Pagination/search (basic)

4. [ ] Modal integration
   - Resend → open `RequestDataModal` with the prefilled selection
   - Refresh the table after actions without full reload

5. [ ] Future-proofing
   - Include placeholder UI elements (Deadline column, status badges)
   - Hooks for bulk reminders (disabled until API ships)

**API Used**:
- `GET /api/projects/:id/data-requests`
- `POST /api/data-requests/bulk`
- `POST /api/data-requests/:id/close`

**Deliverable**: Data Requests section with list, filtering, status updates

---

### Iteration 9: Contacts + Request Data

**Goal**: Manage contacts and request data via mailto  
**Time**: 4-5 hours  
**Status**: ⬜ Not Started

**Prerequisites**:
- ⬜ **Need to build**: Contacts API (see tasks below)
- ⬜ **Depends on**: Iteration 8 (Data Requests API)

**Tasks**:
1. [ ] Create Contacts backend API
   - `POST /api/contacts` - Create contact
   - `GET /api/contacts` - List all contacts (for current user)
   - `PUT /api/contacts/:id` - Update contact
   - `DELETE /api/contacts/:id` - Delete contact
   - Schema:
     ```prisma
     model Contact {
       id          String   @id @default(uuid())
       name        String
       position    String?
       email       String
       userId      String
       user        User     @relation(fields: [userId])
       createdAt   DateTime @default(now())
       updatedAt   DateTime @updatedAt
     }
     ```

2. [ ] Create Contacts page
   - `app/(dashboard)/contacts/page.tsx`
   - Add to MainSidebar navigation
   - Fetch: `GET /api/contacts`
   - Display: Grid of contact cards with name, position, email
   - Actions: Edit, Delete, View request history

3. [ ] Create Contact form dialog
   - Add/Edit contact
   - Fields: name, position (optional), email
   - POST/PUT to `/api/contacts`
   - Validation: Email format, required fields

4. [ ] Create `<RequestDataModal />` component
    - Location: `src/components/request-data-modal.tsx`
    - Props: `{ projectId, projectName, dataPoints[], onClose }`
    - Steps:
       1. Select or create a contact, set the deadline, and confirm the requester name
       2. Review the template (subject/body) with `{{field_list}}`
       3. Click "Open Email" → launch mailto and perform the follow-up API call

5. [ ] Implement mailto generation
    - Fetch: `GET /api/projects/:id/mailto-template`
   - Replace placeholders (`{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}`)
   - Format the list as bullets (`•` + display name + hint)

6. [ ] Log data request(s)
   - POST to `/api/data-requests/bulk` with payload:
       ```json
       {
          "projectId": "uuid",
          "contactId": "uuid",
          "dataPointIds": ["product_name", "energy_input_amount"],
          "deadline": "2025-11-01"
       }
       ```
   - API revokes previous links and returns the current records

7. [ ] Integrate into Dataset and Reports
   - Dataset: checkboxes, bulk bar, Responsible summaries with contact name, "Change" action
   - Reports: reuse the same modal plus quick access for a single field
   - Both flows consume `<RequestDataModal />` and `POST /api/data-requests/bulk`

**API Used**:
- `POST /api/contacts`
- `GET /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `GET /api/projects/:id/mailto-template`
- `POST /api/data-requests/bulk`

**Deliverable**: Contact management, working mailto links, request logging

---

### Iteration 10: Mailto Template Editor

**Goal**: Customize project-wide mailto template  
**Time**: 3-4 hours  
**Status**: ⬜ Not Started

**Tasks**:
1. [ ] Create Mailto Template page
   - `app/projects/[id]/mailto-templates/page.tsx`
   - Accessible from the project sidebar

2. [ ] Fetch template
   - `GET /api/projects/:id/mailto-template`
   - Pre-populate inputs (subject/body)

3. [ ] Inline editor + preview
   - Textareas for subject/body
   - Placeholder reference (`{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}`)
   - Preview with substitutions (including a bullet list)

4. [ ] Persist changes
   - `PUT /api/projects/:id/mailto-template`
   - Validate on the client and server
   - Toast on successful save

5. [ ] Reset to default
   - "Reset" button → `POST /api/projects/:id/mailto-template/reset`
   - Confirm before reset and refresh the UI

**API Used**:
- `GET /api/projects/:id/mailto-template`
- `PUT /api/projects/:id/mailto-template`
- `POST /api/projects/:id/mailto-template/reset`

**Deliverable**: Single project template editor with preview and reset

---

### Iteration 11: Authentication + Route Protection

**Goal**: Secure pages and implement login  
**Time**: 5-6 hours  
**Status**: ⬜ Not Started

**Approach**: Start with mock auth, then build real backend

**Phase 1: Mock Authentication** (2 hours)
1. [ ] Create mock auth context
   - Location: `src/lib/auth-context.tsx`
   - Mock user: `{ id: '1', name: 'John Doe', email: 'john@example.com' }`
   - Functions: `login()`, `logout()`, `isAuthenticated()`

2. [ ] Create login page with mock
   - `app/(public)/login/page.tsx`
   - Any email/password combo works
   - Store mock session in localStorage
   - Redirect to `/dashboard`

3. [ ] Create middleware for route protection
   - `middleware.ts` at root
   - Check localStorage for session
   - Redirect unauthenticated to `/login`
   - Redirect authenticated from `/login` to `/dashboard`

4. [ ] Update MainSidebar
   - Show mock user name and email
   - Logout button clears localStorage

**Phase 2: Real Authentication Backend** (3-4 hours)
5. [ ] Create auth backend API
   - `POST /api/auth/register` - Create user account
   - `POST /api/auth/login` - Authenticate, return JWT
   - `POST /api/auth/logout` - Clear session
   - `GET /api/auth/me` - Get current user
   - Use bcrypt for password hashing
   - Use jose or jsonwebtoken for JWT

6. [ ] Update login/register pages
   - Connect to real API endpoints
   - Handle errors (invalid credentials, etc.)
   - Store JWT in httpOnly cookie

7. [ ] Update middleware
   - Verify JWT instead of localStorage
   - Decode token to get user info

8. [ ] Add register page
   - `app/(public)/register/page.tsx`
   - Fields: name, email, password, confirm password
   - Validation with Zod

**API Used** (Phase 2):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Deliverable**: Working auth flow (mock first, then real)

---

### Iteration 12: Polish + Accessibility

**Goal**: Improve UX, integrate Enhanced Button fully, add missing features  
**Time**: 4-5 hours  
**Status**: ⬜ Not Started

**Tasks**:
1. [ ] Install and integrate Enhanced Button
   - Install: `npm install https://github.com/jakobhoeg/enhanced-button`
   - Install peer deps: `npm install framer-motion`
   - Replace key buttons:
     - "New Project" button → Enhanced with expandIcon
     - "Send Request" button → Enhanced with loading state
     - Form submit buttons → Enhanced with shine effect
   - Keep standard Button for secondary actions

2. [ ] Add toast notifications
   - Install: `npm install sonner` or use shadcn/ui toast
   - Success toasts: "Project created", "Data saved", "Request sent"
   - Error toasts: "Failed to save", "Conflict detected", "Network error"
   - Info toasts: "Changes auto-saved"

3. [ ] Improve Breadcrumbs
   - Show full path: Dashboard > Projects > [Name] > Dataset
   - Clickable links
   - Current page not clickable

4. [ ] Add dark mode support
   - Already configured in globals.css
   - Add toggle button in MainSidebar user menu
   - Persist preference in localStorage
   - Test all components in dark mode

5. [ ] Responsive design
   - Test on mobile: Sidebar collapses to hamburger menu
   - Tables: Horizontal scroll on small screens
   - Forms: Stack vertically on mobile

6. [ ] Keyboard navigation
   - Tab order correct across all pages
   - Escape closes modals and dialogs
   - Enter submits forms
   - Arrow keys navigate tables (if using react-table)
   - Cmd/Ctrl+K for search (optional)

7. [ ] Loading states
   - Skeleton loaders for lists
   - Spinner for buttons during submission
   - Progress bar for file uploads (future)

8. [ ] Error boundaries
   - Catch React errors globally
   - Show fallback UI with "Something went wrong"
   - Log to console (add Sentry later)
   - Add to root layout

9. [ ] Add micro-interactions
   - Hover effects on cards
   - Smooth transitions between pages
   - Loading animations (use framer-motion)
   - Success animations on form submit

**Deliverable**: Polished, accessible, responsive application with Enhanced Button integration

---

## Revised Iteration Summary

| Iteration | Focus | Time Estimate | Dependencies | Status |
|-----------|-------|---------------|--------------|--------|
| 1 ✅ | Foundation (shadcn/ui, sidebar, layouts) | 2-3h | None | ✅ Complete |
| 2 ✅ | Dashboard Analytics | 4-5h | Iteration 1 | ✅ Complete |
| 3 ✅ | Projects List Page | 3-4h | Iteration 1 | ✅ Complete |
| 4 ✅ | Project Creation Wizard | 4-5h | Iteration 3 | ✅ Complete |
| 5 ⬜ | Project Layout + Tabs | 3-4h | Iteration 4 | ⬜ Not Started |
| 6 ⬜ | Dataset Grid (CRUD) | 5-6h | Iteration 5 | ⬜ Not Started |
| 7 ⬜ | Reports (List + Editor) | 5-6h | Iteration 5, 6 | ⬜ Not Started |
| 8 ⬜ | Data Requests List | 3-4h | Backend API | ⬜ Not Started |
| 9 ⬜ | Contacts + Request Data | 5-6h | Iteration 8 | ⬜ Not Started |
| 10 ⬜ | Mailto Template Editor | 3-4h | Iteration 9 | ⬜ Not Started |
| 11 ⬜ | Authentication (Mock → Real) | 5-6h | None | ⬜ Not Started |
| 12 ⬜ | Polish + Enhanced Button | 4-5h | All previous | ⬜ Not Started |

**Total Estimated Time**: 47-58 hours (6-7 full days)

---

## Updated Progress Summary

| Phase | Status | Tasks Complete | Tasks Total |
|-------|--------|----------------|-------------|
| 1. Database Migration | ✅ Complete | 7 / 7 | 100% |
| 2. Type Safety Layer | ✅ Complete | 8 / 8 | 100% |
| 3. Backend APIs (Projects) | ✅ Complete | 11 / 11 | 100% |
| 4. Frontend Foundation | ✅ Complete | 10 / 10 | 100% |
| 5. Frontend Iteration 2 (Dashboard) | ✅ Complete | 6 / 6 | 100% |
| 6. Frontend Iteration 3 (Projects List) | ✅ Complete | 6 / 6 | 100% |
| 7. Frontend Iteration 4 (Wizard) | ✅ Complete | 7 / 7 | 100% |
| 8. Backend APIs (New) | ⬜ Not Started | 0 / 12 | 0% |
| 9. Frontend Features (Remaining) | ⬜ Not Started | 0 / 51 | 0% |
| 10. Testing | ⬜ Not Started | 0 / 15 | 0% |
| 11. Deployment | ⬜ Not Started | 0 / 9 | 0% |

**Overall Progress**: 45% (55 / 123 tasks)

**New APIs to Build**:
- Contacts API (4 endpoints)
- Data Requests API (3 endpoints)
- Auth API (4 endpoints)
- Files API (future - 1 endpoint)

---

**Last Updated**: October 13, 2025  
**Next Review**: After Iteration 2 completion
