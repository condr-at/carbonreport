# Product Vision & Problem Brief

## 1. Product Vision One‑Pager

### Контекст и проблема
Компании сталкиваются с растущим давлением регуляторов и клиентов, требующих отчетность по множеству стандартов (ISO 14067, CBAM, EPD и десятки других). Сегодня они вынуждены собирать данные вручную под каждый формат отдельно, плодя Excel-файлы и email-цепочки. Это приводит к дублированию работы, потере данных и срыву сроков. Бизнес рискует получить штрафы или потерять контракты из-за неспособности быстро предоставить корректный отчет в нужном формате.

### Видение продукта
**Carbon Report** — это рабочее пространство для сбора данных об углеродном следе продукта и коллаборации с поставщиками. Платформа решает одну ключевую боль: **собрать нужные данные от нужных людей к дедлайну**.

Данные вводятся один раз в универсальный датасет. Затем платформа генерирует отчёты в любом из 44+ форматов (CBAM, ISO 14067, EPD, CDP, TCFD и др.) — каждый формат это просто **шаблон экспорта**, а не отдельный продукт.

> **Фокус запуска (beachhead):** CBAM и ISO 14067/PCF — здесь самая острая регуляторная боль и чёткий дедлайн (2026). Остальные 40+ шаблонов доступны как опция для "длинного хвоста" запросов.

> **Важно:** Платформа — это инструмент для сбора, хранения и организации данных. Мы снимаем рутину, но не берем на себя юридические риски. Финальная верификация данных и ответственность за поданную отчетность остаются на стороне внутреннего эксперта компании или внешнего аудитора.

### Ключевая ценность

**Core (одинаково для всех отчётов):**
*   **Управляемый сбор данных:** Таблица данных + рассылка запросов ответственным (коллегам, поставщикам) с отслеживанием статуса. Это решает 80% боли независимо от типа отчёта.
*   **Единый датасет:** Данные вводятся один раз и переиспользуются для любого формата отчётности.
*   **Прозрачность:** Кто, что, когда должен прислать — видно на одном экране.

**Output (зависит от выбранного шаблона):**
*   **44+ шаблонов экспорта:** CBAM, ISO 14067, EPD, CDP, TCFD, EcoVadis, client-specific formats и др.
*   **Каждый шаблон = маппинг датасета → требуемый формат.** Не отдельный продукт, а опция экспорта.

> **TODO (future research):** Провести landscape по каждому из 44 шаблонов — какие реально востребованы, где конкуренция, где "брошенки" без хороших инструментов.

### Архитектура продукта (визуализация)

```
┌────────────────────────────────────────────────────────┐
│                    CORE VALUE                          │
│   (одинаково для всех 44 отчётов)                      │
│                                                        │
│   • Data collection workflow                           │
│   • Рассылка запросов ответственным                    │
│   • Статус-трекинг                                     │
│   • Единый датасет                                     │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│                   OUTPUT (шаблоны)                     │
├─────────────────┬───────────────────┬──────────────────┤
│   BEACHHEAD     │    SECONDARY      │   LONG TAIL      │
│   (focus)       │    (available)    │   (available)    │
├─────────────────┼───────────────────┼──────────────────┤
│ • CBAM          │ • CDP             │ • GRESB          │
│ • ISO 14067/PCF │ • EcoVadis        │ • B-Corp         │
│ • EPD           │ • TCFD            │ • Bank templates │
│                 │ • SBTi            │ • SFDR           │
│                 │                   │ • 30+ других     │
└─────────────────┴───────────────────┴──────────────────┘
```

### Дифференциация
*   **От Excel + Email:** Структурированное хранение, валидация данных, статус-трекинг запросов и версионность, чего нет в таблицах.
*   **От Generic ESG-платформ:** Глубокий фокус на *продуктовом* уровне (Product Carbon Footprint) и специфике ISO 14067/CBAM, а не просто общий корпоративный учет (Scope 1-3).
*   **От LCA-софта (Life Cycle Assessment):** Ориентация на бизнес-пользователя и комплаенс-менеджера, а не на научного эксперта. Простой UX, "wizard"-подход и фокус на отчетности, а не на сложном научном моделировании.

