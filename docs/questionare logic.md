# Questionnaire Decision Engine Spec

Цель этого документа — формально описать логику опросника так, чтобы её можно было **однозначно** реализовать в коде без интерпретаций.

## 1. Справочник вопросов

Каждый вопрос имеет стабильный `id`, текст, тип и список вариантов.

### 1.1. Структура вопроса (концепция)

- `id`: строка (`"Q0.1"` и т.п.)
- `group`: логический блок (`"profile"`, `"initiator"`, `"regulator"`, `"client"`, ...)
- `text`: отображаемый текст
- `type`: `single` \| `multi` \| `free-text`
- `options`: массив вариантов (для `single`/`multi`)

### 1.2. Структура варианта ответа

- `code`: короткий код (например, `"EU"`, `"CLIENT"`, `"A"`)
- `label`: отображаемый текст

### 1.3. Базовый профиль компании (Q0.x)

**Q0.1 — Страна регистрации**
- `id`: `Q0.1`
- `group`: `profile`
- `type`: `single`
- `options`:
	- `EU` — ЕС
	- `UK` — Великобритания
	- `US` — США
	- `RU` — Россия
	- `OTHER` — Другая

**Q0.2 — Отрасль**
- `id`: `Q0.2`
- `group`: `profile`
- `type`: `single`
- `options` (укрупнённые коды):
	- `MANUFACTURING` — Производство
	- `ENERGY` — Энергетика
	- `TRANSPORT` — Транспорт
	- `AVIATION` — Авиация
	- `MARITIME` — Морские перевозки
	- `FINANCE` — Финансы
	- `IT` — IT/цифровые сервисы
	- `CONSTRUCTION` — Строительство/недвижимость
	- `OTHER` — Другое

**Q0.3 — Размер компании (сотрудники)**
- `id`: `Q0.3`
- `group`: `profile`
- `type`: `single`
- `options`:
	- `EMP_<50`
	- `EMP_50_249`
	- `EMP_250_499`
	- `EMP_500+`

**Q0.4 — Годовой оборот (EUR)**
- `id`: `Q0.4`
- `group`: `profile`
- `type`: `single`
- `options`:
	- `REV_<10M`
	- `REV_10_40M`
	- `REV_40_50M`
	- `REV_>50M`

**Q0.5 — Публичная компания**
- `id`: `Q0.5`
- `group`: `profile`
- `type`: `single`
- `options`:
	- `PUBLIC` — Публичная (есть листинг)
	- `PRIVATE` — Частная

**Q0.6 — Активы / AUM (для финсектора)**
- `id`: `Q0.6`
- `group`: `profile`
- `type`: `single`
- `options`:
	- `AUM_<500M`
	- `AUM_500M_1B`
	- `AUM_>1B`

### 1.4. Инициатор (Q1.1)

**Q1.1 — Кто инициировал запрос?**
- `id`: `Q1.1`
- `group`: `initiator`
- `type`: `multi` (может быть несколько одновременно)
- `options`:
	- `REGULATOR` — Регулятор (госорган)
	- `CLIENT_EXISTING` — Текущий клиент
	- `CLIENT_PROSPECT` — Потенциальный клиент
	- `INTERNAL_TOP` — Руководство / владелец (внутренний запрос)
	- `BANK_INVESTOR` — Банк / инвестор
	- `PROGRAM` — Программа / рейтинг (CDP, SBTi и т.п.)
	- `EXCHANGE` — Биржа
	- `INTERNAL_OTHER` — Внутренняя инициатива (команда ESG и т.п.)

Далее в этом документе логика по блокам будет ссылаться на эти `code`.

### 1.5. Государственные требования (Q2.x)

**Q2.1 — Какой орган или юрисдикция?**
- `id`: `Q2.1`
- `group`: `regulator`
- `type`: `single`
- `options`:
	- `EU` — ЕС
	- `UK` — Великобритания (FCA/BEIS)
	- `US` — США (SEC/EPA)
	- `RU` — Россия
	- `OTHER_REG` — Другое государство/орган

**Q2.2 — Какое требование ЕС применимо?** (задаётся если `Q2.1=EU`)
- `id`: `Q2.2`
- `group`: `regulator`
- `type`: `multi`
- `options`:
	- `CSRD`
	- `EU_ETS`
	- `CBAM`
	- `EU_TAXONOMY`
	- `SFDR`
	- `OTHER_EU`

**Q2.2a — Для каких товаров требуется CBAM?**
- `id`: `Q2.2a`
- `group`: `regulator`
- `type`: `multi`
- `options`:
	- `STEEL`
	- `CEMENT`
	- `FERTILIZERS`
	- `ALUMINUM`
	- `HYDROGEN`
	- `ELECTRICITY`
	- `OTHER_CBAM`

**Q2.3 — Какое требование UK?** (если `Q2.1=UK`)
- `id`: `Q2.3`
- `group`: `regulator`
- `type`: `multi`
- `options`:
	- `UK_SECR`
	- `UK_TCFD`
	- `OTHER_UK`

**Q2.4 — Какое требование США?** (если `Q2.1=US`)
- `id`: `Q2.4`
- `group`: `regulator`
- `type`: `multi`
- `options`:
	- `SEC_CLIMATE`
	- `EPA_MRR`
	- `CARB`
	- `OTHER_US`

**Q2.5 — Какое требование РФ?** (если `Q2.1=RU`)
- `id`: `Q2.5`
- `group`: `regulator`
- `type`: `multi`
- `options`:
	- `RU_GHG_MONITORING`
	- `SPPB`
	- `OTHER_RU`

### 1.6. Клиентские запросы (Q3.x)

**Q3.1 — Что именно просит клиент?**
- `id`: `Q3.1`
- `group`: `client`
- `type`: `multi`
- `options`:
	- `COMPANY_INFO` — О компании/корпоративный след
	- `PRODUCT_INFO` — О продукте/услуге
	- `UPSTREAM` — Выбросы на upstream-плече
	- `TEMPLATE` — Заполнить их шаблон
	- `CERTIFICATE` — Получить сертификат
	- `SCOPE3_DETAIL` — Рассчитать Scope 3

**Q3.2 — Формат корпоративного запроса?** (если `COMPANY_INFO`)
- `id`: `Q3.2`
- `group`: `client`
- `type`: `single`
- `options`:
	- `ISO_14064`
	- `CDP`
	- `GHG_PROTOCOL`
	- `ECOVADIS`
	- `CUSTOM`

**Q3.3 — Какой продукт/портфель требуется?**
- `id`: `Q3.3`
- `group`: `client`
- `type`: `free-text`

**Q3.3a — Нужна ли сертификация для продукта?**
- `id`: `Q3.3a`
- `group`: `client`
- `type`: `single`
- `options`:
	- `CERT_REQUIRED`
	- `CERT_NOT_REQUIRED`

**Q3.4 — Что входит в запрос на upstream?**
- `id`: `Q3.4`
- `group`: `client`
- `type`: `multi`
- `options`:
	- `PRODUCTION`
	- `PACKAGING`
	- `TRANSPORT`
	- `WAREHOUSING`
	- `OTHER_UPSTREAM`

**Q3.5 — Какой сертификат нужен?** (если `Q3.1` содержит `CERTIFICATE`)
- `id`: `Q3.5`
- `group`: `client`
- `type`: `single`
- `options`:
	- `CARBON_NEUTRAL`
	- `ISO_14064`
	- `ISO_14001`
	- `EPD`
	- `OTHER_CERT`

