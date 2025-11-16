# Project Backlog

_Last updated: 2025-11-16_

This backlog captures the remaining work items that were previously tracked in `IMPLEMENTATION_CHECKLIST.md`. Items are grouped by theme and prioritised roughly by impact. Move completed items to version control history or note them in `DEVELOPMENT.md`.

---

## � PRODUCTION BLOCKERS (Critical Priority)

### **Test Coverage** 
**Status**: 🔴 Critical gap — only 3 test files exist

**Impact**: Cannot safely deploy to production without automated coverage of multi-org flows.

**Tasks**:
- Unit tests for guards and limits:
  - AC: `assertWithinLimit` covers project/editor/verifier scenarios with correct error codes.
  - AC: `assertOrgMembership` validates role hierarchy and returns correct errors.
  - AC: `getOrganizationUsage` returns accurate counts for all resource types.
  - AC: `computeProjectRetention` correctly calculates days remaining and expiry.
  - DoD: Test coverage >80% for `src/lib/server-utils.ts`, `src/lib/projects/service.ts`.

- Integration tests for multi-org core flows:
  - AC: Create org → auto plan=free, owner membership created, limits returned.
  - AC: Invite editor on Free plan → 409 SEAT_LIMIT_EXCEEDED.
  - AC: Delete org → status=DELETED, all projects soft-deleted with cascade.
  - AC: Restore project when at limit → 409 PLAN_LIMIT_EXCEEDED with structured details.
  - AC: Restore project after 30 days → 409 RETENTION_EXPIRED.
  - AC: Accept membership → seat count incremented, invite_status=ACCEPTED.
  - DoD: Integration test suite runs in CI; covers all error codes.

- E2E tests for user-facing flows:
  - AC: Switcher changes active org → context updates, navigation reloads.
  - AC: Expiry warning shows when plan_valid_until <= 14 days.
  - AC: Dataset VERSION_CONFLICT → refetch triggered, user notification shown.
  - DoD: E2E suite covers critical paths; runs on pre-deploy.

**Timeline**: 1-2 days

---

## 🟡 UI Polish (High Priority)

---

## 🟡 UI Polish (High Priority)

### **Expiry Warning in Switcher**
- Add visual indicator (badge/icon) when `plan_valid_until <= NOW() + 14 days`.
- AC: Badge shows "Expires in X days" for Pro Beta orgs.
- DoD: Implemented in `src/components/layouts/main-sidebar.tsx`.

### **Project Restore Error Handling**
- Enhance restore flow to show actionable error when PLAN_LIMIT_EXCEEDED.
- AC: Error message includes current/limit, suggests archiving other projects or upgrade link.
- DoD: Implemented in `src/app/projects/page.tsx` mutation error handler.

### **Deleted Projects Retention Countdown**
- Show retention countdown in project list for deleted projects.
- AC: Badge displays "Deleted X days ago • Expires in Y days".
- DoD: UI updated in projects list component.

---

## 🟩 Completed (Recent)

- ✅ **Dataset optimistic locking in UI** — VERSION_CONFLICT handling with refetch + user notification.
- ✅ **Organization Settings UI** — All tabs (Profile, Members, Usage, Danger Zone) implemented.
- ✅ **Organization Switcher** — Implemented with loading/error/empty states, plan pill, usage counter.
- ✅ **Projects API lifecycle** — Status transitions, soft-delete, restore with limit checks.
- ✅ **Dataset API** — Full CRUD with optimistic locking (datasetVersion).
- ✅ **Uploads API** — Signed URL generation, MIME/size validation, asset tracking.
- ✅ **Server guards** — assertOrgMembership, assertWithinLimit, getPlan, getOrganizationUsage.
- ✅ **Feature flags** — verifierRoleEnabled, billingUiEnabled, approvalsEnabled in config.
- ✅ **Error format consistency** — All API endpoints use unified { error, code, details } format.

---

## 🟦 Completed (Archive)

- **Dataset optimistic locking in UI** (`app/projects/[id]/dataset/page.tsx`)
  - ✅ Send `datasetVersion` with save mutations.
  - ✅ Handle `409 Conflict` by refreshing + surfacing messaging.

---

## 🟧 API & Services

- `POST /api/projects/[id]/duplicate`
  - Clone project, reset `datasetVersion`, copy `mailtoTemplate`.
- `POST /api/data-requests/remind`
  - Implement reminder flow (contract defined, route missing).

---

## 🟨 Frontend Experience

- **Data Requests Page** (`app/projects/[id]/data-requests/page.tsx`)
  - ➡️ Moved to Post-MVP: sorting controls + e2e coverage, bulk toolbar polish (resend/change/close).
- **Requests (Global)**
  - Ship a top-level "Requests" page in the sidebar: list all project requests with filters (project, status, deadline) and quick actions (resend, reassign, complete, revoke).
