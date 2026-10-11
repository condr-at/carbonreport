# SEC_CLIMATE — SEC Climate Disclosure Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: US SEC climate disclosure rule.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Final rule2024 приостановлено 04.04.2024. SEC прекратила защиту 27.03.2025; суд поставил дело в abeyance12.09.2025.29.05.2026 предложена отмена; статус S7-2026-19 на дату проверки Proposed, не final rescission [DS10–DS11].

Не обозначать всех NYSE/Nasdaq issuers как уже обязанных исполнять Subpart1500. Проверить registrant/filing regime и отдельно существующие material disclosure obligations с US counsel [DS10–DS11].

## Выдаваемый результат

На текущем статусе — подготовительный disclosure workpaper с версией/датой и material climate information для юридической оценки. Самостоятельный PDF не SEC filing.

## Входные данные

- Registrant status, filer category, форма/период, material climate risks, финансовые эффекты и evidence [DS10].
- Board/risk oversight, targets, используемые estimates и GHG evidence для выбранного scope подготовки [DS10–DS11].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS10–DS11; правовой gate] Блокировать утверждение mandatory under2024 climate rule, пока stay действует.
- [DS11; статус проекта] Proposed rescission не отображать как завершённую отмену.
- [UX-предложение; контекст DS10] Не выдавать completion score за legal filing readiness; требования к attestation не назначать автоматически из старого графика.

## Проверка человеком

- US securities counsel проверяет действующие обязанности и актуальный docket перед выпуском.
- Финансовый controller подтверждает materiality и связь с финансовыми statements.

## Риски текущего интерфейса и пробелы реализации

- [DS10–DS11; ограничение использования] Сохранять различие между подготовкой данных и действующей обязанностью подачи; правовой статус источников проверен 11.10.2026.
- Предупреждение о stay не является полной моделью registrant/filing regime и действующих material disclosure obligations; нужна отдельная правовая проверка.
- generated/sec_climate.ts содержит 138 смешанных полей; required values не являются действующей SEC submission specification.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: rules.ts R5_NYSE_NASDAQ выдаёт REGULATORY_MANDATORY без stay gate.
- До CATALOG-01: user-facing.ts once the rule goes live не объясняет stay/litigation/proposed rescission.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SEC_CLIMATE/README.md)

Публичный проект отмены — нормативный материал, не шаблон отчёта. Универсального официального standalone SEC climate report в проверенных источниках нет.

## Источники

- **DS10** [SEC Proposes Rescission of Climate-Related Disclosure Rules](https://www.sec.gov/newsroom/press-releases/2026-49-sec-proposes-rescission-climate-related-disclosure-rules) — US SEC; 2026-05-29; доступ: public. Описывает stay 2024-04-04, прекращение защиты SEC 2025-03-27 и abeyance 8th Circuit 2025-09-12.
- **DS11** [Rescission of climate-related disclosure rules — S7-2026-19](https://www.sec.gov/rules-regulations/2026/05/s7-2026-19) — US SEC; Release 33-11421, 2026-05-29; comments closed 2026-08-03; доступ: public. Страница помечена Proposed. Окончательная отмена на дату проверки не подтверждена.

## Сопоставление с кодом

Название в интерфейсе: **SEC Climate Disclosure Preparation**. Внутреннее имя шаблона: `SEC Climate Disclosure Preparation`.

В реестре кода: 138 уникальных полей, 107 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/sec_climate.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