### Видение “после”
В мире с Carbon Report комплаенс-офицер видит статус готовности отчетов по всем продуктам на одном дашборде. Запросы поставщикам уходят в один клик, а ответы автоматически привязываются к нужным полям проекта. Подготовка к аудиту занимает дни, а не недели, так как вся доказательная база собрана и структурирована.

---

## 2. Problem & Jobs‑to‑Be‑Done Brief

### Универсальная боль (Core Job)

**Job 0: Собрать данные от распределённой команды к дедлайну**

Это базовая боль, которая одинакова для ВСЕХ типов отчётности:
- Нужно получить данные от N людей (коллеги, поставщики, подрядчики)
- Каждый "забывает", "занят", "не понимает что нужно"
- Дедлайн приближается, а таблица пустая
- Email-переписка теряется, статус непонятен

**Carbon Report решает именно эту боль** — независимо от того, для какого отчёта собираются данные.

---

### Business Situations (контексты применения)

Ниже — три типичных ситуации, в которых возникает Job 0. Они отличаются **триггером** и **форматом output**, но core-проблема одна:

### Job 1: Обеспечить соответствие обязательным регуляторным требованиям (Compliance & Risk)
*   **Ключевые отчеты:** CBAM, CSRD, EU ETS, UK SECR, SEC Climate, EU MRV.
*   **Личная боль (Human Side):** "Мне дали три недели на первую CBAM-декларацию, но я только на четвертый день разобрался, какие вообще данные нужны. CFO спрашивает 'когда будет готово', таможенный брокер присылает напоминания, а я сижу с PDF на 200 страниц методологии и пытаюсь понять, что такое 'precursor emissions'. Если мы не сдадим вовремя или ошибемся в расчетах — это прямо штраф в бюджете компании. И все будут знать, кто виноват."
*   **Контекст:** Компания работает на регулируемых рынках (ЕС, Великобритания, США) или в специфических отраслях (авиация, морские перевозки) и обязана отчитываться по закону.
*   **Триггер:** Жесткий дедлайн подачи декларации (например, квартальный отчет CBAM) или введение нового регулирования.
*   **Текущий костыль:** Разрозненные Excel-файлы под каждый регламент, ручной мониторинг изменений в законах, высокий риск штрафов за ошибки.
*   **Как помогает Carbon Report:** Единый датасет автоматически мапится на требования разных регуляторов. Ввели данные один раз — получили отчеты и для CBAM, и для CSRD.

### Job 2: Выиграть тендер и удовлетворить требования B2B-клиентов (Sales & Growth)
*   **Ключевые отчеты:** EPD / ISO 14067, CDP, EcoVadis, Client Scope 3 Packages.
*   **Личная боль (Human Side):** "Сегодня утром Sales написал: 'Клиент дал 48 часов на PCF-отчет, иначе берут конкурента'. У меня уже три таких запроса висят с прошлой недели от других клиентов. Каждый раз приходится заново собирать одни и те же данные, потому что у всех свои форматы анкет. Я перестал нормально спать — постоянно думаю, сколько миллионов мы теряем из-за того, что я физически не успеваю."
*   **Контекст:** Крупные заказчики требуют экологическую прозрачность (PCF, ESG-рейтинг) как условие контракта или участия в цепочке поставок.
*   **Триггер:** Получение тендерной документации или запрос от ключевого клиента ("заполните нашу анкету по выбросам").
*   **Текущий костыль:** Авральный сбор данных по почте, заполнение бесконечных клиентских опросников вручную, риск потери контракта из-за долгого ответа.
*   **Как помогает Carbon Report:** Быстрая генерация продуктовых отчетов (PCF) и возможность выгрузить данные в формате, требуемом клиентом, или предоставить верифицированный сертификат.

