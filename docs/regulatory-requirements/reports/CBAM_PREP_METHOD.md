# CBAM_PREP_METHOD — CBAM Preparation Checklist

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Internal preparation/QA checklist. Не statutory filing, не аккредитованная верификация.

CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

## Выдаваемый результат

Checklist/method statement c applicability decision, monitoring gaps, владельцами/сроками и ссылками на evidence; при необходимости отдельный monitoring plan. [TR25, TR26]

## Входные данные

- Role/year/CN/threshold decision, process map, monitoring methods, data gaps, evidence inventory [TR25, TR26]
- UX: owner, deadline, status и основание закрытия каждой задачи [TR25]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: подходы к измерению/вычислению, источникам/precursors и boundaries соответствуют применимому definitive method [TR26]
- UX: missing data/uncertainty остаётся явно unresolved, не synthetic zero [TR25, TR26]

## Проверка человеком

- Подтверждена ли методика профильным специалистом и готовы ли данные к verifier review? [TR26]

## Риски текущего интерфейса и пробелы реализации

- Внутренняя QA не создаёт approved monitoring plan или verification opinion. [TR25, TR26]
- generated/cbam_prep_method.ts требует certificates и verification results до завершения подготовки.
- Нет first-class task owner/due/evidence/acceptance mapping; checklist title не соответствует плоскому набору emissions fields.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM_PREP_METHOD/README.md)

Нет универсального обязательного CBAM Prep Checklist; текущая guidance 2 даёт последовательность подготовки, guidance 3 — мониторинг.

## Источники

- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR25** [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Preparation Checklist**. Внутреннее имя шаблона: `CBAM Preparation Checklist`.

В реестре кода: 66 уникальных полей, 58 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/cbam_prep_method.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
