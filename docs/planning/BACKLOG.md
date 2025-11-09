# Project Backlog

_Last updated: 2025-11-09_

This backlog captures the remaining work items that were previously tracked in `IMPLEMENTATION_CHECKLIST.md`. Items are grouped by theme and prioritised roughly by impact. Move completed items to version control history or note them in `DEVELOPMENT.md`.

---

## 🟥 Blockers / High Priority

- **Dataset optimistic locking in UI** (`app/projects/[id]/dataset/page.tsx`)
  - Send `datasetVersion` with save mutations.
  - Handle `409 Conflict` by refreshing + surfacing messaging.
- **Authentication hardening** (see `DEVELOPMENT.md`).
- **Test coverage kick-off**
  - Unit tests for dataset + mailto helpers.
  - Integration smoke tests for project creation and data requests.

---

## 🟧 API & Services

- `PATCH /api/projects/[id]/dataset`
  - Switch implementation to `upsertDataPoint` helper for correctness.
- `POST /api/projects/[id]/duplicate`
  - Clone project, reset `datasetVersion`, copy `mailtoTemplate`.
- `POST /api/projects/[id]/reports`
  - Add report type with `metadata: null` default.
- `PUT /api/projects/[id]/reports/[reportId]/metadata`
  - Persist report-specific settings in `Report.metadata`.
- `POST /api/data-requests/remind`
  - Implement reminder flow (contract defined, route missing).

---

## 🟨 Frontend Experience

- **Dataset & Report Tables**
  - Display active "Responsible" summaries using data-request API. _Add integration test_ validating badge rendering after mocked bulk request.
  - Provide inline reassignment with warning tooltip.
- **Data Requests Page** (`app/projects/[id]/data-requests/page.tsx`)
  - Add sorting (requested_at, deadline, field). _Post-MVP_. _Add end-to-end test_ (e.g., Playwright) to verify ordering persists via query params.
  - Prepare bulk toolbar for resend/change contact/close actions.
- **Contact Detail Page** (`app/contacts/[id]/page.tsx`)
  - Introduce "Requests" tab with table + quick actions.
  - Show request history (requested/revoked/completed).
- **Mailto Template Editor**
  - Validate allowed placeholders.
  - Surface inline error feedback for invalid tokens.

---

## 🟩 Tooling & Documentation

- Add JSDoc to newly introduced helpers (dataset, data-requests, mailto).
- Automate HAR capture and regression alerts for SSR payload metrics. _Note_: `NEXT_PUBLIC_LAZY_DATA_REQUESTS` env var already provisioned on Vercel; no perf improvement yet — further analysis required.
- Define staging deployment checklist (backup, rollback, smoke tests).

---

## 📦 Nice-to-Have / Future

- Expand data-request status enums to include `received`, `declined`.
- Style deadline badges for overdue highlighting.
- Outline bulk reminder UX (disabled CTA + tooltip until endpoint ships).
- Plan for exports/reporting needs of operations stakeholders.

Track progress by updating this file or referencing linked issues / tickets in your PM tool of choice.
