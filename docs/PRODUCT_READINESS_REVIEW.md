# Product Readiness Review

_Last updated: 2026-06-16_

## Purpose

Этот документ предназначен для человека: product owner, founder, design lead, engineer lead.

Его задача:
- дать честную оценку текущей готовности продукта;
- зафиксировать реальное product promise;
- описать текущие разрывы между vision, UX и реализацией;
- дать ориентир, что считать production-ready, а что нет.

## Source of Truth Level

- Этот документ не является source of truth для API, схемы БД или ролей.
- Для доменной модели и архитектуры: `docs/ARCHITECTURE.md`
- Для API-контрактов: `docs/API_REFERENCE.md`
- Для UX-структуры: `docs/UX_GUIDE.md`
- Для очереди задач: `docs/planning/BACKLOG.md`

Этот документ является source of truth только для:
- оценки текущей продуктовой готовности;
- приоритетов продуктовой адаптации;
- interpretation layer между vision и implementation.

## Executive Summary

Carbon Report уже выглядит как рабочий B2B продукт ранней стадии, а не как сырой прототип.

Сильные стороны:
- есть понятная core problem framing;
- есть real multi-org architecture;
- есть project creation flow, questionnaire, dataset, requests, reports;
- есть работающий auth слой, API и domain model;
- есть сильная идея "one dataset -> many report outputs".

Слабые стороны:
- после создания проекта core value еще не раскрывается достаточно убедительно;
- product promise шире, чем текущий UX должен обещать;
- документация местами дрейфует относительно кода;
- project overview и некоторые точки workflow все еще недотянуты до production-grade product experience;
- landing и in-app messaging еще не сведены к одной product thesis.

## Readiness Score

### Product

- Core concept clarity: `8/10`
- Beachhead positioning clarity: `6/10`
- Main user flow quality: `6/10`
- Post-onboarding value realization: `5/10`
- Overall product readiness for private beta: `6.5/10`
- Overall product readiness for self-serve production launch: `4.5/10`

### Engineering

- Domain model maturity: `7.5/10`
- API/system design maturity: `7/10`
- Test/verification maturity: `5/10`
- Documentation reliability: `5/10`
- Operational confidence: `5/10`

## Current Product Thesis

### What the product should be

Carbon Report should be treated as:

`A product-level carbon reporting workspace for collecting the right data from the right people before the deadline, then exporting that dataset into required compliance or customer-facing formats.`

### What the product should not primarily be

На текущем этапе продукт не должен позиционироваться как:
- all-in-one enterprise ESG operating system;
- full legal/compliance automation suite;
- generic corporate disclosure platform first;
- LCA expert workstation first.

## Recommended Beachhead

### Primary beachhead

- Product-level projects
- CBAM
- ISO 14067 / PCF
- EPD and client-specific export as adjacent options

### Secondary capability

Corporate and broader disclosure flows можно оставлять в продукте, но не делать их primary promise в первом контакте с пользователем.

Правильный framing:
- product-first by default;
- corporate available as advanced path;
- broader disclosure catalog supported, but not foregrounded.

## Main User

Главный пользователь сейчас:
- sustainability / compliance manager;
- product carbon lead;
- export/compliance operator;
- B2B supplier-facing reporting owner.

Что ему нужно:
- быстро понять, какой тип проекта создать;
- не ошибиться с report scope;
- увидеть список обязательных данных;
- отправить запросы ответственным;
- понять readiness status проекта;
- собрать evidence и выгрузить отчет.

## Current Product Strengths

### 1. Good core job definition

Самая сильная часть продукта:

`собрать нужные данные от нужных людей к дедлайну`

Это сильнее, чем generic “generate carbon reports”, потому что именно здесь есть repeat pain, willingness to pay и operational urgency.

### 2. Good architecture for reuse

Модель `one dataset -> many templates` правильная.

Она:
- снижает дублирование;
- делает report expansion дешевле;
- поддерживает product narrative;
- создает реальную платформенную ценность.

### 3. Good strategic differentiation

Продукт выгодно отличается от:
- Excel + email chaos;
- overly broad ESG suites;
- expert-only LCA tooling.

## Main Product Risks

### 1. Promise too broad for current experience

Сейчас product vision, landing, report catalog и initial UX местами обещают больше breadth, чем текущий first-run experience может убедительно провести.

Риск:
- пользователь видит много шаблонов и режимов;
- не понимает, что для него “default happy path”;
- воспринимает продукт как сложнее, чем он должен быть.

### 2. Value gap after project creation

После создания проекта пользователь должен увидеть:
- что именно заполнять;
- что missing;
- кто owner;
- какие requests pending;
- какой report readiness status.

