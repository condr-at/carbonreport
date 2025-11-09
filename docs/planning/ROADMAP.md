# Roadmap: Data Request Features Implementation

**Status**: Phase 7 in Progress  
**Last Updated**: 2025-11-07

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
- Dedicated badge UI is deferred; rely on the textual "Responsible" summary in the table for now.

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
- Surface active "Responsible" summaries back into dataset/report tables once reminders UI exists. _Automated test_: extend dataset table integration coverage to assert summary badge rendering after mocked bulk request.

**Testing ideas**:
- Navigate to `/projects/:id/data-requests` → verify summaries load.
- Filter by status/contact → ensure rows adjust without reload.
- Trigger bulk complete/revoke → observe summary + timestamp updates.
- Resend via modal → confirm `/api/data-requests/bulk` logs new entry.

---

## Current Implementation Status

✅ **Completed**:
- Phases 1–6 (confirmation dialog through API hardening)
- Data-requests page initial delivery (filters, bulk toolbar, lazy hydration, cache integration)
- Instrumentation baseline for dataset/data-requests pages with `x-server-timing`

⏳ **In Progress**:
- Phase 7 polish: table sorting, metrics check-ins, and QA for bulk actions

🅿️ **Deferred / Post-MVP**:
- Column sorting (requested_at/deadline/field). _Automated test_: add end-to-end table sorting check (e.g., Playwright) verifying persisted order.
- Phase 2b follow-through from `docs/Loading perfomance optimization plan.md`: instrumentation now targets the custom `x-server-timing` header. ✅ Environment variable already added in Vercel, but no improvement yet — needs deeper investigation. Track once we have capacity for perf tooling.
- Reminder endpoint + follow-up UX when contact nudges are scoped.
- Dataset/report "Responsible" summary refresh until reminders/UI contract lands.

---

## Notes

- Each phase can be tested immediately after implementation
- Phases 1-3 provide the most user-visible value
- Phase 6 can be split into sub-phases (POST bulk → GET list → POST complete)
- Consider adding loading states and error handling in each phase
- Test revoke mechanism thoroughly in Phase 6

---

## Related Documentation

- [Loading perfomance optimization plan.md](../archive/Loading%20perfomance%20optimization%20plan.md) - Phase breakdown for SSR payload vs optimistic UX work
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System-wide context for data requests
- [API_REFERENCE.md](../API_REFERENCE.md) - Data Requests endpoints
- [UX_GUIDE.md](../UX_GUIDE.md) - DataPointRow component spec
- [planning/BACKLOG.md](./BACKLOG.md) - Granular task breakdown
- [TECHNICAL_DEBT.md](../TECHNICAL_DEBT.md) - Pointer to active debt items

---

## Post-MVP Themes (High Level)

- **Organizations & Access** — introduce workspaces with scoped membership and roles.
- **Billing & Compliance** — evaluate enterprise-friendly billing/compliance model (likely fixed plans vs usage-based).
- **Automated Data Extraction** — populate fields via uploaded documents (OCR/LLM pipeline with human QA).
- **Data Collection Agents** — automation that sends follow-ups and negotiates data collection on behalf of users (will require delegated email access).
