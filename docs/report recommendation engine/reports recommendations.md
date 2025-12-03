# ТЗ: Блок рекомендаций отчётов по результатам опросника

## 1. Цель

Реализовать decision engine и UX, которые по ответам на расширенный опросник (Q0–Q11 из `questionare logic.md`) формируют перечень отчётов/форматов (CSRD, CBAM, CORP_GHG, ISO 14064, CDP и др.) с разделением на обязательные, рекомендованные и опциональные, и подтягивают соответствующие шаблоны отчётов в шаге `Select Reports`.

## 2. Текущая ситуация (as‑is)

- Страница `questionnaire` (`src/app/projects/new/questionnaire/page.tsx`):
	- Использует новый набор вопросов по группам (`profile`, `initiator`, `regulator`, …).
	- При сабмите вызывает `evaluateQuestionnaire(answers)` и сохраняет результат в `sessionStorage` как `decisionEngineResult`.
	- Дополнительно мапит отчёты движка через `ENGINE_TO_TEMPLATE_MAP` в список кодов шаблонов и кладёт их в `recommendedTemplates`.
- Страница `select-reports` (`src/app/projects/new/select-reports/page.tsx`):
	- Читает `wizardAnswers` и вызывает `getRecommendedTemplates(wizardAnswers)` из `src/lib/questionnaires/wizard-config.ts`.
	- `getRecommendedTemplates` реализует старую мини‑анкету из 3 вопросов и возвращает максимум 2 шаблона (`CBAM`, `ISO14067`).
	- `decisionEngineResult` сейчас никак не используется.
- В `wizard-config.ts` по‑прежнему описана старая логика с 3 вопросами и простыми рекомендациями.

## 3. Желаемое поведение (to‑be)

1. Пользователь проходит расширенный опросник (Q0–Q11).
2. Движок правил по этим ответам вычисляет список отчётов (по спецификации в `questionare logic.md`, разделы 2–4).
3. Отчёты размечаются по уровням:
	 - `mandatoryReports` — форматы, которые юридически/контрактно обязательны.
	 - `recommendedReports` — сильные рекомендации по best practice и бизнес‑контексту.
	 - `optionalReports` — полезные, но не критичные форматы.
4. Шаг `Select Reports`:
	 - Инициализирует выбор шаблонов отчётов на основе `decisionEngineResult` (а не старой функции из `wizard-config.ts`).
	 - Отображает:
		 - обязательные отчёты (отмечены и помечены как обязательные, желательно без возможности снять),
		 - рекомендованные (отмечены по умолчанию, можно снять),
		 - дополнительные доступные форматы (по содержимому `getAllReportTemplates()`), которые можно добавить вручную.
	 - Все ID отчётов из движка мапятся на коды шаблонов через `ENGINE_TO_TEMPLATE_MAP` (полный охват, не только CBAM/ISO).

## 4. Область работ

### 4.1. Вопросы и видимость блоков

**4.1.1 — Синхронизировать справочник вопросов**

- Убедиться, что в модуле с вопросами (например, `src/lib/questionnaires/questions.ts` или аналогичном) определён единый массив:
	- `QUESTION_DEFINITIONS: QuestionDefinition[]` с полями:
		- `id` (`"Q0.1"`, `"Q1.1"`, …),
		- `group` (`"profile"`, `"initiator"`, …),
		- `type` (`'single' | 'multi' | 'free-text'`),
		- `options` (`code`, `label`, `description?`).
- Все вопросы и опции должны соответствовать спецификации `questionare logic.md`, раздел 1.3–1.14 (включая коды опций: `EU`, `EMP_250_499`, `CLIENT_EXISTING`, `CSRD`, `CBAM_GOODS` и т.п.).
- Опция `UNKNOWN` для single/multi‑вопросов реализована как в п. 1.15 спецификации.

**4.1.2 — Логика отображения групп**

