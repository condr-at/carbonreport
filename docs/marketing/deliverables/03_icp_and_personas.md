# ICP, Stakeholders & User Personas

**Последнее обновление:** Ноябрь 2025  
**Статус:** ⚠️ ГИПОТЕЗА v0.1 — требует валидации

---

> **⚠️ ВАЖНО: Этот документ основан на desk research**
> 
> Все профили и персоны ниже — **гипотезы**, построенные на:
> - Анализе конкурентов и их таргетинга
> - Цитатах из Reddit, G2, Capterra
> - Логике регуляторного давления (CBAM, CSRD)
> - Анализе JTBD из `01_product_vision.md`
> 
> **НЕ проведено:**
> - Customer interviews (0 из рекомендуемых 10-15)
> - Анализ реальных сделок (нет sales data)
> - Валидация pricing sensitivity
> - Подтверждение decision-making process
> 
> Перед использованием в sales/marketing — обязательна валидация по плану в разделе 5.

---

> **Связь с продуктовой архитектурой (см. `01_product_vision.md`):**
> - **Core value** = сбор данных от распределённой команды к дедлайну (Job 0)
> - **Output** = 44+ шаблонов экспорта (CBAM, ISO 14067, CDP, TCFD и др.)
> - **Beachhead** = ICP #1 (CBAM) и Job 2 (PCF для B2B)
> - Все ICP используют один и тот же Core workflow, отличается только Output

---

## 1. Ideal Customer Profiles (ICP)

### 1.1 ICP #1: SME-производитель под CBAM (Primary)

**Приоритет:** 🔥 Высокий (beachhead market hypothesis)

| Параметр | Описание | Источник данных |
|----------|----------|-----------------|
| **Размер** | 50-500 сотрудников, оборот €10-100M | Гипотеза на основе CBAM scope |
| **Отрасль** | Производство: сталь, алюминий, цемент, удобрения, химия | EU CBAM Regulation |
| **География** | ЕС (производители) или экспортёры в ЕС (Турция, Китай, СНГ) | CBAM scope |
| **Продукты** | 5-50 SKU, попадающих под CBAM-категории | Гипотеза |
| **Регуляторное давление** | CBAM (обязательно с 2026), возможно CSRD | EU regulations |
| **Текущий стек** | Excel + email + внешний консультант (1-2 раза в год) | Reddit quotes, market research |
| **ESG-зрелость** | Низкая-средняя: нет выделенной sustainability-команды | Гипотеза |
| **Бюджет на инструменты** | €500-5,000/год (гипотеза, требует валидации) | Competitor pricing analysis |

**Почему этот ICP:**
- Жёсткий регуляторный дедлайн (CBAM 2026) создаёт срочность
- Текущие решения (Excel) не масштабируются под требования
- Enterprise-инструменты слишком дороги ($25K+)
- Нет времени/экспертизы на LCA-софт (SimaPro, GaBi)

**Сигналы квалификации (гипотетические):**
- Импорт в ЕС товаров под CN-кодами CBAM
- Запросы от европейских клиентов на PCF
- Отсутствие sustainability-менеджера в штате
- Использование Excel для текущей отчётности

**Пробелы в данных:**
- [ ] Реальный бюджет на compliance tools
- [ ] Кто именно принимает решение о покупке (CFO? COO? Owner?)
- [ ] Сколько времени сейчас тратят на подготовку отчётов
- [ ] Готовы ли платить за SaaS vs одноразовый консалтинг

---

### 1.2 ICP #2: LCA/ESG-консультант (Secondary)

**Приоритет:** 🟡 Средний (multiplier hypothesis)

| Параметр | Описание | Источник данных |
|----------|----------|-----------------|
| **Тип** | Бутиковая консалтинговая фирма или фрилансер | LinkedIn research |
| **Размер** | 1-20 человек | Гипотеза |
| **Клиенты** | 5-30 SME-клиентов в год | Гипотеза |
| **Услуги** | PCF-расчёты, CBAM-декларации, EPD, ISO 14067 | Market research |
| **Текущий стек** | SimaPro/OpenLCA + Excel + кастомные шаблоны | Reddit, competitor analysis |
| **Боль** | Масштабирование: каждый клиент = ручная работа | Reddit quotes |
| **Бюджет** | €2,000-10,000/год на инструменты | Гипотеза |

**Почему этот ICP:**
- Каждый консультант = доступ к 5-30 конечным клиентам
- Понимают ценность автоматизации (считают €/час)
- Могут стать evangelists и referral source
- Низкий CAC на привлечение группы клиентов

**Сигналы квалификации (гипотетические):**
- Профиль LinkedIn: "LCA consultant", "Carbon footprint specialist"
- Посты про "client work", "CBAM projects"
- Упоминание SimaPro/OpenLCA в опыте
- Клиентская база из manufacturing SME

