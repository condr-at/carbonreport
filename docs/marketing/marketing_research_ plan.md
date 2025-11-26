# Marketing Research Plan

## Desk research v1: быстрый контур без клиентов

Цель: за 1–2 вечера собрать минимальный объём данных из открытых источников, чтобы не писать артефакты “в вакууме”. Все выводы помечаем как **предварительные, требующие валидации интервью/пилотами**.

### Шаг 0. Две ключевые персоны и два режима поиска

Перед началом desk‑research зафиксировать две базовые персоны и разные «языки поиска» для каждой.

1. **Эксперт / консультант / in‑house sustainability pro**
   - Как ищет: по стандартам и аббревиатурам — `"CSRD reporting software"`, `"ISO 14067 tool"`, `"CBAM data"`, `"PCAF financed emissions"`, `"LCA software"`, `"TCFD reporting"`.
   - Где искать его голос:
     - Профильные отчёты, whitepapers.
     - Блоги консультантов и LCA‑софтверов.
     - LinkedIn‑посты, статьи на Medium/Substack от специалистов.
   - Что валидируем desk‑research’ем:
     - Какие инструменты они уже используют (Excel, Python, конкретные LCA‑пакеты).
     - Какие bottleneck’и они сами называют (масштабирование, сбор данных от клиентов/поставщиков, подготовка клиентских пакетов отчётности).

2. **Операционный владелец боли (не эксперт по стандартам)**
   - Как ищет: человеческими фразами —
     - `"how to prepare cbam report"`,
     - `"client asked for carbon footprint report what to do"`,
     - `"scope 3 data collection tool"`,
     - `"template for sustainability report for bank"`,
     - `"example sustainability report for customers"`.
   - Где искать его голос:
     - Вопросы на Reddit/StackExchange/Quora.
     - Комментарии под статьями/вебинарами по CBAM/CSRD/PCF.
     - Посты людей из ops/finance/sales, у которых «вдруг появилась задача сделать отчёт».
   - Что валидируем desk‑research’ем:
     - Как они формулируют проблему (без терминов стандартов).
     - К каким решениям тянутся (шаблоны, калькуляторы, консалтинг, готовое ПО).

Во всех шагах ниже важно **собирать примеры и для expert‑языка, и для human‑языка**, помечая источник персоны.

### Шаг 1. Карта рынка и трендов

1. **Google Trends / News (expert + human)**
  - Expert‑запросы: `CBAM`, `"EU CBAM"`, `"ISO 14067"`, `"product carbon footprint"`, `"LCA software"`, `"carbon accounting software"`, `"CSRD reporting"`, `"TCFD reporting"`.
  - Human‑запросы: `"how to prepare cbam report"`, `"carbon footprint report for clients"`, `"template sustainability report for bank"`, `"scope 3 data collection"`.
  - Что фиксировать:
    - Какие темы/ключевые слова растут во времени.
    - В каких странах/отраслях чаще всплывают.
    - Какие формулировки используют в новостях и блогах (язык проблем, не только регуляторики).

2. **Обзоры и аналитика (по семействам репортов)**
  - Для базового семейства (product CF / CBAM / ISO 14067):
    - Ищем: `"CBAM software" review`, `"LCA software comparison"`, `"product carbon footprint tools"`.
  - Для других семейств (примерно, не исчерпывающе):
    - **CSRD / TCFD / UK TCFD**: `"CSRD reporting software"`, `"double materiality tool"`, `"TCFD reporting platform"`.
    - **Финансовый сектор / SFDR / PCAF**: `"SFDR reporting tool"`, `"PCAF financed emissions software"`, `"ESG reporting for asset managers"`.
    - **EU ETS / MRV / CORSIA**: `"EU ETS compliance software"`, `"ETS reporting platform"`, `"CORSIA MRV software"`.
    - **Rating / frameworks (CDP, EcoVadis, GRESB, B‑Corp)**: `"CDP disclosure software"`, `"EcoVadis score improvement"`, `"GRESB data management"`, `"B Corp impact assessment tool"`.
  - Что фиксировать:
    - Список классов решений (LCA‑tools, ESG‑platforms, niche CBAM/CSRD/SFDR‑tools, консалтинг+tool).
    - Оценки сложности/стоимости внедрения.
    - Стандартные боли, которые авторы подчёркивают.

Результат шага: черновой список категорий решений и трендов → основа для раздела **Market Landscape Overview**.

### Шаг 2. Сбор конкурентов и их позиционирования

1. **Поисковые выдачи (Google / каталог‑обзоры)**
  - Expert‑запросы: `"product carbon footprint software"`, `"ISO 14067 software"`, `"CBAM reporting tool"`, `"LCA SaaS"`, `"CSRD software"`, `"SFDR reporting platform"`.
  - Human‑запросы: `"tool to collect carbon data from suppliers"`, `"software to manage sustainability reports"`, `"scope 1 2 3 calculator"`.
  - Выбрать 10–15 представителей: 3–5 LCA‑решений, 3–5 ESG‑платформ, 3–5 нишевых CBAM/PCF/CSRD/SFDR‑tools.

