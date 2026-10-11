# Documentation Index

_Last updated: 2026-10-11_

This folder contains the working documentation for the Carbon Report Platform. The layout was refreshed to reduce duplication and make it easier to find the right reference quickly.

---

## Current Status

**Product maturity**: локальный прототип, проверенный в перечисленных сценариях аудита
**Production readiness**: не подтверждена; ограниченный внешний пилот требует законченного результата и проверки используемых функций/среды

👉 **Quick Status**: See [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md)
📋 **Active Plan**: [`planning/BACKLOG.md`](./planning/BACKLOG.md) — единственная очередь задач и статусов; [`planning/ROADMAP.md`](./planning/ROADMAP.md) — порядок и условия перехода

**Основные открытые вопросы**:
- Один принимаемый покупателем результат и путь к его получению
- Автоматические браузерные регрессии и CI; оставшиеся auth-контракты и внешние интеграции
- Понятный первый запуск, необходимые поля и область организации
- Перенос проверенных требований в правила и один законченный экспорт; [образцы всех активных типов](./report-reference/CATALOG.md) собраны отдельно от реализации

Свежие доказательства: [браузерный аудит 2026-10-10](./qa/browser-audit-2026-10-10/REPORT.md). Предложения: [улучшения флоу](./qa/browser-audit-2026-10-10/FLOW_IMPROVEMENTS.md). Коммерческие гипотезы и ограниченный эксперимент: [бизнес-планирование](./business-planning/README.md).

[`PRODUCT_READINESS_REVIEW.md`](./PRODUCT_READINESS_REVIEW.md) сохраняет продуктовый контекст предыдущей оценки; актуальные наблюдения и задачи находятся по ссылкам выше.

Current sequencing rule:
- landing is frozen until the final polish phase; active work should stay in product surfaces and verification.

---

## 🧭 Documentation Structure

- `IMPLEMENTATION_STATUS.md` — Quick implementation snapshot and current blockers
- `planning/BACKLOG.md` — Actionable tasks and work queue
- `planning/ROADMAP.md` — Phase sequencing, milestones, dependencies
- `business-planning/` — коммерческие гипотезы и план проверки спроса
- `report-reference/` — реестр типов, официальные формы, опубликованные примеры и происхождение файлов
- `regulatory-requirements/` — применимость, требования, проверки и пробелы по каждому типу; модель будущего пошагового маршрута
- `qa/browser-audit-2026-10-10/` — завершённый аудит, доказательства и отдельные UX-предложения
- `archive/` — Historical deep-dives retained for context

Use the table below when you need to know "why does this file exist?" and the Backlog when you need the next concrete task.

---

## 🚀 Quick Start

### For Developers

1. **Environment & Database**
   ```bash
   npm run db:push   # Sync schema (uses DIRECT_URL)
   npm run db:seed   # Seed dataset field definitions and demo data
   npm run dev       # Start dev server
   ```
2. **Validation (after schema or template edits)**
   ```bash
   npm run templates:check  # Ensure report templates match DB field IDs
   ```
3. **Read next**: [`ARCHITECTURE.md`](./ARCHITECTURE.md) → [`DEVELOPMENT.md`](./DEVELOPMENT.md)
4. **API contracts**: [`API_REFERENCE.md`](./API_REFERENCE.md)

### For Product & UX

1. **Observed experience**: [браузерный аудит](./qa/browser-audit-2026-10-10/REPORT.md) → [предложения по флоу](./qa/browser-audit-2026-10-10/FLOW_IMPROVEMENTS.md). [`UX_GUIDE.md`](./ux/UX_GUIDE.md) — справочник, не доказательство текущего поведения.
2. **Design system**: [`DESIGN_SYSTEM.md`](./ux/DESIGN_SYSTEM.md)
3. **Next work**: [`planning/ROADMAP.md`](./planning/ROADMAP.md) → [`planning/BACKLOG.md`](./planning/BACKLOG.md); [проверка спроса](./business-planning/VALIDATION_PLAN.md)

---

## 📚 Core Documents

| File | Who | Why |
| --- | --- | --- |
| [`PRODUCT_READINESS_REVIEW.md`](./PRODUCT_READINESS_REVIEW.md) | Product, Founders, Leads | Honest human-readable assessment of product readiness, product thesis, and near-term decisions. |
| [`AGENT_PRODUCT_GUARDRAILS.md`](./AGENT_PRODUCT_GUARDRAILS.md) | Engineers, AI agents | Execution guardrails for product-facing changes: source-of-truth hierarchy, UX rules, messaging constraints, and acceptance criteria. |
| [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) | **Everyone** | Краткий снимок реализации, проверок и их ограничений |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Engineers, PMs | High-level system & data architecture (supersedes archived requirements docs). |
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Engineers | Day-to-day workflow, active technical debt, validation tooling. |
| [`API_REFERENCE.md`](./API_REFERENCE.md) | Engineers | REST endpoint definitions, request/response schemas. |
| [`DESIGN_SYSTEM.md`](./ux/DESIGN_SYSTEM.md) | Engineers, Designers | UI components, spacing, accessibility rules. |
| [`UX_GUIDE.md`](./ux/UX_GUIDE.md) | Product, Design | UX flows, layout templates, page-to-API mapping. |
| [`BILLING_PLAYBOOK.md`](./BILLING_PLAYBOOK.md) | Engineers, PMs | Эволюция биллинга: история планов, expiry, webhooks, источники usage. |
| [`planning/ROADMAP.md`](./planning/ROADMAP.md) | PMs, Leads | Phase sequencing, milestones, and dependencies. |
| [`planning/BACKLOG.md`](./planning/BACKLOG.md) | Engineers, PMs | Prioritized tasks and follow-ups feeding the roadmap phases. |
| [`business-planning/README.md`](./business-planning/README.md) | Founder, Product | Оценка заработка, сегмент и ценовые гипотезы; ссылки на план пилота |
| [`report-reference/CATALOG.md`](./report-reference/CATALOG.md) | Product, Engineers, Methodology | Все активные коды, ссылки на требования и доступные образцы; наличие шаблона не означает готовность отчёта |
| [`regulatory-requirements/README.md`](./regulatory-requirements/README.md) | Product, Engineers, Methodology | Нормативная библиотека, условия применимости и контракт будущих проверок |
| [`qa/browser-audit-2026-10-10/REPORT.md`](./qa/browser-audit-2026-10-10/REPORT.md) | Product, Engineers | Пройденные сценарии, исправленные баги, скриншоты и результаты проверок |
| [`data-points-hints (outdated).md`](./data%20points%20guide/data-points-hints%20%28outdated%29.md) | Engineers, Analysts | Исторические подсказки (outdated, legacy CamelCase); не актуальный контракт полей. |

