# CBAM — CBAM Importer Data

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Пользовательский narrative importer summary; самостоятельной обязательной формы с этим названием нет.

CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

## Выдаваемый результат

Ненормативный PDF-summary с сопоставлением к годовой декларации; подача через CBAM Registry отдельно. [TR07]

## Входные данные

- Режим/год/роль/товары и applicability evidence [TR01, TR29]
- Количество и units, installation/process/year, direct и применимые indirect emissions, actual/default provenance [TR25, TR26]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: import year >=2026 → definitive; Q4 2025 и прежние периоды → transitional [TR01, TR06]
- UX: суммы PDF сверять с наборами для реестра; статус draft/verified/submitted хранить отдельно [TR07]

## Проверка человеком

- Подтверждены ли охват CN, происхождение и назначение summary? [TR29]
- Методология CBAM проверена отдельно от cradle-to-grave PCF? [TR26]

## Риски текущего интерфейса и пробелы реализации

- Подготовленный CBAM-пакет не означает принятие реестром или положительную верификацию. [TR07, TR26]
- generated/cbam.ts требует quarter, certificates used и building modules независимо от режима; quantity tonnes optional.
- Нужны режим/роль/год/применимость и условные поля; нормативная готовность не доказана массивом fields.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM/README.md)

TR23 — старый supplier form; TR26 — текущая методика, а не образец обязательного summary.

## Источники

- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR06** [CBAM archive: transitional reporting resources](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-archive_en) — European Commission, DG TAXUD; 2023-10–2025-12; проверено 2026-10-11; доступ: public. Открыта. Сам издатель помечает материалы как архивные и не отражающие definitive regime.
- **TR07** [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR25** [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.
- **TR23** [CBAM communication template for installations](https://taxation-customs.ec.europa.eu/document/download/2c15cd0e-2447-4ef8-ab70-68b80b66ede8_en?filename=CBAM%20Communication%20template%20for%20installations_en_20241213.xlsx) — European Commission, DG TAXUD; 2024-12-13; webpage 2024-12-18; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-communication-template-20241213.xlsx). 19 sheets. Transitional supplier communication workbook; использовать только как исторический структурный ориентир и не как annual declaration за 2026.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Importer Data**. Внутреннее имя шаблона: `CBAM Importer Data`.

В реестре кода: 14 уникальных полей, 6 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/cbam.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
