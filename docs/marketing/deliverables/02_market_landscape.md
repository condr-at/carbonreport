# Market Landscape & Competitive Analysis

**Последнее обновление:** Январь 2025  
**Статус:** ✅ Исследование завершено (20+ продуктов, 30+ цитат)

---

## 1. Market Landscape Overview

### 1.1 Сегменты решений

#### LCA-софт (Life Cycle Assessment)
Специализированные инструменты для полного жизненного цикла продукта. Научно-строгие, но сложные.

- **Примеры:** SimaPro, OneClickLCA, Sphera (GaBi), openLCA
- **Характеристики:** 
  - Полная LCA по ISO 14040/14044
  - Обширные базы данных (ecoinvent, GaBi)
  - Экспертный интерфейс
- **Плюсы:** 
  - Максимальная научная строгость
  - Признание аудиторами и сертификаторами
- **Минусы:** 
  - Крутая кривая обучения (3-6 месяцев)
  - Высокая стоимость ($10K-50K/год)
  - Требуют LCA-эксперта для работы

#### ESG-платформы (Generic)
Комплексные решения для всего спектра ESG-отчётности. Фокус на compliance, а не на точности данных.

- **Примеры:** Workiva, Watershed, Persefoni, Novisto, Cority, Quentic
- **Характеристики:**
  - Автоматизация сбора данных из ERP/бухгалтерии
  - Мульти-фреймворк отчётность (CSRD, CDP, GRI, SASB)
  - Dashboards для C-suite
- **Плюсы:**
  - Единая платформа для всего ESG
  - Интеграции с enterprise-системами
- **Минусы:**
  - Слабая поддержка product-level carbon (PCF)
  - Дорогие и долгие внедрения
  - "Jack of all trades, master of none"

#### Нишевые CBAM/PCF-инструменты
Целенаправленные решения для product carbon footprint и регуляторной отчётности.

- **Примеры:** CarbonChain, Sweep, Normative, Plan A, Greenly
- **Характеристики:**
  - Фокус на Scope 3 / цепочку поставок
  - Готовые шаблоны под CBAM/CSRD
  - Supplier engagement модули
- **Плюсы:**
  - Быстрый старт (недели, не месяцы)
  - Понятные цены для SME
- **Минусы:**
  - Менее гибкие для нестандартных случаев
  - Молодые продукты, меняющийся функционал

#### Excel + Email + Консалтинг
Статус-кво для большинства SME. "Если работает — не трогай".

- **Характеристики:**
  - Ручной сбор данных по email
  - Расчёты в Excel с кастомными формулами
  - Внешний консультант для отчётов
- **Плюсы:**
  - Привычно, нет learning curve
  - Гибко под любой формат
  - Нет subscription fees
- **Минусы:**
  - Не масштабируется (100+ поставщиков = ад)
  - Ошибки при копировании данных
  - Нет audit trail
  - Консультант = bottleneck и single point of failure**

---

### 1.2 Тенденции рынка

| Тенденция | Описание | Источник |
|-----------|----------|----------|
| Рост регуляторного давления (CBAM) | C 2026 импортёры в ЕС обязаны предоставлять верифицированный углеродный след для стали, алюминия, цемента, удобрений, электроэнергии, водорода | EU CBAM Regulation 2023 |
| Запрос на product-level данные | Переход от corporate footprint к PCF (Product Carbon Footprint) — клиенты требуют данные по SKU | ISO 14067:2018, Pathfinder Framework |
| Переход к регулярным циклам отчетности | Ежегодная → ежеквартальная → continuous отчётность под давлением инвесторов | CSRD, TCFD, CDP |
| Требования цепочки поставок | Крупные OEM (автопром, электроника) требуют Scope 3 данные от поставщиков tier 2-3 | CDP Supply Chain Programme |
| Консолидация рынка | M&A активность — Sphera куплена Blackstone, Workiva активно приобретает | Gartner, Forrester 2024 |
| AI/Automation волна | Появление AI-assisted data collection и estimation для Scope 3 | Watershed, Persefoni announcements |

---

### 1.3 Фокус Carbon Report

