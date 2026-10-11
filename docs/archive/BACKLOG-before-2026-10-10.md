> Историческая копия перед ревизией 2026-10-10. Сохранена для исходных критериев приёмки и решений, включая незакоммиченные изменения. Статусы, проценты и сроки ниже устарели; это не рабочая очередь. Текущий план: [BACKLOG](../planning/BACKLOG.md) и [ROADMAP](../planning/ROADMAP.md).

# Project Backlog

_Last updated: 2026-06-16_

This backlog captures the remaining work items that were previously tracked in `IMPLEMENTATION_CHECKLIST.md`. Items are grouped by theme and prioritised roughly by impact. Move completed items to version control history or note them in `DEVELOPMENT.md`.

---

## Production Blockers

### Landing Freeze
**Status**: 🟡 Intentional constraint — do not touch landing until the endgame polish phase.

**Reason**: avoid spending cycles on messaging and marketing surfaces before the in-product experience, verification confidence, and workspace proof-of-value are stable.

**Rule**:
- do not iterate on landing copy, layout, or sections during active core-product development;
- only reopen landing after onboarding, overview, and verification priorities are in better shape;
- if a landing change becomes necessary to unblock another task, treat it as an exception and document why.

### Test Coverage
**Status**: 🟡 In progress — local sanity and DB-backed integration paths are now reproducible, but E2E and broader production-confidence coverage are still insufficient

**Impact**: Cannot safely deploy to production without stronger automated coverage of multi-org flows and a reproducible test environment.

**Environment status**:
- Local Postgres dev/test contour is prepared and validated in repo (`.env.local.example`, `.env.test.local.example`, `db:push:local`, `db:seed:local`, `test:integration:local`).
- Supabase is no longer the only intended DB-backed verification target.

**Tasks**:
- Unit tests for guards and limits:
  - AC: `assertWithinLimit` covers project/editor/verifier scenarios with correct error codes.
  - AC: `assertOrgMembership` validates role hierarchy and returns correct errors.
  - AC: `getOrganizationUsage` returns accurate counts for all resource types.
  - AC: `computeProjectRetention` correctly calculates days remaining and expiry.
  - Status: mostly covered in `src/__tests__/lib/server-utils.test.ts` and project service tests.
  - Remaining: measure/raise effective coverage where still thin.
  - DoD: Test coverage >80% for `src/lib/server-utils.ts`, `src/lib/projects/service.ts`.

- Integration tests for multi-org core flows:
  - AC: Create org → auto plan=free, owner membership created, limits returned.
  - AC: Invite editor on Free plan → 409 SEAT_LIMIT_EXCEEDED.
  - AC: Delete org → status=DELETED, all projects soft-deleted with cascade.
  - AC: Restore project when at limit → 409 PLAN_LIMIT_EXCEEDED with structured details.
  - AC: Restore project after 30 days → 410 RETENTION_EXPIRED.
  - AC: Accept membership → seat count incremented, invite_status=ACCEPTED.
  - Status: covered on the local Postgres contour, including route-level contract assertions for the critical error paths above.
  - Remaining: wire this suite into CI and expand beyond the current critical-path set.
  - DoD: Integration test suite runs in CI; covers all error codes.

- E2E tests for user-facing flows:
  - AC: Switcher changes active org → context updates, navigation reloads.
  - AC: Expiry warning shows when plan_valid_until <= 14 days.
  - AC: Dataset VERSION_CONFLICT → refetch triggered, user notification shown.
  - DoD: E2E suite covers critical paths; runs on pre-deploy.

**Timeline**: 1-2 days

---

### Authentication Rollout
**Status**: 🟡 Mostly implemented and sanity-verified — rollout is no longer the main blocker, but a few contract/flow checks remain.

**Objective**: Complete and harden the production-ready email/password flow so dashboard pages, API routes, middleware, email verification, and password flows are consistently documented and verified.

**Phases (4-8h each)**:
1. **Phase 1 — Verify existing auth baseline**
  - Confirm middleware behavior for protected pages and APIs.
  - Confirm `getCurrentUser()` resolution from request context/cookies.
  - Update stale docs that still describe auth as a dev stub.
  - Status: done.
  - DoD: Source-of-truth docs no longer contradict implementation on auth basics.
2. **Phase 2 — Core auth hardening**
  - Validate `/api/auth/register`, `/login`, `/logout`, `/refresh` flows end-to-end.
  - Add or improve unit/integration coverage for happy path + invalid credentials.
  - Status: register/login/logout covered; refresh handler still not route-tested.
  - DoD: Core auth flows are verified by tests, not just by code inspection.
3. **Phase 3 — Email Verification Flow**
  - `/api/auth/verify-email/:token` + `/api/auth/resend-verification` using Resend templates.
  - Stateless verification tokens tied to `emailVerified` flag.
  - `/verify-email` page with resend CTA + success/error states.
  - Status: API behavior sanity-covered; UI/manual flow still worth one integrated pass.
  - DoD: Clicking email link flips `emailVerified=true`, middleware respects state.
4. **Phase 4 — Password Reset Flow** (Should-have, 4h)
  - `/api/auth/forgot-password` + `/api/auth/reset-password/:token` endpoints.
  - `/forgot-password` + `/reset-password` pages with form + validation.
  - Email template for password reset, tokens scoped to password hash.
  - Status: forgot-password API sanity-covered; reset-password contract still not verified.
  - DoD: Reset link updates password, invalid/expired links handled cleanly.

