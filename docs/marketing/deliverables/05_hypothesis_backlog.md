# Hypothesis Backlog & Discovery Plan

**Последнее обновление:** Ноябрь 2025  
**Статус:** ⚠️ ГИПОТЕЗА v0.1

---

> **⚠️ ВАЖНО: Этот документ консолидирует все непроверенные гипотезы**
> 
> Источники:
> - `04_messaging_positioning.md` раздел 8 (критический анализ, проблемы 1-9)
> - `03_icp_and_personas.md` (пробелы в данных по каждому ICP)
> - `marketing_research_ plan.md` (результаты Desk Research — что не валидировано)
>
> **Цель:** Систематизировать всё, что требует проверки, до начала активного маркетинга.

---

## 1. Hypothesis Backlog

### 1.1 Сводная таблица гипотез

| ID | Гипотеза | Важность | Риск | Способ проверки | Срок |
|----|----------|----------|------|-----------------|------|
| **Из 04_messaging_positioning.md (Критический анализ)** |||||
| H-MSG-1 | Pricing anchor €299/mo — доступная цена для SME, окупается после 1 отчёта | Critical | High | Fake door test с разными ценами (€99, €299, €499) | До запуска |
| H-MSG-2 | "Дни, не месяцы" для первого отчёта — реалистично за 1-2 недели | Critical | High | Beta user case study с конкретными цифрами | После beta |
| H-MSG-3 | "Готово к передаче верификатору" — достаточно для positioning (vs "audit-ready") | High | Medium | Юридическая проверка + customer feedback на формулировку | До запуска |
| H-MSG-4 | Позиционирование vs SimaPro/GaBi релевантно для ICP #2 (Anna — консультант) | Medium | Low | Customer interviews с консультантами | Неделя 1-2 |
| H-MSG-5 | "Один датасет — много отчётов" — differentiator vs конкурентов | Medium | Medium | Messaging A/B test: "One product dataset → CBAM + ISO 14067" | Неделя 1-2 |
| H-MSG-6 | Email-подход для поставщиков (без портала) — преимущество, не недостаток | High | Medium | Supplier response rate tracking в beta | После beta |
| H-MSG-7 | Персоны Maria, Thomas, Anna — соответствуют реальным buyers | Critical | High | Первые 10 sales calls — записывать и анализировать | Параллельно |
| H-MSG-8 | "€500 за PCF от консультанта" — актуальная цена | Low | Low | Запросить актуальные quotes у 3-5 консультантов | P2 |
| H-MSG-9 | Страх штрафа CBAM продаёт лучше чем экономия денег/времени | High | Medium | A/B test: "Избегите штрафов CBAM" vs "Дешевле консультанта" | До запуска |
| **Из 03_icp_and_personas.md (Пробелы в данных — ICP #1)** |||||
| H-ICP1-1 | SME-производители под CBAM готовы платить €500-5,000/год за compliance tools | Critical | High | Pricing page clicks + customer interviews | До запуска |
| H-ICP1-2 | Решение о покупке принимает CFO/COO/Owner в SME 50-500 человек | High | Medium | Interview: "кто подписывает" — паттерн в 60%+ | Неделя 1-4 |
| H-ICP1-3 | На подготовку одного отчёта сейчас тратят X часов (baseline для ROI) | High | Medium | Customer discovery interviews | Неделя 1-4 |
| H-ICP1-4 | SME готовы платить за SaaS vs одноразовый консалтинг | Critical | High | Fake door: subscription vs one-time | До запуска |
| **Из 03_icp_and_personas.md (Пробелы в данных — ICP #2)** |||||
| H-ICP2-1 | LCA-консультанты готовы использовать чужую платформу (vs свои шаблоны) | High | High | Customer interviews + Consultant Plan fake door | Неделя 2-4 |
| H-ICP2-2 | White-label/co-branded отчёты — must-have для консультантов | Medium | Medium | Feature request tracking в discovery calls | Неделя 2-4 |
| H-ICP2-3 | Модель оплаты per-client лучше чем subscription для консультантов | Medium | Medium | Pricing fake door: "Consultant Plan (5 clients)" vs single | Неделя 2-4 |
| H-ICP2-4 | Интеграция с ecoinvent — критично для adoption консультантами | Medium | High | Feature fake door: "Connect ecoinvent" button clicks | После MVP |
| **Из 03_icp_and_personas.md (Пробелы в данных — Stakeholders)** |||||
| H-STK-1 | IT involvement в компаниях 50-200 человек — минимальный или отсутствует | Medium | Low | Interview: "кто ещё вовлечён в принятие решения" | Неделя 1-4 |
| H-STK-2 | Legal sign-off требуется для покупки SaaS в SME | Low | Low | Interview: "какие approvals нужны" | Неделя 1-4 |
| **Из marketing_research_ plan.md (Не валидировано)** |||||
| H-MRP-1 | Цены конкурентов — €10,000-100,000/год для enterprise ESG platforms | Medium | Low | Indirect validation через customer quotes | Ongoing |
| H-MRP-2 | Supplier portal у конкурентов — реальное преимущество или noise | Medium | Medium | Competitive analysis + customer feedback | После beta |

---

### 1.2 Приоритизация по критичности

#### 🔴 Critical (блокируют запуск)

| ID | Гипотеза | Deadline |
|----|----------|----------|
| H-MSG-1 | Pricing €299/mo валиден | До запуска |
| H-MSG-7 | Персоны соответствуют реальности | До платного маркетинга |
| H-ICP1-1 | SME готовы платить €500-5,000/год | До запуска |
| H-ICP1-4 | SaaS vs one-time консалтинг preference | До запуска |
| H-MSG-2 | "Дни, не месяцы" — реалистично | После первого beta user |

#### 🟠 High (существенно влияют на конверсию)

| ID | Гипотеза | Deadline |
|----|----------|----------|
| H-MSG-3 | "Готово к передаче верификатору" — ОК | До запуска |
| H-MSG-6 | Email-подход — преимущество | После beta |
| H-MSG-9 | Страх штрафа > экономия | До запуска |
| H-ICP1-2 | CFO/COO — decision maker | Неделя 1-4 |
| H-ICP2-1 | Консультанты готовы использовать платформу | Неделя 2-4 |

---

## 2. Customer Discovery Plan

### 2.1 Цели Discovery

**Что проверяем:**
1. **ICP validation:** Действительно ли SME под CBAM — наш primary market?
2. **Pain validation:** Сбор данных от поставщиков — главная боль?
3. **Decision process:** Кто реально подписывает чек (CFO vs COO vs Owner)?
4. **Pricing sensitivity:** Готовы ли платить €299/mo за SaaS?
5. **Persona validation:** Существуют ли Maria/Thomas/Anna в описанном виде?

**Что НЕ проверяем на этом этапе:**
- Конкретные UI/UX решения
- Детали roadmap (какие фичи первые)
- Конкурентный messaging (слишком рано)

---

### 2.2 Список целевых профилей (10-20 типов)

> **Примечание:** Ниже — типы профилей для поиска, не конкретные компании.

#### ICP #1: SME-производитель под CBAM (10-12 интервью)

| # | Тип профиля | Характеристики | Почему важен |
|---|-------------|----------------|--------------|
| 1 | SME-производитель стали (ЕС) | 50-200 сотрудников, экспорт внутри ЕС | Core CBAM segment |
| 2 | SME-производитель алюминия (ЕС) | Категория CBAM, средний размер | Core CBAM segment |
| 3 | Производитель удобрений (Турция/СНГ) | Экспорт в ЕС, под CBAM с 2026 | Экспортёр, высокая мотивация |
| 4 | Химический производитель (Восточная Европа) | Широкая номенклатура, сложный supply chain | Complexity validation |
| 5 | Цементный завод (SME, ЕС) | CBAM категория, капиталоёмкое производство | Energy-intensive validation |
| 6 | Sustainability Manager в manufacturing SME | Роль "Maria" — один человек на sustainability | Persona validation |
| 7 | Operations/Quality Manager с sustainability "в нагрузку" | Роль "Thomas" — не основная работа | Persona validation |
| 8 | CFO/COO в SME под CBAM | Decision maker | Budget & decision process |
| 9 | Procurement Manager с задачей собрать supplier data | Supply chain focus | Pain validation |
| 10 | Owner/CEO малого производства (50-100 человек) | Все решения принимает сам | SME decision pattern |

#### ICP #2: LCA/ESG-консультант (5-8 интервью)

| # | Тип профиля | Характеристики | Почему важен |
|---|-------------|----------------|--------------|
| 11 | Независимый LCA-консультант | 1-3 человека, 10-20 проектов/год | Tool vs templates preference |
| 12 | Бутиковая ESG-консалтинговая фирма | 5-15 человек, SME-клиенты | Scalability pain validation |
| 13 | Консультант с SimaPro/OpenLCA опытом | Использует heavy LCA tools | Integration requirements |
| 14 | CBAM-специалист (недавно появившаяся роль) | Фокус на CBAM compliance | Niche validation |
| 15 | Консультант из Big4 ESG-практики | Enterprise focus, но знает рынок | Market perspective |

#### Дополнительно (3-5 интервью)

| # | Тип профиля | Характеристики | Почему важен |
|---|-------------|----------------|--------------|
| 16 | Верификатор/аудитор ISO 14067 | Проверяет отчёты, знает ошибки | Output quality requirements |
| 17 | Procurement в крупной компании (запрашивает PCF) | Покупатель, создаёт pressure на suppliers | Demand-side validation |
| 18 | Sustainability в mid-market под CSRD | ICP #3 (deferred) — понять отличия | Segment boundary |

---

### 2.3 Interview Script

> **Источник:** `03_icp_and_personas.md` раздел 5.2

#### Блок 1: Текущий процесс (10-15 мин)

1. Как вы сейчас готовите carbon/CBAM отчётность?
2. Кто в компании этим занимается? Сколько человек?
3. Сколько времени занимает один отчёт?
4. Какие инструменты используете (Excel, софт, консультанты)?

#### Блок 2: Боли и триггеры (10-15 мин)

5. Что самое сложное/раздражающее в процессе?
6. Был ли момент, когда вы думали "должен быть способ лучше"?
7. Что заставило бы вас искать новое решение?
8. Как вы собираете данные от поставщиков? Что работает, что нет?

#### Блок 3: Decision making (10 мин)

9. Кто принимает решение о покупке таких инструментов?
10. Какой бюджет выделяется на compliance tools?
11. Что нужно, чтобы одобрить новый инструмент?
12. Какие approvals требуются (IT, Legal, Finance)?

#### Блок 4: Конкуренты и альтернативы (5-10 мин)

13. Смотрели ли вы другие решения? Какие?
14. Почему не купили / почему купили?
15. Что не устраивает в текущем решении?

---

### 2.4 План интервью

| Этап | Количество | Фокус | Таймлайн |
|------|------------|-------|----------|
| **Wave 1** | 5 интервью | ICP #1: SME под CBAM | Неделя 1-2 |
| **Wave 2** | 5 интервью | ICP #1 (продолжение) + ICP #2 начало | Неделя 2-3 |
| **Wave 3** | 5 интервью | ICP #2 + дополнительные профили | Неделя 3-4 |
| **Итого** | 15 интервью | Полный охват всех типов | 4 недели |

**Минимум для валидации:** 10 интервью (7 ICP #1 + 3 ICP #2)

---

### 2.5 Критерии принятия решений

> **Источник:** `03_icp_and_personas.md` раздел 5.3

| Гипотеза | Как проверяем | Порог "validated" |
|----------|---------------|-------------------|
| SME под CBAM — primary ICP | 10+ интервью, 7+ подтвердили боль | 70% confirmation |
| Budget €500-5,000/год | Pricing page clicks, interview quotes | 50%+ готовы платить в диапазоне |
| Sustainability Manager — champion | Role analysis в interviews | 60%+ компаний имеют такую роль |
| Supplier data collection — main pain | Pain ranking в interviews | Top-3 боль у 70%+ |
| CFO/COO — decision maker | Interview: "кто подписывает" | Consistent pattern в 60%+ |

**Что делаем по результатам:**

| Результат | Действие |
|-----------|----------|
| ✅ Гипотеза подтверждена (≥70%) | Переходим в production, масштабируем |
| ⚠️ Частично (40-70%) | Уточняем сегмент, проводим дополнительные интервью |
| 🔴 Опровергнута (<40%) | Пересматриваем ICP/позиционирование/roadmap |

---

## 3. Digital Validation Plan

> **Источник:** `marketing_research_ plan.md` раздел "Phase 2: Pre-Beta Validation"

### 3.1 Fake Door Tests

#### Test A: Валидация цены (The Velvet Rope)

| Параметр | Значение |
|----------|----------|
| **Где** | Страница Pricing |
| **Что показываем** | Тариф "Professional: €299/mo" с кнопкой "Start 14-day Trial" |
| **Механика** | Пользователь кликает, ожидая ввод карты |
| **Результат (Modal)** | "Вы попали в ранний список! Мы еще не принимаем оплату. Для вас этот тариф будет **бесплатным** на время беты в обмен на фидбек. [Email Field]" |
| **Метрика успеха** | Клик по кнопке с ценой = готовность платить |
| **Порог** | >3% CTR на "Start Trial" |

#### Test B: Валидация интеграций

| Параметр | Значение |
|----------|----------|
| **Где** | Блок Integrations |
| **Что показываем** | Иконки SAP / 1C / Oracle с кнопкой "Connect" |
| **Результат** | "Интеграция в разработке. Сообщить, когда будет готова?" |
| **Метрика** | Какая ERP получает больше кликов |

#### Test C: Валидация Consultant Plan

| Параметр | Значение |
|----------|----------|
| **Где** | Страница Pricing |
| **Что показываем** | Тариф "Consultant Plan (5 clients): €499/mo" vs "Single Company: €299/mo" |
| **Метрика** | Распределение кликов между тарифами |
| **Порог для ICP #2** | >20% кликов на Consultant Plan |

---

### 3.2 Smoke Tests (Lead Magnets)

#### Smoke Test 1: Excel vs SaaS comparison

| Параметр | Значение |
|----------|----------|
| **Артефакт** | PDF-гайд "Excel vs SaaS для CBAM отчётности: что выбрать" |
| **Дистрибуция** | LinkedIn, Reddit r/sustainability |
| **Метрика** | Downloads, CTR |
| **Порог провала** | CTR <1% или <50 downloads за неделю |

#### Smoke Test 2: CBAM Excel Template

| Параметр | Значение |
|----------|----------|
| **Артефакт** | Бесплатный Excel-шаблон для CBAM transitional reporting |
| **Дистрибуция** | LinkedIn, тематические группы |
| **Метрика** | Downloads → email signup conversion |
| **Порог провала** | <100 downloads или <10% email conversion |

---

### 3.3 A/B Tests

#### A/B Test 1: Fear vs Savings messaging

| Вариант | Заголовок |
|---------|-----------|
| A (Fear) | "Избегите штрафов CBAM 2026" |
| B (Savings) | "Сэкономьте 40 часов на CBAM отчётности" |

| Параметр | Значение |
|----------|----------|
| **Где** | Landing page hero section |
| **Метрика** | CTR, конверсия в signup |
| **Порог для выбора** | >20% разница в конверсии |

#### A/B Test 2: Deadline vs Client Request

| Вариант | Заголовок |
|---------|-----------|
| A (Regulatory) | "Успейте к CBAM 2026" |
| B (Business) | "Отвечайте на запросы клиентов о PCF за часы, не недели" |

| Параметр | Значение |
|----------|----------|
| **Где** | Landing page + paid ads |
| **Метрика** | CTR, качество лидов (ICP fit) |
| **Цель** | Понять, какой триггер сильнее: regulatory vs business pressure |

#### A/B Test 3: Terminology

| Вариант | Термин |
|---------|--------|
| A | "Product carbon footprint" |
| B | "PCF" |

| Параметр | Значение |
|----------|----------|
| **Где** | Hero section |
| **Метрика** | Bounce rate |
| **Гипотеза** | Full term понятнее для операторов (Thomas) |

---

### 3.4 Review Mining (пассивная валидация)

> **Источник:** `marketing_research_ plan.md` — Review Mining

**Цель:** Понять "Anti-Features" — чего мы точно НЕ делаем.

| Источник | Конкуренты для анализа | Что ищем |
|----------|------------------------|----------|
| G2 | Sphera, Persefoni, Greenly, OneClickLCA | Отзывы 1-3 звезды |
| Capterra | Sphera, Persefoni, Greenly | "complex", "expensive", "hidden fees" |
| TrustRadius | Persefoni, Watershed | "support is slow", "Excel export failed" |

**Результат:** Список "Anti-Features" для positioning.

---

## 4. 🚨 Red Flags Dashboard (Мониторинг)

> **Критические индикаторы, которые требуют постоянного отслеживания.**
> Если любой из этих флагов срабатывает — СТОП и пересмотр стратегии.

### 4.1 Pre-Launch Red Flags (до запуска)

| 🚨 Red Flag | Индикатор | Порог срабатывания | Действие при срабатывании |
|-------------|-----------|-------------------|---------------------------|
| **Цена не работает** | Fake door test €299/mo | CTR на "Start Trial" <1% | Тестировать другие price points (€99, €199, €499) |
| **ICP не существует** | Customer discovery interviews | <40% подтверждают боль с CBAM | Pivot на другой сегмент (B2B client requests?) |
| **Персоны неверны** | Первые 5 sales calls | Реальные buyers ≠ Maria/Thomas | Переписать персоны, messaging |
| **Никто не платит за SaaS** | Interview: "готовы на subscription?" | >60% хотят one-time консалтинг | Рассмотреть hybrid модель |
| **Decision maker другой** | Interview: "кто подписывает" | CFO/COO упоминаются <30% | Переделать stakeholder map |

### 4.2 Beta Red Flags (во время beta)

| 🚨 Red Flag | Индикатор | Порог срабатывания | Действие при срабатывании |
|-------------|-----------|-------------------|---------------------------|
| **Time-to-first-report провален** | Среднее время до первого отчёта | >4 недель (vs обещанных "1-2") | Упростить onboarding или убрать claim |
| **Supplier response rate низкий** | % поставщиков, ответивших на запрос | <30% response rate | Пересмотреть email-подход, добавить portal |
| **Churn после первого месяца** | % отказов после trial | >50% не конвертируются | Проблема с value delivery |
| **"Не готово к верификатору"** | Feedback от аудиторов/верификаторов | Аудитор отклоняет отчёт | Критично — юридический риск |

### 4.3 Post-Launch Red Flags (после запуска)

| 🚨 Red Flag | Индикатор | Порог срабатывания | Действие при срабатывании |
|-------------|-----------|-------------------|---------------------------|
| **CAC > LTV** | Cost of Acquisition vs Lifetime Value | CAC > €1,000 при €299/mo | Пересмотреть каналы или pricing |
| **CBAM отменён/отложен** | EU regulatory news | Официальное объявление об отсрочке | Срочный pivot на "B2B client PCF requests" |
| **Конкурент запустил freemium** | Competitor monitoring | Greenly/Normative запускают бесплатный tier | Пересмотреть positioning |
| **Негативные отзывы** | G2/Capterra reviews | >2 отзывов 1-2 звезды с одинаковой жалобой | Приоритизировать исправление |

### 4.4 Процесс мониторинга

| Частота | Что проверяем | Кто отвечает |
|---------|---------------|--------------|
| **Ежедневно** | Fake door CTR, signup conversion | Growth |
| **Еженедельно** | Interview insights, supplier response rates | Product |
| **Ежемесячно** | Churn, CAC/LTV, competitor moves | Founder |
| **При событии** | EU regulatory news (CBAM updates) | All hands alert |

### 4.5 Escalation Protocol

```
🟢 Всё OK        → Продолжаем план
🟡 1 флаг        → Обсуждение на weekly, план mitigation
🔴 2+ флага      → Экстренный review стратегии
⚫ Critical флаг → СТОП маркетинг, pivot discussion
```

**Critical флаги (немедленный СТОП):**
- CBAM отменён/отложен на 2+ года
- Юридическая претензия по "audit-ready" / качеству отчётов
- >70% интервью опровергают ICP

---

## Changelog

| Дата | Версия | Изменение |
|------|--------|-----------|
| Ноябрь 2025 | v0.1 | Создан на основе консолидации гипотез из 03, 04 и marketing_research_ plan |
| Ноябрь 2025 | v0.1.1 | Добавлен раздел 4: Red Flags Dashboard |