**Q3.6 — Какие категории Scope 3 нужны клиенту?**
- `id`: `Q3.6`
- `group`: `client`
- `type`: `multi`
- `options`: 15 категорий GHG Protocol (`PURCHASED_GOODS`, `CAPITAL_GOODS`, `FUEL_ENERGY`, `UPSTREAM_TRANSPORT`, `WASTE`, `BUSINESS_TRAVEL`, `COMMUTING`, `UPSTREAM_LEASED`, `DOWNSTREAM_TRANSPORT`, `PROCESSING`, `USE_PHASE`, `END_OF_LIFE`, `DOWNSTREAM_LEASED`, `FRANCHISES`, `INVESTMENTS`).

### 1.7. Финансовые институты (Q4.x)

**Q4.1 — Зачем информация банку/инвестору?**
- `id`: `Q4.1`
- `group`: `financial`
- `type`: `single`
- `options`:
	- `CREDIT`
	- `INVESTMENT`
	- `BOND`
	- `BANK_INTERNAL_REPORT`

**Q4.2 — Какой формат/стандарт требуется?**
- `id`: `Q4.2`
- `group`: `financial`
- `type`: `multi`
- `options`:
	- `TCFD`
	- `GHG_VERIFIED`
	- `CDP`
	- `ISO_14064`
	- `BANK_TEMPLATE`

### 1.8. Программы и рейтинги (Q5.x)

**Q5.1 — Какая программа или рейтинг?**
- `id`: `Q5.1`
- `group`: `program`
- `type`: `multi`
- `options`:
	- `CDP`
	- `SBTI`
	- `RE100`
	- `ECOVADIS`
	- `GRESB`
	- `BCORP`
	- `OTHER_PROGRAM`

### 1.9. Биржевые требования (Q6.x)

**Q6.1 — На какой бирже листинг/план листинга?**
- `id`: `Q6.1`
- `group`: `exchange`
- `type`: `single`
- `options`:
	- `EU_EXCHANGE`
	- `LSE`
	- `NYSE_NASDAQ`
	- `HKEX`
	- `OTHER_EXCHANGE`

### 1.10. Внутренняя инициатива (Q7.x)

**Q7.1 — Зачем компании расчёт?**
- `id`: `Q7.1`
- `group`: `internal`
- `type`: `multi`
- `options`:
	- `UNDERSTAND_FOOTPRINT`
	- `PREPARE_FOR_REGULATION`
	- `SET_TARGETS`
	- `REPUTATION`
	- `TENDERS`
	- `ENERGY_EFFICIENCY`

**Q7.2 — Это первый расчёт?**
- `id`: `Q7.2`
- `group`: `internal`
- `type`: `single`
- `options`:
	- `FIRST_TIME_NO_VERIF`
	- `FIRST_TIME_WITH_VERIF`
	- `ALREADY_DONE`

**Q7.2a — Нужна ли верификация первого расчёта?**
- `id`: `Q7.2a`
- `group`: `internal`
- `type`: `single`
- `options`:
	- `VERIFICATION_REQUIRED`
	- `VERIFICATION_NOT_REQUIRED`

**Q7.3 — К какому будущему требованию готовитесь?**
- `id`: `Q7.3`
- `group`: `internal`
- `type`: `multi`
- `options`: ссылки на основные требования (`CSRD`, `SEC_CLIMATE`, `SBTI`, `CLIENT_SPECIFIC`, `OTHER_FUTURE`).

**Q7.4 — Цели по выбросам будут публичными?**
- `id`: `Q7.4`
- `group`: `internal`
- `type`: `single`
- `options`:
	- `PUBLIC_TARGETS`
	- `INTERNAL_TARGETS`
	- `SBTI`

**Q7.5 — Для репутации что именно нужно?**
- `id`: `Q7.5`
- `group`: `internal`
- `type`: `multi`
- `options`:
	- `COMPANY_CERT`
	- `COMPANY_PUBLICATION`
	- `PRODUCT_CERT`
	- `PRODUCT_PUBLICATION`

**Q7.5a — К чему относится репутационный запрос?**
- `id`: `Q7.5a`
- `group`: `internal`
- `type`: `single`
- `options`:
	- `COMPANY`
	- `PRODUCT`

**Q7.6 — Что требуется для тендеров?**
- `id`: `Q7.6`
- `group`: `internal`
- `type`: `multi`
- `options`:
	- `CORPORATE_FOOTPRINT`
	- `PRODUCT_PCF`
	- `ISO_14064`
	- `EPD`
	- `REDUCTION_PLAN`
	- `RE_CERTIFICATES`

### 1.11. Операции и границы учёта (Q8.x)

**Q8.1 — Какие собственные источники выбросов?**
- `id`: `Q8.1`
- `group`: `operations`
- `type`: `multi`
- `options`:
	- `STATIONARY_COMBUSTION`
	- `MOBILE_COMBUSTION`
	- `FUGITIVE`
	- `PROCESS_EMISSIONS`
	- `AGRICULTURE`
	- `OTHER_SCOPE1`

**Q8.2 — Какие виды закупленной энергии?**
- `id`: `Q8.2`
- `group`: `operations`
- `type`: `multi`
- `options`:
	- `GRID_ELECTRICITY`
	- `ON_SITE_RENEWABLE`
	- `HEAT_STEAM`
	- `COGEN`
	- `PPA`

**Q8.3 — Уровень покрытия Scope 3?**
- `id`: `Q8.3`
- `group`: `operations`
- `type`: `single`
- `options`:
	- `SCOPE3_FULL`
	- `SCOPE3_BASIC`
	- `SCOPE1_2_ONLY`

### 1.12. Экспорт/импорт и CBAM (Q9.x)

**Q9.1 — Есть ли экспорт в ЕС?**
- `id`: `Q9.1`
- `group`: `trade`
- `type`: `single`
- `options`:
	- `YES`
	- `NO`
	- `PLANNED`

**Q9.2 — Какие товары экспортируются?**
- `id`: `Q9.2`
- `group`: `trade`
- `type`: `multi`
- `options`:
	- `CBAM_GOODS`
	- `NON_CBAM_GOODS`

**Q9.3 — Вы выступаете импортёром CBAM или поставщиком?**
- `id`: `Q9.3`
- `group`: `trade`
- `type`: `single`
- `options`:
	- `SUPPLIER_ONLY`
	- `IMPORTER_OF_RECORD`

### 1.13. Сроки, ресурсы и бюджет (Q10.x)

**Q10.1 — Какой желаемый срок выполнения?**
- `id`: `Q10.1`
- `group`: `constraints`
- `type`: `single`
- `options`:
	- `<=2M`
	- `3_6M`
	- `>6M`

**Q10.2 — Есть ли внутренняя команда/данные?**
- `id`: `Q10.2`
- `group`: `constraints`
- `type`: `single`
- `options`:
	- `NO_TEAM`
	- `SOME_DATA`
	- `FULL_DATA`

**Q10.3 — Бюджет на проект?**
- `id`: `Q10.3`
- `group`: `constraints`
- `type`: `single`
- `options`:
	- `LOW`
	- `MEDIUM`
	- `HIGH`

### 1.14. Отраслевая специфика (Q11.x)

**Q11.1 — Для авиации: есть международные рейсы?**
- `id`: `Q11.1`
- `group`: `sector`
- `type`: `single`
- `options`:
	- `DOMESTIC_ONLY`
	- `INTERNATIONAL`

**Q11.2 — Для морского флота: судна заходят в ЕС?**
- `id`: `Q11.2`
- `group`: `sector`
- `type`: `single`
- `options`:
	- `NO_EU_PORTS`
	- `EU_PORTS`