**Пробелы в данных:**
- [ ] Готовы ли использовать чужую платформу (vs свои шаблоны)
- [ ] White-label требования (брендинг отчётов)
- [ ] Модель оплаты: per-client vs subscription
- [ ] Интеграция с их текущим LCA-софтом

---

### 1.3 ICP #3: Mid-market под CSRD (Deferred)

**Приоритет:** ⚪ Низкий (отложен на 2026+)

| Параметр | Описание | Источник данных |
|----------|----------|-----------------|
| **Размер** | 500-5000 сотрудников | CSRD scope |
| **Регуляторное давление** | CSRD (2025-2026), возможно CBAM | EU regulations |
| **Текущий стек** | Возможно уже есть ESG-платформа | Market research |
| **Бюджет** | €10,000-50,000/год | Competitor pricing |

**Почему отложен:**
- Более длинный sales cycle
- Конкуренция с established players (Persefoni, Sweep, Plan A)
- Требуют enterprise features (SSO, integrations, SLA)
- Product-level PCF — не их главный приоритет (corporate disclosure важнее)

---

## 2. Stakeholder Map (Buying Committee)

> **⚠️ Гипотеза:** Структура ниже основана на типичных B2B SaaS patterns и упоминаниях в Reddit. Требует валидации через discovery calls.

### 2.1 Для ICP #1 (SME-производитель)