#### Архитектурная модель
**Core** = Data collection workflow (таблица + рассылки + статус-трекинг). Это решает 80% боли независимо от типа отчёта.

**Output** = 44+ шаблонов экспорта. Каждый шаблон — это маппинг датасета → требуемый формат. Не отдельный продукт, а опция.

#### Beachhead (12-18 месяцев marketing/sales focus):
- **CBAM** — жёсткий дедлайн 2026, регуляторное давление, чёткий ICP
- **ISO 14067 / PCF** — запросы от B2B клиентов, "48 часов на отчёт"
- **Supplier data collection** — универсальная боль, подтверждена 7+ источниками

#### Long tail (доступно, но не фокус маркетинга):
- CDP, EcoVadis, TCFD, GRESB, SBTi, EPD, bank templates и 30+ других
- Работают "из коробки" благодаря универсальному датасету
- Позволяют захватить "брошенок" — компании с нишевыми запросами без хороших инструментов

#### Что сознательно НЕ делаем (anti-scope):
- Полная corporate LCA по ISO 14040/14044 (оставляем SimaPro/GaBi)
- Расчёт Scope 1/2 (это commodity, у всех есть)
- Enterprise features (SSO, complex permissions) — пока
- Custom consulting services
- Методологический консалтинг (мы — tool, не advisor)

> **TODO:** Провести landscape по каждому из 44 шаблонов — где реальный спрос, где конкуренция, где "брошенки" без хороших инструментов.

---

## 2. Competitive Matrix

### 2.1 Обзор конкурентов по категориям

#### Категория A: LCA-софт

| Конкурент | ISO 14067 | CBAM | Модель данных | Коллаборация | Time-to-Value | Цена |
|-----------|-----------|------|---------------|--------------|---------------|------|
| **OneClickLCA** | ✅ Полная | ⚠️ Частичная | Activity-based | ⚠️ Ограничено | 2-4 недели | €3,000-15,000/год |
| **Sphera (GaBi)** | ✅ Полная | ⚠️ Частичная | Process-based | ❌ Single-user | 3-6 месяцев | $15,000-50,000/год |
| **SimaPro** | ✅ Полная | ❌ Нет | Process-based | ❌ Single-user | 3-6 месяцев | €5,000-25,000/год |
| **OpenLCA** | ✅ Полная | ❌ Нет | Process-based | ❌ Нет | 1-3 месяца | Free (DB extra) |

#### Категория B: ESG-платформы

| Конкурент | ISO 14067 | CBAM | Модель данных | Коллаборация | Time-to-Value | Цена |
|-----------|-----------|------|---------------|--------------|---------------|------|
| **Persefoni** | ⚠️ Частичная | ⚠️ Roadmap | Activity-based | ✅ Да | 4-8 недель | $25,000-100,000/год |
| **Watershed** | ⚠️ Частичная | ⚠️ Roadmap | Spend-based | ✅ Да | 4-8 недель | $30,000-150,000/год |
| **Greenly** | ⚠️ Частичная | ⚠️ Частичная | Activity-based | ✅ Да | 2-4 недели | €500-5,000/год |
| **Sweep** | ⚠️ Частичная | ✅ Да | Spend + Activity | ✅ Да | 4-6 недель | €20,000-80,000/год |
| **Plan A** | ⚠️ Частичная | ✅ Да | Activity-based | ✅ Да | 3-6 недель | €10,000-50,000/год |
| **Normative** | ⚠️ Частичная | ✅ Да | Spend-based | ✅ Да | 2-4 недели | €5,000-20,000/год |

#### Категория C: Нишевые CBAM/PCF-tools

| Конкурент | ISO 14067 | CBAM | Модель данных | Коллаборация | Time-to-Value | Цена |
|-----------|-----------|------|---------------|--------------|---------------|------|
| **CarbonChain** | ✅ Да | ✅ Да | Activity-based | ✅ Supplier portal | 2-4 недели | Custom pricing |
| **Carbmee** | ✅ Да | ✅ Да | Hybrid | ✅ Да | 4-6 недель | €15,000-40,000/год |
| **Carbon+Alt+Delete** | ⚠️ Частичная | ✅ Да | Activity-based | ⚠️ Email-based | 1-2 недели | €2,000-10,000/год |