2. **Разбор сайтов конкурентов**
  Для каждого:
  - Как они формулируют **hero‑сообщение** (кто целевая, какую боль обещают снять).
  - Какие **ключевые фичи** выносят на первый экран (шаблоны отчётов, supplier data, аудит, dashboards и т.п.).
  - Какой **сегмент** явно/неявно таргетят (enterprise, SMB, consultants, отрасли).
  - Есть ли публичный **pricing**, как примерно моделируют цену (per org / per user / per project / per report).

Результат шага: заполненный черновик **Competitive Matrix** и первые заметки “чем мы точно не хотим быть”.

### Шаг 3. Черновой ICP и роли через LinkedIn

1. **Поиск людей и компаний (expert + human)**
  - Expert‑поиск:
    - LinkedIn search по title/keywords: `"Life Cycle Assessment"`, `"LCA"`, `"ESG"`, `"Sustainability"`, `"CSRD"`, `"TCFD"`, `"SFDR"`, `"PCAF"`.
    - Фильтры: консалтинговые фирмы, sustainability‑департаменты крупных компаний, отраслевые ассоциации.
  - Human‑поиск:
    - LinkedIn / Twitter / Reddit: люди с ролями `operations`, `finance`, `key account`, `procurement`, у которых в постах/описании фигурируют запросы клиентов/банков/регуляторов.

2. **Фиксация паттернов**
  - Типы компаний: размер, отрасль, экспорт в ЕС, попадание под CBAM/CSRD/SFDR и др.
  - Частые должности и уровни (manager, head, director, consultant) по **двум дорожкам** (expert vs operator).
  - Формулировки в описании ролей ("responsible for CBAM reporting", "prepare ESG reports for clients", "coordinate sustainability data" и т.д.).

Результат шага: сырой материал для **ICP Doc** и **Stakeholder Map** (какие роли точно существуют в реальном мире).

### Шаг 4. Боли и Jobs‑to‑Be‑Done из текстов

1. **Форумы и коммьюнити (главный источник human‑языка)**
  - Reddit: `r/sustainability`, `r/ESG`, `r/supplychain`, `r/consulting`, отраслевые сабы (поиск по `CBAM`, `LCA`, `carbon footprint`, `sustainability report`, `ESG report`).
  - Q&A‑площадки: StackExchange (Sustainable Living / Workplace), Quora, профильные форумы.
  - Комментарии под видеозаписями/вебинарами по CBAM/CSRD/PCF на YouTube и сайтах консультантов.
  - Ищем формулировки с явными сигналами боли: _"I have no idea how to…"_, _"our client asked for…"_, _"we struggle with…"_, _"Excel hell"_, _"no clear template"_.

2. **Кейсы и блоги конкурентов (преимущественно expert‑язык)**
  - Что клиенты говорят в цитатах: “до” (какой ад), “после” (что стало проще).
  - Какие процессы они описывают: сбор данных от поставщиков, подготовка отчёта, работа с аудиторами, внутренняя координация.
  - Какие именно стандарты, форматы отчётов и data‑points подчёркивают как сложные.

Результат шага: список 10–20 “сырых” болей и задач, из которых можно собрать **Problem & Jobs‑to‑Be‑Done Brief** (с пометкой “desk research v1”).

### Шаг 5. Черновой positioning и гипотезы

1. **Positioning Statement(s)**
  - На основе Market Landscape + JTBD:
    - Кто наш ранний сегмент (например, SME‑производители под CBAM или LCA‑консультанты).
    - Какие 1–2 боли мы берём в фокус на старте.
    - Чем принципиально отличаемся от heavy LCA и generic ESG.
  - Сформулировать 1–2 позиционирования в формате, описанном в `marketing_research.md`.

2. **Hypothesis Backlog (черновик)**
  - Из всего собранного выше выписать 10–15 гипотез:
    - про ICP (кто наш лучший ранний клиент),
    - про ценность (что для них “вау‑результат”),
    - про каналы (где они “живут” онлайн),
    - про монетизацию (какой порядок цен выглядит реалистично по сравнению с конкурентами).
  - У каждой гипотезы явно указать источник: **desk research**, чтобы потом приоритизировать интервью/пилоты для проверки.

Результат шага: базовый набор материалов, с которыми уже можно:
- заполнять ключевые разделы в `marketing_research.md` (рынок, конкуренты, ICP, позиционирование, гипотезы),
- и готовиться к следующему этапу — валидации спроса.

---

## Phase 2: Pre-Beta Validation (Zero-Touch / Без интервью)

**Цель:** Снизить риск разработки ненужного функционала и проверить готовность платить (Willingness to Pay) до написания кода.

### 1. Review Mining (Анализ негатива конкурентов)
Вместо того чтобы спрашивать "что вам нужно", смотрим "что вас бесит в текущих решениях".
*   **Источники:** G2, Capterra, TrustRadius. Ищем профили: Sphera, Persefoni, Greenly, OneClickLCA.
*   **Фильтр:** Читаем отзывы **1, 2 и 3 звезды**.
*   **Что ищем:** "complex", "expensive", "hidden fees", "support is slow", "Excel export failed".
*   **Результат:** Список "Anti-Features" (чего мы точно НЕ делаем).

