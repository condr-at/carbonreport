# Торговля и транспорт: CBAM, EU ETS, EU MRV, CORSIA

Проверено: **2026-10-11**. Охват: 9 активных кодов. Статус: исследовательская база для исправления контрактов отчётов; расчётная и нормативная готовность для подачи не подтверждена. Машиночитаемый реестр: [trade-transport.json](../../report-reference/research/trade-transport.json). Точные URL, версия, доступность и локальные файлы находятся в этом реестре; ниже приведены первичные ссылки.


Кодовые наблюдения исходного снимка до CATALOG-01 отделены ниже от текущих пробелов. Локальные изменения текста и рекомендаций не подтверждают production-проверку или нормативную готовность. Статусы задач ведутся только в [BACKLOG](../../planning/BACKLOG.md); нормативные источники повторно не проверялись.

## Как читать требования

**Норма** — обязанность из применимого права/официального нормативного документа с указанным источником. Guidance/FAQ — объяснение издателя, не замена праву. **UX** — наша рекомендация для предотвращения ошибочного использования. `classification` описывает фактический документ сервиса: наличие CBAM в названии не делает внутренний PDF отдельной обязательной формой.

Перед каждой подачей нужен конкретный режим, reporting year, legal entity/operator, страна и competent authority. Готовый PDF, успешная арифметическая проверка, верифицированные данные и принятая регулятором подача — разные состояния.

## Критичные различия, влияющие на архитектуру

- **CBAM**: transitional reporting 01.10.2023–31.12.2025 и definitive regime с 01.01.2026 должны быть разными контрактами. Первый annual declaration и surrender за импорт 2026 — 30.09.2027. Продажи сертификатов начинаются 01.02.2027. Квартальный учёт цен/баланса не означает квартальную definitive декларацию. [TR01, TR06, TR08, TR29]
- **Порог CBAM**: единая годовая net mass 50 т применяется к соответствующим товарам cement, iron/steel, aluminium, fertilisers по импортёру, а не отдельно к каждому SKU/поставщику. Для electricity/hydrogen эта mass-exemption не действует. Исключения по происхождению и таможенным процедурам проверяются отдельно. [TR29]
- **CBAM certificates** не являются EU ETS allowances. Free allocation adjustment уменьшает расчётное количество сертификатов; это не бесплатная выдача квот импортёру. [TR05, TR29]
- **EU MRV** работает одновременно с shipping EU ETS и имеет более широкий охват. CO2/CH4/N2O входят в MRV с 2024; maritime ETS включает CH4/N2O с 2026. Phase-in 40/70/100% относится к surrender за emission years 2024/2025/2026, а не к сокращению выбросов в MRV отчёте. [TR11, TR14]
- **CORSIA**: в 2026 идёт first phase; operator MRV и route-based offsetting проверяются раздельно. Текущий ICAO newsletter подтверждает срок **30 April 2026** для ER/VR за 2025; старые материалы с 31 May не использовать. Полный текст Annex 16 с платной **Amendment 2 (каталог: 03.08.2026) не прочитан**; её applicability и национальную имплементацию должен проверить профильный reviewer. [TR18, TR36, TR37, TR40, TR41]

## Карта результатов

| Код | Классификация результата | Официальный образец |
|---|---|---|
| CBAM | internal_workpaper | partial_reference |
| CBAM_REPORT | regulated | historical_official_sample_current_format_gap |
| CBAM_DATA_PACKAGE | internal_workpaper | official_form_historical_plus_current_guidance |
| CBAM_PREP_METHOD | internal_workpaper | official_guidance_only_no_mandated_form |
| CBAM_ALLOWANCES | internal_workpaper | reference_data_only_no_mandated_ledger |
| CBAM_MONITORING_ALERT | internal_workpaper | official_guidance_only_no_mandated_form |
| EU_ETS | regulated | official_forms_and_verifier_example |
| EU_MRV | regulated | official_form_online_and_local_crosswalk |
| CORSIA | regulated | official_forms_available_full_standard_paid_gap |

## Проверенные контракты по кодам

### CBAM

Пользовательский narrative importer summary; самостоятельной обязательной формы с этим названием нет.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** Ненормативный PDF-summary с сопоставлением к годовой декларации; подача через CBAM Registry отдельно. [TR07]

**Входные данные:**

- Режим/год/роль/товары и applicability evidence [TR01, TR29]
- Количество и units, installation/process/year, direct и применимые indirect emissions, actual/default provenance [TR25, TR26]

**Валидации:**

- Норма: import year >=2026 → definitive; Q4 2025 и прежние периоды → transitional [TR01, TR06]
- UX: суммы PDF сверять с наборами для реестра; статус draft/verified/submitted хранить отдельно [TR07]

**Контрольные вопросы и человеческая проверка:**

- Подтверждены ли охват CN, происхождение и назначение summary? [TR29]
- Методология CBAM проверена отдельно от cradle-to-grave PCF? [TR26]

**Эталон/образец.** TR23 — старый supplier form; TR26 — текущая методика, а не образец обязательного summary.

**Предупреждения интерфейса:**

- Подготовленный CBAM-пакет не означает принятие реестром или положительную верификацию. [TR07, TR26]

**Текущие пробелы реализации:**

- generated/cbam.ts требует quarter, certificates used и building modules независимо от режима; quantity tonnes optional.
- Нужны режим/роль/год/применимость и условные поля; нормативная готовность не доказана массивом fields.

### CBAM_REPORT

