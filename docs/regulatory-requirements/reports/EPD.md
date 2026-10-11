# EPD — EPD Data Preparation

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: epd.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

ISO 14025:2026 опубликован; конкретную публикацию определяют выбранная программа, PCR и правила перехода.

Продуктовая декларация в выбранной программе; обязательность по закупке/местному праву определяется отдельно.

## Выдаваемый результат

Опубликованная декларация с владельцем, номером/сроком, PCR, единицей и границами, таблицами показателей и подтверждением предусмотренной программой верификации.

## Входные данные

- [PG11/PG12/PG25] Оператор, категория продукта, версии PCR/c-PCR, GPI и применимый секторный стандарт.
- [PG23/PG36] Declared/functional unit, reference flow, границы/модули, LCA-модель, источники и экологические показатели.
- [PG13/PG23] Верификатор, объём проверки, номер декларации, даты и ограничения сравнения.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма программы PG12/PG13] Проверка перед публикацией по допустимому маршруту выбранного оператора.
- [Норма программы PG25] Шаблон разработки не заменяет PCR; обязательность форм проверки зависит от программы и категории.
- [UX-контроль; PG11/PG12/PG24] Смена редакции ISO не должна автоматически инвалидировать старую EPD; проверить переход у оператора.
- [UX-контроль; PG23] Не складывать D с A–C и не подменять все impact indicators одним PCF.

## Проверка человеком

- [PG13] LCA-практик и допущенный программой проверяющий; публикация через оператора.
- [PG11/PG12] Проверить новую ISO 14025:2026 по лицензированному тексту и переход программы/PCR.

## Риски текущего интерфейса и пробелы реализации

- Проект декларации не равен опубликованной и верифицированной EPD.
- Заполнение PCF не даёт права назвать результат EPD.
- generated/epd.ts: 62 поля идентичны ISO_14067/PRODUCT_PCF; в fieldId отсутствуют PCR/EPD/programme identifiers. Самостоятельная структура экологических показателей EPD не представлена.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/EPD/README.md)

PG23 — скачанная IBU EPD на 1 kg алюминиевого профиля. PG36 — онлайн-пример IES. Программы и PCR разные; чужие коэффициенты и результаты не универсальны.

## Источники

- **PG02** [ISO 14040:2006 — LCA principles and framework](https://www.iso.org/standard/37456.html) — ISO; 2006 edition 2; Amd 1:2020; доступ: public_metadata. Catalogue only; obtain licensed applicable edition/amendment before conformance review.
- **PG03** [ISO 14044:2006 — LCA requirements and guidelines](https://www.iso.org/standard/38498.html) — ISO; 2006; Amd 1:2017 and Amd 2:2020; confirmed 2022; доступ: public_metadata. Public abstract describes goal/scope, LCI, LCIA, interpretation, reporting and critical review. No inaccessible clause claims.
- **PG11** [ISO 14025:2026 — Environmental product declarations](https://www.iso.org/standard/14025) — ISO; 2026-06 edition 2, Published; доступ: public_metadata. Replaces ISO 14025:2006. Programme/PCR transition must be checked; catalogue update does not itself prove expiry of an existing EPD.
- **PG12** [General Programme Instructions](https://www.environdec.com/resources/general-programme-instructions) — EPD International AB; Live page checked 2026-10-11; доступ: public_fulltext. Public transition rules read: existing PCR/EPD validity retained on programme update, surveillance uses original verified PCR/GPI. Full current GPI file/version was not retrieved.
- **PG13** [EPD Verification](https://www.environdec.com/verification) — EPD International AB; Live page checked 2026-10-11; доступ: public_fulltext. IES requires verification before publication; approved individual/certification-body and other approved routes. These are IES rules, not every programme’s exact workflow.
- **PG23** [Schüco Low Carbon Aluminium Profile EPD](https://www.schueco.com/resource/blob/4385164/e1096f93dbaf9025600a63a92bd6f546/Schueco%20Low%20Carbon%20Aluminium%20Profile%202.pdf?domain=se) — Schüco International KG / Institut Bauen und Umwelt (IBU); EPD-SCH-20240604-CBA1-EN; issued 2025-01-08; stated valid to 2030-01-07; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/schueco-low-carbon-aluminium-epd-2025.pdf). Manufacturer-hosted IBU EPD, 1 kg declared unit; p. 2 external verification (Matthias Schulz), p. 6 multi-indicator/module results. Registry withdrawal status not independently checked; IBU rules differ from IES. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG24** [ISO 14025:2006 — withdrawn record](https://www.iso.org/standard/38131.html) — ISO; Withdrawn; replaced by ISO 14025:2026; доступ: public_metadata. Old edition still cited in examples; confirm programme transition and original verification basis rather than relabel historical documents.
- **PG25** [EPD development and verification templates](https://www.environdec.com/resources/epd-templates) — EPD International AB; Construction PCR 2019:14v2.0.1; machine-readable template 20260316; доступ: public_fulltext. Development templates are voluntary aids; mandatory verification/machine-readable templates are programme/product-specific. Direct file links were not exposed in browser text; no DOCX was guessed/downloaded.
- **PG36** [Extruded aluminium profile — EPD-IES-0026622:001](https://www.environdec.com/library/epd26622) — EPD International / TECNOAL; Version 2026-02-17; listed Valid to 2031-01-13; доступ: public_fulltext. Online example with named Bureau Veritas verifier, PCR 2019:14v2.0.1 and older ISO 14025:2006 basis. Shows programme transition nuance; PDF discovered but not additionally saved because PG23 already covers verified EPD format.

## Сопоставление с кодом

Название в интерфейсе: **EPD Data Preparation**. Внутреннее имя шаблона: `EPD Data Preparation`.

В реестре кода: 62 уникальных полей, 54 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/epd.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