---

## 🔍 Navigation Tips

**New to the project?**
1. Skim [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the system overview.
2. Read [`UX_GUIDE.md`](./ux/UX_GUIDE.md) to understand the product experience.
3. Check [`DEVELOPMENT.md`](./DEVELOPMENT.md) for active engineering focus areas.

**Working on datasets or templates?**
- Требования и образцы: [`report-reference/CATALOG.md`](./report-reference/CATALOG.md), [`regulatory-requirements/RULE_MODEL.md`](./regulatory-requirements/RULE_MODEL.md). Реестр кода и старые матрицы не доказывают нормативную полноту.
- Canonical definitions: `prisma/seed-data/dataset-fields.ts`
- Validation tooling: `npm run templates:check`
- Historical field guidance (outdated): [`data-points-hints (outdated).md`](./data%20points%20guide/data-points-hints%20%28outdated%29.md)
 - Data points guide & matrix: `docs/data points guide/` — план расширения полей (`data points expansion plan.md`) и матрица `datapoints-reports matrix.csv` как источник истины, какие `fieldId` где используются и реализованы.

**Implementing backend changes?**
- API specs: [`API_REFERENCE.md`](./API_REFERENCE.md)
- Technical debt / priorities: [`DEVELOPMENT.md`](./DEVELOPMENT.md#active-technical-debt)
- Backlog tasks: [`planning/BACKLOG.md`](./planning/BACKLOG.md)
- Условия следующего этапа: [`planning/ROADMAP.md`](./planning/ROADMAP.md); прежний [`IMPLEMENTATION_CHECKLIST.md`](./archive/IMPLEMENTATION_CHECKLIST.md) — исторический документ

**Building frontend features?**
- UX flows & layouts: [`UX_GUIDE.md`](./ux/UX_GUIDE.md)
- Components: [`DESIGN_SYSTEM.md`](./ux/DESIGN_SYSTEM.md)
- Data contracts: [`API_REFERENCE.md`](./API_REFERENCE.md)

---

## Terminology Consistency

Единые термины и регистры, используемые в коде и документации:

- Роли (`organization_memberships.role`): `OWNER`, `ADMIN`, `EDITOR`, `VIEWER_READONLY`, `VIEWER_VERIFIER`.
- Статусы проектов (`projects.status`): `active`, `archived`, `reported`, `deleted`.
- Статусы организаций (`organizations.status`): `active`, `deleted`, `pending_transfer`.
- Статусы инвайта (`organization_memberships.invite_status`): `pending`, `accepted`, `declined`, `revoked`.
- Коды планов (`plan_definitions.plan_code`): `free`, `pro_beta`.
- Коды ошибок API (JSON поле `code`): `PLAN_LIMIT_EXCEEDED`, `SEAT_LIMIT_EXCEEDED`, `RETENTION_EXPIRED`, `VERSION_CONFLICT`, `VALIDATION_ERROR`, `FORBIDDEN`, `NOT_FOUND`, `UPGRADE_NOT_IMPLEMENTED`.

См. также: `docs→ARCHITECTURE.md` (Enums), `docs→API_REFERENCE.md` (таблица ошибок), `docs→BILLING_PLAYBOOK.md` (планы и expiry).

---

## 🗂️ Archives & Historical Specs

The previous long-form documents are preserved for reference:

- `docs/archive/Requirements v0.0.1.md`
- `docs/archive/REPORT_TEMPLATES_ARCHITECTURE.md`
- `docs/archive/IMPLEMENTATION_CHECKLIST.md`
- `docs/archive/BACKLOG-before-2026-10-10.md` и `ROADMAP-before-2026-10-10.md` — исходные критерии и изменения до ревизии; их статусы и сроки не действуют
- `docs/archive/REFERENCE_data_points_hints.json`
- Additional planning artefacts inside `docs/archive/`

Refer to these when you need the original detail that fed into the current summaries.

---

## ✍️ Contributing to Docs

1. Update "Last updated" timestamps when making significant edits.
2. Cross-link related sections to avoid duplication.
3. For major restructures, move superseded files to `docs/archive/` instead of deleting outright.
4. Keep `ARCHITECTURE.md` and `DEVELOPMENT.md` high-level; push granular task lists to `planning/`.

Questions or suggestions? Reach out in the project channel or open an issue.