- В `computeGroupVisibility(answers)` реализовать таблицу 1.16 из `questionare logic.md`:
	- `regulator` включается, если в `Q1.1` выбран `REGULATOR` или `EXCHANGE`.
	- `client` — если `Q1.1` включает `CLIENT_EXISTING` или `CLIENT_PROSPECT`.
	- `financial` — если `Q1.1` включает `BANK_INVESTOR`.
	- `program`, `exchange`, `internal`, `operations`, `trade`, `constraints`, `sector` — строго по условиям спецификации.
- При выключении группы её ответы должны очищаться (поведение уже присутствует в `questionnaire/page.tsx`, нужно только чтобы `computeGroupVisibility` давала корректные флаги).

### 4.2. Каталог отчётов и шаблонов

**4.2.1 — Каталог отчётов**

- Создать/обновить модуль, например `src/lib/questionnaires/reports-catalog.ts`:
	- Тип `ReportDefinition` с полями:
		- `id` (строка: `CSRD`, `CBAM`, `CORP_GHG`, …),
		- `name`,
		- `category`,
		- `priorityLevel` (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`),
		- `verificationLevel?`,
		- `scopes?`,
		- `notes?`.
	- Массив `REPORT_DEFINITIONS: ReportDefinition[]` минимум для тех ID, которые встречаются в правилах из `questionare logic.md` (раздел 2.2 и таблицы 4.4.x).

**4.2.2 — Маппинг отчёт → шаблон**

- В `questionnaire/page.tsx` (или отдельном модуле) расширить `ENGINE_TO_TEMPLATE_MAP`:
	- Для каждого `report.id` из движка определить `ReportTemplateCode`:
		- Примеры:
			- `CSRD` → `CSRD` (если есть шаблон),
			- `CORP_GHG` → `CORP_GHG`,
			- `ISO_14064_CERT` → `ISO14064`,
			- `CDP_DISCLOSURE` → `CDP`,
			- `EPD_OR_ISO_14067` → `ISO14067` и т.д.
- Проверить, что все используемые коды шаблонов есть в `getAllReportTemplates()` (`src/lib/report-templates.ts`); при необходимости добавить новые шаблоны (минимум: код, имя, версия, краткое описание).

### 4.3. Decision engine (правила)

**4.3.1 — Типы и примитивы правил**

- Создать модуль `src/lib/questionnaires/decision-engine.ts`, который экспортирует:
	- Типы:
		- `PredicateType = 'Q_EQUALS' | 'Q_INCLUDES' | 'Q_ANY_OF' | 'Q_NOT' | ...`,
		- `Predicate` (структура по §3.2 в `questionare logic.md`),
		- `Rule` (по §3.1),
		- `EvaluationResult`:
			- `mandatoryReports: ReportInstance[]`,
			- `recommendedReports: ReportInstance[]`,
			- `optionalReports: ReportInstance[]`,
			- где `ReportInstance` как минимум содержит `id` и, опционально, ссылку на `ReportDefinition`.
	- Функцию:
		- `evaluateQuestionnaire(answers: AnswerMap): EvaluationResult`.

**4.3.2 — Таблица правил**

- В этом модуле описать массив `RULES: Rule[]` по таблицам 4.4.x в `questionare logic.md`:
	- Регуляторные требования (`R1_CSRD`, `R2_EU_ETS`, `R3_CBAM`, `R4_UK_SECR`, …).
	- Клиентские (`R12_CLIENT_ISO14064` … `R21_CLIENT_CARBON_NEUTRAL`).
	- Банки/инвесторы (`R22_BANK_TCFD` … `R28_BANK_DATA_ONLY`).
	- Программы и рейтинги (`R29_PROGRAM_CDP` … `R33_PROGRAM_GRESB`).
	- Остальные правила до полного набора, если он уже определён в брифе (общее количество ~68).
- Каждое правило следует формату:
	- `conditions` используют только формализованные предикаты по `Q0.x`–`Q11.x` и кодам ответов.
	- `outputs.reports` — массив ID отчётов (должны быть в `REPORT_DEFINITIONS`).
	- `outputs.level` / `outputs.tags` — по необходимости.

**4.3.3 — Вычисление уровня отчётов**

- В `evaluateQuestionnaire`:
	- Для каждого правила, чьи `conditions` истинны, добавить указанные `outputs.reports` в промежуточную структуру.
	- После прохода по всем правилам агрегировать отчёты:
		- если хотя бы одно правило пометило отчёт как критический/обязательный (`level = CRITICAL` или тег `REGULATORY_MANDATORY`), он попадает в `mandatoryReports`.
		- отчёты с `priorityLevel` `HIGH` без жёсткой обязательности — в `recommendedReports`.
		- остальные — в `optionalReports`.
- Логика приоритизации должна быть однозначной и задокументированной (в комментарии или отдельном подпункте).

### 4.4. Интеграция с `questionnaire` и `select-reports`

**4.4.1 — Использовать новый движок на шаге опросника**

- Убедиться, что `questionnaire/page.tsx`:
	- импортирует `evaluateQuestionnaire` из нового модуля,
	- на сабмите:
		- вызывает `evaluateQuestionnaire(answers)`,
		- сохраняет результат в `sessionStorage` как `decisionEngineResult`,
		- вычисляет `recommendedTemplates` через `ENGINE_TO_TEMPLATE_MAP` по всем трём спискам (`mandatory`, `recommended`, `optional`).

**4.4.2 — Переключить `select-reports` на результат движка**

- В `select-reports/page.tsx`:
	- При инициализации:
		- в первую очередь читать `decisionEngineResult` и/или `recommendedTemplates`, которые пишет страница опросника;
		- использовать `recommendedTemplates` как начальный набор выбранных шаблонов.
	- Старый вызов `getRecommendedTemplates(wizardAnswers)` из `wizard-config.ts` удалить или оставить только как fallback, если нет данных нового формата.
- UI:
	- опционально, но желательно:
		- выделить обязательные отчёты (например, `disabled` чекбоксы с пометкой «обязательно»),
		- рекомендованные — отмечены по умолчанию, можно снять,
		- остальные шаблоны из `getAllReportTemplates()` — неотмечены, пользователь может добавить вручную.

### 4.5. Удаление/миграция старой логики

**4.5.1 — Ревизия `wizard-config.ts`**

- Согласовать роль файла:
	- Оставить там только:
		- `WIZARD_STEPS` и навигационные функции (`getCurrentStepInfo`, `getNextStepPath`, и т.д.).
	- Логику мини‑анкеты (`WIZARD_QUESTIONNAIRE`, `getRecommendedTemplates`, `getVisibleQuestions`) либо удалить, либо перенести в отдельный legacy‑модуль, если где‑то ещё используется.
- Убедиться, что после миграции:
	- шаг `questionnaire` использует только новый справочник вопросов и движок,
	- шаг `select-reports` не зависит от старых вопросов `target_region`, `product_type`, `reporting_purpose`.

## 5. Нефункциональные требования

- Код стилистически и структурно соответствует существующим модулям (те же паттерны типов, импортов, форматирования).
- Decision engine детерминирован: при одинаковом `AnswerMap` всегда возвращает один и тот же `EvaluationResult`.
- При изменении структуры вопросов или правил:
	- обновляются `questionare logic.md` и этот файл `reports recommendations.md`;
	- по возможности сохраняется обратная совместимость (fallback для старых сессий допустим, но основной путь — новый движок).

## 6. Критерии готовности

- Пользователь, пройдя расширенный опросник, на шаге `Select Reports` видит список отчётов, соответствующий правилам из `questionare logic.md`.
- Предзаполненный выбор шаблонов на шаге `Select Reports` основан на `decisionEngineResult` (а не на `getRecommendedTemplates` из `wizard-config.ts`).
- Любой ID отчёта, упомянутый в правилах, корректно мапится в существующий шаблон (или явно зафиксировано, что для него шаблон ещё не реализован и будет добавлен позже).
- Старый сценарий «3 вопроса → 2 отчёта» больше не влияет на основной путь создания проекта (может оставаться только как legacy‑fallback).