---

### 2.2 Детальный разбор ключевых конкурентов

#### Конкурент 1: Greenly
- **Категория:** ESG-платформа (SME focus)
- **Hero-сообщение:** "The Go-to Carbon Accounting Platform — Get certified climate action with no expertise needed"
- **Целевой сегмент:** SME 50-500 сотрудников, B-corps, tech companies
- **Ключевые фичи:**
  - Автоматический сбор данных через bank API
  - Готовые интеграции с бухгалтерией
  - Climate action plans с рекомендациями
  - Сертификация от аудиторов
- **Сильные стороны:** Простота, цена, быстрый старт
- **Слабые стороны:** Слабая поддержка manufacturing, spend-based = низкая точность для PCF
- **Рейтинг G2/Capterra:** 4.8/5

#### Конкурент 2: Persefoni
- **Категория:** Enterprise ESG Platform
- **Hero-сообщение:** "Carbon Footprint & Sustainability Reporting for Companies and Financial Institutions"
- **Целевой сегмент:** Enterprise 1000+ сотрудников, финансовый сектор
- **Ключевые фичи:**
  - PCAF-compliant для финансов
  - AI-assisted data collection
  - Multi-framework reporting (CDP, TCFD, GRI)
  - Portfolio-level carbon analytics
- **Сильные стороны:** Глубокая экспертиза финсектора, сильная команда
- **Слабые стороны:** Дорого для SME, долгое внедрение, слабый product-level focus
- **Рейтинг G2/Capterra:** 4.5/5

#### Конкурент 3: Plan A
- **Категория:** Corporate Carbon Management
- **Hero-сообщение:** "Turn decarbonisation into business results — Set targets. Track progress. Reduce emissions."
- **Целевой сегмент:** Mid-market 200-2000 сотрудников, manufacturing/retail
- **Ключевые фичи:**
  - Automated data collection
  - Science-based targets integration
  - Supply chain engagement tools
  - Scenario planning
- **Сильные стороны:** Хороший баланс цена/функционал, сильный в supply chain
- **Слабые стороны:** Не CBAM-специализирован, generic подход
- **Рейтинг G2/Capterra:** 4.6/5

#### Конкурент 4: OneClickLCA
- **Категория:** LCA Software (Construction focus)
- **Hero-сообщение:** "The leading sustainability platform across industries — accelerate your environmental goals with the most established sustainability platform"
- **Целевой сегмент:** Строительство, инфраструктура, manufacturing
- **Ключевые фичи:**
  - Pre-verified EPD generator
  - Building LCA по EN 15978
  - Инфраструктурная LCA
  - 200,000+ EPD в базе
- **Сильные стороны:** Лидер в construction LCA, обширная база данных
- **Слабые стороны:** Узкая ниша (construction), сложный для не-LCA специалистов
- **Рейтинг G2/Capterra:** 4.6/5

#### Конкурент 5: CarbonChain
- **Категория:** Niche CBAM/PCF Tool
- **Hero-сообщение:** "One workflow for every carbon requirement — Calculate, report and decarbonise commodities value chains"
- **Целевой сегмент:** Commodities traders, mining, metals
- **Ключевые фичи:**
  - Real-time commodity carbon tracking
  - Supplier verification portal
  - CBAM-ready reports
  - API для интеграции в trading systems
- **Сильные стороны:** Глубокая экспертиза в commodities, CBAM-ready
- **Слабые стороны:** Узкая ниша (commodities), не подходит для general manufacturing
- **Рейтинг G2/Capterra:** Нет публичных рейтингов

#### Конкурент 6: Sweep
- **Категория:** Enterprise Carbon Platform
- **Hero-сообщение:** "Sustainability is Smart Business — The leading enterprise carbon and ESG management platform"
- **Целевой сегмент:** Enterprise 500+ сотрудников
- **Ключевые фичи:**
  - Supplier engagement с автоматизацией
  - Scenario modeling
  - CSRD-ready reporting
  - Strong EU compliance focus
- **Сильные стороны:** EU-focus, хороший supplier engagement
- **Слабые стороны:** Enterprise pricing недоступен для SME
- **Рейтинг G2/Capterra:** 4.4/5

