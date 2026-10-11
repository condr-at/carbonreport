# Marketing Backlog

_Historical marketing hypotheses: 2025-11-28_

Текущая очередь и статусы находятся только в [BACKLOG](BACKLOG.md), включая LAND-01, PLAN-01 и PILOT-01. Перечисленные ниже цены, отзывы, сроки и обещания — прежние гипотезы, не действующий контракт лендинга. Текущий лендинг представляет ограниченный supplier review package; отзывы/логотипы клиентов и неподтверждённые тарифы не публикуются.

Этот бэклог содержит все маркетинговые задачи, сгруппированные по этапам и приоритетам. Источники: `docs/marketing/deliverables/` (05, 06, 07) и `marketing_research_plan.md`.

---

## 🔴 P0: Pre-Launch Blockers

### **MKT-001: Landing Page**
**Status**: 🔴 Not started  
**Impact**: Без лендинга невозможно собирать лиды и запускать beta outreach.

**Deliverable**: Готовая landing page с формой waitlist/beta signup.

**Acceptance Criteria**:
- [ ] Hero секция с value prop
- [ ] Problem/Solution блок
- [ ] Features overview (3-4 ключевых)
- [ ] Social proof placeholder (для будущих отзывов)
- [ ] Pricing preview (€99/€299/€599)
- [ ] Beta signup форма (email + company + role)
- [ ] Mobile responsive
- [ ] Meta tags + OG images для шаринга

**Dependencies**: Копирайт из `04_messaging_positioning.md`, pricing из `07_pricing_model.md`  
**Timeline**: 2-3 дня  
**Owner**: TBD

**Связанный документ**: `docs/planning/LANDING_PAGE_SPEC.md`

---

### **MKT-002: Beta Outreach Templates**
**Status**: 🔴 Not started  
**Impact**: Нужны готовые шаблоны для LinkedIn outreach.

**Deliverables**:
- [ ] LinkedIn connection request (3 варианта под разные персоны)
- [ ] Follow-up message #1 (после accept)
- [ ] Follow-up message #2 (если не ответили)
- [ ] Demo invite message
- [ ] Post-demo follow-up

**Source**: `06_beta_program.md` раздел 2.2-2.4

**Acceptance Criteria**:
- AC: Каждый шаблон < 300 символов (LinkedIn limit)
- AC: Персонализированные плейсхолдеры: {name}, {company}, {role}
- AC: A/B варианты для тестирования

**Timeline**: 4 часа  
**Owner**: TBD

---

### **MKT-003: Demo Script & Flow**
**Status**: 🔴 Not started  
**Impact**: Нужен структурированный демо для конверсии interest → beta signup.

**Deliverable**: 20-30 минутный demo script с discovery вопросами.

**Structure** (из `06_beta_program.md`):
1. **Discovery (5 мин)**: Вопросы о текущем процессе, боли, дедлайнах
2. **Problem recap (2 мин)**: Подтвердить понимание боли
3. **Demo (15 мин)**: Показать прототип под их use case
4. **Q&A (5 мин)**: Ответы на вопросы
5. **Next steps (3 мин)**: Beta invite или follow-up

**Acceptance Criteria**:
- [ ] Script document с talking points
- [ ] Список discovery вопросов (10-15)
- [ ] Objection handling (5-7 типичных возражений)
- [ ] Beta pitch / условия участия

**Timeline**: 4 часа  
**Owner**: TBD

---

## 🟡 P1: Beta Launch (Week 1-2)

### **MKT-004: LinkedIn Outreach Campaign**
**Status**: 🟡 Ready to start (после MKT-001, MKT-002)  
**Target**: 100-150 контактов → 30 ответов → 15 демо → 10 beta signups

**Tasks**:
- [ ] Настроить LinkedIn Sales Navigator (или обычный поиск)
- [ ] Создать search queries по персонам:
  - `"Sustainability Manager" + "manufacturing"`
  - `"Quality Manager" + "steel" OR "aluminum" OR "cement"`
  - `"CBAM" OR "carbon footprint" + company size 50-500`
  - `"LCA consultant" OR "carbon footprint consultant"`
- [ ] Составить список 150 целевых контактов
- [ ] Отправить connection requests (batch по 20-30/день)
- [ ] Follow-up flow (день 3, день 7)
- [ ] Трекинг в spreadsheet (контакт → статус → демо → signup)

**Metrics**:
- Connection accept rate: target 30%+
- Response rate: target 20%+
- Demo conversion: target 50%+

**Timeline**: Ongoing (2-4 недели)  
**Owner**: TBD

---

### **MKT-005: Reddit/LinkedIn Content**
**Status**: 🟡 Low priority  
**Impact**: Бесплатный inbound канал, но конверсия непредсказуема.

**Tasks**:
- [ ] Написать 3-5 постов для Reddit (`r/sustainability`, `r/supplychain`)
- [ ] Написать 2-3 LinkedIn поста (building in public style)
- [ ] Определить расписание публикаций

**Content Ideas**:
1. "How SMEs are preparing for CBAM 2026 deadline"
2. "Excel hell: How we collected PCF data from 30 suppliers"
3. "Building a carbon footprint tool: Week 1 learnings"

**Timeline**: 1-2 часа на пост  
**Owner**: TBD

---

## 🟢 P2: Validation & Testing (Week 2-4)

### **MKT-006: Customer Discovery Interviews**
**Status**: 🔴 Critical gap — 0 из 15 интервью проведено  
**Impact**: Все ICP/персоны/pricing — гипотезы без валидации.