Если вместо этого он видит partially static workspace или слабую operational guidance, core value теряется в самый важный момент.

### 3. Documentation drift

Когда docs говорят одно, а код уже делает другое, команда начинает тратить время на reconciling reality.

Это особенно опасно для:
- новых инженеров;
- агентных изменений;
- product decisions на основе устаревших документов.

## Readiness by Area

### Positioning and Messaging

Status: `Partially ready`

Good:
- понятный pain;
- strong regulatory and B2B context;
- clear product-level thesis.

Not ready:
- landing spec, landing content and live implementation partially diverge;
- messaging still mixes beachhead with broader platform promise too early.

### Onboarding and Project Creation

Status: `Usable, but needs tightening`

Good:
- project creation path exists;
- questionnaire exists;
- report recommendation engine exists;
- manual selection exists.

Needs work:
- product path should be primary and clearer;
- corporate path should be advanced disclosure, not equal first choice;
- selection UX should explain why a report is mandatory/recommended;
- user should understand "what happens next" more explicitly.

### Core Workspace

Status: `Not yet fully convincing`

Good:
- dataset editor exists;
- requests exist;
- reports exist;
- project state exists.

Not ready:
- overview must reflect real readiness, not approximate or mock-driven values;
- "next steps" must be derived from actual project state;
- data request visibility must be obvious and trustworthy.

### Reports and Template Model

Status: `Strategically strong, operationally uneven`

Good:
- large template surface;
- user-facing metadata layer exists;
- decision engine and template system are coherent.

Needs work:
- keep template breadth without overwhelming first-time users;
- enforce stronger grouping: primary, advanced, hidden-until-needed;
- maintain consistent mapping from recommendation layer to template layer.

### Documentation and Internal Alignment

Status: `Needs cleanup now`

Needed:
- clear source-of-truth hierarchy;
- removal of stale readiness/auth claims;
- better separation between architecture, implementation snapshot, and product interpretation.

## What Must Be True Before Production

### Product conditions

- First-run flow must clearly privilege product-level beachhead path.
- Corporate flow must not confuse the primary user.
- Project overview must show real operational value, not placeholder value.
- Mandatory/recommended report logic must be trustworthy and visible.
- Landing and in-app positioning must tell the same story.

### Engineering conditions

- Test suite must be runnable in a reproducible environment.
- Auth state in docs must match actual implementation.
- Critical project lifecycle paths must be covered by tests.
- No major user-facing flow should depend on placeholder logic for core value.

## Recommended Product Decisions

### Decision 1: Keep corporate, but demote it in the default UX

Do:
- keep corporate capability available;
- reveal it via advanced option or expanded mode;
- explain that product projects are the default recommended path.

Do not:
- remove the capability entirely;
- foreground it equally with the beachhead path.

### Decision 2: Treat report breadth as catalog depth, not homepage promise

Do:
- keep large report inventory;
- surface only the most relevant reports by default;
- reveal broader catalog progressively.

Do not:
- force every new user to mentally parse the entire standards universe.

### Decision 3: Make project overview the main proof of value

The project overview should answer:
- what is incomplete;
- what blocks completion;
- who owes data;
- which reports are ready or at risk;
- what action should be taken next.

Until this works well, the product feels less differentiated than it really is.

## Recommended Near-Term Product Changes

### Active sequencing rule

Landing is frozen until the final polish phase.

Это означает:
- landing page is not part of the active implementation surface right now;
- product, onboarding, workspace, verification, and source-of-truth cleanup have priority first;
- landing/message alignment is deferred intentionally to the end, once the in-product experience is more stable.

### P0

- Product-first create-project UX
- Advanced reveal for corporate mode
- Real mandatory/recommended report labels
- Real readiness/next-step logic on project overview
- Documentation source-of-truth cleanup

### P1

- Better segmentation of report catalog
- Stronger legal/disclaimer and regulatory metadata presentation

### P2

- Landing and in-app messaging alignment after core product surfaces stabilize
- Supplier portal / reminders / deeper external collaboration
- Broader disclosure workflows as a clearer second product layer

## Acceptance Criteria for "Private Beta Ready"

The product can be considered private-beta ready when:

- a product-focused user can create a project without confusion;
- they receive sensible report recommendations;
- they can see what data is missing;
- they can request that data from others;
- they can track progress toward a real report outcome;
- the product consistently reinforces the same product thesis across landing, onboarding and workspace.

## Acceptance Criteria for "Production Ready"

The product can be considered production-ready only when:

- product value is operationally visible in the workspace;
- docs no longer contradict implementation on critical topics;
- core flows are testable and reproducible;
- report recommendation and selection logic is reliable;
- breadth no longer harms comprehension for the main user.