2026+: annual CBAM declaration. Quarterly report относится к transitional 2023–2025; прежнее название пользовательского шаблона зафиксировано ниже как историческое наблюдение.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** 2026+: годовая декларация authorised declarant через CBAM Registry с данными goods/emissions/certificates и verification evidence для actual data. Первый срок 30.09.2027 за 2026; текущая definitive upload schema не подтверждена. Исторически: quarterly XML/ZIP transitional registry. [TR07, TR08, TR29]

**Входные данные:**

- Importer EORI, authorised account, legal representation, import year, declarations/quantities/origin/CN [TR07, TR29]
- Installation/operator, production periods/processes/precursors; methodology and actual/default selector by applicable goods [TR25, TR26]
- Embedded emissions, carbon price deduction evidence, free-allocation adjustment, certificates due; actual-values verifier evidence [TR05, TR29]

**Валидации:**

- Норма: annual first due 2027-09-30 for 2026 imports, не quarterly filing и не старое 31 May [TR08, TR29]
- Норма: transitional reports не требуют purchases/surrender certificates [TR06]
- Норма: actual/default, production functional unit и Annex II treatment отделить от generic product PCF [TR25, TR26]
- UX: не применять XSD TR20 как definitive annual schema; подтвердить формат/версию в реестре [TR06, TR07]

**Контрольные вопросы и человеческая проверка:**

- Установлены право подачи и национальный authority, CN scope/exempt origin/threshold, completeness annual import register? [TR07, TR29]
- Аккредитованный verifier и reviewer должны проверить actual-value chain, boundaries и carbon price evidence. [TR25, TR26]

**Эталон/образец.** Получены реальные XSD, structure XLSX, importer XML ZIP 2024. Они пригодны для исторического режима; definitive annual образец/схема не получены.

**Предупреждения интерфейса:**

- Supplier communication и registry declaration — разные результаты; применимый акт и Annex указывать явно. [TR06, TR26]
- Не смешивать периодичность декларации с учётом сертификатов и историческим transitional regime. [TR06, TR29]

**Текущие пробелы реализации:**

- generated/cbam_report.ts: quarter required, authorised ID optional, goods quantity optional, unrelated building/PCF fields required.
- Нет подтверждённого schema mapping к definitive declaration и end-to-end принятия в registry.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: UI Official Annex IV filing вводит в заблуждение: ссылка на Annex без указания акта неоднозначна; supplier communication и registry declaration различаются. [TR06, TR26]
- До CATALOG-01: UI certificates each quarter ошибочно объединяет режимы и баланс сертификатов с периодичностью декларации. [TR06, TR29]
- До CATALOG-01: user-facing.ts: title Quarterly Declaration, subtitle transitional, useWhen certificates each quarter.

### CBAM_DATA_PACKAGE

Пакет доказательств поддерживает обязанности по данным, но не является отдельной statutory declaration.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** Supplier/installation evidence package: monitoring plan, operator emissions report, расчётные таблицы, первичные документы, verification link; согласованный реестровый обмен/O3CI. [TR07, TR25, TR26]

**Входные данные:**

- Operator/installations/processes, period, source streams, meters/factors/calibration, production outputs and precursor provenance [TR25, TR26]
- Goods CN, qualifying sector parameters, actual/default values, allocation, verifier report and carbon-price evidence as applicable [TR26, TR29]

**Валидации:**

- Норма: operator reporting calendar year; фактические данные привязать к установке/периоду/товару и verification evidence [TR25, TR26]
- UX: index каждого файла → исходный показатель/единица/расчёт/версия/владелец; не сводить весь пакет к PDF [TR07, TR26]

**Контрольные вопросы и человеческая проверка:**

- Можно ли восстановить специфические выбросы из первичных данных и chain of precursors? [TR26]
- Согласованы передача коммерчески чувствительных сведений и права recipient/O3CI? [TR07]

**Эталон/образец.** Communication XLSX 2024 сохранён, illustrative filled sector ZIP не скачался за две попытки. Current guidance 3 содержит методические примеры, не заверенный клиентский package.

**Предупреждения интерфейса:**

- Supplier package ≠ filed declaration; BOМ/invoices не универсально достаточны для CBAM. [TR07, TR26]

**Текущие пробелы реализации:**

- Generated schema почти совпадает с CBAM_REPORT и требует importer certificates/quarter в supplier package.
- Нужны manifest attachments, provenance, evidence versions и rights; полная текущая supplier-format mapping отсутствует.

### CBAM_PREP_METHOD

Internal preparation/QA checklist. Не statutory filing, не аккредитованная верификация.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** Checklist/method statement c applicability decision, monitoring gaps, владельцами/сроками и ссылками на evidence; при необходимости отдельный monitoring plan. [TR25, TR26]

**Входные данные:**

- Role/year/CN/threshold decision, process map, monitoring methods, data gaps, evidence inventory [TR25, TR26]
- UX: owner, deadline, status и основание закрытия каждой задачи [TR25]

**Валидации:**

- Норма: подходы к измерению/вычислению, источникам/precursors и boundaries соответствуют применимому definitive method [TR26]
- UX: missing data/uncertainty остаётся явно unresolved, не synthetic zero [TR25, TR26]

**Контрольные вопросы и человеческая проверка:**

- Подтверждена ли методика профильным специалистом и готовы ли данные к verifier review? [TR26]

**Эталон/образец.** Нет универсального обязательного CBAM Prep Checklist; текущая guidance 2 даёт последовательность подготовки, guidance 3 — мониторинг.

**Предупреждения интерфейса:**

- Внутренняя QA не создаёт approved monitoring plan или verification opinion. [TR25, TR26]

**Текущие пробелы реализации:**

- generated/cbam_prep_method.ts требует certificates и verification results до завершения подготовки.
- Нет first-class task owner/due/evidence/acceptance mapping; checklist title не соответствует плоскому набору emissions fields.