**Target**: 15 интервью (10 ICP #1, 5 ICP #2)

**Tasks**:
- [ ] Подготовить interview script (из `05_hypothesis_backlog.md`)
- [ ] Записать все интервью (с разрешения)
- [ ] Транскрибировать ключевые цитаты
- [ ] Обновить персоны по результатам
- [ ] Валидировать/опровергнуть гипотезы

**Key Questions to Validate**:
1. Кто принимает решение о покупке? (CFO/COO/Owner)
2. Сколько времени сейчас тратят на подготовку отчётов?
3. Готовы ли платить €299/mo за SaaS?
4. SaaS vs one-time консалтинг preference?

**Timeline**: 2-4 недели (параллельно с beta)  
**Owner**: TBD

---

### **MKT-007: Fake Door Tests**
**Status**: 🟡 After landing page  
**Impact**: Валидация pricing и feature demand без разработки.

**Tests to Run**:

| Test | Page | What we measure |
|------|------|-----------------|
| Pricing validation | /pricing | Clicks on €99 vs €299 vs €599 |
| Integration demand | /integrations | Clicks on "Connect SAP" / "Connect ecoinvent" |
| Feature interest | /features | Clicks on "AI Data Agent" / "Supplier Portal" |

**Implementation**:
- [ ] Добавить tracking на кнопки (Plausible / Posthog)
- [ ] "Coming soon" modal при клике
- [ ] Email capture для waitlist конкретной фичи

**Timeline**: 4-8 часов после лендинга  
**Owner**: TBD

---

### **MKT-008: Lead Magnet / Smoke Test**
**Status**: 🟡 Nice to have  
**Impact**: Проверка болит ли проблема достаточно для действия.

**Options**:
1. **CBAM Excel Template** — шаблон для ручного заполнения
2. **PDF Guide** — "5 Steps to CBAM Compliance for SMEs"
3. **CN Codes Lookup Tool** — проверка попадает ли продукт под CBAM

**Distribution**:
- LinkedIn пост с CTA скачать
- Reddit thread с value-first подходом

**Metrics**:
- Downloads / clicks
- Email signups для получения

**Timeline**: 4-8 часов на создание + distribution  
**Owner**: TBD

---

## 🔵 P3: Post-Beta (Week 6-8)

### **MKT-009: Case Studies**
**Status**: ⚪ After beta success  
**Target**: 2-3 публичных кейса с цитатами

**Structure per case study**:
- Company profile (anonymized if needed)
- Challenge / situation before
- Solution / how they used Carbon Report
- Results / time saved / deadlines met
- Quote from user

**Timeline**: После завершения первых beta-проектов  
**Owner**: TBD

---

### **MKT-010: Testimonials & Social Proof**
**Status**: ⚪ After beta  
**Target**: 5-10 цитат для лендинга

**Tasks**:
- [ ] Попросить beta-участников дать отзыв
- [ ] Получить разрешение на публикацию
- [ ] Разместить на лендинге

**Timeline**: Week 6-8  
**Owner**: TBD

---

### **MKT-011: Pricing Finalization**
**Status**: ⚪ After validation  
**Impact**: Финальные цены на основе feedback и fake door tests.

**Tasks**:
- [ ] Проанализировать результаты fake door tests
- [ ] Собрать feedback по pricing из интервью
- [ ] Определить final pricing tiers
- [ ] Обновить лендинг и документацию

**Current Hypothesis** (из `07_pricing_model.md`):
- Free: €0 (1 project, 1 user)
- Starter: €99/mo (3 projects, 3 users)
- Professional: €299/mo (10 projects, 5 users)
- Business: €599/mo (30 projects, 10 users)

**Timeline**: Week 6-8  
**Owner**: TBD

---

## 📊 Metrics Dashboard

### Funnel Targets (из `06_beta_program.md`)

```
Awareness:     200 contacts
    ↓ 15%
Interest:      30 responses
    ↓ 50%
Demo:          15 demos
    ↓ 67%
Beta Signup:   10 signups
    ↓ 70%
Active Beta:   7 active users
    ↓ 50%
Success:       3-5 completed reports
```

### Key Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| LinkedIn connections sent | 150 | 0 |
| Connection accept rate | 30% | - |
| Demo calls completed | 15 | 0 |
| Beta signups | 10 | 0 |
| Active beta users | 7 | 0 |
| Completed reports | 5 | 0 |
| Customer interviews | 15 | 0 |
| NPS from beta | 40+ | - |

---

## 📅 Timeline Overview

```
Week 1:     MKT-001 (Landing) + MKT-002 (Templates) + MKT-003 (Demo Script)
Week 1-2:   MKT-004 (LinkedIn Outreach starts)
Week 2-4:   MKT-006 (Customer Discovery) + MKT-007 (Fake Door Tests)
Week 3-6:   Beta onboarding + feedback collection
Week 6-8:   MKT-009 (Case Studies) + MKT-011 (Pricing Finalization)
```

---

## 🔗 Related Documents

- `docs/marketing/deliverables/04_messaging_positioning.md` — Копирайт и позиционирование
- `docs/marketing/deliverables/05_hypothesis_backlog.md` — Гипотезы для валидации
- `docs/marketing/deliverables/06_beta_program.md` — Дизайн beta-программы
- `docs/marketing/deliverables/07_pricing_model.md` — Pricing тарифы
- `docs/planning/LANDING_PAGE_SPEC.md` — ТЗ на лендинг

---

_Track progress by updating status emojis and checkboxes._
