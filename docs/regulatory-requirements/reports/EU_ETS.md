# EU_ETS — EU ETS Installation Data

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: EU ETS.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Regulated annual emissions reporting; применимость зависит от установки/деятельности и jurisdiction. Разные ветки stationary, aviation, maritime; ETS2 — отдельная система. [TR09, TR10]

Сначала выбрать stationary installation с ETS permit/competent authority либо авиационную/морскую ветку. Не назначать по факту наличия корпоративных Scope 1–3. [TR09, TR10, TR11]

## Выдаваемый результат

AER по принятой authority форме/ERT + независимый verification report; allowance surrender отдельной операцией Union Registry. Обычно report до 31 March следующего года, surrender до 30 September; национальные сроки проверять. [TR09]

## Входные данные

- Permit/installation IDs/operator/year/authority, approved monitoring plan and changes [TR09, TR10]
- Source streams, activity quantities/units, factors, tiers/uncertainty, emissions by relevant gases, fallbacks/data gaps and verifier opinion [TR10, TR30]
- Allowance transactions отдельно от emissions calculation; activity-specific scope and exclusions [TR09, TR31]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: approved monitoring plan и applicability sector branch до выбора формы; installation AER не corporate inventory [TR09, TR10]
- Норма: latest authority template, source-stream totals and units, data gaps, verification outcome [TR10, TR30]
- UX: расчётный AER не маркировать Verified автоматически; surrender status не выводится из PDF [TR09, TR32]

## Проверка человеком

- Есть ли permit, утверждённый MP, правильные thresholds/exclusions и национальная форма? [TR09, TR10]
- Аккредитованный verifier подтвердил год/полноту/результат; authority принял submission? [TR09, TR32]

## Риски текущего интерфейса и пробелы реализации

- Каталог обозначает stationary installation; отдельные модели aviation/maritime/ETS2 не подтверждены этим исправлением. [TR09, TR11]
- generated/eu_ets.ts смешивает six ETS totals с RE100/GRESB/BCorp/aviation/Scope2 и не моделирует source-stream AER.
- Реальный verification workflow и фиксация результата независимой проверки остаются необходимым отдельным этапом.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: Рекомендуется ограничить текущий UI stationary scope или добавить отдельный выбор aviation/maritime/ETS2. [TR09, TR11]
- До CATALOG-01: UI verified installation emissions заявляет статус без самого verification workflow.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/EU_ETS/README.md)

Локальные актуальные XLSX для stationary и aviation; отдельный заполненный verification exemplar. Последний не универсальный AER и не подпись по клиенту.

## Источники

- **TR09** [EU ETS monitoring, reporting and verification: guidance and templates](https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en) — European Commission, DG CLIMA; проверено 2026-10-11; доступ: public. Открыта. Annual compliance cycle; ERT; AER installation template 2026-02-09, aircraft template 2026-01-23. Национальные формы могут отличаться.
- **TR10** [Monitoring and Reporting Regulation (EU) 2018/2066, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02018R2066-20250527) — European Commission, EUR-Lex; 2025-05-27; доступ: public. Текст открыт по актуальной ссылке из TR09; более старая 2024 consolidation не использована как актуальная версия.
- **TR11** [Reducing emissions from the shipping sector](https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en) — European Commission, DG CLIMA; проверено 2026-10-11; доступ: public. Открыта. MRV/ETS overlap и phase-in. Июльская 2026 реформа на странице названа proposal, не принятая норма.
- **TR30** [EU ETS Template 4: Annual Emissions Report installations](https://climate.ec.europa.eu/document/download/ef2f9250-ae8b-48d9-99c8-378703f369f8_en?filename=policy_ets_monitoring_t4_aer_installations_en.xlsx) — European Commission, DG CLIMA; 2026-02-09; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/ets-aer-installations-20260209.xlsx). 19 sheets, 4.06 MB, workbook opens; A–J structured AER. Национальный authority может использовать свою версию/ERT.
- **TR31** [EU ETS/Swiss ETS/CORSIA Template 5: aircraft AER](https://climate.ec.europa.eu/document/download/4a327569-5092-4d55-a457-530a5a4eb487_en?filename=t5_aer_aircraft_en.xlsx) — European Commission, DG CLIMA; 2026-01-23; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/ets-corsia-aircraft-aer-20260123.xlsx). 17 sheets, включая CORSIA emissions/fuels; разделять границы режимов. Это EU reporting context, не универсальный ICAO filing format.
- **TR32** [EU ETS exemplar verification report: installation](https://climate.ec.europa.eu/document/download/84c3bff8-0ba4-4657-a594-c8430597f115_en?filename=examplar_avr_verification_installations_en.pdf) — European Commission, DG CLIMA; дата файла отдельно не подтверждена; index checked 2026-10-11; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/ets-installation-verification-exemplar.pdf). Учебный заполненный пример верификатора, не годовой emissions report и не реальное заключение по клиенту.

## Сопоставление с кодом

Название в интерфейсе: **EU ETS Installation Data**. Внутреннее имя шаблона: `EU ETS Installation Data`.

В реестре кода: 63 уникальных полей, 61 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/eu_ets.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