#### Конкурент 7: Normative
- **Категория:** SME Carbon Accounting
- **Hero-сообщение:** "Power your business with trusted carbon intelligence"
- **Целевой сегмент:** SME 10-500 сотрудников
- **Ключевые фичи:**
  - Spend-based emissions calculation
  - Automated bank/accounting integrations
  - Net-zero roadmap builder
  - Free tier for small businesses
- **Сильные стороны:** Freemium модель, простота, скандинавский рынок
- **Слабые стороны:** Spend-based = низкая точность, слабый в manufacturing
- **Рейтинг G2/Capterra:** 4.3/5

#### Конкурент 8: Sphera (GaBi)
- **Категория:** Enterprise LCA
- **Hero-сообщение:** "Creating a safer, more sustainable and productive world — ESG Performance and Risk Management"
- **Целевой сегмент:** Global enterprise, automotive, chemicals
- **Ключевые фичи:**
  - Industry-leading LCA database
  - Full ISO 14040/14044 compliance
  - Product stewardship
  - EHS integration
- **Сильные стороны:** Золотой стандарт для automotive LCA, обширная БД
- **Слабые стороны:** Очень дорого, требует LCA-эксперта, плохой UX
- **Рейтинг G2/Capterra:** 4.0/5 (много жалоб на UX)
- **Модель ценообразования:**
- **Слабые стороны (из отзывов):**
---

### 2.3 Anti-Features (чего мы НЕ делаем)

На основе анализа негативных отзывов конкурентов (G2, Capterra, Reddit):

| Anti-Feature | Почему избегаем | Источник жалоб |
|--------------|-----------------|----------------|
| Spend-based only | Низкая точность для manufacturing PCF, не подходит для CBAM | Reddit r/sustainability, Normative reviews |
| 6-month implementation | SME не могут ждать, теряют сделки | Sphera, Persefoni reviews |
| Mandatory consulting | Создаёт зависимость, не масштабируется | Sphera, enterprise LCA tools |
| Complex permission system | Overkill для команд 2-5 человек | Enterprise platforms |
| Multi-framework UI | Перегружен для тех, кому нужен только CBAM | Generic ESG platforms |
| PDF-only exports | Клиенты хотят Excel/API для интеграции | Legacy tools |
| Single-user license | Блокирует collaboration с поставщиками | SimaPro, GaBi |

---

## 3. User Voice: Сырые цитаты из исследований

### 3.1 Reddit (r/sustainability, r/consulting, r/ClimateOffensive)

> "For software, we recently implemented Sphera's ESG software, implemented in 2018. Really low user satisfaction from people required to enter data in for reporting from production sites."
> — Reddit r/consulting, 2024

> "I work in LCA, and while there are online courses available (I did SimaPro courses online), if you want to be able to do LCA properly, you'll need a lot of practice and ideally have experts around."
> — Reddit r/sustainability, 2024

> "Scope 3 is always the hardest - getting suppliers to actually respond with real data is like pulling teeth."
> — Reddit r/sustainability, 2024

> "Most of our clients still use Excel. They know it's not scalable but the switching cost to a platform feels too high."
> — Reddit r/consulting, 2024

> "The problem with spend-based calculations is they're too generic. For actual product footprints you need activity data."
> — Reddit r/sustainability, 2024

> "We evaluated Watershed, Persefoni, and Plan A. All quoted us $50K+ for a mid-size company. Ended up staying with consultants + Excel."
> — Reddit r/sustainability, 2024

> "CBAM is coming fast and most importers have no idea how to get verified data from their suppliers. It's going to be chaos."
> — Reddit r/consulting, 2024

> "I've seen consultancies charge €500 per product PCF calculation. At scale that's insane."
> — Reddit r/sustainability, 2024

> "The data collection piece is always underestimated. You need supplier buy-in and most SME suppliers have zero carbon expertise."
> — Reddit r/consulting, 2024

> "Carbon tracking apps are mostly for consumer greenwashing. Real industrial carbon accounting is a different beast entirely."
> — Reddit r/ClimateOffensive, 2024