**Q11.3 — Для финансов: какие продукты?**
- `id`: `Q11.3`
- `group`: `sector`
- `type`: `multi`
- `options`:
	- `FUNDS`
	- `LOANS`
	- `ASSET_MANAGEMENT`
	- `INSURANCE`
	- `OTHER_FINANCE`

**Q11.4 — Для строительства/недвижимости: какие сертификации?**
- `id`: `Q11.4`
- `group`: `sector`
- `type`: `multi`
- `options`:
	- `LEED`
	- `BREEAM`
	- `GRESB`
	- `CRREM`
	- `OTHER_BUILDING`

**Q11.5 — Для IT/цифрового сектора: инфраструктура?**
- `id`: `Q11.5`
- `group`: `sector`
- `type`: `multi`
- `options`:
	- `OWN_DATA_CENTERS`
	- `CLOUD_PROVIDERS`
	- `EDGE_INFRA`
	- `OTHER_IT`

---

## 2. Справочник отчётов

Каждый отчёт/формат — отдельная сущность с ID. Таблицы соответствия используют только эти ID.

### 2.1. Структура отчёта (концепция)

- `id`: строка (`"CSRD"`, `"CBAM"`, `"CORP_GHG"` и т.п.)
- `name`: человекочитаемое имя
- `category`: `"REGULATORY"` \| `"CLIENT"` \| `"FINANCIAL"` \| `"PROGRAM"` \| `"INTERNAL"` \| `"PRODUCT"` \| `"SECTOR"`
- `priorityLevel`: `"CRITICAL"` (🔴) \| `"HIGH"` (🟡) \| `"MEDIUM"`/`"LOW"` (🟢)
- `verificationLevel`: `"MANDATORY"` \| `"RECOMMENDED"` \| `"OPTIONAL"` \| `"NOT_NEEDED"`
- `scopes`: структура с флагами (`scope1`, `scope2`, `scope3` + детализация, если нужна)
- `frequency`: строка (`"ANNUAL"`, `"QUARTERLY"`, `"ONE_OFF"` и т.п.)
- `notes`: краткие замечания (штрафы, юридический статус)

### 2.2. Примеры ключевых отчётов

Ниже зафиксируем только те ID и поля, которые уже используются в правилах. Детализация (сроки, бюджет) может быть вынесена в отдельные матрицы.

- `CSRD`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`
	- `verificationLevel`: `MANDATORY`
	- `scopes`: { scope1: true, scope2: true, scope3: true }

- `EU_ETS`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`
	- `verificationLevel`: `MANDATORY`
	- `scopes`: { scope1: true, scope2: false, scope3: false }

- `CBAM`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`
	- `verificationLevel`: `MANDATORY` (с 2026)

- `SEC_CLIMATE`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`

- `UK_SECR`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`

- `UK_TCFD`
	- `category`: `REGULATORY`/`FINANCIAL`
	- `priorityLevel`: `CRITICAL`

- `HKEX_ESG`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`

- `SFDR`
	- `category`: `REGULATORY`/`FINANCIAL`
	- `priorityLevel`: `CRITICAL`

- `CORSIA`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`

- `EU_MRV`
	- `category`: `REGULATORY`
	- `priorityLevel`: `CRITICAL`

- `CORP_GHG` (корпоративный GHG по GHG Protocol)
	- `category`: `INTERNAL`/`CLIENT`/`FINANCIAL`
	- `priorityLevel`: `HIGH` (по умолчанию)

- `CORP_GHG_SIMPLIFIED`
	- `category`: `INTERNAL`
	- `priorityLevel`: `MEDIUM`

- `ISO_14064_CERT`
	- `category`: `CLIENT`/`INTERNAL`
	- `priorityLevel`: `HIGH`

- `CDP_DISCLOSURE`
	- `category`: `PROGRAM`
	- `priorityLevel`: `HIGH`

- `SBTI_COMMITMENT`
	- `category`: `PROGRAM`/`INTERNAL`
	- `priorityLevel`: `HIGH`

- `EPD_OR_ISO_14067`
	- `category`: `PRODUCT`
	- `priorityLevel`: `HIGH`

- `PRODUCT_PCF`
	- `category`: `PRODUCT`
	- `priorityLevel`: `HIGH`

(Полный перечень отчётов можно расширить на основе оригинальной таблицы.)

---

## 3. Формат правила «условия → отчёты»

Каждое правило описывает один сценарий из таблицы соответствия.

### 3.1. Структура правила (концепция)

- `id`: числовой или строковый идентификатор правила (например, `1`, `"R1_CSRD"`)
- `conditions`: массив предикатов
- `outputs`: список отчётов/действий
- `priorityOverride?`: опционально — если нужно задать приоритет сценария относительно других
- `notes?`: пояснения для человека/UX

### 3.2. Структура предиката

Базовые типы предикатов (можно реализовывать как enum в коде):

- `Q_EQUALS` — значение вопроса равно одному коду
	- `questionId`: напр. `"Q0.1"`
	- `value`: например, `"EU"`

- `Q_INCLUDES` — для multi-select: ответ содержит код
	- `questionId`: напр. `"Q1.1"`
	- `value`: напр. `"REGULATOR"`

- `Q_ANY_OF` — вопрос равен одному из множества кодов
	- `questionId`
	- `values`: массив кодов

- `Q_NOT` — отрицание другого предиката
- (дополнительно можно ввести `AND`/`OR` дерева, но на первом шаге достаточно списка предикатов с неявным AND.)

### 3.3. Структура результата правила

- `outputs.reports`: массив `reportId`
- `outputs.tags?`: дополнительные теги (например, `"MANDATORY"`, `"OPTIONAL"`)
- `outputs.level?`: явный приоритет уровня (если отличается от приоритета отчёта)

---

## 4. Примеры формализованных правил

Ниже — несколько ключевых правил из раздела ОБЯЗАТЕЛЬНЫЕ ОТЧЁТЫ, переписанные в формальном формате.

### Правило 1 — CSRD (ЕС, крупная публичная компания)

- `id`: `R1_CSRD`
- `conditions`:
	- `Q_EQUALS(Q0.1, EU)`
	- `(Q0.3 in {EMP_250_499, EMP_500+} OR Q0.4 in {REV_40_50M, REV_>50M})`
	- `Q_EQUALS(Q0.5, PUBLIC)`
- `outputs`:
	- `reports: [CSRD]`
	- `level: CRITICAL`
	- `tags: ["REGULATORY_MANDATORY"]`

(Во внутреннем представлении OR можно разложить на два правила — по размеру и по обороту, если так удобнее реализовывать.)

### Правило 2 — EU ETS (попадает в схему)

- `id`: `R2_EU_ETS`
- `conditions`:
	- `Q_EQUALS(Q0.1, EU)`
	- `Q_ANY_OF(Q0.2, [ENERGY, MANUFACTURING])`
	- `HAS_FLAG(EU_ETS_COVERED_INSTALLATIONS) // отдельный вопрос или бинарный флаг`
- `outputs`:
	- `reports: [EU_ETS]`
	- `level: CRITICAL`

### Правило 3 — CBAM (экспорт CBAM-товаров в ЕС)

Предполагаем существование вопросов:
- `Q9.1` — экспорт в ЕС? (`YES`/`NO`/`PLANNED`)
- `Q9.2` — какие товары? (`CBAM_GOODS`/`OTHER`)