### 2. Smoke Test через Lead Magnet (Проверка боли)
Проверяем, болит ли проблема настолько, чтобы человек совершил действие.
*   **Артефакт:** Простой бесплатный ресурс (Excel-шаблон, PDF-гайд по кодам ТН ВЭД).
*   **Действие:** Дистрибуция в LinkedIn/Reddit.
*   **Метрика:** Если CTR < 1% или никто не скачивает бесплатный шаблон — проблема не горячая.

### 3. Fake Door Testing (Проверка цен и фич)
**Суть:** Показываем кнопку или тариф, которого еще нет, и считаем клики как выражение твердого намерения.

*   **Сценарий А: Валидация цены (The Velvet Rope)**
    *   *Где:* Страница Pricing.
    *   *Что:* Тариф "Professional: €299/mo" с кнопкой **"Start 14-day Trial"**.
    *   *Механика:* Пользователь кликает, ожидая ввод карты.
    *   *Результат (Modal):* "Вы попали в ранний список! Мы еще не принимаем оплату. Для вас этот тариф будет **бесплатным** на время беты в обмен на фидбек. [Email Field]".
    *   *Вывод:* Клик по кнопке с ценой = готовность платить. Регистрация после этого = супер-горячий лид.

*   **Сценарий Б: Валидация интеграций**
    *   *Где:* Блок Integrations.
    *   *Что:* Иконки SAP / 1C / Oracle с кнопкой **"Connect"**.
    *   *Результат:* "Интеграция в разработке. Сообщить, когда будет готова?".
    *   *Вывод:* Понимаем, какая ERP реально нужна рынку, а не гадаем.

---

## Черновой Hypothesis Backlog (Digital Signals Edition)

Ниже — набор гипотез, адаптированный под проверку **без интервью**. Мы смотрим на поведение (клики, конверсии), а не слушаем слова.

| ID  | Persona / Фокус | Гипотеза | Как проверять (Digital Signal) | Условия опровержения |
|-----|------------------|-----------|---------------|----------------------|
| H1  | Оператор | Для оператора важнее процесс и статус, чем методология. | **Landing Page:** Heatmap кликов на блок "Process Dashboard" vs "LCA Methodology". | На лендинге блок "Процесс" пролистывают не глядя, задерживаются на "Методологии". |
| H2  | Оператор | Оператор описывает задачу по‑человечески, а не стандартом. | **SEO/Search:** Сравнить частотность запросов "CBAM report help" vs "ISO 14067 software". **Onboarding:** Поле "Опишите задачу" — пишут ли своими словами? | Запросов по стандартам в 10 раз больше; поле "опишите задачу" заполняют названием стандарта. |
| H3  | Эксперт | Эксперту критично переиспользовать dataset. | **Feature Fake Door:** Кнопка "Import from previous project" в демо-скриншотах — кликают ли? | Кнопку игнорируют. |
| H4  | Консультант | Консультанты хотят использовать платформу как delivery‑tool. | **Pricing Fake Door:** Клик по тарифу "Consultant Plan (5 clients)" vs "Single Company". | Консультанты выбирают тариф "Single Company" или вообще не кликают на тарифы. |
| H5  | SME оператор | SME приходят после боли с Excel. | **Lead Magnet:** Скачивают ли шаблон "Excel vs SaaS comparison"? | Низкий CTR на контент про сравнение с Excel. |
| H6  | Оператор | Главный канал боли — сообщества. | **Distribution Test:** Пост в Reddit/LinkedIn vs SEO-статья. Откуда выше конверсия в Waitlist? | Трафик с сообществ "холодный"; SEO дает более качественные лиды. |
| H7  | Эксперт | За маппинг данных готовы платить отдельно. | **Fake Door:** Чекбокс "Add Regulatory Mapping (+$50/mo)" при выборе тарифа. | Никто не ставит галочку в чекбокс доп. услуги. |
| H8  | Эксперт | “Чёрный ящик” неприемлем. | **Review Mining:** Поиск отзывов со словом "black box", "transparency" у конкурентов. | Отсутствие жалоб на непрозрачность расчетов у конкурентов-"калькуляторов". |
| H9  | Оператор | Страх штрафа продает лучше, чем экономия времени. | **Ad A/B Test:** Заголовки "Save 2 weeks" vs "Avoid CBAM fines". Какой CTR выше? | Баннеры про "экономию времени" кликают чаще, чем про "штрафы". |
| H10 | SME оператор | Готовы платить €200-300/мес (Self-service). | **Pricing Fake Door:** Конверсия в клик "Start Trial" на тарифе €299. | Высокий Bounce rate на странице цен; кликают только на "Contact Sales" или "Free Tier". |

Продолжай добавлять строки тем же форматом, опираясь на **действия** (клик, скачивание, отзыв), а не слова.