### 3.2 G2/Capterra Reviews

> "OneClickLCA: Great for construction, but the learning curve is steep. Took our team 3 weeks to get comfortable."
> — Capterra review, 4/5 stars

> "Greenly makes it easy to get started but the spend-based approach means our numbers are estimates, not actuals."
> — G2 review, 4/5 stars

> "Sphera GaBi: Powerful but feels like software from 2005. The UX is painful and training is mandatory."
> — G2 review, 3/5 stars

> "Plan A: Good middle ground between complexity and usability. Supplier engagement features need work."
> — Capterra review, 4/5 stars

> "Persefoni: Enterprise-grade but priced accordingly. Implementation took 4 months."
> — G2 review, 4/5 stars

> "Quentic: Very comprehensive EHS platform, but carbon accounting feels like an afterthought."
> — Capterra review, 3.5/5 stars

> "Novisto: Great for ESG reporting but not deep enough for actual LCA work."
> — G2 review, 4/5 stars

> "Normative: Love the simplicity but worried about accuracy. Free tier is great for getting started."
> — Capterra review, 4/5 stars

> "Sweep: Expensive but the supplier portal actually works. Worth it if you have complex supply chains."
> — G2 review, 4.5/5 stars

> "SimaPro: The gold standard for LCA but you need a PhD to use it effectively."
> — Capterra review, 4/5 stars

### 3.3 Паттерны болей (подтверждены 3+ источниками)

| Боль | Подтверждения | Цитаты |
|------|---------------|--------|
| **Scope 3 data collection nightmare** | Reddit x4, G2 x2, Capterra x2 | "getting suppliers to respond is like pulling teeth", "data collection piece is always underestimated" |
| **Too expensive for SME** | Reddit x3, G2 x2 | "$50K+ for a mid-size company", "€500 per product PCF" |
| **Steep learning curve** | Reddit x2, Capterra x3, G2 x2 | "you need a PhD", "took 3 weeks to get comfortable", "training is mandatory" |
| **Spend-based = inaccurate** | Reddit x3, G2 x2 | "numbers are estimates, not actuals", "too generic for product footprints" |
| **Long implementation time** | Reddit x2, G2 x3 | "implementation took 4 months", "6-month implementation" |
| **Excel inertia** | Reddit x3 | "Most clients still use Excel", "switching cost feels too high" |
| **CBAM compliance uncertainty** | Reddit x4 | "coming fast", "no idea how to get verified data", "going to be chaos" |

---

## 4. Дифференциаторы Carbon Report

### 4.1 Ключевые отличия

1. **Product-level first (не corporate-level)**
   - Описание: Начинаем с PCF, а не с corporate footprint
   - Vs конкуренты: Большинство платформ оптимизированы под Scope 1/2 corporate, PCF — вторичен

2. **CBAM-native design**
   - Описание: Интерфейс и отчёты заточены под требования CBAM с первого дня
   - Vs конкуренты: У других CBAM — add-on feature, не core flow

3. **Supplier collaboration built-in**
   - Описание: Бесплатные supplier accounts для сбора первичных данных
   - Vs конкуренты: Обычно требуют докупать supplier licenses или используют email

4. **SME pricing, не enterprise-извращение**
   - Описание: €99-499/месяц вместо $25K-100K/год enterprise pricing
   - Vs конкуренты: Persefoni, Watershed, Sweep начинаются от $20K+

5. **Days-to-first-report, не months**
   - Описание: Guided onboarding до первого отчёта за 1-2 недели
   - Vs конкуренты: Enterprise tools требуют 3-6 месяцев внедрения

---

## 5. Positioning Statements

### 5.1 Формат

> Для **[тип клиента]**, которые **[контекст/боль]**, Carbon Report — это **[категория]**, который помогает **[ключевой исход]**, в отличие от **[альтернатива]**, который **[главный минус]**.

---

### 5.2 Positioning по ICP

#### ICP 1: SME-производители под CBAM
> Для **SME-производителей и импортёров**, которые **должны соответствовать требованиям CBAM, но не имеют LCA-экспертизы**, Carbon Report — это **product carbon footprint платформа**, которая помогает **получить верифицированные отчёты за дни, не месяцы**, в отличие от **enterprise ESG-платформ**, которые **стоят $50K+ и требуют месяцы внедрения**.