- `id`: `R3_CBAM`
- `conditions`:
	- `Q_EQUALS(Q9.1, YES)`
	- `Q_EQUALS(Q9.2, CBAM_GOODS)`
- `outputs`:
	- `reports: [CBAM]`
	- `level: CRITICAL`

### Правило 12 — ISO 14064 по запросу клиента

Предполагаем:
- `Q3.1` — что просит клиент? (`COMPANY`, `PRODUCT`, ...)
- `Q3.2` — формат? (`ISO_14064`, `CDP`, `GHG_PROTOCOL`, `ECOVADIS`)

- `id`: `R12_CLIENT_ISO14064`
- `conditions`:
	- `Q_INCLUDES(Q1.1, CLIENT_EXISTING)`
	- `Q_EQUALS(Q3.1, COMPANY)`
	- `Q_EQUALS(Q3.2, ISO_14064)`
- `outputs`:
	- `reports: [ISO_14064_CERT]`
	- `level: HIGH`

### Правило 35 — Упрощённый GHG (внутренняя инициатива, первый раз, без верификации)

Предполагаем:
- `Q7.1` — зачем? (`UNDERSTAND_FOOTPRINT`, ...)
- `Q7.2` — первый раз? (`FIRST_TIME_NO_VERIF`, `FIRST_TIME_WITH_VERIF`, `ALREADY_DONE`)

- `id`: `R35_INTERNAL_SIMPLE_GHG`
- `conditions`:
	- `Q_INCLUDES(Q1.1, INTERNAL_TOP)` или `Q_INCLUDES(Q1.1, INTERNAL_OTHER)`
	- `Q_EQUALS(Q7.1, UNDERSTAND_FOOTPRINT)`
	- `Q_EQUALS(Q7.2, FIRST_TIME_NO_VERIF)`
- `outputs`:
	- `reports: [CORP_GHG_SIMPLIFIED]`
	- `level: MEDIUM`

### 4.4. Каталог правил по блокам

Ниже приведён формальный перечень всех правил (соответствует 68 строкам исходной таблицы). Для каждого правила фиксируем `ruleId`, источник (№ строки брифа), ключевые условия и итоговые отчёты/эффекты. В коде это можно представить как единый массив `Rule[]`.

#### 4.4.1. Регуляторные требования (#1–#11)

| Rule ID | Src # | Ключевые условия | Отчёт |
| --- | --- | --- | --- |
| `R1_CSRD` | 1/9 | `Q0.1=EU` ∧ `Q0.5=PUBLIC` ∧ (`Q0.3≥EMP_250_499` ∨ `Q0.4≥REV_40_50M`) **ИЛИ** `Q6.1=EU_EXCHANGE` | `CSRD` |
| `R2_EU_ETS` | 2 | `Q0.1=EU` ∧ `Q0.2∈{ENERGY,MANUFACTURING}` ∧ `EU_ETS_COVERED=true` | `EU_ETS` |
| `R3_CBAM` | 3 | `Q9.1∈{YES,PLANNED}` ∧ `Q9.2` содержит `CBAM_GOODS` | `CBAM` |
| `R4_UK_SECR` | 4 | `Q0.1=UK` ∧ `Q0.5=PUBLIC` ∧ `Q0.3≥EMP_250_499` | `UK_SECR` |
| `R5_SEC_CLIMATE` | 5 | `Q0.1=US` ∧ `Q0.5=PUBLIC` ∧ `Q6.1=NYSE_NASDAQ` | `SEC_CLIMATE` |
| `R6_CORSIA` | 6/54 | `Q0.2=AVIATION` ∧ `Q11.1=INTERNATIONAL` | `CORSIA` |
| `R7_EU_MRV` | 7/55 | `Q0.2=MARITIME` ∧ `Q11.2=EU_PORTS` | `EU_MRV` (с отметкой про переход в EU ETS) |
| `R8_SFDR` | 8/56 | `Q0.1=EU` ∧ `Q0.2=FINANCE` ∧ `Q0.6≥AUM_500M_1B` | `SFDR` |
| `R10_UK_TCFD` | 10 | `Q6.1=LSE` (premium) ∨ (`Q0.1=UK` ∧ `Q2.3` содержит `UK_TCFD`) | `UK_TCFD` |
| `R11_HKEX_ESG` | 11 | `Q6.1=HKEX` ∧ `Q0.5=PUBLIC` | `HKEX_ESG` |

#### 4.4.2. Клиентские требования (#12–#21)

| Rule ID | Src # | Условия | Отчёт |
| --- | --- | --- | --- |
| `R12_CLIENT_ISO14064` | 12 | `Q1.1` включает `CLIENT_*` ∧ `Q3.1=COMPANY_INFO` ∧ `Q3.2=ISO_14064` | `ISO_14064_CERT` |
| `R13_CLIENT_CDP` | 13/29 | `Q3.2=CDP` **ИЛИ** `Q5.1` содержит `CDP` | `CDP_DISCLOSURE` |
| `R14_CLIENT_CORP_GHG` | 14 | `Q3.2=GHG_PROTOCOL` | `CORP_GHG` |
| `R15_CLIENT_ECOVADIS` | 15/32 | `Q3.2=ECOVADIS` **ИЛИ** `Q5.1=ECOVADIS` | `ECOVADIS_SCORE` |
| `R16_CLIENT_EPD` | 16/44 | `Q3.1=PRODUCT_INFO` ∧ `Q3.3a=CERT_REQUIRED` | `EPD_OR_ISO_14067` |
| `R17_CLIENT_PCF` | 17/45 | `Q3.1=PRODUCT_INFO` ∧ `Q3.3a=CERT_NOT_REQUIRED` | `PRODUCT_PCF` |
| `R18_CLIENT_SCOPE3` | 18 | `Q3.1` включает `UPSTREAM` | `CLIENT_SCOPE3_PACKAGE` |
| `R19_CLIENT_TEMPLATE` | 19 | `Q3.1` включает `TEMPLATE` | `CLIENT_TEMPLATE_FILL` |
| `R20_CLIENT_SCOPE3_DETAIL` | 20 | `Q3.6` содержит ≥1 категорию | `SCOPE3_DETAILED` |
| `R21_CLIENT_CARBON_NEUTRAL` | 21 | `Q3.1` включает `CERTIFICATE` ∧ `Q3.5=CARBON_NEUTRAL` | `CARBON_NEUTRAL_CERT` |

#### 4.4.3. Банки и инвесторы (#22–#28)

| Rule ID | Src # | Условия | Отчёт |
| --- | --- | --- | --- |
| `R22_BANK_TCFD` | 22 | `Q1.1` включает `BANK_INVESTOR` ∧ `Q4.2` содержит `TCFD` | `TCFD_REPORT` |
| `R23_BANK_GHG_VERIFIED` | 23/27 | `Q4.2` содержит `GHG_VERIFIED` **ИЛИ** формат не указан (`Q4.2=∅`) | `CORP_GHG_VERIFIED` |
| `R24_BANK_CDP` | 24 | `Q4.2` содержит `CDP` | `CDP_DISCLOSURE` |
| `R25_BANK_ISO` | 25 | `Q4.2` содержит `ISO_14064` | `ISO_14064_CERT` |
| `R26_BANK_TEMPLATE` | 26 | `Q4.2` содержит `BANK_TEMPLATE` | `BANK_TEMPLATE_FILL` |
| `R28_BANK_DATA_ONLY` | 28 | `Q4.1=BANK_INTERNAL_REPORT` | `SCOPE123_DATASET` |

