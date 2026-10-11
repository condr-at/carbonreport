# CBAM_REPORT — CBAM Declaration Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

2026+: annual CBAM declaration. Quarterly report относится к transitional 2023–2025; название шаблона устарело.

CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

## Выдаваемый результат

2026+: годовая декларация authorised declarant через CBAM Registry с данными goods/emissions/certificates и verification evidence для actual data. Первый срок 30.09.2027 за 2026; текущая definitive upload schema не подтверждена. Исторически: quarterly XML/ZIP transitional registry. [TR07, TR08, TR29]

## Входные данные

- Importer EORI, authorised account, legal representation, import year, declarations/quantities/origin/CN [TR07, TR29]
- Installation/operator, production periods/processes/precursors; methodology and actual/default selector by applicable goods [TR25, TR26]
- Embedded emissions, carbon price deduction evidence, free-allocation adjustment, certificates due; actual-values verifier evidence [TR05, TR29]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: annual first due 2027-09-30 for 2026 imports, не quarterly filing и не старое 31 May [TR08, TR29]
- Норма: transitional reports не требуют purchases/surrender certificates [TR06]
- Норма: actual/default, production functional unit и Annex II treatment отделить от generic product PCF [TR25, TR26]
- UX: не применять XSD TR20 как definitive annual schema; подтвердить формат/версию в реестре [TR06, TR07]

## Проверка человеком

- Установлены право подачи и национальный authority, CN scope/exempt origin/threshold, completeness annual import register? [TR07, TR29]
- Аккредитованный verifier и reviewer должны проверить actual-value chain, boundaries и carbon price evidence. [TR25, TR26]

## Риски текущего интерфейса и пробелы реализации

- Supplier communication и registry declaration — разные результаты; применимый акт и Annex указывать явно. [TR06, TR26]
- Не смешивать периодичность декларации с учётом сертификатов и историческим transitional regime. [TR06, TR29]
- generated/cbam_report.ts: quarter required, authorised ID optional, goods quantity optional, unrelated building/PCF fields required.
- Нет подтверждённого schema mapping к definitive declaration и end-to-end принятия в registry.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: UI Official Annex IV filing вводит в заблуждение: ссылка на Annex без указания акта неоднозначна; supplier communication и registry declaration различаются. [TR06, TR26]
- До CATALOG-01: UI certificates each quarter ошибочно объединяет режимы и баланс сертификатов с периодичностью декларации. [TR06, TR29]
- До CATALOG-01: user-facing.ts: title Quarterly Declaration, subtitle transitional, useWhen certificates each quarter.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM_REPORT/README.md)

Получены реальные XSD, structure XLSX, importer XML ZIP 2024. Они пригодны для исторического режима; definitive annual образец/схема не получены.

## Источники

- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR03** [Regulation (EU) 2023/956, consolidated after 2025/2083](https://eur-lex.europa.eu/eli/reg/2023/956/2025-10-20) — European Union, EUR-Lex; 2025-10-20; доступ: public_access_problem. Ссылка реально открыта из TR02; вместо текста получена JS-проверка, alternate TXT redirected. После двух способов чтение остановлено. Содержание в этой работе сверено по официальным пояснениям, не заявлено как полная постатейная проверка.
- **TR04** [Implementing Regulation (EU) 2025/2547: embedded-emissions methods](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2547) — European Commission, EUR-Lex; 2025-12; доступ: public_access_problem. Открыта ELI и TXT-ссылка, обе JS-проверка. Использованы доступные официальные guidance TR25/TR26; необходима окончательная сверка Annexes закона.
- **TR06** [CBAM archive: transitional reporting resources](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-archive_en) — European Commission, DG TAXUD; 2023-10–2025-12; проверено 2026-10-11; доступ: public. Открыта. Сам издатель помечает материалы как архивные и не отражающие definitive regime.
- **TR07** [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR08** [CBAM communication and news](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-communication-and-news_en) — European Commission, DG TAXUD; новости до 2026-10-05; доступ: public. Открыта. Публикует FAQ, communication XLSX 2024, sector examples и подтверждение первого annual deadline 2027-09-30. Публикация старого XLSX здесь не делает его definitive-template.
- **TR20** [CBAM quarterly report XSD/stypes](https://taxation-customs.ec.europa.eu/document/download/b473e58d-655b-4d21-a4ef-144d48e9877a_en?filename=CBAM%20XSD%20version%2018.30.zip) — European Commission, DG TAXUD; 18.30; 2024-09-10; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-quarterly-xsd-v18.30.zip). Архивная transitional XSD, не definitive annual schema.
- **TR21** [CBAM quarterly importer sample](https://taxation-customs.ec.europa.eu/document/download/e26f421b-4825-4c03-ba0a-5d2e3e6278e4_en?filename=CBAM_Quarterly_Report_sample_file_for_importer_ver1.3.0.0.zip) — European Commission, DG TAXUD; 1.3.0.0; 2024-09-12; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-quarterly-importer-sample-v1.3.0.0.zip). Официальный учебный ZIP: export.xml и mock supporting documents. XML содержит Q2/2024 и демонстрационные реквизиты. Не универсальный образец; совместимость с XSD 18.30 ещё не проверена.
- **TR22** [CBAM quarterly report structure](https://taxation-customs.ec.europa.eu/document/download/d3cc400c-ce53-43df-87ed-2b4bcaed4bb9_en?filename=Report%20Structure%20ver%2018.30.xlsx) — European Commission, DG TAXUD; 18.30; 2024-09-10; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-quarterly-structure-v18.30.xlsx). Архивный справочник fields/обязательности/code lists; 33 sheets, открывается.
- **TR25** [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.
- **TR05** [Implementing Regulation (EU) 2025/2620: free allocation adjustment](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2620) — European Commission, EUR-Lex; 2025-12-16; OJ 2025-12-22; доступ: public. Текст открыт. Это уменьшение числа CBAM certificates к погашению, не выдача импортёру EU ETS allowances. Articles 1–4 и Annex.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Declaration Preparation**. Внутреннее имя шаблона: `CBAM Declaration Preparation`.

В реестре кода: 68 уникальных полей, 62 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/cbam_report.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
