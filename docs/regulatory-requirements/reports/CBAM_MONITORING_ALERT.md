# CBAM_MONITORING_ALERT — CBAM Monitoring Data

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Сервисное уведомление о полноте данных/сроках; не официальный regulator alert или statutory report.

CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

## Выдаваемый результат

Watchlist незакрытых данных/методов/изменений/сроков со ссылкой на затронутые товары/установки и evidence. [TR07, TR25, TR26]

## Входные данные

- Role/year/methodology version, supplier requests/status, missing parameters, applicability/threshold state [TR07, TR25, TR26]
- UX: rule ID, severity, affected item, owner, due date, observed_at, evidence [TR25]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: различать monitoring/verification requirements по режиму и actual/default; отсутствие ответа supplier не делает любой fallback допустимым [TR26]
- UX: duplicate alerts deduplicate по item/rule/version; закрывать по evidence, показывать freshness [TR07, TR25]

## Проверка человеком

- Подтверждены источник правила, deadline и юридическая значимость alert? [TR02, TR29]

## Риски текущего интерфейса и пробелы реализации

- Не называть внутреннее сообщение предписанием регулятора или доказательством несоответствия без review. [TR07, TR26]
- generated/cbam_monitoring_alert.ts требует полные verified emissions/certificates вместо event/rule/owner/status.
- Нужна версия нормативного правила и handling 2023–2025 vs 2026+.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM_MONITORING_ALERT/README.md)

Нет официальной универсальной формы Monitoring Alert; источники служат базой правил, не оформлением уведомления.

## Источники

- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR07** [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR25** [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Monitoring Data**. Внутреннее имя шаблона: `CBAM Monitoring Data`.

В реестре кода: 52 уникальных полей, 52 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/cbam_monitoring_alert.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