### CBAM_ALLOWANCES

Внутренний реестр/прогноз CBAM certificates, не EU ETS allowances и не новая statutory форма.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** Ledger и forecast обязательств с reconciliation к registry; certificates приобретаются с 01.02.2027, обязательства по импорту 2026 погашаются до 30.09.2027. [TR29]

**Входные данные:**

- Annual imports и embedded emissions, actual/default route, benchmarks/adjustment, carbon-price-paid evidence [TR05, TR29]
- Certificate transactions, import quarter/year, applicable published prices, purchases/surrender/repurchase/cancellation and account balances [TR01, TR29]

**Валидации:**

- Норма: TR05 free allocation adjustment уменьшает surrender quantity; не выдаёт бесплатные CBAM allowances [TR05]
- Норма: CBAM certificates нельзя передавать другим лицам или использовать как EU ETS allowances [TR29]
- UX: forecast отделён от purchased/available/surrendered; quarterly balance control с 2027 отделён от annual declaration [TR07, TR29]

**Контрольные вопросы и человеческая проверка:**

- Сверены ли registry balance и операции, formula/benchmark/year, carbon price deduction и корректировки? [TR05, TR29]
- Точный календарь 50%-контроля и новые акты о carbon price deduction перепроверены по действующему праву до автоматизации? [TR02, TR29]

**Эталон/образец.** Benchmarks XLSX — официальный справочник, не ledger template; обязательный универсальный ledger не обнаружен.

**Предупреждения интерфейса:**

- Не отображать forecast как приобретённые сертификаты или free allocation entitlement. [TR05, TR29]

**Текущие пробелы реализации:**

- Поле cbam_free_allowances_quantity остаётся семантически неоднозначным; корректировка free allocation не равна бесплатной выдаче сертификатов импортёру. [TR05, TR29]
- Нет журналов transactions/reconciliation в плоском шаблоне, purchase/use required независимо от даты.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: Переименовать Allowance Ledger в CBAM Certificate Register/Forecast. [TR05, TR29]
- До CATALOG-01: user-facing.ts useWhen предлагал Plan free allocations; эта формулировка пользовательского каталога удалена. Семантика поля cbam_free_allowances_quantity остаётся текущим пробелом.

### CBAM_MONITORING_ALERT

Сервисное уведомление о полноте данных/сроках; не официальный regulator alert или statutory report.

**Применимость.** CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

**Выходной формат.** Watchlist незакрытых данных/методов/изменений/сроков со ссылкой на затронутые товары/установки и evidence. [TR07, TR25, TR26]

**Входные данные:**

- Role/year/methodology version, supplier requests/status, missing parameters, applicability/threshold state [TR07, TR25, TR26]
- UX: rule ID, severity, affected item, owner, due date, observed_at, evidence [TR25]

**Валидации:**

- Норма: различать monitoring/verification requirements по режиму и actual/default; отсутствие ответа supplier не делает любой fallback допустимым [TR26]
- UX: duplicate alerts deduplicate по item/rule/version; закрывать по evidence, показывать freshness [TR07, TR25]

**Контрольные вопросы и человеческая проверка:**

- Подтверждены источник правила, deadline и юридическая значимость alert? [TR02, TR29]

**Эталон/образец.** Нет официальной универсальной формы Monitoring Alert; источники служат базой правил, не оформлением уведомления.

**Предупреждения интерфейса:**

- Не называть внутреннее сообщение предписанием регулятора или доказательством несоответствия без review. [TR07, TR26]

**Текущие пробелы реализации:**

- generated/cbam_monitoring_alert.ts требует полные verified emissions/certificates вместо event/rule/owner/status.
- Нужна версия нормативного правила и handling 2023–2025 vs 2026+.

### EU_ETS

Regulated annual emissions reporting; применимость зависит от установки/деятельности и jurisdiction. Разные ветки stationary, aviation, maritime; ETS2 — отдельная система. [TR09, TR10]

**Применимость.** Сначала выбрать stationary installation с ETS permit/competent authority либо авиационную/морскую ветку. Не назначать по факту наличия корпоративных Scope 1–3. [TR09, TR10, TR11]

**Выходной формат.** AER по принятой authority форме/ERT + независимый verification report; allowance surrender отдельной операцией Union Registry. Обычно report до 31 March следующего года, surrender до 30 September; национальные сроки проверять. [TR09]

**Входные данные:**

- Permit/installation IDs/operator/year/authority, approved monitoring plan and changes [TR09, TR10]
- Source streams, activity quantities/units, factors, tiers/uncertainty, emissions by relevant gases, fallbacks/data gaps and verifier opinion [TR10, TR30]
- Allowance transactions отдельно от emissions calculation; activity-specific scope and exclusions [TR09, TR31]

**Валидации:**

- Норма: approved monitoring plan и applicability sector branch до выбора формы; installation AER не corporate inventory [TR09, TR10]
- Норма: latest authority template, source-stream totals and units, data gaps, verification outcome [TR10, TR30]
- UX: расчётный AER не маркировать Verified автоматически; surrender status не выводится из PDF [TR09, TR32]

**Контрольные вопросы и человеческая проверка:**

- Есть ли permit, утверждённый MP, правильные thresholds/exclusions и национальная форма? [TR09, TR10]
- Аккредитованный verifier подтвердил год/полноту/результат; authority принял submission? [TR09, TR32]

**Эталон/образец.** Локальные актуальные XLSX для stationary и aviation; отдельный заполненный verification exemplar. Последний не универсальный AER и не подпись по клиенту.

**Предупреждения интерфейса:**

