# CORSIA — CORSIA Emissions Data

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: International aviation.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

ICAO SARPs реализуются через государство attribution; reporting и offsetting имеют разную применимость. 2024–2026 first phase; 2027 second phase не применяется досрочно. [TR17, TR36, TR40]

Aeroplane operator international flights: annual CO2 >10000 t от aeroplanes MTOM >5700 kg, с установленными исключениями. Не любой airport/aviation business. MRV независимо от State volunteering; offsetting определяется state pairs/годом и new entrant rules. [TR37, TR40]

## Выдаваемый результат

Annual verified operator Emissions Report + Verification Report to State. EMP approved by State; отдельный EUCR при offsetting. Для EU-операторов возможен Template 5 national/EU implementation; CCR — канал State→ICAO. [TR16, TR31, TR33–TR35, TR37]

## Входные данные

- State attribution/operator identity, monitoring year, fleet/MTOM, flights/state pairs and exclusions [TR33, TR34, TR37]
- Fuel quantity/type/density, approved method/CERT eligibility, route CO2 aggregates and data gaps [TR33, TR34]
- Verifier report; optional eligible-fuel claims with certification and supporting chain; offsetting values only when assigned/eligible [TR35, TR37, TR40]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: distinguish MRV scope and offset routes; 2026 use Edition 6 state list, not 2027 list [TR36, TR37, TR40]
- Норма: annual ER/VR deadline 30 April to State; в 2026 это отчёт за 2025. State reports ICAO к 31 July [TR37, TR41]
- Норма: flight/fuel CO2 не corporate CO2e inventory; emissions gaps must be disclosed by relevant form [TR33, TR37]
- UX: eligible fuel/units, new entrant and 3-year offset compliance не смешивать с annual ER; не выдавать credits balance как verification [TR16, TR35, TR40]

## Проверка человеком

- Государство attribution/национальный акт, операторские thresholds/exclusions и approved EMP подтверждены? [TR17, TR34, TR37]
- Проверить Amendment 2 (каталог Aug 2026), его дату применения и national implementation до production rules; полный licensed text здесь не получен. [TR18]
- Независимый verifier проверил полноту полётов, топливо/плотность, gaps и eligible fuel evidence? [TR33, TR35, TR37]

## Риски текущего интерфейса и пробелы реализации

- Отрасль aviation сама по себе не доказывает применимость; проверить aeroplane operator и условия выбранного периода. [TR37]
- Generated PDF не ICAO certification и не receipt национального authority. [TR16, TR35]
- generated/corsia.ts: 47 fields, ни одного aviation/corsia-specific поля; требует Scope2/SBTi/taxonomy/waste.
- Нужны fleet/flight/state-pair/method/density/data-gap schema и national filing branch. Check applicability предупреждает о проверке, но не реализует полный расчёт применимости.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: Airlines слишком узко: обязанный aeroplane operator может быть не авиакомпанией; industry aviation слишком широко. [TR37]

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CORSIA/README.md)

Сохранены 3 ICAO XLSX и EU combined AER. Это пустые стандартные формы, не заверенный заполненный report. Полный Annex 16 с Amendment 2 остаётся paid/registration gap.

## Источники