#### 4.4.4. Программы и рейтинги (#29–#34)

| Rule ID | Src # | Условия | Отчёт |
| --- | --- | --- | --- |
| `R29_PROGRAM_CDP` | 29 | `Q5.1` содержит `CDP` | `CDP_DISCLOSURE` |
| `R30_PROGRAM_SBTI` | 30/41 | `Q5.1` содержит `SBTI` **ИЛИ** `Q7.4=SBTI` | `SBTI_COMMITMENT` + `CORP_GHG` |
| `R31_PROGRAM_RE100` | 31 | `Q5.1` содержит `RE100` | `RE100_REPORTING` |
| `R32_PROGRAM_ECOVADIS` | 32 | `Q5.1` содержит `ECOVADIS` | `ECOVADIS_SCORE` |
| `R33_PROGRAM_GRESB` | 33/58 | `Q5.1` содержит `GRESB` **ИЛИ** `Q11.4` включает `GRESB/CRREM` | `GRESB_ASSESSMENT` |
| `R34_PROGRAM_BCORP` | 34 | `Q5.1` содержит `BCORP` | `BCORP_IMPACT_ASSESSMENT` |

#### 4.4.5. Внутренние инициативы (#35–#53)

| Rule ID | Src # | Условия | Отчёт |
| --- | --- | --- | --- |
| `R35_INTERNAL_SIMPLE` | 35 | `Q7.1=UNDERSTAND_FOOTPRINT` ∧ `Q7.2=FIRST_TIME_NO_VERIF` | `CORP_GHG_SIMPLIFIED` |
| `R36_INTERNAL_FULL_VERIFIED` | 36 | `Q7.1=UNDERSTAND_FOOTPRINT` ∧ `Q7.2=FIRST_TIME_WITH_VERIF` | `CORP_GHG_VERIFIED` |
| `R37_INTERNAL_ANNUAL` | 37 | `Q7.2=ALREADY_DONE` | `CORP_GHG_ANNUAL` |
| `R38_INTERNAL_PREP` | 38 | `Q7.1=PREPARE_FOR_REGULATION` ∧ `Q7.3` указывает регулятор | `PREP_GHG_<standard>` |
| `R39_INTERNAL_PUBLIC` | 39/43 | `Q7.1=SET_TARGETS` ∧ `Q7.4=PUBLIC_TARGETS` **ИЛИ** `Q7.5` содержит `COMPANY_PUBLICATION` | `CORP_GHG_PUBLIC` |
| `R40_INTERNAL_INTERNAL` | 40 | `Q7.4=INTERNAL_TARGETS` | `CORP_GHG_INTERNAL` |
| `R41_INTERNAL_SBTI` | 41 | `Q7.4=SBTI` | `SBTI_COMMITMENT` |
| `R42_INTERNAL_COMPANY_CERT` | 42 | `Q7.5` содержит `COMPANY_CERT` | `ISO_14064_CERT` / `CARBON_NEUTRAL_CERT` |
| `R44_INTERNAL_PRODUCT_CERT` | 44 | `Q7.5` содержит `PRODUCT_CERT` | `EPD_OR_ISO_14067` |
| `R45_INTERNAL_PRODUCT_PCF` | 45 | `Q7.5` содержит `PRODUCT_PUBLICATION` | `PRODUCT_PCF` |
| `R46_INTERNAL_TENDER_CORP` | 46 | `Q7.1=TENDERS` ∧ `Q7.6` содержит `CORPORATE_FOOTPRINT` | `CORP_GHG` |
| `R47_INTERNAL_TENDER_PCF` | 47 | `Q7.6` содержит `PRODUCT_PCF` | `PRODUCT_PCF` |
| `R48_INTERNAL_TENDER_ISO` | 48 | `Q7.6` содержит `ISO_14064` | `ISO_14064_CERT` |
| `R49_INTERNAL_TENDER_EPD` | 49 | `Q7.6` содержит `EPD` | `EPD_OR_ISO_14067` |
| `R50_INTERNAL_TENDER_PLAN` | 50 | `Q7.6` содержит `REDUCTION_PLAN` | `CLIMATE_ACTION_PLAN` |
| `R51_INTERNAL_TENDER_RECS` | 51 | `Q7.6` содержит `RE_CERTIFICATES` | `RECs_OR_PPA_STRATEGY` |
| `R52_INTERNAL_ENERGY_AUDIT` | 52 | `Q7.1=ENERGY_EFFICIENCY` | `ENERGY_AUDIT_SCOPE12` |
| `R53_INTERNAL_GENERIC` | 53 | `Q1.1` содержит `INTERNAL_OTHER` | Применяются соответствующие правила 35–52 |

#### 4.4.6. Отраслевая специфика (#54–#60)

| Rule ID | Src # | Условия | Отчёт |
| --- | --- | --- | --- |
| `R54_SECTOR_CORSIA_DUP` | 54 | `Q0.2=AVIATION` ∧ `Q11.1=INTERNATIONAL` | `CORSIA` (подтверждение) |
| `R55_SECTOR_EU_MRV_DUP` | 55 | `Q0.2=MARITIME` ∧ `Q11.2=EU_PORTS` | `EU_MRV` |
| `R56_SECTOR_SFDR_DUP` | 56 | `Q0.2=FINANCE` ∧ `Q11.3` включает ЕС-активы | `SFDR` |
| `R57_SECTOR_BUILDING_CARBON` | 57 | `Q0.2=CONSTRUCTION` ∧ `Q11.4` содержит `LEED/BREEAM` | `BUILDING_CARBON_FOOTPRINT` |
| `R58_SECTOR_GRESB_CRREM` | 58 | `Q11.4` содержит `GRESB`/`CRREM` | `GRESB_ASSESSMENT` |
| `R59_SECTOR_IT_SCOPE2` | 59 | `Q0.2=IT` ∧ `Q11.5` содержит `OWN_DATA_CENTERS` | `SCOPE2_DETAILED` |
| `R60_SECTOR_IT_SCOPE3` | 60 | `Q0.2=IT` ∧ `Q11.5` содержит `CLOUD_PROVIDERS` | `SCOPE3_CATEGORY1_SUPPLIERS` |

#### 4.4.7. Комбинированные сценарии (#61–#64)

| Rule ID | Src # | Условия | Эффект |
| --- | --- | --- | --- |
| `R61_COMBO_REG_CLIENT` | 61 | `Q1.1` содержит `REGULATOR` ∧ `CLIENT_*` | Установить сортировку: регулятор ↦ приоритет 1, клиент ↦ 2 |
| `R62_COMBO_REG_INTERNAL` | 62 | `Q1.1` содержит `REGULATOR` ∧ `INTERNAL_*` | Пометить внутренние отчёты как «расширенные» |
| `R63_COMBO_CLIENT_BANK_INTERNAL` | 63 | `CLIENT_*` + `BANK_INVESTOR` + `INTERNAL_*` | Объединить `CORP_GHG_VERIFIED` как единый ответ для клиента/банка |
| `R64_COMBO_PROGRAM_INTERNAL` | 64 | `PROGRAM` + `INTERNAL_*` | Программный отчёт = базовый, внутренние KPI = дополнение |

#### 4.4.8. CBAM-специфика (#65–#68)

