# Next Steps: Data Request Features Implementation

**Status**: Ready for Phase 1  
**Last Updated**: 2025-10-28

## Overview

This document outlines the implementation plan for completing the data request features. Each phase is designed to be small, testable, and incrementally valuable.

### Decisions & Clarifications
- Phase 1 creates a temporary `POST /api/data-requests/bulk` handler that just echoes the payload; Phase 6 will replace it with the real Prisma logic.
- Request status is derived on the fly from timestamps (`revoked_at` → revoked, `completed_at` → completed, otherwise pending).
- When a field is re-requested for the same project, any previous active request for that field (different contact) gets `revoked_at` set.

---

## Phase 1: Confirmation Dialog (30 min) ✅ READY

**Goal**: Add post-mailto confirmation dialog to log data requests

**Files to modify**:
- `src/components/request-data-modal.tsx`

**Implementation**:
1. Add state for showing confirmation dialog after mailto link opens
2. Create dialog with question: "Was the email sent?"
3. Add three buttons:
   - "Yes, log request" → Call temporary `POST /api/data-requests/bulk` endpoint, close modal, show success toast
   - "No, cancel" → Close modal
   - "< Back to edit" → Return to form
4. Add a lightweight API route (same path as Phase 6) that validates payload shape and responds with 200 without touching the database

**Testing**: Click mailto → Open form → Click "Request Data" → See confirmation → Test all three buttons (mock endpoint logs payload)

**Acceptance Criteria**:
- Dialog appears immediately after mailto link opens
- "Yes" button triggers API call (can be mock endpoint initially)
- "No" button closes modal cleanly
- "Back" button returns to editable form state

---

## Phase 2: Mock Data Requests API (20 min)

**Goal**: Create GET endpoint returning fake request data

**Files to create**:
- `src/app/api/projects/[id]/data-requests/route.ts`

**Implementation**:
1. Create basic GET handler (re-use status derivation logic from Phase 3)
2. Return hardcoded array of 2-3 sample requests with different statuses
3. Include contact info, field info, timestamps

**Testing**: Open browser DevTools → Navigate to dataset page → Check Network tab for API call

**Sample Response**:
```json
[
  {
    "id": "123",
    "dataPointId": "dp-1",
    "contactId": "contact-1",
    "status": "pending",
    "requestedAt": "2025-10-20T10:00:00Z",
    "contact": {"name": "John Doe", "email": "john@example.com"},
    "dataPoint": {"label": "Total Emissions"}
  }
]
```

---

## Phase 3: Request Badges in Dataset Table (45 min)

**Goal**: Show visual indicators for requested data points

**Files to modify**:
- `src/components/dataset-table.tsx`
- `src/app/projects/[id]/dataset/dataset-page-client.tsx`

**Implementation**:
1. Fetch data requests in dataset page
2. Pass requests array to DatasetTable
3. Add badge component to each row: "Requested from [Contact Name]"
4. Color code by computed status: yellow (pending), green (completed)
5. Add popover on badge click with actions: "Resend", "Change Contact", "Mark Complete"

**Testing**: 
- Mock API returns request for field → Badge appears
- Click badge → Popover shows
- Test each action button

---

## Phase 4: Contact Selector Dropdown (30 min)

**Goal**: Replace radio group with searchable dropdown

**Files to modify**:
- `src/components/request-data-modal.tsx`

**Implementation**:
1. Replace radio buttons with shadcn Select or Combobox
2. Show contact name + email in options
3. Add search/filter capability
4. Maintain same validation logic

**Testing**: Open modal → See dropdown → Search for contact → Select → Preview updates

---

## Phase 5: Multi-field Support with Checkboxes (1 hour)

**Goal**: Allow requesting multiple fields at once

**Files to modify**:
- `src/components/dataset-table.tsx` (add checkboxes to rows)
- `src/components/request-data-modal.tsx` (handle multiple fields)

**Implementation**:
1. Add checkbox column to DatasetTable
2. Add "Request Selected Fields" button in table toolbar
3. Modify RequestDataModal to accept `fieldIds: string[]`
4. Generate `{{field_list}}` as bulleted list
5. Update preview to show all fields

**Testing**: 
- Select 3 fields → Click button → See all fields in preview
- Test with 1 field (should work same as before)
- Test with 10 fields (ensure list is readable)

---

## Phase 6: Real API Implementation (1.5 hours)

**Goal**: Replace mock with Prisma-based CRUD operations

**Files to modify**:
- `src/app/api/projects/[id]/data-requests/route.ts` (enhance GET)
- `src/app/api/data-requests/bulk/route.ts` (new POST endpoint)
- `src/app/api/data-requests/[id]/complete/route.ts` (new POST endpoint)

**Implementation**:
1. Create POST `/api/data-requests/bulk` handler:
   - Validate input (project, contact, fields array)
   - Check for existing active requests (same project + data point, regardless of contact) → Set `revoked_at` on older records
   - Create new DataRequest records
   - Return created records with relations

2. Enhance GET `/api/projects/[id]/data-requests`:
   - Query Prisma with filters (status, field, contact)
   - Include contact + dataPoint relations
   - Order by requestedAt DESC

3. Create POST `/api/data-requests/[id]/complete`:
   - Update `completedAt` timestamp
   - Validate ownership

**Testing**:
- Send real request → Check database
- Revoke test: Request field A from Contact 1 → Request field A from Contact 2 → Verify Contact 1 request has `revoked_at`
- Complete request → Verify timestamp + badge updates

---

## Phase 7: Dedicated Data Requests Page (1 hour)

**Goal**: Centralized view of all requests

**Files to create**:
- `src/app/projects/[id]/data-requests/page.tsx`
- `src/app/projects/[id]/data-requests/data-requests-client.tsx`

**Implementation**:
1. Create table showing all requests with columns: Field, Contact, Status, Requested Date
2. Add filters: Status (All/Pending/Completed), Contact (dropdown)
3. Add bulk actions: "Mark Selected Complete", "Resend All Pending"
4. Add link in project sidebar

**Testing**:
- Navigate to page → See all requests
- Apply filters → Verify results
- Select multiple → Mark complete → Verify updates

---

## Estimated Total Time

- Phase 1: 30 min
- Phase 2: 20 min
- Phase 3: 45 min
- Phase 4: 30 min
- Phase 5: 1 hour
- Phase 6: 1.5 hours
- Phase 7: 1 hour

**Total: ~5 hours**

---

## Current Implementation Status

✅ **Completed**:
- Placeholder system (`{{requester_signature}}`, `{{field_display_name}}`, etc.)
- Basic RequestDataModal with single-field support
- Mailto template editor with preview
- Project owner name fetching via API

⏳ **In Progress**: None

❌ **Not Started**: All phases above

---

## Notes

- Each phase can be tested immediately after implementation
- Phases 1-3 provide the most user-visible value
- Phase 6 can be split into sub-phases (POST bulk → GET list → POST complete)
- Consider adding loading states and error handling in each phase
- Test revoke mechanism thoroughly in Phase 6

---

## Related Documentation

- [Requirements v0.0.1.md](./Requirements%20v0.0.1.md) - §3.5 Data Requests
- [API_REFERENCE.md](./API_REFERENCE.md) - Data Requests endpoints
- [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md) - DataPointRow component spec
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Granular task breakdown
- [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) - Known limitations