- Каталог обозначает stationary installation; отдельные модели aviation/maritime/ETS2 не подтверждены этим исправлением. [TR09, TR11]

**Текущие пробелы реализации:**

- generated/eu_ets.ts смешивает six ETS totals с RE100/GRESB/BCorp/aviation/Scope2 и не моделирует source-stream AER.
- Реальный verification workflow и фиксация результата независимой проверки остаются необходимым отдельным этапом.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: Рекомендуется ограничить текущий UI stationary scope или добавить отдельный выбор aviation/maritime/ETS2. [TR09, TR11]
- До CATALOG-01: UI verified installation emissions заявляет статус без самого verification workflow.

### EU_MRV

Regulation 2015/757 as amended; templates 2023/2449. MRV продолжается одновременно с shipping EU ETS, не только до onboarding. [TR11, TR13, TR14]

**Применимость.** Cargo/passenger ships >=5000 GT; с 2025 также general cargo 400–<5000 GT и offshore >=400 GT при EEA-related voyages; проверить exclusions, port calls, responsibility and reporting year. ETS охват отдельно. [TR14, TR15, TR39]

**Выходной формат.** Ship emissions report/partial report + verification; ETS company aggregate report там, где применим; submission THETIS-MRV, document of compliance выдает verifier. Templates Annex I–IV 2023/2449. [TR13, TR14]

**Входные данные:**

- Ship IMO/name/type/GT, company/ISM responsibility, authority, reporting period and approved MP [TR13, TR39]
- Voyages/ports/dates, fuel and emission sources/factors, CO2 CH4 N2O, transport work/distance/cargo/time, data gaps [TR13, TR39]
- Ship transfers/partial periods, verifier report, ETS scope aggregation, derogations and phase-in [TR11, TR14, TR39]

**Валидации:**

- Норма: MRV включает CH4/N2O с 2024; maritime ETS включает их с 2026. Не смешивать totals [TR11, TR14]
- Норма: phase-in по emission year 2024/2025/2026 = 40%/70%/100%; surrender следующий год, не занижать MRV emissions этими коэффициентами [TR11]
- Норма: annual ship report к 31 March следующего года; authority может требовать раньше, но не раньше 28 February; company ETS report отдельно [TR14]
- UX: суммировать ship/partial periods без пропуска/дубля при смене company; не применять ETS 50% extra-EEA voyage к gross MRV inventory [TR11, TR39]

**Контрольные вопросы и человеческая проверка:**

- Правильно ли определены ship type, GT, voyages/port calls, exemptions и company responsible? [TR39]
- Verifier/authority подтверждают MP, emissions reports/DoC; не смешаны ли MRV, ETS и FuelEU? [TR13, TR39, TR42]

**Эталон/образец.** Нормативные бланки в Annexes TR13 проверены онлайн, локально сохранены EMSA structure tutorial и legal-table crosswalk. Полный текущий THETIS annual submission sample/XML не получен.

**Предупреждения интерфейса:**

- MRV шире/параллелен shipping ETS; применимость и результаты этих процессов проверять отдельно. [TR11, TR14]
- THETIS доступен после регистрации; выгрузка сервиса не равна accepted report/DoC. [TR38, TR39]

**Текущие пробелы реализации:**

- generated/eu_mrv.ts: 45 полей, нет ни ship/IMO/GT, ни fuel/voyage/emission methods; обязательны gender pay gap/privacy/SBTi.
- Нужны ship entities, voyage/port model, company responsibility history, gas-specific emissions, actual Annex mappings.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: Удалить обещание prior to ETS onboarding. MRV шире/параллелен ETS. [TR11, TR14]

### CORSIA

ICAO SARPs реализуются через государство attribution; reporting и offsetting имеют разную применимость. 2024–2026 first phase; 2027 second phase не применяется досрочно. [TR17, TR36, TR40]

**Применимость.** Aeroplane operator international flights: annual CO2 >10000 t от aeroplanes MTOM >5700 kg, с установленными исключениями. Не любой airport/aviation business. MRV независимо от State volunteering; offsetting определяется state pairs/годом и new entrant rules. [TR37, TR40]

**Выходной формат.** Annual verified operator Emissions Report + Verification Report to State. EMP approved by State; отдельный EUCR при offsetting. Для EU-операторов возможен Template 5 national/EU implementation; CCR — канал State→ICAO. [TR16, TR31, TR33–TR35, TR37]

**Входные данные:**

- State attribution/operator identity, monitoring year, fleet/MTOM, flights/state pairs and exclusions [TR33, TR34, TR37]
- Fuel quantity/type/density, approved method/CERT eligibility, route CO2 aggregates and data gaps [TR33, TR34]
- Verifier report; optional eligible-fuel claims with certification and supporting chain; offsetting values only when assigned/eligible [TR35, TR37, TR40]

**Валидации:**

- Норма: distinguish MRV scope and offset routes; 2026 use Edition 6 state list, not 2027 list [TR36, TR37, TR40]
- Норма: annual ER/VR deadline 30 April to State; в 2026 это отчёт за 2025. State reports ICAO к 31 July [TR37, TR41]
- Норма: flight/fuel CO2 не corporate CO2e inventory; emissions gaps must be disclosed by relevant form [TR33, TR37]
- UX: eligible fuel/units, new entrant and 3-year offset compliance не смешивать с annual ER; не выдавать credits balance как verification [TR16, TR35, TR40]

**Контрольные вопросы и человеческая проверка:**

- Государство attribution/национальный акт, операторские thresholds/exclusions и approved EMP подтверждены? [TR17, TR34, TR37]
- Проверить Amendment 2 (каталог Aug 2026), его дату применения и national implementation до production rules; полный licensed text здесь не получен. [TR18]
- Независимый verifier проверил полноту полётов, топливо/плотность, gaps и eligible fuel evidence? [TR33, TR35, TR37]