| Rule ID | Src # | Условия | Отчёт/предупреждение |
| --- | --- | --- | --- |
| `R65_CBAM_SUPPLIER_DATA` | 65 | `Q9.1=YES` ∧ `Q9.2=CBAM_GOODS` ∧ `Q9.3=SUPPLIER_ONLY` | `CBAM_DATA_PACKAGE` |
| `R66_CBAM_IMPORTER` | 66 | `Q9.3=IMPORTER_OF_RECORD` | `CBAM_REPORT` + `CBAM_ALLOWANCES` |
| `R67_CBAM_MONITOR` | 67 | `Q9.2=NON_CBAM_GOODS` | `CBAM_MONITORING_ALERT` |
| `R68_CBAM_PREP` | 68 | `Q9.1=PLANNED` ∧ `Q9.2=CBAM_GOODS` | `CBAM_PREP_METHOD` |

Эти таблицы работают как чек-лист при имплементации: каждая строка должна быть представлена объектом `Rule`. В случае сложных сценариев допускается разбивка на несколько правил с одним `Src #`.

---

## 5. Правила валидации (непротиворечивости)

Эти правила не добавляют новые отчёты, а **ограничивают** или **добавляют предупреждения**.

### 5.1. Формат правила валидации

- `id`: например, `V1_NO_CSRD_FOR_SMALL_PRIVATE`
- `if`: набор предикатов (как выше)
- `effect`:
	- `FORBID_REPORT(reportId)` \| `DOWNGRADE_PRIORITY(reportId)` \| `ADD_WARNING(code)`

### 5.2. Примеры правил валидации

**V1 — CSRD не применяется к малым частным компаниям (упрощённая модель)**

- `id`: `V1_NO_CSRD_FOR_SMALL_PRIVATE`
- `if`:
	- `Q_EQUALS(Q0.1, EU)`
	- `Q_EQUALS(Q0.5, PRIVATE)`
	- `Q0.3 in {EMP_<50, EMP_50_249}`
	- `Q0.4 in {REV_<10M, REV_10_40M}`
- `effect`:
	- `FORBID_REPORT(CSRD)`

**V2 — Не предлагать CBAM, если нет экспорта в ЕС**

- `id`: `V2_NO_CBAM_WITHOUT_EXPORT`
- `if`:
	- `Q_EQUALS(Q9.1, NO)`
- `effect`:
	- `FORBID_REPORT(CBAM)`

**V3 — Не предлагать CORSIA, если отрасль ≠ авиация**

- `id`: `V3_NO_CORSIA_IF_NOT_AVIATION`
- `if`:
	- `Q_NOT(Q_EQUALS(Q0.2, AVIATION))`
- `effect`:
	- `FORBID_REPORT(CORSIA)`

**V4 — Временная нереалистичность полного Scope 3**

Предполагаем вопрос `Q10.1` — желаемый срок (`<=2M`, `3_6M`, `>6M`).

- `id`: `V4_UNREALISTIC_SCOPE3_IN_SHORT_TIME`
- `if`:
	- `Q_EQUALS(Q10.1, <=2M)`
	- `SELECTED_REPORT_REQUIRES_FULL_SCOPE3` (например, `CSRD`, `SBTI_COMMITMENT`, `CORP_GHG_FULL_WITH_SCOPE3`)
- `effect`:
	- `ADD_WARNING("TIME_UNREALISTIC_FOR_FULL_SCOPE3")`

**V5 — Бюджет vs дорогие сертификации**

Предполагаем вопрос `Q10.3` — бюджет (`LOW`, `MEDIUM`, `HIGH`).

- `id`: `V5_LOW_BUDGET_VS_EXPENSIVE_CERTS`
- `if`:
	- `Q_EQUALS(Q10.3, LOW)`
	- `SELECTED_REPORT_IN([ISO_14064_CERT, EPD_OR_ISO_14067, CSRD])`
- `effect`:
	- `ADD_WARNING("BUDGET_TOO_LOW_FOR_CERTIFICATION")`

### 5.3. Полный перечень валидаций

Для реализации удобно завести отдельный массив `VALIDATION_RULES`, сгруппированный по типам ограничений:

| ID | Категория | Условия | Эффект |
| --- | --- | --- | --- |
| `V1_NO_CSRD_FOR_SMALL_PRIVATE` | Applicability | См. выше | `FORBID_REPORT(CSRD)` |
| `V2_NO_CBAM_WITHOUT_EXPORT` | Applicability | `Q9.1=NO` | `FORBID_REPORT(CBAM)` |
| `V3_NO_CORSIA_IF_NOT_AVIATION` | Applicability | `Q0.2≠AVIATION` | `FORBID_REPORT(CORSIA)` |
| `V4_UNREALISTIC_SCOPE3_IN_SHORT_TIME` | Constraints | `Q10.1<=2M` ∧ отчёт требует полного Scope 3 | `ADD_WARNING(TIME_UNREALISTIC...)` |
| `V5_LOW_BUDGET_VS_EXPENSIVE_CERTS` | Constraints | `Q10.3=LOW` ∧ выбран дорогой отчёт | `ADD_WARNING(BUDGET_TOO_LOW...)` |
| `V6_PRODUCT_ONLY_AVOIDS_CORP` | Consistency | `Q3.1=PRODUCT_INFO` ∧ нет других запросов | `DOWNGRADE_PRIORITY(CORP_GHG)` (кроме случаев CBAM/CSRD) |
| `V7_SCOPE3_REQUIRED_FOR_SBTI` | Completeness | `selectedReports` содержит `SBTI_COMMITMENT`, но `Q8.3≠SCOPE3_FULL` | `ADD_WARNING("SCOPE3_REQUIRED_FOR_SBTI")` |
| `V8_SCOPE3_NOT_REQUESTED` | Applicability | `Q8.3=SCOPE1_2_ONLY` ∧ отчёт требует Scope 3 | `ADD_WARNING("SCOPE3_DATA_NEEDED")` |
| `V9_DUPLICATE_PROGRAM_AND_CLIENT` | Dedup | `Q3.2=CDP` и `Q5.1=CDP` | объединить источники (добавить `sourceTags`) |
| `V10_MULTI_REGULATOR_CONFLICT` | Conflict | `Q2.2` содержит >1 регулятор, но сроки пересекаются | добавить `ADD_WARNING("MULTIPLE_REGULATORS_MANAGE_TIMELINE")` |
| `V11_CBAM_WITHOUT_SCOPE1_DATA` | Completeness | `selectedReports` содержит `CBAM`, но `Q8.1` пуст | `ADD_WARNING("CBAM_NEEDS_SCOPE1_DATA")` |
| `V12_VERIFICATION_REQUIRED_BUT_REFUSED` | Consistency | требуется верификация (ISO/CBAM/CSRD) ∧ `Q7.2a=VERIFICATION_NOT_REQUIRED` | `ADD_WARNING("VERIFICATION_MANDATORY")` |
| `V13_TIMELINE_AFTER_DEADLINE` | Constraints | `deadlineDate` (из отчёта) < `today+desiredTimeline` | `ADD_WARNING("DEADLINE_AT_RISK")` |
| `V14_PRIORITY_ESCALATION` | Conflict | Инициатор содержит `REGULATOR` + другие | автоматически повышает регуляторные отчёты до `CRITICAL` и понижает остальные |

Расширять список можно по мере появления новых комбинаций. Главное — все такие правила хранить отдельно от «позитивных» `Rule`.

---

## 6. Приоритизация отчётов в результате

После применения всех правил и валидаций, итоговый набор отчётов сортируется и группируется.

### 6.1. Уровни приоритета

