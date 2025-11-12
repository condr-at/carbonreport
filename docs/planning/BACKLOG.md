# Project Backlog

_Last updated: 2025-11-12_

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
  - ✅ Responsible column now displays the latest pending contact only (single name, fallback "—") with integration test coverage enforcing the invariant.
  - 🚫 Inline reassignment control — решение признано избыточным: повторный запрос через модалку уже покрывает сценарий.
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