**Эталон/образец.** Сохранены 3 ICAO XLSX и EU combined AER. Это пустые стандартные формы, не заверенный заполненный report. Полный Annex 16 с Amendment 2 остаётся paid/registration gap.

**Предупреждения интерфейса:**

- Отрасль aviation сама по себе не доказывает применимость; проверить aeroplane operator и условия выбранного периода. [TR37]
- Generated PDF не ICAO certification и не receipt национального authority. [TR16, TR35]

**Текущие пробелы реализации:**

- generated/corsia.ts: 47 fields, ни одного aviation/corsia-specific поля; требует Scope2/SBTi/taxonomy/waste.
- Нужны fleet/flight/state-pair/method/density/data-gap schema и national filing branch. Check applicability предупреждает о проверке, но не реализует полный расчёт применимости.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: Airlines слишком узко: обязанный aeroplane operator может быть не авиакомпанией; industry aviation слишком широко. [TR37]

## Кодовая проверка и границы утверждений

Прочитаны `src/lib/report-templates/user-facing.ts` и девять `generated/{cbam,cbam_report,cbam_data_package,cbam_prep_method,cbam_allowances,cbam_monitoring_alert,eu_ets,eu_mrv,corsia}.ts`. Отдельные карточки сопоставлены с реально объявленными полями. Это не аудит всего pipeline генерации и не доказательство отсутствия функций в других частях системы.

Наблюдения: `EU_MRV` содержит 45 полей, `CORSIA` — 47; в просмотренных generated schemas нет отраслевых ship/flight полей. `EU_ETS` смешивает данные установки с обязательными полями RE100/GRESB/BCorp. CBAM-формы требуют building modules и квартал там, где это не обусловлено назначением. Нельзя считать такой набор полей нормативным покрытием.

## Сохранённые материалы, проверка и оставшиеся пробелы

Файлы находятся в [assets/trade-transport](../../report-reference/assets/trade-transport/); [download-manifest.json](../../report-reference/assets/trade-transport/download-manifest.json) фиксирует URL, HTTP/MIME, размер, подпись/структуру, SHA256 и неуспешные попытки. Полезные образцы: transitional CBAM `export.xml` с учебными вложениями, XSD и structure workbook; supplier communication workbook 2024; EU ETS stationary AER 09.02.2026 и combined aviation AER 23.01.2026; три стандартных ICAO workbook; EMSA MRV/legal-table crosswalk.

XLSX проверены как ZIP/OOXML и открыты в режиме чтения, структура листов осмотрена. Макросы не запускались, формулы не пересчитывались, нормативная полнота всех ячеек отдельно не сертифицирована. PDF проверены по подписи и извлечению страниц; визуально проверены CORSIA FAQ p.51 и EMSA crosswalk p.1. Заполненный EU ETS verification exemplar — учебный, не годовой AER клиента.

Остаются открытыми:

- Definitive CBAM annual submission schema и завершённый официальный пример за 2026; архивные XML/XSD не заменяют этот пробел.
- Полная постатейная сверка действующих CBAM consolidated/implementing acts: TR03/TR04 вернули антибот-проверку после двух способов чтения. Основания требований здесь — открытые официальные пояснения; задача production implementation требует повторного доступа reviewer.
- CBAM sector-filled examples ZIP: две попытки завершились 429 и неполным ответом; файл не сохранён. Старый communication workbook и официальный XML importer sample доступны локально.
- Текущий THETIS annual submission XML/заполненный annual report не скачан; statutory forms доступны в TR13, локально есть официальные crosswalk и guidance.
- Полный licensed ICAO Annex 16 с Amendment 2; приобретение/обход защиты не выполнялись. Национальный акт и конкретная форма подачи CORSIA должны быть выбраны по государству attribution.
- Издательские FAQ могут содержать неточности: CBAM FAQ перечисляет 31 October среди квартальных контрольных дат. Календарь 50%-контроля не следует автоматически строить по этой строке без проверки действующего закона.
- Ссылки TR12/TR13 открылись с текстом при первом запросе, при повторах работали нестабильно. Локальных копий закона нет. Это явно отражено в `access`, а не скрыто статусом verified.

## Первичные источники

У источников с недоступным полным текстом указан ограниченный статус. Они не считаются прочитанной нормой только на основании URL. Локальные материалы — оригинальные файлы издателей, не копии чужих отчётов с предполагаемой универсальной юридической силой.

