# BANK_TEMPLATE_FILL — Bank Questionnaire Preparation

Проверено: **2026-10-11**. Категория: `client_defined`. Семейство: Bank-defined forms / financed emissions.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Банковская анкета определяется банком. PCAF Part A относится к финансовой организации и не делает каждую анкету заёмщика нормативным PCAF-отчётом.

Сначала роль: заёмщик отвечает банку или финансовая организация рассчитывает financed emissions.

## Выдаваемый результат

Ответ в форме банка; при отдельном PCAF-заказе — раскрытие по выбранным классам активов с attribution и качеством данных.

## Входные данные

- Версия анкеты банка, роль респондента, период
- При PCAF: класс актива, объём финансирования и нужный знаменатель
- Эмиссии контрагента/объекта, метод и качество данных

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Не применять одну формулу ко всем классам активов [CE04].
- Разделять собственные выбросы компании и attributed financed emissions [CE04].
- Указать качество исходных данных; не изображать proxy как verified value [CE04].
- Checklist мая 2025 сверить с редакцией декабря 2025 перед выпуском [CE04, CE05].

## Проверка человеком

- Банк принимает анкету; профильный специалист проверяет attribution и применимый класс активов.

## Риски текущего интерфейса и пробелы реализации

- Шаблон не является универсальной банковской формой.
- Не реализованы банковский mapping, классы активов/attribution и согласованный формат передачи.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/BANK_TEMPLATE_FILL/README.md)

CE04 содержит sample tables, CE05 — более ранний checklist. Настоящая анкета конкретного банка остаётся обязательным входом.

## Источники

- **CE04** [Financed Emissions, Part A, Third Edition](https://carbonaccountingfinancials.com/files/standard-launch-2025/PCAF-PartA-2025-V3-December.pdf) — PCAF; December 2025; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/pcaf-part-a-third-edition-2025.pdf). Contains reporting examples in section 10.2. For financial institutions; not every borrower questionnaire is PCAF. Verified sample-table section starts on PDF page 199 in downloaded copy; TOC page references differ.
- **CE05** [Disclosure Checklist, Part A Financed Emissions](https://carbonaccountingfinancials.com/files/disclosure_checklist/PCAF-Disclosure-Checklist-Part-A-Financed-Emissions-May-2025.pdf) — PCAF; May 2025; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/pcaf-disclosure-checklist-may-2025.pdf). Predates third edition December 2025; compare against CE04 before use.

## Сопоставление с кодом

Название в интерфейсе: **Bank Questionnaire Preparation**. Внутреннее имя шаблона: `Bank Questionnaire Preparation`.

В реестре кода: 88 уникальных полей, 82 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/bank_template_fill.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/client-energy.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