**Dependencies**: Env vars (`JWT_SECRET`, expiry values, Resend API key) already provisioned in `vercel.env.template`.

**Timeline**: ~1-2 days for hardening/verification, excluding email delivery setup issues.

---

## 🟡 UI Polish (High Priority)

---

## 🟡 UI Polish (High Priority)

### Product-First Project Creation Flow
**Status**: ✅ Completed
- Make product projects the default recommended path in `/projects/new`.
- Keep corporate mode available behind progressive disclosure / advanced option.
- AC: first-time users see one obvious primary path; advanced users can still reveal corporate reporting.
- DoD: onboarding no longer presents corporate and product paths as equal defaults.

### Project Overview Real-State Pass
**Status**: ✅ Completed first pass
- Remove authoritative-looking placeholder roadmap/activity widgets from core overview.
- Derive readiness, report completion, data requests, and missing-state messaging from actual project data.
- Remaining: improve explicit ownership and "what next" guidance.

### Project Overview Actionability
**Status**: ✅ Completed first pass
- Surface the primary next action from real project state.
- Show what is missing, whether it is internal or external, and who currently owes the work.
- Provide direct navigation from primary action and missing-work rows to related project surfaces.
- AC: pending data requests identify external contacts as owners.
- AC: incomplete roadmap/report/dataset gaps identify internal project owner or team as owner.
- AC: pending requests, dataset gaps, and report gaps expose direct links to the relevant workspace page.
- AC: completed/ready states do not invent missing work.
- DoD: actionability logic is covered by unit tests and wired into `src/app/projects/[id]/page.tsx`.
- Remaining: validate the UX with seeded/demo projects and browser-level E2E.

### **Expiry Warning in Switcher**
**Status**: ✅ Completed first pass
- Add visual indicator (badge/icon) when `plan_valid_until <= NOW() + 14 days`.
- AC: Badge shows "Expires in X days" for Pro Beta orgs.
- DoD: Implemented in `src/components/layouts/main-sidebar.tsx`.

### **Project Restore Error Handling**
**Status**: ✅ Completed first pass
- Enhance restore flow to show actionable error when PLAN_LIMIT_EXCEEDED.
- AC: Error message includes current/limit, suggests archiving other projects or upgrade link.
- DoD: Implemented in `src/app/projects/page.tsx` mutation error handler.

### **Deleted Projects Retention Countdown**
**Status**: ✅ Completed first pass
- Show retention countdown in project list for deleted projects.
- AC: Badge displays "Deleted X days ago • Expires in Y days".
- DoD: UI updated in projects list component.

### **Regulatory Version & Legal Disclaimers**
- Add visible versioning for regulatory standards used in reports.
  - AC: Each regulatory report template (CSRD/ESRS, SEC_CLIMATE, SFDR, CBAM, EU_ETS, etc.) shows `Standard version last reviewed: YYYY‑MM` in UI (and PDF if applicable).
  - DoD: Version metadata wired from config/code, not hardcoded per template.
- Add unobtrusive, dismissible legal disclaimer banner in app layout.
  - AC: Banner text clarifies that the product is a data/automation tool and **not** legal advice; appears on first visits and can be dismissed per user.
  - DoD: Dismissal state persisted; copy reviewed and stored in a single config.

---

## 🟩 Completed (Recent)

- ✅ **Dataset optimistic locking in UI** — VERSION_CONFLICT handling with refetch + user notification.
- ✅ **Organization Settings UI** — All tabs (Profile, Members, Usage, Danger Zone) implemented.
- ✅ **Organization Switcher** — Implemented with loading/error/empty states, plan pill, usage counter.
- ✅ **Projects API lifecycle** — Status transitions, soft-delete, restore with limit checks.
- ✅ **Projects list lifecycle UX** — Deleted filter, retention countdown, restore suggestions, and expiry warning first pass.
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
  - ✅ Implemented as the product-facing reminder endpoint.
  - AC: updates `requested_at`, keeps requests pending, returns serialized request rows.
  - AC: requires authenticated user with editor-or-higher access to every request's project organization.
- `POST /api/data-requests/reassign`
  - ✅ Implemented as the project-level change-contact endpoint.
  - AC: only pending requests can be reassigned.
  - AC: revokes selected pending requests and creates new pending requests for the target contact.
  - AC: preserves data point, item, field label, deadline, and external-access metadata.
  - AC: requires authenticated user with editor-or-higher access to every request's project organization.

---

## 🟨 Frontend Experience

- **Data Requests Page** (`app/projects/[id]/data-requests/page.tsx`)
  - ✅ First-pass bulk toolbar now covers complete, revoke, remind, and change contact for pending requests.
  - ➡️ Moved to Post-MVP: sorting controls + e2e coverage and deeper toolbar polish.
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
 - Legal & policy docs: draft and publish Terms of Use / Privacy Policy / Data Processing terms including a clear statement that reports are generated on a best-effort basis and do not constitute legal advice.

---

## 📦 Nice-to-Have / Future

- Expand data-request status enums to include `received`, `declined`.
- Style deadline badges for overdue highlighting.
- Expand reassign UX to the future global Requests page.
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
