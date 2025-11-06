# Next Steps: Data Request Features Implementation

**Status**: Phase 7 in Progress  
**Last Updated**: 2025-11-06

## Overview

This document outlines the implementation plan for completing the data request features. Each phase is designed to be small, testable, and incrementally valuable.

### Decisions & Clarifications
- Phase 1 creates a temporary `POST /api/data-requests/bulk` handler that just echoes the payload; Phase 6 will replace it with the real Prisma logic.
- Request status is derived on the fly from timestamps (`revoked_at` → revoked, `completed_at` → completed, otherwise pending).
- When a field is re-requested for the same project, any previous active request for that field (different contact) gets `revoked_at` set.

---

## ✅ Phase 1: Confirmation Dialog (complete)

**Outcome**: Post-mailto confirmation flow ships in `RequestDataModal` and calls the real bulk endpoint.

**Files to modify**:
- `src/components/request-data-modal.tsx`

**Notes**:
- Confirmation dialog is live with "Yes/No/Back" actions.
- "Yes" now hits the production `/api/data-requests/bulk` endpoint (see Phase 6).
- Modal resets cleanly after logging requests.

---

## ✅ Phase 2: Data Requests API (complete)

**Outcome**: `/api/projects/[id]/data-requests` returns real Prisma data with status filters and sorting.

**Notes**:
- GET handler ships with Prisma integration, contact joins, status/ordering logic.
- Supports `status`, `contact`, and `sort` query params.

---

## ✅ Phase 3: Dataset Table Integration (complete)

**Outcome**: Dataset table consumes live request summaries (count/status/contacts) and exposes bulk actions.

- `src/components/dataset-table.tsx`
- `src/app/projects/[id]/dataset/dataset-page-client.tsx`

**Notes**:
- Row-level selection, request summaries, and modal hand-off are wired.
- Dedicated badge UI is deferred; summaries live in the table for now.

---

## ✅ Phase 4: Contact Selector Dropdown (complete)

**Outcome**: Request modal uses a searchable combobox with automatic email/name fill.

**Files to modify**:
- `src/components/request-data-modal.tsx`

**Implementation**:
1. Replace radio buttons with shadcn Select or Combobox
2. Show contact name + email in options
3. Add search/filter capability
4. Maintain same validation logic

**Testing**: Open modal → See dropdown → Search for contact → Select → Preview updates

---

## ✅ Phase 5: Multi-field Support (complete)

**Outcome**: Checkbox selection and modal now handle multi-field requests end-to-end.

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

## ✅ Phase 6: Real API Implementation (complete)

**Goal**: Finish Prisma-backed CRUD flows and management endpoints

**Files to modify**:
- `src/app/api/projects/[id]/data-requests/route.ts` (enhance GET)
- `src/app/api/data-requests/bulk/route.ts` (new POST endpoint)
- `src/app/api/data-requests/[id]/complete/route.ts` (new POST endpoint)
- `src/app/api/data-requests/[id]/revoke/route.ts` (new POST endpoint)

**Implementation**:
✅ Bulk creation + automatic revocation shipped.  
✅ GET endpoint upgraded with filters/sorting.  
✅ `POST /api/data-requests/[id]/complete` marks requests done, validates optional timestamp, and returns serialized payload.  
✅ `POST /api/data-requests/[id]/revoke` records manual revocations with idempotent safeguards.

**Testing targets**:
- Send bulk request → verify DB writes and automatic revocation.
- Manual revoke endpoint → request transitions to `revoked`.
- Manual complete endpoint → request transitions to `completed`.

---

## 🚧 Phase 7: Dedicated Data Requests Page (in progress)

**Goal**: Centralized view of all requests

**Initial delivery (shipped)**:
- New route at `app/projects/[id]/data-requests/page.tsx` with client component wiring.
- Live table showing Field, Contact, Status, Requested/Completed/Revoked timestamps, and deadlines.
- Status pills + filters (All/Pending/Completed/Revoked) and contact dropdown filtering.
- Bulk action toolbar replacing row buttons: resend (opens RequestDataModal with contact guardrails), mark complete, revoke, and clear selection.
- Shared service layer + caching (`src/lib/data-requests/service.ts`, `src/lib/cache.ts`) backing all endpoints.
- Empty-state messaging and manual refresh control.

**Still outstanding**:
- Column sorting (requested_at/deadline/field).
- Surface active badge summaries back into dataset/report tables once reminders UI exists.
- Close the loop with Phase 2b of `docs/Loading perfomance optimization plan.md`: payload instrumentation now ships (`ServerTimingTracker` + hydration logs). Baselines captured on 2025-11-06 — dataset page (176 KB raw / 25.9 KB gzip, DOMContentLoaded ≈5.6 s) and data-requests page (1.01 MB raw / 35.7 KB gzip, DOMContentLoaded ≈9.2 s). `NEXT_PUBLIC_LAZY_DATA_REQUESTS` can now disable SSR hydration for the table; flip it on in staging, profile the client fetch, and then decide whether further trimming (chunking/virtualization) is required.

**Testing ideas**:
- Navigate to `/projects/:id/data-requests` → verify summaries load.
- Filter by status/contact → ensure rows adjust without reload.
- Trigger bulk complete/revoke → observe badge + timestamp updates.
- Resend via modal → confirm `/api/data-requests/bulk` logs new entry.

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

- [Loading perfomance optimization plan.md](./Loading%20perfomance%20optimization%20plan.md) - Phase breakdown for SSR payload vs optimistic UX work
- [Requirements v0.0.1.md](./Requirements%20v0.0.1.md) - §3.5 Data Requests
- [API_REFERENCE.md](./API_REFERENCE.md) - Data Requests endpoints
- [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md) - DataPointRow component spec
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Granular task breakdown
- [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) - Known limitations