```
┌─────────────────────────────────────────────────────────────┐
│                    DECISION MAKER                           │
│                                                             │
│   CFO / Finance Director          COO / Operations Head     │
│   "Сколько стоит compliance       "Кто будет этим            │
│    vs штраф за несоблюдение?"     заниматься и сколько       │
│                                    времени займёт?"          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CHAMPION / USER                          │
│                                                             │
│   Sustainability Manager          Quality / Compliance      │
│   (если есть)                     Manager                   │
│   "Мне нужен инструмент,         "Как это интегрируется     │
│    который упростит мою жизнь"   с нашими процессами?"      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INFLUENCER                               │
│                                                             │
│   External Consultant             Procurement / Supply      │
│   "Я рекомендую инструменты      Chain Manager              │
│    своим клиентам"               "Смогу ли я получить       │
│                                   данные от поставщиков?"   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BLOCKER (potential)                      │
│                                                             │
│   IT / Security                   Legal                     │
│   "Где хранятся данные?          "Кто несёт ответственность │
│    GDPR compliance?"              за ошибки в отчёте?"      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Роли и их мотивации

| Роль | Цели | Опасения | Аргументы "за" |
|------|------|----------|----------------|
| **CFO** | Минимизировать cost of compliance | ROI неочевиден, скрытые затраты | "Дешевле чем консультант + штраф" |
| **COO** | Не отвлекать команду от operations | Ещё один инструмент, обучение | "Минимальный time investment" |
| **Sustainability Manager** | Выполнить KPI по отчётности | Сложность, зависимость от вендора | "Упрощает мою работу в 3x" |
| **Quality Manager** | Соответствие стандартам | Точность данных, аудируемость | "Audit-ready отчёты" |
| **Procurement** | Получить данные от поставщиков | Поставщики не будут отвечать | "Supplier portal делает за меня" |
| **IT** | Безопасность, интеграции | Ещё один SaaS, data privacy | "GDPR compliant, EU hosting" |

**Пробелы в данных:**
- [ ] Кто реально подписывает чек в SME (owner vs CFO vs COO)?
- [ ] Есть ли IT involvement в компаниях 50-200 человек?
- [ ] Насколько важен Legal sign-off?

---

## 3. User Personas (внутри продукта)

### 3.1 Persona: "Марина" — Sustainability Manager

> **⚠️ Гипотетическая персона** на основе Reddit quotes и JTBD analysis

**Демография:**
- 28-40 лет
- Образование: экология, химия, инженерия + MBA или sustainability certification
- 2-5 лет в роли, часто "выросла" из quality/compliance

**Контекст работы:**
- Единственный sustainability-специалист в компании
- Отчитывается перед COO или CFO
- "Sustainability" — одна из многих обязанностей (не 100% времени)

**Цитаты из исследований (адаптированные):**
> "I'm a one-person sustainability team. When CBAM request comes, I'm the one who has to figure it out."

> "Мой начальник не понимает, почему это занимает так долго. 'Просто заполни форму' — говорит он."

**Jobs-to-be-Done:**
1. Собрать данные от 10-50 поставщиков к дедлайну
2. Подготовить отчёт, который пройдёт аудит
3. Объяснить CFO/COO статус и риски простым языком
4. Не стать bottleneck для sales-команды (когда клиенты запрашивают PCF)

**Боли:**
- Постоянное переключение между задачами
- Поставщики не отвечают на emails
- Нет понимания "правильной" методологии
- Страх ошибки (штрафы, репутация)

**Что хочет от Carbon Report:**
- ✅ Чёткий checklist "что нужно сделать"
- ✅ Автоматические напоминания поставщикам
- ✅ Шаблоны, которым можно доверять
- ✅ Dashboard для отчёта руководству
- ❌ НЕ хочет: сложную LCA-методологию, курсы на 40 часов

**Метрики успеха:**
- Отчёт сдан вовремя
- Аудит пройден без замечаний
- Руководство довольно (не спрашивает "когда будет готово")

---

### 3.2 Persona: "Алексей" — Operations/Quality Manager

> **⚠️ Гипотетическая персона** — часто sustainability "падает" на operations

**Демография:**
- 35-50 лет
- Инженерное образование
- 10+ лет на производстве

**Контекст работы:**
- Sustainability — НЕ основная работа (добавили "в нагрузку")
- Хорошо знает производственные процессы, но не ESG-стандарты
- Скептичен к "модным" инструментам

**Цитаты из исследований (адаптированные):**
> "Мне сказали 'разберись с CBAM'. Я инженер, не эколог. Где вообще взять эти emission factors?"

> "У нас SAP, там все данные. Почему я должен вводить их ещё куда-то вручную?"

**Jobs-to-be-Done:**
1. Закрыть задачу минимальными усилиями
2. Не навредить основным operations-процессам
3. Получить данные из существующих систем (ERP, производственный учёт)

**Боли:**
- "Это не моя работа"
- Непонятная терминология (Scope 3, upstream, PCF)
- Времени нет — production priorities важнее
- Страх сделать неправильно

**Что хочет от Carbon Report:**
- ✅ "Просто скажи, какие данные ввести"
- ✅ Импорт из Excel/ERP
- ✅ Минимум обучения
- ✅ Понятный язык без ESG-жаргона
- ❌ НЕ хочет: становиться "sustainability expert"

---

### 3.3 Persona: "Дмитрий" — Поставщик (Data Contributor)

> **⚠️ Гипотетическая персона** — критически важная для supplier engagement

**Контекст:**
- Получает запрос на carbon данные от клиента (нашего пользователя)
- Не имеет собственной sustainability-экспертизы
- Воспринимает запрос как "ещё одну анкету от клиента"

**Цитаты из исследований:**
> "Scope 3 is always the hardest - getting suppliers to actually respond with real data is like pulling teeth."

> "The data collection piece is always underestimated. You need supplier buy-in and most SME suppliers have zero carbon expertise."

**Jobs-to-be-Done:**
1. Ответить на запрос клиента, чтобы не потерять контракт
2. Потратить минимум времени
3. Не раскрыть конфиденциальные данные

**Боли:**
- Не понимает, что от него хотят
- Нет данных в нужном формате
- Боится раскрыть коммерческую информацию
- "У меня 10 клиентов — каждый присылает свою анкету"

**Что хочет от Carbon Report (supplier portal):**
- ✅ Простая форма на 5-10 полей
- ✅ Понятные подсказки "что вводить"
- ✅ Возможность приложить документ (а не заполнять вручную)
- ✅ Уверенность, что данные защищены
- ❌ НЕ хочет: регистрироваться, учить платформу, платить

---

### 3.4 Persona: "Анна" — LCA-консультант

> **⚠️ Гипотетическая персона** для ICP #2

**Демография:**
- 30-45 лет
- PhD или MSc в environmental science
- Сертификация по LCA (ISO 14040/14044)

**Контекст работы:**
- Независимый консультант или small firm (2-10 человек)
- 5-20 проектов в год
- Использует SimaPro/OpenLCA + Excel для delivery

**Jobs-to-be-Done:**
1. Масштабировать практику без найма (tool leverage)
2. Быстрее делать "типовые" проекты (CBAM, simple PCF)
3. Фокусироваться на сложных кейсах (где нужна экспертиза)

**Боли:**
- Каждый проект — ручная работа
- Клиенты не понимают, за что платят €500/PCF
- Конкуренция с "калькуляторами" за простые проекты
- Data collection от клиентских поставщиков — bottleneck

**Что хочет от Carbon Report:**
- ✅ White-label или co-branded отчёты
- ✅ Client portal для data collection
- ✅ Интеграция с LCA databases (ecoinvent)
- ✅ Pricing model: per-client или volume discount
- ❌ НЕ хочет: терять контроль над методологией

---

## 4. Матрица Persona × Job

| Persona | Job 1: Compliance | Job 2: Sales/Tenders | Job 3: Investment |
|---------|-------------------|----------------------|-------------------|
| **Марина** (Sust. Manager) | 🔥 Primary user | 🟡 Secondary | 🟡 Secondary |
| **Алексей** (Operations) | 🟡 Data contributor | ⚪ Rare | ⚪ Rare |
| **Дмитрий** (Supplier) | 🔥 Critical for Scope 3 | 🔥 Critical for PCF | ⚪ Rare |
| **Анна** (Consultant) | 🔥 Delivers for clients | 🔥 Delivers for clients | 🟡 Secondary |

---

## 5. План валидации (обязательно перед GTM)

### 5.1 Источники данных для дополнения

| Источник | Что узнаем | Приоритет | Статус |
|----------|------------|-----------|--------|
| **Customer Interviews (10-15)** | Decision process, budget, current tools, timeline | 🔥 Critical | ❌ Не начато |
| **LinkedIn Research** | Job titles, company patterns, who posts about CBAM | 🟡 Medium | ❌ Не начато |
| **Competitor Case Studies** | Who are their customers (names, sizes, industries) | 🟡 Medium | ⚠️ Частично (websites) |
| **Crunchbase/LinkedIn Sales Navigator** | Company firmographics for ICP validation | 🟡 Medium | ❌ Не начато |
| **Pricing Experiments** | Willingness to pay, price sensitivity | 🔥 Critical | ❌ Не начато |
| **Pilot Data** | Actual usage patterns, activation, retention | 🔥 Critical | ❌ Нужны пилоты |

### 5.2 Вопросы для Customer Discovery

**Блок 1: Текущий процесс**
- Как вы сейчас готовите carbon/CBAM отчётность?
- Кто в компании этим занимается? Сколько человек?
- Сколько времени занимает один отчёт?
- Какие инструменты используете (Excel, софт, консультанты)?

**Блок 2: Боли и триггеры**
- Что самое сложное/раздражающее в процессе?
- Был ли момент, когда вы думали "должен быть способ лучше"?
- Что заставило бы вас искать новое решение?

**Блок 3: Decision making**
- Кто принимает решение о покупке таких инструментов?
- Какой бюджет выделяется на compliance tools?
- Что нужно, чтобы одобрить новый инструмент?

**Блок 4: Конкуренты и альтернативы**
- Смотрели ли вы другие решения? Какие?
- Почему не купили / почему купили?
- Что не устраивает в текущем решении?

### 5.3 Критерии успешной валидации

| Гипотеза | Как проверяем | Порог "validated" |
|----------|---------------|-------------------|
| SME под CBAM — primary ICP | 10+ интервью, 7+ подтвердили боль | 70% confirmation |
| Budget €500-5000/год | Pricing page clicks, interview quotes | 50%+ готовы платить в диапазоне |
| Sustainability Manager — champion | Role analysis в interviews | 60%+ компаний имеют такую роль |
| Supplier data collection — main pain | Pain ranking в interviews | Top-3 боль у 70%+ |
| CFO/COO — decision maker | Interview: "кто подписывает" | Consistent pattern в 60%+ |

---

## 6. Changelog

| Дата | Версия | Изменение | Автор |
|------|--------|-----------|-------|
| Ноябрь 2025 | v0.1 | Создан гипотетический документ на основе desk research | — |
| — | v0.2 (план) | Обновление после 5 discovery interviews | — |
| — | v1.0 (план) | Валидированная версия после 10-15 interviews + pilot data | — |

---

## Приложение A: Сырые данные из desk research

### Упоминания ролей в цитатах

| Цитата | Источник | Implied Role |
|--------|----------|--------------|
| "I'm a one-person sustainability team" | Reddit | Sustainability Manager |
| "Sphera's ESG software... Really low user satisfaction from people required to enter data in for reporting from production sites" | Reddit r/consulting | Operations/Site staff |
| "Getting suppliers to actually respond with real data is like pulling teeth" | Reddit | Procurement/Sustainability |
| "Clients ask for carbon footprint report" | Reddit r/consulting | Consultant |
| "We evaluated Watershed, Persefoni, and Plan A. All quoted us $50K+" | Reddit | Decision maker (mid-market) |
| "I've seen consultancies charge €500 per product PCF calculation" | Reddit | Consultant pricing |

### Упоминания размеров компаний

| Signal | Источник | Implied Size |
|--------|----------|--------------|
| "mid-sized manufacturer" | Reddit | 100-1000 employees |
| "100+ suppliers" | Reddit | Mid-market+ |
| "$50K+ quoted" | Reddit | Enterprise budget |
| "small sustainability team" | Reddit | SME |
| "one-person team" | Reddit | SME (50-200) |
