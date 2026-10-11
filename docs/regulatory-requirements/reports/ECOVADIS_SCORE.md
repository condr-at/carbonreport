# ECOVADIS_SCORE — EcoVadis Assessment Preparation

Проверено: **2026-10-11**. Категория: `assessment`. Семейство: EcoVadis sustainability rating submission.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Коммерческая добровольная оценка системы управления: четыре темы, до 21 критерия, tailored questionnaire и analyst review [DS34–DS36]. Не регулируемый carbon report.

Размер, activity/industry, страна и assessment scope определяют вопросы и критерии; применяется договор/приглашение клиента и правила EcoVadis [DS34,DS36].

## Выдаваемый результат

Submission evidence dossier / реестр ответов и документов; официальный scorecard формирует EcoVadis [DS34–DS36].

## Входные данные

- Юрлицо/оценочный scope, страны/размер/sector и активная анкета [DS34,DS36].
- Реальные политики, actions/results по Environment, Labor & Human Rights, Ethics, Sustainable Procurement [DS34–DS35].
- Document owner/date/scope и связь evidence→answer [DS35].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS35; правило evidence] Проверить релевантность, даты, принадлежность scope и внедрение; сгенерированный специально для анкеты текст не доказательство практики.
- [DS34–DS36; правило схемы] Не вычислять официальный score из собственной полноты полей.
- [UX-предложение; контекст DS34] Для каждого ответа показать документ/страницу и reviewer status; пропуски не замещать выдуманными политиками.

## Проверка человеком

- ESG/compliance owner подтверждает подлинность и внедрение документов.
- EcoVadis analysts выполняют внешнюю оценку; service не заменяет её [DS34].

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Разделять подготовку к оценке и официальный Scorecard/балл/медаль.
- 82 поля преимущественно carbon/energy не покрывают tailored четыре темы и доказательства.
- Нет видимого criterion→answer→supportingdocument mapping и фиксации версии questionnaire.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: generated/ecovadis_score.ts называется EcoVadis Scorecard, хотя UI точнее Submission Dossier.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/ECOVADIS_SCORE/README.md)

Общедоступный универсальный бланк/полный официальный scorecard не получен. В DS36 экспорт индивидуальной анкеты связан с доступом/подпиской; portal/paywall не обходились.

## Источники

- **DS34** [What is the EcoVadis methodology?](https://support.ecovadis.com/hc/en-us/articles/115002531507-What-is-the-EcoVadis-methodology) — EcoVadis; current support article checked 2026-10-11; доступ: public. Четыре темы, 21 потенциальный критерий; применимость зависит от размера, деятельности, страны.
- **DS35** [Understanding supporting documents](https://support.ecovadis.com/hc/en-us/articles/210460307-Understanding-supporting-documents) — EcoVadis; current support article checked 2026-10-11; доступ: public. Документы должны подтверждать внедрённые практики; специально сочинённые для анкеты свидетельства не подмена реальной evidence.
- **DS36** [Understanding my questionnaire](https://support.ecovadis.com/hc/en-us/articles/14988568737170-Understanding-my-questionnaire) — EcoVadis; current support article checked 2026-10-11; доступ: public. Tailored questionnaire. Экспорт после публикации score доступен в рамках условий подписки; универсальная публичная анкета не получена.

## Сопоставление с кодом

Название в интерфейсе: **EcoVadis Assessment Preparation**. Внутреннее имя шаблона: `EcoVadis Assessment Preparation`.

В реестре кода: 82 уникальных полей, 74 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/ecovadis_score.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