### Job 3: Привлечь финансирование и повысить инвестиционную привлекательность (Strategy & Finance)
*   **Ключевые отчеты:** TCFD, GRESB, SBTi, B-Corp, Bank Templates, SFDR.
*   **Личная боль (Human Side):** "Третью неделю пытаюсь получить данные по Scope 3 от Head of Procurement — он читает мои письма (вижу read receipts), но не отвечает. Logistics вообще перестали брать трубку. Консультанты за €15K сидят и ждут цифр, которые я не могу выбить."
*   **Контекст:** Инвесторы, банки и акционеры оценивают климатические риски и ESG-зрелость компании.
*   **Триггер:** Подготовка к раунду инвестиций, получение "зеленого" кредита или годовой отчет.
*   **Текущий костыль:** Найм дорогих консультантов; данные собираются вручную и теряются.
*   **Как помогает Carbon Report:** Тот же workflow сбора данных, но с **шаблонами экспорта** под TCFD, SBTi, bank templates.

> **⚠️ Приоритет:** Job 3 — это **secondary use case** (длинный хвост). Beachhead = Job 1 (CBAM) и Job 2 (PCF для B2B). Job 3 работает "из коробки" благодаря универсальному датасету, но не является фокусом marketing/sales на старте.

---

## 3. Источники исследований

> **Дисклеймер:** Описания "личных болей" (Human Side) основаны на синтезе данных из официальных отраслевых отчетов и верифицированных публикаций. Ниже указаны источники с рабочими ссылками.

---

### Верифицированные источники (с рабочими URL)

#### 1. European Commission — Carbon Border Adjustment Mechanism
**URL:** https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en

**Ключевые факты из источника:**
- CBAM вступает в дефинитивный режим с 1 января 2026 (переходный период 2023-2025)
- Импортеры обязаны регистрироваться как "authorised CBAM declarants"
- Применяется к cement, iron and steel, aluminium, fertilisers, electricity, hydrogen
- "Carbon leakage occurs when companies based in the EU move carbon-intensive production abroad" — именно это регуляция призвана предотвратить
- Сложность: "the objective of the transitional period is to serve as a pilot and learning period for all stakeholders (importers, producers and authorities)"
- Публикуются регулярные Call for Evidence по методологии расчетов — показывает, что даже ЕС признает неопределенности

**Релевантность для Job 1 (Compliance):** Официально подтверждает сложность compliance — ЕС сам признает, что нужен "learning period" для всех сторон.

---

#### 2. IBM Think — What is Carbon Accounting?
**URL:** https://www.ibm.com/think/topics/carbon-accounting

**Ключевые факты из источника:**

**О проблеме данных:**
> "Data stranded in silos or kept in spreadsheets: Metrics for carbon, energy, waste, water and social indicators are captured from different sources across the business, making them difficult to access in a consolidated way for reporting and decision-making."

> "Data quality is inconsistent and unreliable: Data captured manually increases the likelihood of inaccurate or incomplete data due to errors."

> "Time and cost to report on sustainability are high: The process of capturing the activity data and managing and allocating the factors required for calculating emissions is time and labor-intensive when managed manually with spreadsheets."

**О Scope 3 и поставщиках:**
> "Scope 3 emissions present a significant opportunity for organizations to engage their suppliers to accelerate decarbonization globally."

> "Significant barriers exist to report and reduce Scope 3 emissions. The biggest challenges include:
> - Establishing boundaries between scopes
> - Capturing reliable data in a systematic and auditable way across numerous suppliers and locations
> - Selecting emission factors to derive accurate calculations
> - Engaging with suppliers to both report and reduce emissions"

**О внутренних стейкхолдерах:**
> "Although commitments, targets, strategy and GHG accounting might stem from one team within your organization, the data must be sourced from a larger pool of internal stakeholders. Ideally, a diverse group will be engaged and accountable for collecting and sharing data from the representative business units."

> "Getting everyone's buy-in can be difficult, so it's important to be mindful of the challenges and address the level of effort required up front."