- **Contacts Page**
  - Create table of Contacts in the menu page.
  - Create contact detail page (`app/contacts/[id]/page.tsx`) with a "Requests" tab showing history (requested/revoked/completed timestamps) sourced from the global store.
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

---

## 📚 Epics — Multi‑Org (без Account) & Plans

### Epic: Schema & Migrations
**Description**: Ввести таблицы/enum/индексы для multi‑org, статусы проектов, assets.

Tasks:
- Create tables and enums per `docs→ARCHITECTURE.md`.
  - AC: все таблицы существуют; индексы созданы; миграции применяются на чистой БД.
  - DoD: миграции в репозитории; проверка `npm run db:migrate` проходит; документировано в `DEVELOPMENT.md`.

### Epic: Org Settings & Switcher
**Description**: Настройки организации и переключатель в сайдбаре.

Tasks:
- Implement Organization Switcher UI.
  - AC: логотип/инициалы, имя, план, `X / limit`; empty/loading/error.
  - DoD: `UX_GUIDE.md` обновлён; ручной тест сценариев.
- Settings Profile/Members/Usage/Danger tabs.
  - AC: формы валидируются; PATCH/GET/DELETE/usage задокументированы.
  - DoD: unit тесты валидаторов; `API_REFERENCE.md` обновлён.

### Epic: Memberships & Roles
**Description**: Инвайты/роли/лимиты мест.

Tasks:
- Invite flow with seat checks.
  - AC: добавление EDITOR при исчерпанных местах → `409 SEAT_LIMIT_EXCEEDED`.
  - DoD: unit тесты guard’ов; спецификация в `API_REFERENCE.md`.
- Role change guard.
  - AC: смена на EDITOR проверяет лимит; OWNER immutable.
  - DoD: integration тест.

### Epic: Project Status Lifecycle
**Description**: Переходы статусов, soft-delete и restore.

Tasks:
- PATCH status endpoint.
  - AC: `reported` делает read-only; `active` ограничивается лимитом.
  - DoD: интеграционный тест.
- DELETE project (soft).
  - AC: возврат retention_expires_at.
  - DoD: тест восстановление → успех.
- POST restore.
  - AC: 409 `PLAN_LIMIT_EXCEEDED` и 409 `RETENTION_EXPIRED` случаи.
  - DoD: e2e сценарий.

### Epic: Uploads & Assets
Tasks:
- Signed URL endpoint с валидацией.
  - AC: >512KB или неподдерживаемый MIME → 413/415.
  - DoD: тест успешной загрузки + сохранение asset_id.

### Epic: Usage & Limits
Tasks:
- Usage endpoint.
  - AC: возвращает usage + limits + plan_valid_until.
  - DoD: кэш стратегия описана.
- Snapshots job.
  - AC: создаёт запись; несколько запусков — новые строки.
  - DoD: подтверждено просмотром в БД.

### Epic: API Contracts & Errors
Tasks:
- Unified error envelope.
  - AC: ответы содержат `error` и `code`.
  - DoD: таблица кодов в `API_REFERENCE.md`.

### Epic: Billing Preparation
Tasks:
- Billing playbook.
  - AC: описаны события планов, expiry downgrade.
  - DoD: ссылка в README.

---

## 📊 Implementation Status (as of 2025-11-16)

**Overall Readiness**: 🟡 **85% Complete**

### By Epic:
- ✅ Schema & Migrations: COMPLETE
- ✅ Server Guards & Utilities: COMPLETE  
- ✅ Organizations API: COMPLETE
- ✅ Projects API (Lifecycle): COMPLETE
- ✅ Dataset API with Optimistic Locking: COMPLETE
- ✅ Uploads & Assets: COMPLETE
- ✅ Org Settings & Switcher: COMPLETE
- ✅ Memberships & Roles: COMPLETE
- ✅ Usage & Limits: COMPLETE
- ✅ API Contracts & Errors: COMPLETE
- ✅ Documentation: COMPLETE
- 🟡 UI Polish: 90% (minor gaps: expiry warnings, retention countdown)
- 🔴 Testing & Quality: 15% (CRITICAL GAP - production blocker)

### Production Blockers:
1. 🔴 **Test Coverage** — Only 3 test files exist; need integration/E2E for multi-org flows
2. 🟡 **UI Polish** — Expiry warnings, limit exceeded UX, retention countdown
3. 🔴 **Authentication** — Dev stub needs replacement with real JWT middleware

### Ready for Staging: ✅ YES
- All backend APIs implemented and working
- Database schema complete with proper indices
- Error handling unified across all endpoints
- UI functional for core workflows

### Ready for Production: ❌ NO
- Critical test coverage gap (integration/E2E)
- Authentication still using dev stub
- Minor UX polish needed

### Estimated Time to Production-Ready:
- **Testing**: 1-2 days (Priority 1)
- **UI Polish**: ~4 hours (Priority 2)
- **Authentication**: TBD (requires scoping)

Total: ~2-3 days excluding authentication work