- **TR01** — [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en). European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: `public`. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR02** — [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en). European Commission, DG TAXUD; проверено 2026-10-11; доступ: `public`. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR03** — [Regulation (EU) 2023/956, consolidated after 2025/2083](https://eur-lex.europa.eu/eli/reg/2023/956/2025-10-20). European Union, EUR-Lex; 2025-10-20; доступ: `public_access_problem`. Ссылка реально открыта из TR02; вместо текста получена JS-проверка, alternate TXT redirected. После двух способов чтение остановлено. Содержание в этой работе сверено по официальным пояснениям, не заявлено как полная постатейная проверка.
- **TR04** — [Implementing Regulation (EU) 2025/2547: embedded-emissions methods](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2547). European Commission, EUR-Lex; 2025-12; доступ: `public_access_problem`. Открыта ELI и TXT-ссылка, обе JS-проверка. Использованы доступные официальные guidance TR25/TR26; необходима окончательная сверка Annexes закона.
- **TR05** — [Implementing Regulation (EU) 2025/2620: free allocation adjustment](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2620). European Commission, EUR-Lex; 2025-12-16; OJ 2025-12-22; доступ: `public`. Текст открыт. Это уменьшение числа CBAM certificates к погашению, не выдача импортёру EU ETS allowances. Articles 1–4 и Annex.
- **TR06** — [CBAM archive: transitional reporting resources](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-archive_en). European Commission, DG TAXUD; 2023-10–2025-12; проверено 2026-10-11; доступ: `public`. Открыта. Сам издатель помечает материалы как архивные и не отражающие definitive regime.
- **TR07** — [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en). European Commission, DG TAXUD; проверено 2026-10-11; доступ: `public`. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR08** — [CBAM communication and news](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-communication-and-news_en). European Commission, DG TAXUD; новости до 2026-10-05; доступ: `public`. Открыта. Публикует FAQ, communication XLSX 2024, sector examples и подтверждение первого annual deadline 2027-09-30. Публикация старого XLSX здесь не делает его definitive-template.
- **TR09** — [EU ETS monitoring, reporting and verification: guidance and templates](https://climate.ec.europa.eu/areas-action/carbon-markets/eu-emissions-trading-system-eu-ets/monitoring-reporting-and-verification_en). European Commission, DG CLIMA; проверено 2026-10-11; доступ: `public`. Открыта. Annual compliance cycle; ERT; AER installation template 2026-02-09, aircraft template 2026-01-23. Национальные формы могут отличаться.
- **TR10** — [Monitoring and Reporting Regulation (EU) 2018/2066, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02018R2066-20250527). European Commission, EUR-Lex; 2025-05-27; доступ: `public`. Текст открыт по актуальной ссылке из TR09; более старая 2024 consolidation не использована как актуальная версия.
- **TR11** — [Reducing emissions from the shipping sector](https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en). European Commission, DG CLIMA; проверено 2026-10-11; доступ: `public`. Открыта. MRV/ETS overlap и phase-in. Июльская 2026 реформа на странице названа proposal, не принятая норма.
- **TR12** — [Regulation (EU) 2015/757, consolidated MRV maritime](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02015R0757-20240101). European Union, EUR-Lex; 2024-01-01; доступ: `public_intermittent`. Первое открытие вернуло полный текст; повторный find перенаправлялся. Изменения последующих лет дополнительно сверены через TR14/TR39; эта старая consolidation не объявляется полной редакцией 2026.
- **TR13** — [Implementing Regulation (EU) 2023/2449: MRV forms](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2449). European Commission, EUR-Lex; 2023-11-06; доступ: `public_intermittent`. Первое открытие вернуло 1218 строк; повторный fetch/host blocked. Annex I monitoring plan, Annex II emissions/partial report, Annex III document of compliance, Annex IV company report. Локальный PDF не получен; официальный crosswalk сохранён TR42.
- **TR14** — [MRV Regulation: amended obligations](https://www.emsa.europa.eu/reducing-emissions/mrv-changes.html). EMSA; проверено 2026-10-11; доступ: `public`. Открыта. Расширение на газы и суда, годовой ship report и отдельный company report для ETS, сроки и право authority назначить более ранний срок.
- **TR15** — [FAQ MRV Regulation](https://www.emsa.europa.eu/reducing-emissions/mrv-changes/faq-mrv-changes.html). EMSA; страница указывает update 2024-08-23; проверено 2026-10-11; доступ: `public`. Открыта. Сама направляет к более подробному и свежему TR39; не заменяет закон.
- **TR16** — [CORSIA standardized templates](https://www.icao.int/CORSIA/standardized-templates). ICAO; Doc 9501 Vol IV 4th edition; files 2025; доступ: `public`. Открыта. ER и EMP остались по структуре 3rd edition; VR обновлён. Это рекомендованные стандартные формы оператор→государство, не CCR state→ICAO.
- **TR17** — [SARPs Annex 16 Volume IV](https://www.icao.int/CORSIA/sarps-annex-16-volume-iv). ICAO; 2nd edition July 2023; applies 2024-01-01; доступ: `public`. Открыта. Страница базового издания не разрешает игнорировать поправки; TR18 сообщает Amendment 2.
- **TR18** — [Annex 16 Volume IV, 2nd edition including Amendment 2](https://store.icao.int/en/annex-16-environmental-protection-volume-iv-carbon-offsetting-and-reduction-scheme-for-international-aviation-corsia). ICAO Store; 2nd ed. 2023; catalog Amendment 2 dated 2026-08-03; доступ: `paid/registration`. Официальная индексированная карточка проверена: USD 140, single-user protected PDF; открытие страницы вернуло 407. Полный платный текст/поправка не приобретались, применимость отдельных изменений требует licensed review.
- **TR19** — [CORSIA States for Chapter 3 State Pairs](https://www.icao.int/CORSIA/corsia-states-chapter-3-state-pairs). ICAO; проверено 2026-10-11; доступ: `public`. Открыта. Есть разные списки по годам, включая уже опубликованный 2027. Для 2026 сохранено именно Edition 6; 2027 не подменяет текущий год.
- **TR20** — [CBAM quarterly report XSD/stypes](https://taxation-customs.ec.europa.eu/document/download/b473e58d-655b-4d21-a4ef-144d48e9877a_en?filename=CBAM%20XSD%20version%2018.30.zip). European Commission, DG TAXUD; 18.30; 2024-09-10; доступ: `public_downloaded`; локально: [cbam-quarterly-xsd-v18.30.zip](../../report-reference/assets/trade-transport/cbam-quarterly-xsd-v18.30.zip). Архивная transitional XSD, не definitive annual schema.
- **TR21** — [CBAM quarterly importer sample](https://taxation-customs.ec.europa.eu/document/download/e26f421b-4825-4c03-ba0a-5d2e3e6278e4_en?filename=CBAM_Quarterly_Report_sample_file_for_importer_ver1.3.0.0.zip). European Commission, DG TAXUD; 1.3.0.0; 2024-09-12; доступ: `public_downloaded`; локально: [cbam-quarterly-importer-sample-v1.3.0.0.zip](../../report-reference/assets/trade-transport/cbam-quarterly-importer-sample-v1.3.0.0.zip). Официальный учебный ZIP: export.xml и mock supporting documents. XML содержит Q2/2024 и демонстрационные реквизиты. Не универсальный образец; совместимость с XSD 18.30 ещё не проверена.
- **TR22** — [CBAM quarterly report structure](https://taxation-customs.ec.europa.eu/document/download/d3cc400c-ce53-43df-87ed-2b4bcaed4bb9_en?filename=Report%20Structure%20ver%2018.30.xlsx). European Commission, DG TAXUD; 18.30; 2024-09-10; доступ: `public_downloaded`; локально: [cbam-quarterly-structure-v18.30.xlsx](../../report-reference/assets/trade-transport/cbam-quarterly-structure-v18.30.xlsx). Архивный справочник fields/обязательности/code lists; 33 sheets, открывается.
- **TR23** — [CBAM communication template for installations](https://taxation-customs.ec.europa.eu/document/download/2c15cd0e-2447-4ef8-ab70-68b80b66ede8_en?filename=CBAM%20Communication%20template%20for%20installations_en_20241213.xlsx). European Commission, DG TAXUD; 2024-12-13; webpage 2024-12-18; доступ: `public_downloaded`; локально: [cbam-communication-template-20241213.xlsx](../../report-reference/assets/trade-transport/cbam-communication-template-20241213.xlsx). 19 sheets. Transitional supplier communication workbook; использовать только как исторический структурный ориентир и не как annual declaration за 2026.
- **TR24** — [CBAM communication template: sector examples](https://taxation-customs.ec.europa.eu/document/download/8d00a979-e57d-4e53-a11f-8b01370236a9_en?filename=Communication-template-examples.zip). European Commission, DG TAXUD; 2024-06-20; доступ: `public_download_failed`. Ссылка найдена в открытой TR08; 429, затем premature response. Две попытки исчерпаны, ZIP не сохранён. Сам архив: illustrative sector examples, не нормативный эталон definitive.
- **TR25** — [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf). European Commission, DG TAXUD; 2026-08-14; доступ: `public_downloaded`; локально: [cbam-guidance-2-operators-20260814.pdf](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** — [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf). European Commission, DG TAXUD; 2026-08-14; доступ: `public_downloaded`; локально: [cbam-guidance-3-methods-20260814.pdf](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR27** — [CBAM default values definitive period, corrected](https://taxation-customs.ec.europa.eu/document/download/1c05d211-80cb-4aaa-8ef0-e08005a95d7e_en?filename=DV%20correcting%20act_final%20update_06.08.xlsx). European Commission, DG TAXUD; page 2026-08-10; filename 2026-08-06; доступ: `public_downloaded`; локально: [cbam-default-values-20260810.xlsx](../../report-reference/assets/trade-transport/cbam-default-values-20260810.xlsx). Информационный Excel; юридически обязательны 2025/2621 + correcting 2026/1740 из TR02. Не отчёт и не расчёт пользователя.
- **TR28** — [CBAM benchmarks definitive period](https://taxation-customs.ec.europa.eu/document/download/9877523c-2a02-4926-a211-aefae7cf6d0d_en?filename=CBAM%20Benchmarks_20260206.xlsx). European Commission, DG TAXUD; file 2026-02-06; page 2026-02-13; доступ: `public_downloaded`; локально: [cbam-benchmarks-20260206.xlsx](../../report-reference/assets/trade-transport/cbam-benchmarks-20260206.xlsx). Информационная таблица benchmarks; юридический источник TR05, не бесплатные allowances импортёру.
- **TR29** — [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf). European Commission, DG TAXUD; 2026-05-28; доступ: `public_downloaded`; локально: [cbam-faq-20260528.pdf](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.
- **TR30** — [EU ETS Template 4: Annual Emissions Report installations](https://climate.ec.europa.eu/document/download/ef2f9250-ae8b-48d9-99c8-378703f369f8_en?filename=policy_ets_monitoring_t4_aer_installations_en.xlsx). European Commission, DG CLIMA; 2026-02-09; доступ: `public_downloaded`; локально: [ets-aer-installations-20260209.xlsx](../../report-reference/assets/trade-transport/ets-aer-installations-20260209.xlsx). 19 sheets, 4.06 MB, workbook opens; A–J structured AER. Национальный authority может использовать свою версию/ERT.
- **TR31** — [EU ETS/Swiss ETS/CORSIA Template 5: aircraft AER](https://climate.ec.europa.eu/document/download/4a327569-5092-4d55-a457-530a5a4eb487_en?filename=t5_aer_aircraft_en.xlsx). European Commission, DG CLIMA; 2026-01-23; доступ: `public_downloaded`; локально: [ets-corsia-aircraft-aer-20260123.xlsx](../../report-reference/assets/trade-transport/ets-corsia-aircraft-aer-20260123.xlsx). 17 sheets, включая CORSIA emissions/fuels; разделять границы режимов. Это EU reporting context, не универсальный ICAO filing format.
- **TR32** — [EU ETS exemplar verification report: installation](https://climate.ec.europa.eu/document/download/84c3bff8-0ba4-4657-a594-c8430597f115_en?filename=examplar_avr_verification_installations_en.pdf). European Commission, DG CLIMA; дата файла отдельно не подтверждена; index checked 2026-10-11; доступ: `public_downloaded`; локально: [ets-installation-verification-exemplar.pdf](../../report-reference/assets/trade-transport/ets-installation-verification-exemplar.pdf). Учебный заполненный пример верификатора, не годовой emissions report и не реальное заключение по клиенту.
- **TR33** — [ICAO emissions report operator to State](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.2-ER-template_ETM-Vol-IV-4th-ed.xlsx). ICAO; ETM Vol IV 4th ed., 2025; доступ: `public_downloaded`; локально: [corsia-emissions-report-etm4.xlsx](../../report-reference/assets/trade-transport/corsia-emissions-report-etm4.xlsx). 8 sheets: identity, basic info, fleet, density, reporting, State pairs, aerodrome pairs, data gaps. Не CCR upload.
- **TR34** — [ICAO emissions monitoring plan](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.1-EMP-template_ETM-Vol-IV-4th-ed.xlsx). ICAO; ETM Vol IV 4th ed., 2025; доступ: `public_downloaded`; локально: [corsia-monitoring-plan-etm4.xlsx](../../report-reference/assets/trade-transport/corsia-monitoring-plan-etm4.xlsx). 11 sheets: versions/identification/fleet/methods/data management; approval State required.
- **TR35** — [ICAO verification report](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Documents/Standardized%20templates%20-%202025/ETM-Volume-IV-Appendix-1.6-VR-template_ETM-Vol-IV-4th-ed.xlsx). ICAO; ETM Vol IV 4th ed., 2025; доступ: `public_downloaded`; локально: [corsia-verification-report-etm4.xlsx](../../report-reference/assets/trade-transport/corsia-verification-report-etm4.xlsx). 10 sheets. Заполняется верификатором; генерация не даёт verified status.
- **TR36** — [CORSIA States for Chapter 3 State Pairs, Edition 6](https://www.icao.int/sites/default/files/sp-files/environmental-protection/CORSIA/Documents/CORSIA-States-for-Chapter-3-State-Pairs_6Ed_web.pdf). ICAO; 2026 reporting year; доступ: `public_downloaded`; локально: [corsia-state-pairs-2026-ed6.pdf](../../report-reference/assets/trade-transport/corsia-state-pairs-2026-ed6.pdf). 4 pages; 2026 state-pair applicability, не 2027 list.
- **TR37** — [CORSIA Frequently Asked Questions](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/CORSIA_FAQs_Apr2024.pdf). ICAO; 2024-04; доступ: `public_downloaded`; локально: [corsia-faq-202404.pdf](../../report-reference/assets/trade-transport/corsia-faq-202404.pdf). 83 pages; Q3.19 scope thresholds, Q3.64 timing, Q3.65 route scope. Срок 30 April перепроверен TR41; новые поправки сверить TR18.
- **TR38** — [THETIS-MRV webinar: monitoring plan structure](https://www.emsa.europa.eu/we-do/digitalisation/maritime-monitoring/download/7764/5154/23.html). EMSA; 2024-03-05; доступ: `public_downloaded`; локально: [mrv-thetis-monitoring-plan-training-20240305.pdf](../../report-reference/assets/trade-transport/mrv-thetis-monitoring-plan-training-20240305.pdf). 10 slides, slide 7 maps Annex I A–F to THETIS. Учебный UI/process reference; не заполненный annual report.
- **TR39** — [EU ETS and MRV Maritime: General guidance for shipping companies](https://climate.ec.europa.eu/document/download/31875b4f-39b9-4cde-a4e2-fbb8f65ee703_en?filename=policy_transport_shipping_gd1_maritime_en.pdf). European Commission, DG CLIMA; 2025-11-18 updated version; доступ: `public_downloaded`; локально: [mrv-ets-general-guidance.pdf](../../report-reference/assets/trade-transport/mrv-ets-general-guidance.pdf). 125 pages; найден через EMSA. Более свежий guide имеет приоритет над устаревшими FAQ по интерпретации, но не над законом.
- **TR40** — [Assembly Resolution A42-22: CORSIA](https://www.icao.int/sites/default/files/environmental-protection/Assembly42/Resolution-A42-22_CORSIA.pdf). ICAO; 42nd Assembly 2025; доступ: `public_downloaded`; локально: [corsia-resolution-a42-22.pdf](../../report-reference/assets/trade-transport/corsia-resolution-a42-22.pdf). 7 pages, фазирование и route-based offsetting; не заменяет национальное внедрение/SARPs.
- **TR41** — [CORSIA newsletter: 2026 implementation deadlines](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/Newsletter/CORSIA-Newsletter_Feb-2026_v5.pdf). ICAO; 2026-02; доступ: `public_downloaded`; локально: [corsia-deadlines-newsletter-202602.pdf](../../report-reference/assets/trade-transport/corsia-deadlines-newsletter-202602.pdf). Публично доступен на ICAO site. Page 2 подтверждает operator ER/VR deadline 2026-04-30 за 2025, States 2026-07-31.
- **TR42** — [THETIS-MRV monitoring plan: reference to tables of legal acts](https://www.emsa.europa.eu/thetis-mrv/download/7902/5281/23.html). EMSA; дата PDF не указана; linked FuelEU integration 2024; доступ: `public_downloaded`; локально: [mrv-monitoring-plan-legal-template-crosswalk.pdf](../../report-reference/assets/trade-transport/mrv-monitoring-plan-legal-template-crosswalk.pdf). 3 pages, реально скачан и визуально проверен: crosswalk MRV/FuelEU. Не сами annual report формы; разделяет общие и специальные поля.