- **TR16** [CORSIA standardized templates](https://www.icao.int/CORSIA/standardized-templates) — ICAO; Doc 9501 Vol IV 4th edition; files 2025; доступ: public. Открыта. ER и EMP остались по структуре 3rd edition; VR обновлён. Это рекомендованные стандартные формы оператор→государство, не CCR state→ICAO.
- **TR17** [SARPs Annex 16 Volume IV](https://www.icao.int/CORSIA/sarps-annex-16-volume-iv) — ICAO; 2nd edition July 2023; applies 2024-01-01; доступ: public. Открыта. Страница базового издания не разрешает игнорировать поправки; TR18 сообщает Amendment 2.
- **TR18** [Annex 16 Volume IV, 2nd edition including Amendment 2](https://store.icao.int/en/annex-16-environmental-protection-volume-iv-carbon-offsetting-and-reduction-scheme-for-international-aviation-corsia) — ICAO Store; 2nd ed. 2023; catalog Amendment 2 dated 2026-08-03; доступ: paid/registration. Официальная индексированная карточка проверена: USD 140, single-user protected PDF; открытие страницы вернуло 407. Полный платный текст/поправка не приобретались, применимость отдельных изменений требует licensed review.
- **TR19** [CORSIA States for Chapter 3 State Pairs](https://www.icao.int/CORSIA/corsia-states-chapter-3-state-pairs) — ICAO; проверено 2026-10-11; доступ: public. Открыта. Есть разные списки по годам, включая уже опубликованный 2027. Для 2026 сохранено именно Edition 6; 2027 не подменяет текущий год.
- **TR31** [EU ETS/Swiss ETS/CORSIA Template 5: aircraft AER](https://climate.ec.europa.eu/document/download/4a327569-5092-4d55-a457-530a5a4eb487_en?filename=t5_aer_aircraft_en.xlsx) — European Commission, DG CLIMA; 2026-01-23; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/ets-corsia-aircraft-aer-20260123.xlsx). 17 sheets, включая CORSIA emissions/fuels; разделять границы режимов. Это EU reporting context, не универсальный ICAO filing format.
- **TR33** [ICAO emissions report operator to State](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.2-ER-template_ETM-Vol-IV-4th-ed.xlsx) — ICAO; ETM Vol IV 4th ed., 2025; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-emissions-report-etm4.xlsx). 8 sheets: identity, basic info, fleet, density, reporting, State pairs, aerodrome pairs, data gaps. Не CCR upload.
- **TR34** [ICAO emissions monitoring plan](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.1-EMP-template_ETM-Vol-IV-4th-ed.xlsx) — ICAO; ETM Vol IV 4th ed., 2025; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-monitoring-plan-etm4.xlsx). 11 sheets: versions/identification/fleet/methods/data management; approval State required.
- **TR35** [ICAO verification report](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.6-VR-template_ETM-Vol-IV-4th-ed.xlsx) — ICAO; ETM Vol IV 4th ed., 2025; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-verification-report-etm4.xlsx). 10 sheets. Заполняется верификатором; генерация не даёт verified status.
- **TR36** [CORSIA States for Chapter 3 State Pairs, Edition 6](https://www.icao.int/sites/default/files/sp-files/environmental-protection/CORSIA/Documents/CORSIA-States-for-Chapter-3-State-Pairs_6Ed_web.pdf) — ICAO; 2026 reporting year; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-state-pairs-2026-ed6.pdf). 4 pages; 2026 state-pair applicability, не 2027 list.
- **TR37** [CORSIA Frequently Asked Questions](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/CORSIA_FAQs_Apr2024.pdf) — ICAO; 2024-04; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-faq-202404.pdf). 83 pages; Q3.19 scope thresholds, Q3.64 timing, Q3.65 route scope. Срок 30 April перепроверен TR41; новые поправки сверить TR18.
- **TR40** [Assembly Resolution A42-22: CORSIA](https://www.icao.int/sites/default/files/environmental-protection/Assembly42/Resolution-A42-22_CORSIA.pdf) — ICAO; 42nd Assembly 2025; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-resolution-a42-22.pdf). 7 pages, фазирование и route-based offsetting; не заменяет национальное внедрение/SARPs.
- **TR41** [CORSIA newsletter: 2026 implementation deadlines](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Newsletter/CORSIA-Newsletter_Feb-2026_v5.pdf) — ICAO; 2026-02; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/corsia-deadlines-newsletter-202602.pdf). Публично доступен на ICAO site. Page 2 подтверждает operator ER/VR deadline 2026-04-30 за 2025, States 2026-07-31.

## Сопоставление с кодом

Название в интерфейсе: **CORSIA Emissions Data**. Внутреннее имя шаблона: `CORSIA Emissions Data`.

В реестре кода: 47 уникальных полей, 47 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/corsia.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