1. `CRITICAL` (🔴) — регуляторные/штрафные отчёты (CSRD, CBAM, EU_ETS, SEC_CLIMATE, CORSIA, EU_MRV, SFDR и т.п.)
2. `HIGH` (🟡) — клиентские требования, банки/инвесторы, тендеры, публичные программы (CDP, SBTi и др.)
3. `MEDIUM/LOW` (🟢) — внутренние инициативы, добровольные отчёты, подготовительные шаги.

### 6.2. Приоритет внутри уровня (черновой порядок)

Для `CRITICAL` предложенный порядок:
- 1) `CBAM`, `EU_ETS`, `CORSIA`, `EU_MRV` (штрафы за тонну, привязка к операциям)
- 2) `CSRD`, `SEC_CLIMATE`, `SFDR`, `HKEX_ESG`, `UK_TCFD`

Для `HIGH`:
- 1) Клиентские с дедлайнами (ISO_14064_CERT, PRODUCT_PCF, EPD_OR_ISO_14067)
- 2) Банковские/инвесторские (TCFD, верифицированный GHG)
- 3) Программы с публичными обязательствами (SBTI_COMMITMENT, CDP_DISCLOSURE)

Это упрощённый порядок; при необходимости можно добавить более точный вес (`priorityScore`).

### 6.3. Расчёт итогового приоритета

Для устранения спорных ситуаций используем числовой скоринг:

```
priorityScore = baseScore(priorityLevel) + regulatoryBonus + initiatorBonus - constraintPenalty

baseScore(CRITICAL)=100,
baseScore(HIGH)=60,
baseScore(MEDIUM)=30.

regulatoryBonus = 10, если инициатор `REGULATOR` или отчёт категории `REGULATORY`.
initiatorBonus = 5, если инициатор `CLIENT`/`BANK`/`PROGRAM` совпадает с источником отчёта.
constraintPenalty = 10 за каждое предупреждение `TIME_UNREALISTIC`, `BUDGET_TOO_LOW`, и т.д.
```

Итоговые списки сортируются по `priorityScore` (desc) → `priorityLevel` → `category` → `ruleId`.

### 6.4. Разрешение конфликтов

1. **Регулятор против всех** — если `REGULATOR` присутствует среди инициаторов, все регуляторные отчёты получают `priorityLevel=CRITICAL` и выводятся первыми, даже если по умолчанию они HIGH (пример: биржевые требования).
2. **Клиент vs банк** — если требуется и клиентский, и банковский отчёт, система пытается слить их в один (`CORP_GHG_VERIFIED`). Если форматы несовместимы (например, CDP + TCFD), оба отчёта остаются, но добавляется предупреждение `ADD_WARNING("CLIENT_BANK_DOUBLE_WORK")`.
3. **Product vs Corporate** — когда пришёл только продуктовый запрос, корпоративные отчёты помечаются как «опциональные» (см. `V6_PRODUCT_ONLY_AVOIDS_CORP`). Если регулятор требует корпоративный отчёт (CSRD/CBAM), правило перевешивает и возвращает оба.
4. **Сроки и бюджет** — если constraint-предупреждения суммируются >2, отчёты с наименьшим `priorityScore` автоматически переносятся в блок `optionalReports`, чтобы подсветить их низкий шанс выполнения.
5. **Дубли программ** — если один отчёт приходит из нескольких правил (например, CDP из клиента и программы), он появляется один раз, но `ResolvedReport.sourceTags` содержит все источники; приоритет берётся максимальный.

---

## 7. Связь с существующим брифом

- Диаграмма из `nov 13 brief (temporary).mermaid` описывает **поток вопросов**.
- Большая таблица соответствия описывает **правила** в человеческом виде.
- Настоящий документ фиксирует **формальную модель**:
	- список вопросов и кодов ответов,
	- список отчётов (ID + базовые атрибуты),
	- формат правила `conditions → outputs`,
	- примеры ключевых правил и валидаций,
	- общую схему приоритизации.

Дальше на основе этого спецификатора можно:
- Создать TypeScript-типы (`Question`, `AnswerOption`, `Report`, `Rule`, `ValidationRule`).
- Перенести все 68+ сценариев из исходной таблицы в структуру `Rule[]`.
- Подключить движок к UI опросника и генератору итогового отчёта.

---

## 8. Алгоритм `evaluateQuestionnaire(answers)`

Этот раздел описывает общий конвейер, по которому система идёт от ответов пользователя к финальному списку отчётов и предупреждений.

Пусть:
- `answers` — объект вида `{ [questionId: string]: AnswerValue }`.
- `RULES` — массив правил соответствия (см. раздел 4).
- `VALIDATION_RULES` — массив правил валидации (см. раздел 5).
- `REPORT_DEFINITIONS` — справочник отчётов (см. раздел 2).

### 8.1. Шаг 1 — сбор и нормализация ответов

1. Принять ответы пользователя из UI.
2. Преобразовать их в нормализованный объект `answers`:
	- для `single`-вопросов — одно значение,
	- для `multi` — массив кодов,
	- для числовых/свободного текста — привести к ожидаемому типу.

### 8.2. Шаг 2 — применение правил `RULES`

1. Инициализировать пустой набор `selectedReports`.
2. Для каждого `rule` в `RULES`:
	- проверить, выполняются ли все его `conditions` на объекте `answers`;
	- если да — добавить все `outputs.reports` в `selectedReports` (как множество, без дублей),
	  и при необходимости зафиксировать в служебной структуре, какие `ruleId` привели к какому отчёту.

Результат шага 2: черновой набор отчётов без учёта непротиворечивости.

### 8.3. Шаг 3 — применение правил `VALIDATION_RULES`

1. Инициализировать `warnings = []` и `forbiddenReports = new Set()`.
2. Для каждого правила валидации `vRule` в `VALIDATION_RULES`:
	- проверить, выполняются ли его `if`-условия на `answers` и/или `selectedReports`;
	- если да — применить `effect`:
	  - `FORBID_REPORT(id)` → добавить `id` в `forbiddenReports`;
	  - `DOWNGRADE_PRIORITY(id)` → пометить в метаданных, что приоритет этого отчёта снижен;
	  - `ADD_WARNING(code)` → добавить `code` (и, опционально, человекочитаемое сообщение) в `warnings`.
3. Удалить из `selectedReports` все отчёты, попавшие в `forbiddenReports`.

Результат шага 3: очищенный список отчётов + список предупреждений.

### 8.4. Шаг 4 — обогащение отчётов метаданными

1. Для каждого `reportId` в `selectedReports`:
	- получить определение из `REPORT_DEFINITIONS[reportId]`;
	- на его основе собрать объект `ResolvedReport` с полями:
	  - `id`, `name`, `category`,
	  - `priorityLevel` (с учётом возможного `DOWNGRADE_PRIORITY`),
	  - `verificationLevel`,
	  - `scopes`,
	  - ориентировочные `timeline`, `budget` (по матрицам из брифа),
	  - ссылки на источники (какие `ruleId` его породили).

### 8.5. Шаг 5 — приоритизация и группировка

1. Отсортировать `ResolvedReport[]` по:
	- `priorityLevel` (CRITICAL → HIGH → MEDIUM/LOW),
	- внутри уровня — по фиксированному порядку для `CRITICAL` и `HIGH` (см. раздел 6),
	- опционально — по категории (регуляторные → клиентские → банковские → программные → внутренние).
2. Разбить отсортированный список на логические блоки для UI/отчёта:
	- `mandatoryReports` — все `CRITICAL` с `category=REGULATORY`;
	- `recommendedReports` — `HIGH` и `CRITICAL` не из регуляторных (банки, клиенты, программы);
	- `optionalReports` — `MEDIUM`/`LOW`, внутренние и подготовительные.