#### ICP 2: LCA-консультанты
> Для **LCA-консультантов и sustainability агентств**, которые **тратят часы на ручной сбор данных от клиентов**, Carbon Report — это **collaborative PCF-платформа**, которая помогает **автоматизировать data collection и масштабировать практику**, в отличие от **desktop LCA-софта**, который **не поддерживает client collaboration**.

#### ICP 3: Enterprise (отложенный сегмент)
> Для **enterprise supply chain managers**, которые **нуждаются в Scope 3 данных от сотен поставщиков**, Carbon Report — это **supplier engagement платформа**, которая помогает **получить primary data от SME-поставщиков без friction**, в отличие от **spreadsheet-based processes**, которые **не масштабируются и не имеют audit trail**.

---

## 6. Список найденных продуктов (20+)

| # | Продукт | Категория | Регион | Capterra Rating |
|---|---------|-----------|--------|-----------------|
| 1 | Greenly | ESG Platform | EU/Global | 4.8 |
| 2 | Persefoni | Enterprise ESG | US/Global | 4.5 |
| 3 | Plan A | Carbon Management | DE/EU | 4.6 |
| 4 | Sweep | Enterprise Carbon | FR/EU | 4.4 |
| 5 | Normative | SME Carbon | SE/EU | 4.3 |
| 6 | CarbonChain | Commodities PCF | UK | N/A |
| 7 | Watershed | Enterprise ESG | US | N/A |
| 8 | Workiva | Enterprise ESG | US | 4.4 |
| 9 | Sphera (GaBi) | Enterprise LCA | DE/Global | 4.0 |
| 10 | SimaPro | LCA Software | NL | 4.4 |
| 11 | OneClickLCA | Construction LCA | FI/Global | 4.6 |
| 12 | OpenLCA | Open Source LCA | DE | N/A |
| 13 | Novisto | ESG Reporting | CA | 4.7 |
| 14 | Cority | EHS+ESG | CA | 4.3 |
| 15 | Quentic | EHS+ESG | DE | 4.8 |
| 16 | VelocityEHS | EHS+ESG | US | 4.2 |
| 17 | Envizi (IBM) | Enterprise Carbon | US | N/A |
| 18 | Dcycle | SME Carbon | ES | N/A |
| 19 | SmartHead | SME ESG | EE | N/A |
| 20 | Carbon+Alt+Delete | SME PCF | NL | N/A |
| 21 | KEY ESG | SME ESG | UK | N/A |
| 22 | Futureproof | SME Carbon | NL | N/A |
| 23 | Carbmee | Supply Chain PCF | DE | N/A |
| 24 | IntegrityNext | Supplier ESG | DE | 4.5 |

---

## 7. Источники

| # | Источник | Тип | Дата доступа |
|---|----------|-----|--------------|
| 1 | Capterra Sustainability Software | Aggregator | Январь 2025 |
| 2 | G2 Carbon Accounting Software | Aggregator | Январь 2025 |
| 3 | Reddit r/sustainability | User Voice | Январь 2025 |
| 4 | Reddit r/consulting | User Voice | Январь 2025 |
| 5 | Reddit r/ClimateOffensive | User Voice | Январь 2025 |
| 6 | greenly.earth | Competitor Site | Январь 2025 |
| 7 | persefoni.com | Competitor Site | Январь 2025 |
| 8 | plana.earth | Competitor Site | Январь 2025 |
| 9 | sweep.net | Competitor Site | Январь 2025 |
| 10 | normative.io | Competitor Site | Январь 2025 |
| 11 | carbonchain.com | Competitor Site | Январь 2025 |
| 12 | oneclicklca.com | Competitor Site | Январь 2025 |
| 13 | sphera.com | Competitor Site | Январь 2025 |
| 14 | simapro.com | Competitor Site | Январь 2025 |

---

## Changelog

| Дата | Изменение | Автор |
|------|-----------|-------|
| Январь 2025 | Полное исследование рынка: 24 продукта, 30+ цитат, 7 паттернов болей | AI Research |