**О работе с утилити-данными:**
> "This seems straightforward until you consider that there are thousands of utility providers with different rules and processes for data provision. The resulting variability in each utility's willingness and ability to provide data creates difficulties, particularly for organizations with multiple facilities in different geographic locations."

**Релевантность:** Прямо описывает проблемы, которые решает Carbon Report — разрозненные данные, ручной сбор, сложность работы с внутренними департаментами и поставщиками.

---

#### 3. WBCSD — Reporting Matters 2025
**URL:** https://www.wbcsd.org/resources/reporting-matters-2025-embedding-change-accelerating-impact/

**Контекст:** World Business Council for Sustainable Development объединяет 250+ глобальных компаний (Honda, Accenture, BCG, McKinsey, Holcim и др.) и регулярно публикует research по sustainability reporting.

**Релевантность:** Подтверждает, что крупнейшие компании мира инвестируют в улучшение sustainability reporting — это не нишевая проблема.

---

#### 4. GHG Protocol — Scope 3 Calculation Guidance
**URL:** https://ghgprotocol.org/scope-3-calculation-guidance

**Ключевой факт:**
- Scope 3 emissions составляют в среднем 5.5x больше, чем прямые выбросы компании (Scope 1)
- Это де-факто стандарт для расчета выбросов, на который ссылаются CDP, TCFD, SBTi

**Релевантность для Job 3 (Strategy & Finance):** Объясняет, почему Scope 3 — это не просто "еще один отчет", а ключевой показатель для инвесторов.

---

#### 5. CDP — Supply Chain Programme
**URL:** https://www.cdp.net/en/supply-chain

**Контекст:** CDP (бывший Carbon Disclosure Project) — крупнейшая платформа для disclosure экологических данных. 23,000+ компаний раскрываются ежегодно.

**Релевантность для Job 2 (Sales & Growth):** Подтверждает масштаб запросов от клиентов на экологические данные.

---

#### 6. Science Based Targets initiative (SBTi)
**URL:** https://sciencebasedtargets.org/reports

**Контекст:** Стандарт для научно-обоснованных климатических целей, который требуют инвесторы и включают в ESG-рейтинги.

**Релевантность для Job 3:** Подтверждает, что SBTi-валидация — это реальное требование для привлечения "зеленого" финансирования.

---

### Обоснование "личных болей" (Human Side)

Формулировки в разделе Jobs-to-Be-Done основаны на паттернах, описанных в верифицированных источниках:

| Боль | Подтверждение из IBM Think |
|------|---------------------------|
| "Я не понимаю методологию" | "Many organizations run their annual carbon accounting process by using spreadsheets, which leads to enhanced risk" |
| "Коллеги не отвечают на запросы" | "Data must be sourced from a larger pool of internal stakeholders... Getting everyone's buy-in can be difficult" |
| "Данные разбросаны по Excel" | "Data stranded in silos or kept in spreadsheets... making them difficult to access in a consolidated way" |
| "Нет времени на аврал" | "Time and cost to report on sustainability are high... time and labor-intensive when managed manually" |
| "Scope 3 — это кошмар" | "Significant barriers exist to report and reduce Scope 3 emissions... Capturing reliable data across numerous suppliers" |
| "Поставщики не отвечают" | "Data might be held by suppliers who don't have systems and processes in place to share it" |

---

### Рекомендации для дальнейшей верификации

Для подтверждения конкретных цифр и цитат рекомендуется:

1. **Провести 5-10 интервью с целевыми клиентами** — sustainability managers в производственных компаниях
2. **Запросить доступ к отчетам Big4:**
   - Deloitte CBAM Readiness Survey (поиск: "deloitte cbam survey")
   - PwC CSRD Readiness Report (поиск: "pwc csrd readiness")
   - KPMG Sustainability Reporting Survey
3. **Мониторить LinkedIn #CBAM #CSRD** — практики регулярно делятся опытом
4. **Подписаться на CDP и EcoVadis newsletters** — они публикуют статистику response rates и challenges