### 8.6. Шаг 6 — формирование итоговой структуры результата

Функция `evaluateQuestionnaire(answers)` на выходе возвращает структуру наподобие:

- `profile`: агрегированное резюме по компании (по Q0.x, Q1.1 и ключевым ответам).
- `mandatoryReports: ResolvedReport[]`.
- `recommendedReports: ResolvedReport[]`.
- `optionalReports: ResolvedReport[]`.
- `warnings: Warning[]` (включая коды типа `TIME_UNREALISTIC_FOR_FULL_SCOPE3`, `BUDGET_TOO_LOW_FOR_CERTIFICATION` и т.п.).
- `scopeSummary`: агрегированный вывод по Scope 1/2/3, рассчитанный на основе выбранных отчётов и матрицы Scope.
- `timelineSummary`: ориентировочный план (по наибольшей сложности из выбранных отчётов).
- `budgetSummary`: ориентировочный диапазон затрат.

Эта структура затем используется шаблоном отчёта (как описано в финальном разделе брифа) для рендера человекочитаемого результата.

---

## 9. Чеклист реализации

Чтобы избежать потерь информации при переходе к коду, придерживайтесь следующего порядка.

### 9.1. Структуры данных

1. Определить TypeScript-типы:
	- `Question`, `AnswerOption`, `AnswerValue`.
	- `ReportDefinition`, `ResolvedReport`.
	- `Rule`, `Predicate`, `RuleOutput`.
	- `ValidationRule`, `ValidationEffect`.
2. Завести модули: `questions.ts`, `reports.ts`, `rules.ts`, `validation-rules.ts`, `priorities.ts`.

### 9.2. Наполнение справочников

1. Перенести все вопросы `Q0.1–Q11.5` в `questions.ts` (используя формат из раздела 1).
2. Заполнить `reports.ts` по `2.2`, добавив поля `scope`, `frequency`, `budgetRange`, `timelineRange`, `legalNotes`.
3. Для CBAM/EU ETS добавить вспомогательные флаги (`EU_ETS_COVERED`, `CBAM_ROLE`).

### 9.3. Загрузка правил

1. Для каждой строки таблиц `4.4.1–4.4.8` создать объект `Rule` с единственным источником правды (`ruleId`, `sourceNumber`).
2. Сложные ветви (например, `R1_CSRD`) разбить на несколько `Rule`, если это упрощает проверку `conditions`.
3. Хранить ссылку на текстовое описание/tooltip (`notes`).

### 9.4. Валидации и приоритеты

1. Реализовать `validateSelection(selectedReports, answers)` на базе таблицы `5.3`.
2. Реализовать `scoreReport(resolvedReport, context)` на базе разделов `6.1–6.4`.
3. Убедиться, что комбинированные сценарии (`R61–R64`) применяются **после** валидаций, но **до** финальной сортировки.

### 9.5. Тестирование

1. Составить набор эталонных анкет (минимум по одной на блок: регулятор, клиент, банк, программа, внутренняя инициатива, отраслевой, CBAM special).
2. Для каждого теста зафиксировать ожидаемый список отчётов, предупреждений и порядок приоритета.
3. Добавить snapshot-тест для `evaluateQuestionnaire` с фиксацией промежуточных структур (`selectedReports`, `warnings`, `priorityScores`).
4. Протестировать отрицательные кейсы: отсутствие данных для CBAM, конфликт бюджета, короткие сроки.

### 9.6. Ответственности и автоматизация

1. Вести `rules.yaml` или `rules.json` в `docs/` как мастер-файл; из него можно генерировать TypeScript (скрипт `scripts/check-templates.ts` можно адаптировать).
2. Сделать утилиту `pnpm rules:validate`, которая проверяет:
	- уникальность `ruleId`,
	- наличие всех `questionId` в справочнике,
	- покрытие всех 68 исходных сценариев (ссылки на `Src #`).
3. В README дописать инструкцию по обновлению правил.

Этот чеклист должен быть выполнен до начала UI/UX-работ, чтобы backend-логика была стабилизирована.

### 9.7. Интеграция с текущим wizard’ом

1. Расширить существующий экран `src/app/projects/new/questionnaire/page.tsx`, чтобы он рендерил вопросы из нового справочника: поддержать `multi-choice`, `free-text`, условную видимость и прогресс на основании `QuestionConfig`.
2. В `src/lib/questionnaires/wizard-config.ts` оставить только навигацию и подключить новый источник вопросов/правил; любые временные хардкоды (CBAM/ISO) удалить после миграции.
3. В `src/lib/wizard-progress.ts` добавить версию схемы (`wizardSchemaVersion`) и миграцию: при изменении структуры вопросов чистить устаревшие ответы/рекомендации, чтобы UI не падал на старых `sessionStorage` данных.
4. Проверить обратную совместимость кнопки «Skip to Report Selection» на `src/app/projects/new/page.tsx`: при пропуске шагов новые поля должны иметь безопасные значения по умолчанию.

### 9.8. Синхронизация с dataset-prefill и API

1. Обновить `src/lib/questionnaires/v1.ts` (или завести v2) так, чтобы новые вопросы могли мапиться на dataset поля. Если mapping меняется радикально, задокументировать это в `docs/DEVELOPMENT.md`.
2. В обработчике `/api/projects` (`src/app/api/projects/route.ts`) сохранять не только `template_codes`, но и сам `answers` JSON + список сработавших `ruleId` (либо в `project.dataset`, либо в отдельной таблице `questionnaire_responses`).
3. Добавить вспомогательный API (`GET/PUT /api/projects/:id/questionnaire`), чтобы уже созданные проекты могли обновлять ответы без повторного прохождения wizard’а.

### 9.9. Расширение каталога отчётов и UI выбора

1. Расширить `src/lib/report-templates/index.ts` и соответствующие файлы (`cbam.ts`, `iso14067.ts`, ...), добавив заглушки для всех отчётов из раздела 4.4. Пока контента нет — достаточно имени, категории, описания и требований к Scope.
2. На странице `src/app/projects/new/select-reports/page.tsx` предусмотреть группировку по категориям/приоритетам, фильтры и короткие описания, чтобы длинный перечень шаблонов оставался управляемым.
3. При рендере списка отображать теги источников (регулятор, клиент, банк и т.д.), используя метаданные, которые вернёт движок правил.

### 9.10. Аудит и телеметрия правил

1. В `evaluateQuestionnaire` сохранять, какие `ruleId` породили каждый отчёт, и прокидывать это в UI (например, tooltip «Появился по правилу R1_CSRD»).
2. Логировать факт применения правил на сервере (в БД или аналитике), чтобы понимать, какие сценарии популярны и где нужны правки.
3. Добавить административный endpoint/скрипт для сравнения активной версии правил с `docs/questionare logic.md`, чтобы исключить расхождения.

### 9.11. Тестирование UI и движка

1. Дополнить unit-тесты движка (`evaluateQuestionnaire`) сценариями для основных веток диаграммы (регулятор, клиент, банк, программа, внутренняя инициатива, CBAM special). Снимки должны включать список отчётов, предупреждений и `priorityScore`.
2. Покрыть React-компоненты wizard’а тестами (React Testing Library) на рендер разных типов вопросов и условных переходов.
3. Добавить Playwright-/Cypress-сценарии для трёх ключевых пользовательских потоков: «только CBAM», «клиент + банк», «внутренняя инициатива с SBTi». Это защитит навигацию и сохранение прогресса после дальнейших правок.

