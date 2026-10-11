# Раскрытия, стандарты и оценочные схемы: 15 типов отчёта

Проверено **11 октября 2026 года**. Это нормативная и справочная библиотека для реализации продукта. Обязанность определяется организацией, юрисдикцией и отчётным периодом; заполненность полей сама по себе не доказывает соответствие. Подробная матрица входных данных, проверок и пробелов: [disclosures-schemes.json](../../report-reference/research/disclosures-schemes.json).

Метки `правовой gate` обозначают проверку применимости права, `правило стандарта/схемы` — выбранного framework, `UX-предложение` — нашу рекомендацию продукту. Добровольная схема может быть условием договора, но это не делает её универсальной законодательной обязанностью.


Кодовые наблюдения исходного снимка до CATALOG-01 отделены ниже от текущих пробелов. Локальные изменения текста и рекомендаций не подтверждают production-проверку или нормативную готовность. Статусы задач ведутся только в [BACKLOG](../../planning/BACKLOG.md); нормативные источники повторно не проверялись.

## Изменения, которые нельзя потерять

| Область | Статус на дату проверки | Практическое следствие |
|---|---|---|
| CSRD / ESRS | Omnibus принят; revised ESRS опубликованы в OJ21.09.2026 [DS01–DS05]. Точный commencement Article 2 не извлечён. | Старый shortcut описан как исторический; полную scope, national transposition, период и выбранную ESRS edition ещё нужно формализовать. Не описывать окончательный акт как ещё только предложение. |
| SEC | Правило 2024 приостановлено; отмена предложена 29.05.2026, final rescission не подтверждена [DS10–DS11]. | Автоматическое mandatory снято локально; это не действующая filing specification и не заключение о применимости. |
| UK / HKEX | FCA final PS26/19:FY 2027, first report 2028; HKEXAppendix C2 с issuer/phasing tiers [DS18,DS21]. | Ни premium-only, ни один exchange flag не определяют весь режим. |
| ISSB / schemes | Местные adoption rules отличаются; CDP/GRESB ежегодные; SBTiV2 опубликована, validation planned 2027; B Corp перешла к новой модели [DS24–DS25,DS30,DS37,DS42,DS47–DS49]. | Версия, cohort, профиль и фактический статус подачи должны храниться вместе с ответами. |

## Карточки применимости и реализации

### CSRD — EU corporate sustainability disclosure

**Класс:** `regulated`. **Нормативный статус:** Omnibus окончательно одобрен 24.02.2026 [DS01]; stop-the-clock2025/794 уже принят [DS02]. Revised ESRS 2026/1563 приняты 03.07 и опубликованы 21.09.2026 [DS03–DS04]. Заявленное применение — FY с 01.01.2027, раннее FY 2026 после вступления в силу [DS05]; точный commencement Article 2 требует ручной сверки.

**Применимость:** Для нового EU scope ориентир: более 1 000 работников И net turnover более€450m; нужны группа/юрисдикция/отчётный год/национальная имплементация, отдельный non-EU test. Wave1 out-of-scope relief за 2025/26 проверяется по местному акту [DS01].

**Результат:** Sustainability statement в management report: double materiality, применимые ESRS disclosures, политики/действия/цели/метрики и основания пропусков; assurance и формат публикации по применимому режиму [DS03].

**Входные данные:** Юрлицо, parent/group, EU/non-EU, net turnover, средняя численность, финансовый период, national transposition [DS01–DS02]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS01–DS05; правовой gate] Определять scope и reporting period до назначения обязательных полей; не применять EMP250 или €40m как текущий автоматический CSRD trigger.

**Человеческая проверка:** Специалист по местному праву подтверждает transposition, exemptions и commencement [DS01–DS05].

**Образец:** Valmet Sustainability Statement 2024 [DS51], официальный PDF. Визуально проверены basis, индекс и таблица E1-6: PDF 2/21/41. Исторический пример структуры, не эталон правильности и не шаблон revised ESRS 2026.

**Текущий пробел реализации:** Нужна полная модель scope по организации/группе, стране и периоду; грубые диапазоны анкеты и Check applicability не заменяют юридические тесты.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: R1_SIZE/R1_REVENUE использовал 250 сотрудников/€40m и PUBLIC для категоричной рекомендации CSRD. Эти shortcuts и автоматический mandatory заменены предупреждением о проверке применимости.
- До CATALOG-01: user-facing.ts: безусловный subtitle ESRS-compliant annual disclosure завышает доказанный результат.

### UK_SECR — UK energy and carbon reporting

**Класс:** `regulated`. **Нормативный статус:** SECR действует для периодов с 01.04.2019; руководство 2019 остаётся опубликованным [DS07–DS08]. Treasury2025–26 отдельно поясняет, что повышение общих company-size thresholds2025 не повысило SECR thresholds [DS09].

**Применимость:** UK quoted companies; для unquoted/LLP тест как минимум двух из turnover>£36m, balance sheet>£18m, employees>250 с правилами групп/лет и исключениями. Проверить low energy use40MWh и иные разрешённые исключения [DS08–DS09].

**Результат:** Энергия/выбросы, intensity ratio, comparatives, methodology и energy-efficiency actions в Directors Report либо LLP Energy and Carbon Report; quoted global/UK split отличается от unquoted UK boundary [DS08].

**Входные данные:** Quoted/unquoted/LLP, размер, группа, период и потребление для exemption test [DS08–DS09]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS08–DS09; правовой gate] Не ограничивать SECR публичными компаниями или одним headcount test.

**Человеческая проверка:** Company secretary/accountant подтверждает scope, групповые исключения и место раскрытия [DS08–DS09].

**Образец:** С.51–57 — официальные пустые отчётные таблицы и narrative examples; исторические годы внутри образца заменить своим периодом. Не готовая подача в Companies House.

**Текущий пробел реализации:** Маршрут Check applicability учитывает необходимость проверки unquoted/LLP; полные финансовые/групповые тесты, границы и исключения ещё требуют формализации.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: R4 ограничивал SECR триггером UK+PUBLIC+headcount. Локально добавлены маршруты проверки для других случаев; полные финансовые тесты остаются текущим пробелом.

### SEC_CLIMATE — US SEC climate disclosure rule

**Класс:** `regulated`. **Нормативный статус:** Final rule2024 приостановлено 04.04.2024. SEC прекратила защиту 27.03.2025; суд поставил дело в abeyance12.09.2025.29.05.2026 предложена отмена; статус S7-2026-19 на дату проверки Proposed, не final rescission [DS10–DS11].

**Применимость:** Не обозначать всех NYSE/Nasdaq issuers как уже обязанных исполнять Subpart1500. Проверить registrant/filing regime и отдельно существующие material disclosure obligations с US counsel [DS10–DS11].

**Результат:** На текущем статусе — подготовительный disclosure workpaper с версией/датой и material climate information для юридической оценки. Самостоятельный PDF не SEC filing.

**Входные данные:** Registrant status, filer category, форма/период, material climate risks, финансовые эффекты и evidence [DS10]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS10–DS11; правовой gate] Блокировать утверждение mandatory under2024 climate rule, пока stay действует.

**Человеческая проверка:** US securities counsel проверяет действующие обязанности и актуальный docket перед выпуском.

**Образец:** Публичный проект отмены — нормативный материал, не шаблон отчёта. Универсального официального standalone SEC climate report в проверенных источниках нет.

**Текущий пробел реализации:** Предупреждение о stay не является полной моделью registrant/filing regime и действующих material disclosure obligations; нужна отдельная правовая проверка.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: rules.ts R5_NYSE_NASDAQ выдаёт REGULATORY_MANDATORY без stay gate.
- До CATALOG-01: user-facing.ts once the rule goes live не объясняет stay/litigation/proposed rescission.

### SFDR — EU financial market entity PAI

**Класс:** `regulated`. **Нормативный статус:** SFDR Article 4 и RTS2022/1288/Annex I действуют; Council position24.06.2026 по реформе не равна принятой замене [DS12–DS16].

**Применимость:** Entity PAI относится к FMP, которые обязаны учитывать PAI (>500 сотрудников либо parent large group по Article 4(3)/(4)) или выбрали это; для остальных работает Article 4(1) disclosure/explanation. Не выводить обязанность из AUM€500m [DS12].

**Результат:** Entity-level principal adverse sustainability impacts statement по Annex I; product Article 8/9/11 annexes — отдельный вид результата [DS13–DS15].

**Входные данные:** FMP/adviser legal type, employee/group test, voluntary PAI election и reporting year [DS12]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS12; правовой gate] Entity-level PAI не назначать по произвольному AUM; product classification не заменяет entity test.

**Человеческая проверка:** Compliance/legal определяет Article 4 scope и применимую редакцию RTS.

**Образец:** Официальный редактируемый Annex I DOCX. Это entity PAI, не Article 8/9 pre-contractual или periodic product template; перед выпуском сверить с authentic OJ [DS14].

**Текущий пробел реализации:** Check applicability не реализует полный Article 4 employee/group/opt-in test и определение применимого результата; эти условия остаются для формализации.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: R8 назначал SFDR по finance+AUM500m+. AUM-shortcut и категоричная рекомендация заменены предупреждением о проверке применимости.

### UK_TCFD — UK climate financial disclosure and UK SRS transition

**Класс:** `regulated`. **Нормативный статус:** Текущие TCFD-aligned режимы различаются по issuer/sector. UK SRS опубликованы 25.02.2026; FCA final PS26/19 опубликован 30.09.2026, применяется к accounting periods с 01.01.2027, первые reports2028 [DS17–DS20].

**Применимость:** Сначала определить FCA listing category, asset manager/asset owner regime либо Companies Act/LLP CFD. Последний включает отдельные >500 employee tests и для крупных private/LLP >£500m turnover; simple LSE flag недостаточен [DS17–DS20].

**Результат:** Режимный annual disclosure: TCFD statement либо применимый UK SRS disclosure / comply-or-explain; сохранять basis, места cross-reference и причины исключений [DS17–DS20].

**Входные данные:** Listing category / legal entity / sector, отчётный период, headcount/turnover/group и применимый regime [DS17–DS20]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS18; временное правило] Учитывать один год Scope 3 relief и два года wider S1 relief для нового FCA режима; не считать все требования уже действующими для FY 2026.

**Человеческая проверка:** UK counsel/company secretary выбирает режим и проверяет applicable listing category.

**Образец:** TCFD workshop: National Grid governance excerpt. Подходит как пример подачи governance для legacy TCFD; не полный UKCFD/UK SRS compliance example.

**Текущий пробел реализации:** Нужны проверяемый выбор listing/entity regime и версия требований по отчётному периоду; предупреждение о применимости не выполняет эти проверки.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: user-facing.ts ограничивает описание premium listings и обещает PRA/FCA-ready без определения режима.
- До CATALOG-01: rules.ts трактует LSE/запрос регулятора как универсальную обязанность.

### HKEX_ESG — Hong Kong listed issuer ESG code

**Класс:** `regulated`. **Нормативный статус:** Действующее название — Appendix C2 ESG Reporting Code. Part B mandatory, Part C comply-or-explain, Part D климат с phasing2025/2026 [DS21–DS22].

**Применимость:** Выяснить Main Board/GEM и весь предшествующий финансовый год членства в Hang Seng Composite LargeCap Index. Для LargeCap Part D обязателен с FY 2026 и сохраняется при последующем выходе из индекса; остальные tiers отличаются [DS21].

**Результат:** Annual ESG disclosure по применимой части Code: governance/materiality/boundary, environmental/social KPIs, климатические risks/strategy/metrics с cross-references [DS21–DS22].

**Входные данные:** Board/market tier, reporting year и история HSCLI membership [DS21]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS21; правовой gate] Вычислять Part D phasing по периоду и issuer tier, не одному HKEX flag.

**Человеческая проверка:** Hong Kong listing adviser подтверждает rules/transition relief и issuer tier.

**Образец:** Официальная таблица HKEX↔ISSB, PDF20 страниц. Это reference/crosswalk, не заполненный ESG report; универсальный публичный report template не установлен.

**Текущий пробел реализации:** Нужна формализованная модель issuer tiers и FY 2025/26 phasing; Check applicability не доказывает полноту выбранного disclosure scope.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: user-facing.ts до сих пор Appendix 27 compliance.
- До CATALOG-01: HKEX получал автоматический mandatory без подтверждения применимости. Этот статус заменён предупреждением о проверке; issuer tiers и phasing остаются текущим пробелом.

### IFRS_S2_CLIMATE — ISSB climate disclosure standard

**Класс:** `voluntary_standard`. **Нормативный статус:** IFRS S2 standard действует для периодов с 01.01.2024; юридическая обязательность зависит от местного внедрения [DS23,DS25]. Поправки GHG опубликованыдекабрь 2025, применяются с FY 2027; early application разрешено [DS24].

**Применимость:** Для добровольного заявления о соответствии нужен IFRS basis, включая связанные S1 requirements; для regulated use выбрать jurisdiction, entity scope, phase-in и локальные отличия [DS23–DS25].

**Результат:** Climate-related financial disclosures: governance, strategy, risk management, metrics/targets и связь с financial reporting; не только GHG inventory [DS23,DS26].

**Входные данные:** Jurisdiction/adoption basis, reporting entity/period, chosen edition/reliefs [DS23–DS25]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS25; правовой gate] Standard effective date не равна дате обязательности в каждой стране; profile не путать с preliminary snapshot.

**Человеческая проверка:** ISSB/local reporting specialist подтверждает basis и полноту S1/S2.

**Образец:** June2025 implementation guidance с requirements/illustrations/TPT mapping; не универсальный completed IFRS S2 report и не certificate.

**Текущий пробел реализации:** generated/ifrs_s2_climate.ts135 полей не образуют проверяемый S1/S2 paragraph map.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: user-facing.ts ahead of jurisdictional mandates скрывает уже введённые режимы.

### TCFD_REPORT — Legacy TCFD recommendations

**Класс:** `voluntary_standard`. **Нормативный статус:** Рекомендации 2017 и implementation annex2021; TCFD распущена 12.10.2023, сайт архивный сноября 2023. Мониторинг передан IFRS Foundation [DS28].

**Применимость:** Добровольный investor/client-requested TCFD narrative; там, где TCFD встроена в закон, выбирать отдельный местный regime [DS28,DS17].

**Результат:** Четыре pillars и 11 recommended disclosures с index/cross-references: governance, strategy, risk management, metrics/targets [DS28].

**Входные данные:** Boundary/period/audience, governance responsibilities, climate risks/opportunities и scenarios [DS28]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS28; добровольный framework] Проверить покрытие 11recommendations, включая причины пропусков и cross-references.

**Человеческая проверка:** Board/risk owner подтверждает содержание; юрист проверяет claims и местную обязательность.

**Образец:** Governance workshop2022 содержит реальные опубликованные excerpts, в том числе National Grid2020/21 на с.13. TCFD предупреждает, что это иллюстрации, не endorsement и не весь report.

**Текущий пробел реализации:** Нужна явная фиксация выбранного legacy framework либо применимого local regime; снятие обещания single PDF не создаёт такую модель.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: user-facing.ts single PDF не раскрывает legacy status и ограниченность международной применимости.

### CDP_DISCLOSURE — CDP annual environmental questionnaire

**Класс:** `assessment`. **Нормативный статус:** Добровольная/requested схема CDP, версия 2026; corporate disclosure интегрирует environmental topics и tailoring. Это не самостоятельный закон и не только investor climate questionnaire [DS30–DS33].

**Применимость:** Company request/self-selection, Full или SME, activity classification, запрошенные темы и дополнительные initiative/supply-chain questions определяют фактическую анкету [DS30–DS33].

**Результат:** Ответ на active tailored questionnaire в CDP portal с evidence; score выдаёт CDP после своего процесса, не генератор PDF [DS30–DS33].

**Входные данные:** Reporting year, requester, Full/SME eligibility, revenue/headcount/activity и тематический маршрут [DS32]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS31–DS33; правило схемы] Проверять year+questionnaire path+questionID; не использовать 2025 form как 2026.

**Человеческая проверка:** CDP response owner подтверждает активную анкету/visibility и подписывает ответ.

**Образец:** Скачаны 2026overview40 pp и setup preview13 pp. Это реальные материалы CDP, но не все tailored questions и не пример полного ответа компании; финальная конфигурация в портале.

**Текущий пробел реализации:** generated/cdp_disclosure.ts139 полей без year/questionID routing; присутствуют SFDR/HKEX/CSRD поля.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: user-facing.ts Investor version / Climate Questionnaire слишком узко.

### ECOVADIS_SCORE — EcoVadis sustainability rating submission

**Класс:** `assessment`. **Нормативный статус:** Коммерческая добровольная оценка системы управления: четыре темы, до 21 критерия, tailored questionnaire и analyst review [DS34–DS36]. Не регулируемый carbon report.

**Применимость:** Размер, activity/industry, страна и assessment scope определяют вопросы и критерии; применяется договор/приглашение клиента и правила EcoVadis [DS34,DS36].

**Результат:** Submission evidence dossier / реестр ответов и документов; официальный scorecard формирует EcoVadis [DS34–DS36].

**Входные данные:** Юрлицо/оценочный scope, страны/размер/sector и активная анкета [DS34,DS36]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS35; правило evidence] Проверить релевантность, даты, принадлежность scope и внедрение; сгенерированный специально для анкеты текст не доказательство практики.

**Человеческая проверка:** ESG/compliance owner подтверждает подлинность и внедрение документов.

**Образец:** Общедоступный универсальный бланк/полный официальный scorecard не получен. В DS36 экспорт индивидуальной анкеты связан с доступом/подпиской; portal/paywall не обходились.

**Текущий пробел реализации:** 82 поля преимущественно carbon/energy не покрывают tailored четыре темы и доказательства.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: generated/ecovadis_score.ts называется EcoVadis Scorecard, хотя UI точнее Submission Dossier.

### SBTI_COMMITMENT — SBTi target-setting commitment and validation

**Класс:** `voluntary_standard`. **Нормативный статус:** Corporate Net-ZeroV2 опубликованиюнь 2026; текущие подачи 2026 используют V1.3.1. Открытие validation V2 запланировано Q1 2027; переход не считать уже исполненным [DS37].

**Применимость:** Corporate/SME/financial institution и sector/FLAG маршрут выбираются отдельно. Commitment, target preparation, submitted и validated — разные состояния [DS37].

**Результат:** В зависимости от этапа: commitment evidence либо пакет целей/inventory/evidence для SBTi Services. Создание письма не означает validation [DS37–DS38].

**Входные данные:** Entity/group, sector/FLAG/financial status, выбранная standard edition, submission date/stage [DS37]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS37; version gate] Для подачи 2026 не назначать preliminary V2 форму как обязательную active submission.

**Человеческая проверка:** Target-setting specialist проверяет boundary, coverage и sector criteria.

**Образец:** Официальный XLSX предварительной подачи V2: instructions/company/governance/base year/GHG/targets/sector. Это справочный образец будущего процесса, не действующая форма 2026 и не подтверждение приёма.

**Текущий пробел реализации:** generated/sbti_commitment.ts97 полей не содержит sbti_*fieldId, зато CDP/EcoVadis поля.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: Название Commitment Letter скрывает различия commitment/near-term/net-zero validation.

### RE100_REPORTING — RE100 renewable electricity annual reporting

**Класс:** `voluntary_standard`. **Нормативный статус:** Добровольное членское обязательство, criteriaMarch2025 и reporting guidanceJuly2026; отчёт через соответствующие CDP вопросы [DS39–DS41].

**Применимость:** RE100 member, заявленный commitment scope и target year; electricity procurement eligibility по рынкам/инструментам/установкам [DS40–DS41].

**Результат:** Годовой ответ RE100/CDP с сопоставлением потребления, подтверждённых renewable claims и progress; self-reported renewable share отличается от recognised share [DS41].

**Входные данные:** Группа/boundary/period, commitment/target year; total electricity и self-generation по стране/рынку [DS41]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS40; критерии схемы] Сверять market, vintage, ownership/retirement, eligible technology и age exceptions, а не только наличие сертификата.

**Человеческая проверка:** Energy procurement specialist проверяет EAC/PPA, markets и exceptions.

**Образец:** 2026guide включает реальный mapping вопросов и учебную таблицу расчёта на с.19. Не полный публичный отчёт участника; criteria2025 скачаны отдельно как норматив схемы [DS40].

**Текущий пробел реализации:** generated/re100_reporting.ts56 полей не содержит re100_*fieldId; смешивает тепло/пар и ESG поля.

### GRESB_ASSESSMENT — GRESB real asset ESG assessment

**Класс:** `assessment`. **Нормативный статус:** Ежегодная добровольная investor-driven assessment. Для 2026 official guidance перенесена в GRESB Guides; realestate и несколько infrastructure assessment types различаются [DS42–DS43].

**Применимость:** Выбрать assessment year и тип: Real Estate, Infrastructure Fund/Asset/Development и др.; portfolio/entity boundary определяется выбранной схемой [DS42–DS44].

**Результат:** Portal assessment + asset data и evidence; GRESB выдаёт benchmark/score. Сервис может подготовить submission package, но не собственный официальный рейтинг.

**Входные данные:** Assessment type/year, reporting entity/portfolio и asset inventory с GAV/GFA/ownership dates [DS44–DS45]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS44; импорт] Сохранять workbook schema/IDs; public reference XLSX не импортировать.

**Человеческая проверка:** Portfolio manager подтверждает boundary, ownership и floor-area/coverage.

**Образец:** 2026RealEstate public Asset Spreadsheet3.10MB — справочный защищённый XLSX, явно не импортируемый. Для реальной подачи нужен экспорт участника из Asset Portal. Не маппировать автоматически на infrastructure.

**Текущий пробел реализации:** Нейтральное название подготовки не подтверждает поддержку разных assessment types; тип, год и модель данных должны быть согласованы отдельно.

**Наблюдения исходного снимка до CATALOG-01:**

- До CATALOG-01: UI обещает realestate/infrastructure, generated/gresb_assessment.ts именует только RealEstate.

### BCORP_IMPACT_ASSESSMENT — B Lab B Corp certification assessment

**Класс:** `assessment`. **Нормативный статус:** Новые стандарты опубликованы 08.04.2025, переход к сертификации начался 2026; первые certifications по ним объявлены 16.06.2026 [DS47–DS49]. Старое правило 80 points нельзя универсально применять к новым требованиям.

**Применимость:** Certification/recertification cohort, company size/sector/location, foundation eligibility и risk profile определяют применимые требования; точную edition подтвердить в BImpact [DS46,DS48,DS50].

**Результат:** Evidence/readiness pack по foundation и семи impact topics, затем независимая проверка/решение сертификации. Это не один carbon report и не самостоятельно созданный сертификат [DS46–DS49].

**Входные данные:** Юрлицо/возраст/structure, country/sector/size, certification cohort и legal stakeholder-governance requirements [DS46,DS48]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [DS46–DS48; схема] Проверять отдельные mandatory requirements применимого профиля; не заменять общей суммой 80.

**Человеческая проверка:** B Corp lead/legal проверяет eligibility и stakeholder governance.

**Образец:** Публичные standards/resources найдены; общий заполненный BImpactform не получен. Download page открылся черезweb, прямой fetch403; PDF не скачан. Closed assessment portal не обходился; точная V2.1 не заявляется.

**Текущий пробел реализации:** generated/bcorp_impact_assessment.ts95 полей содержит EUETS/SFDR/aviation и лишь отдельные social metrics.

### CLIMATE_ACTION_PLAN — Internal corporate climate transition planning

**Класс:** `internal_workpaper`. **Нормативный статус:** Универсальной обязательной формы для этого кода не установлено. TPT — voluntary framework; IFRS S2 disclosure guidance не требует каждой организации создать transition plan [DS26–DS27]. Отдельные законы/контракты проверяются вне этого общего кода.

**Применимость:** Внутренний план компании или согласованный с клиентом deliverable; цель/периметр/аудитория и framework выбираются явно.

**Результат:** Утверждённый roadmap: baseline/targets, measures, responsible owners, milestones, resources, dependencies, risks и progress review; это рекомендуемый продуктовый результат на основе TPT [DS27].

**Входные данные:** Baseline/year/boundary и цели с отдельно показанными gross emissions/removals/credits [DS26–DS27; good practice]. Остальные входы и точные проверки приведены в JSON.

**Валидация:** [UX-предложение на основе DS27] Каждая мера имеет owner, milestone и измеримый expected effect; не суммировать пересекающиеся эффекты без коррекции.

**Человеческая проверка:** Руководство/finance approve реалистичность бюджета и ответственность.

**Образец:** IFRS S2 transition guidance66 pp и публичные TPT resources — reference для структуры. Универсальный официальный заполненный climate action plan не установлен; localPDF не выдаётся за такой пример.

**Текущий пробел реализации:** generated/climate_action_plan.ts120 полей, но не содержит climate_action_measures_list, хотя включает EUETS и GRESB поля.

## Что сохранено локально

12 файлов, **12 224 571 байт** суммарно; крупнейший файл 3 098 263 байт. Все меньше 10MB, суммарно меньше 30MB. Бинарные оригиналы не редактировались. Назначение и версия важнее расширения файла.

| Источник | Файл | Назначение / ограничения |
|---|---|---|
| DS08 | [secr-guidance-2019.pdf](../../report-reference/assets/disclosures-schemes/secr-guidance-2019.pdf) | official_guidance_with_templates; 2019-03 |
| DS15 | [sfdr-annex-i-pai-template.docx](../../report-reference/assets/disclosures-schemes/sfdr-annex-i-pai-template.docx) | official_blank_template; catalog file 2023-01-31 |
| DS22 | [hkex-issb-esg-code-comparison.pdf](../../report-reference/assets/disclosures-schemes/hkex-issb-esg-code-comparison.pdf) | official_crosswalk; 2025-09 |
| DS26 | [ifrs-s2-transition-plan-guidance-2025.pdf](../../report-reference/assets/disclosures-schemes/ifrs-s2-transition-plan-guidance-2025.pdf) | official_implementation_guidance; 2025-06 |
| DS29 | [tcfd-governance-workshop-2022.pdf](../../report-reference/assets/disclosures-schemes/tcfd-governance-workshop-2022.pdf) | official_public_example_collection; 2022-02 |
| DS31 | [cdp-corporate-overview-2026.pdf](../../report-reference/assets/disclosures-schemes/cdp-corporate-overview-2026.pdf) | official_questionnaire_overview; 2026 |
| DS32 | [cdp-questionnaire-setup-preview-2026.pdf](../../report-reference/assets/disclosures-schemes/cdp-questionnaire-setup-preview-2026.pdf) | official_form_preview; 2026 |
| DS38 | [sbti-v2-preliminary-submission.xlsx](../../report-reference/assets/disclosures-schemes/sbti-v2-preliminary-submission.xlsx) | preliminary_official_template; V2 preliminary; downloaded 2026-10-11 |
| DS40 | [re100-technical-criteria-2025.pdf](../../report-reference/assets/disclosures-schemes/re100-technical-criteria-2025.pdf) | voluntary_scheme_criteria; publication 2025-03-24; distributed filename 2025-04-15 |
| DS41 | [re100-reporting-guidance-2026.pdf](../../report-reference/assets/disclosures-schemes/re100-reporting-guidance-2026.pdf) | official_guidance_with_worked_example; 2026; catalog July2026 |
| DS45 | [gresb-public-asset-spreadsheet-2026.xlsx](../../report-reference/assets/disclosures-schemes/gresb-public-asset-spreadsheet-2026.xlsx) | official_reference_template; 2026 |
| DS51 | [valmet-sustainability-statement-2024.pdf](../../report-reference/assets/disclosures-schemes/valmet-sustainability-statement-2024.pdf) | Реальный issuer statement за 2024; исторический ESRS; опубликован в financial report 27.02.2025 |

SECR содержит иллюстративные таблицы, TCFD — реальные частичные раскрытия National Grid, SFDR — официальный пустой Annex I. RE100 содержит учебный расчёт. IFRS/HKEX/CDPoverview — guidance/crosswalk, а не полный заполненный отчёт. CDPsetup — preview реальных вопросов; SBTiXLSX — preliminary V2 для будущего процесса; GRESBXLSX — **For Reference Only**, защищённый, непригодный для импорта.

MIME, сигнатуры и SHA256 записаны в `sources[].notes` и [локальном manifest](../../report-reference/assets/disclosures-schemes/manifest.json). XLSX/DOCX проверены как OOXML; PDF разобраны парсером. Визуально проверены значимые страницы: SECR51, TCFD13, IFRS25, CDPsetup4, RE10019, HKEXcomparison4. Poppler недоступен, рендер выполненpdfplumber.

## Ограничения и следующий шаг

Для CSRD сохранён реальный issuer statement DS51. Не получены универсальные полные официальные образцы SEC, EcoVadis, B Corp и общего climate action plan; это результат ограниченного поиска, а не утверждение, что примеров нигде нет. Не обходились логин, подписка, защита Excel или ограничения порталов. ERR/403/429/challenge и успешные альтернативы отмечены у источников. Для Article 2 нового ESRS и национального CSRD transposition нужна отдельная юридическая проверка перед включением автоматических рекомендаций.

Проверка кода ограничена `src/lib/report-templates/user-facing.ts`, пятнадцатью `generated/*.ts` и `src/lib/questionnaires/decision-engine/rules.ts`. CATALOG-01 изменил текст и снял категоричные рекомендации; далее нужны полные applicability tests и связь `requirement → field/evidence → validation → output section` для каждой версии. Нормативная готовность этим не подтверждена.

## Источники

- **DS01** — [Council signs off simplification of sustainability reporting and due diligence requirements](https://www.consilium.europa.eu/en/press/press-releases/2026/02/24/council-signs-off-simplification-of-sustainability-reporting-and-due-diligence-requirements-to-boost-eu-competitiveness/); Council of the EU; 2026-02-24. Тип: `official_adoption_notice`; доступ: `public`.
- **DS02** — [Directive (EU) 2025/794 — stop-the-clock](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=oj%3AL_202500794); European Union; 2025-04-14; OJ 2025-04-16. Тип: `legislation`; доступ: `public`.
- **DS03** — [Commission Delegated Regulation (EU) 2026/1563 — revised ESRS](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=oj%3AL_202601563); European Commission / EUR-Lex; adopted 2026-07-03; OJ 2026-09-21. Тип: `legislation`; доступ: `public`.
- **DS04** — [European Commission adopts revised ESRS and voluntary sustainability reporting standard](https://www.efrag.org/en/news-and-calendar/news/european-commission-adopts-revised-esrs-and-voluntary-sustainability-reporting-standard-efrag); EFRAG; 2026-09-22. Тип: `official_status_notice`; доступ: `public`.
- **DS05** — [European Commission publishes delegated act on revised ESRS and voluntary sustainability reporting](https://www.efrag.org/en/news-and-calendar/news/european-commission-publishes-delegated-act-on-revised-esrs-and-voluntary-sustainability-reporting); EFRAG; 2026-07-03. Тип: `official_status_notice`; доступ: `public`.
- **DS06** — [ESRS XBRL Taxonomy — Exposure Draft Consultation](https://www.efrag.org/en/projects/esrs-xbrl-taxonomy/exposure-draft-consultation); EFRAG; 2026-09-17; consultation through 2026-11-11. Тип: `draft_technical_specification`; доступ: `public`.
- **DS07** — [Environmental reporting guidelines including mandatory GHG reporting guidance](https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance); DESNZ / DEFRA / GOV.UK; updated 2019-03-29. Тип: `official_guidance`; доступ: `public`.
- **DS08** — [Environmental Reporting Guidelines — SECR guidance](https://assets.publishing.service.gov.uk/media/67161e8696def6d27a4c9ab3/environmental-reporting-guidance-secr-march-2019.pdf); UK Government; 2019-03. Тип: `official_guidance_with_templates`; доступ: `public_download_verified`.
- **DS09** — [Sustainability Reporting Guidance 2025–26, SECR section and footnote 5](https://www.gov.uk/government/publications/sustainability-reporting-guidance-2025-26/sustainability-reporting-guidance-2025-26); HM Treasury; 2025–2026 reporting guidance. Тип: `official_guidance`; доступ: `public`.
- **DS10** — [SEC Proposes Rescission of Climate-Related Disclosure Rules](https://www.sec.gov/newsroom/press-releases/2026-49-sec-proposes-rescission-climate-related-disclosure-rules); US SEC; 2026-05-29. Тип: `official_rulemaking_notice`; доступ: `public`.
- **DS11** — [Rescission of climate-related disclosure rules — S7-2026-19](https://www.sec.gov/rules-regulations/2026/05/s7-2026-19); US SEC; Release 33-11421, 2026-05-29; comments closed 2026-08-03. Тип: `proposed_rule`; доступ: `public`.
- **DS12** — [Regulation (EU) 2019/2088 — Article 4](https://eur-lex.europa.eu/eli/reg/2019/2088/2020-07-12/eng); European Union; consolidated 2020-07-12. Тип: `legislation`; доступ: `public`.
- **DS13** — [Commission Delegated Regulation (EU) 2022/1288 — RTS and Annex I](https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32022R1288); European Commission; 2022-04-06; applicable from 2023-01-01. Тип: `legislation_with_template`; доступ: `public`.
- **DS14** — [Principal adverse impact and product templates for SFDR](https://www.eiopa.europa.eu/publications/principal-adverse-impact-and-product-templates-sustainable-finance-disclosure-regulation_en); EBA / EIOPA / ESMA; 2022-07-26; updated 2023-03-23. Тип: `official_template_catalog`; доступ: `public`.
- **DS15** — [Annex I — principal adverse sustainability impacts statement, editable template](https://www.eiopa.europa.eu/document/download/9a7fd137-3cc6-4324-834a-6272350353d1_en?filename=C%202022%201931%20annex%201%20principal%20adverse%20sustainability%20impacts%20statement.docx); European Supervisory Authorities / EIOPA; catalog file 2023-01-31. Тип: `official_blank_template`; доступ: `public_download_verified`.
- **DS16** — [Council agrees position on simpler transparency rules for sustainable financial products](https://www.consilium.europa.eu/en/press/press-releases/2026/06/24/council-agrees-position-on-simpler-transparency-rules-for-sustainable-financial-products/); Council of the EU; 2026-06-24. Тип: `negotiating_position`; доступ: `public`.
- **DS17** — [Sustainability reporting requirements](https://www.fca.org.uk/firms/climate-change-sustainable-finance/reporting-requirements); FCA; updated 2026-09-30. Тип: `official_regulatory_guidance`; доступ: `public`.
- **DS18** — [PS26/19 — Aligning listed issuers sustainability disclosures with international standards](https://www.fca.org.uk/publications/policy-statements/ps26-19-aligning-listed-issuers-sustainability-disclosures-international-standards); FCA; published 2026-09-30; accounting periods from 2027-01-01. Тип: `final_policy_statement`; доступ: `public`.
- **DS19** — [UK Sustainability Reporting Standards S1 and S2](https://www.gov.uk/government/publications/uk-sustainability-reporting-standards-uk-srs-s1-and-uk-srs-s2); UK Government; published 2026-02-25. Тип: `endorsed_standards`; доступ: `public`.
- **DS20** — [Climate-related financial disclosures for companies and LLPs](https://www.gov.uk/government/publications/climate-related-financial-disclosures-for-companies-and-limited-liability-partnerships-llps); DESNZ / BEIS; published 2022-02-21; financial years from 2022-04-06. Тип: `official_regulatory_guidance`; доступ: `public`.
- **DS21** — [Appendix C2 — Environmental, Social and Governance Reporting Code](https://en-rules.hkex.com.hk/entiresection/3742); HKEX; current code checked 2026-10-11. Тип: `exchange_rules`; доступ: `public_text_partial_retrieval`.
- **DS22** — [Linking the ISSB Standards and HKEX ESG Reporting Code](https://www.hkex.com.hk/-/media/HKEX-Market/Listing/Rules-and-Guidance/Environmental-Social-and-Governance/Exchanges-guidance-materials-on-ESG/ISSBstd_esgcode.pdf); HKEX; 2025-09. Тип: `official_crosswalk`; доступ: `public_download_verified`.
- **DS23** — [IFRS S2 Climate-related Disclosures](https://www.ifrs.org/issued-standards/ifrs-sustainability-standards-navigator/ifrs-s2-climate-related-disclosures/); IFRS Foundation / ISSB; issued 2023; standard effective 2024-01-01. Тип: `standard_catalog`; доступ: `public`.
- **DS24** — [ISSB issues targeted amendments to IFRS S2](https://www.ifrs.org/news-and-events/news/2025/12/issb-issues-targeted-amendments-ifrs-s2/); IFRS Foundation / ISSB; 2025-12; effective periods from 2027-01-01; early application permitted. Тип: `standard_amendment_notice`; доступ: `public`.
- **DS25** — [Use of IFRS Sustainability Disclosure Standards by jurisdiction](https://www.ifrs.org/ifrs-sustainability-disclosure-standards-around-the-world/use-by-jurisdiction/); IFRS Foundation; updated 2026-09-24. Тип: `jurisdiction_profiles`; доступ: `public`.
- **DS26** — [Disclosing information about climate-related transition, including transition plans, in accordance with IFRS S2](https://www.ifrs.org/content/dam/ifrs/supporting-implementation/ifrs-s2/transition-plan-disclosure-s2.pdf); IFRS Foundation; 2025-06. Тип: `official_implementation_guidance`; доступ: `public_download_verified`.
- **DS27** — [Transition Plan Taskforce resources](https://www.ifrs.org/sustainability/knowledge-hub/transition-plan-taskforce-resources/); IFRS Foundation hosting TPT; TPT framework 2023; sector resources 2024. Тип: `voluntary_framework_resources`; доступ: `public`.
- **DS28** — [TCFD Publications](https://www.fsb-tcfd.org/publications/); Task Force on Climate-related Financial Disclosures; recommendations 2017; implementing annex 2021; archived 2023-11. Тип: `archived_framework_catalog`; доступ: `public`.
- **DS29** — [TCFD Governance Workshop — examples of disclosures](https://assets.bbhub.io/company/sites/60/2022/02/TCFD-Governance-Workshop.pdf); TCFD; 2022-02. Тип: `official_public_example_collection`; доступ: `public_download_verified`.
- **DS30** — [How to disclose — 2026 corporate questionnaire resources](https://www.cdp.net/en/disclose/how-to-disclose); CDP; 2026 reporting cycle. Тип: `scheme_guidance`; доступ: `public`.
- **DS31** — [CDP Full Corporate Questionnaire Overview 2026](https://www.cdp.net/api/media/3MFY5gykVQn8pxHfuLWsHJ?locale=en); CDP; 2026. Тип: `official_questionnaire_overview`; доступ: `public_download_verified`.
- **DS32** — [CDP Corporate Questionnaire setup — 2026 Preview](https://www.cdp.net/api/media/2qFFBStRlvdvUVZsbBpFga?locale=en); CDP; 2026. Тип: `official_form_preview`; доступ: `public_download_verified`.
- **DS33** — [Accessing CDP questionnaires and guidance](https://help.cdp.net/en-US/knowledgebase/article/KA-01025); CDP Help Center; 2026 cycle checked 2026-10-11. Тип: `scheme_portal_guidance`; доступ: `public`.
- **DS34** — [What is the EcoVadis methodology?](https://support.ecovadis.com/hc/en-us/articles/115002531507-What-is-the-EcoVadis-methodology); EcoVadis; current support article checked 2026-10-11. Тип: `assessment_methodology`; доступ: `public`.
- **DS35** — [Understanding supporting documents](https://support.ecovadis.com/hc/en-us/articles/210460307-Understanding-supporting-documents); EcoVadis; current support article checked 2026-10-11. Тип: `assessment_evidence_guidance`; доступ: `public`.
- **DS36** — [Understanding my questionnaire](https://support.ecovadis.com/hc/en-us/articles/14988568737170-Understanding-my-questionnaire); EcoVadis; current support article checked 2026-10-11. Тип: `assessment_portal_guidance`; доступ: `public`.
- **DS37** — [The new Corporate Net-Zero Standard Version 2.0](https://sciencebasedtargets.org/corporate-net-zero-standard-v2); SBTi; V2 published 2026-06; 2026 submissions V1.3.1. Тип: `voluntary_standard_transition_notice`; доступ: `public`.
- **DS38** — [Preliminary Submission Form — Corporate Net-Zero Standard V2](https://docs.sbtiservices.com/resources/PreliminarySubmissionFormCNZSV2.xlsx); SBTi Services; V2 preliminary; downloaded 2026-10-11. Тип: `preliminary_official_template`; доступ: `public_download_verified`.
- **DS39** — [RE100 Technical Guidance & FAQs](https://www.theclimategroup.org/re100/technical-guidance); Climate Group / RE100; technical criteria March2025; reporting guidance July2026. Тип: `scheme_resource_catalog`; доступ: `public`.
- **DS40** — [RE100 Technical Criteria and Appendices](https://www.theclimategroup.org/hubfs/RE100/PDFs/RE100%20technical%20criteria%20+%20appendices%20(15%20April%202025).pdf?hsLang=en); Climate Group / RE100; publication 2025-03-24; distributed filename 2025-04-15. Тип: `voluntary_scheme_criteria`; доступ: `public_download_verified`.
- **DS41** — [2026 RE100 Reporting Guidance](https://www.theclimategroup.org/hubfs/RE100/RE100%20Technical%20and%20FAQ/RE100%20Reporting%20Guidance%202026-2.pdf?hsLang=en); Climate Group / RE100; 2026; catalog July2026. Тип: `official_guidance_with_worked_example`; доступ: `public_download_verified`.
- **DS42** — [2026 GRESB Assessment resources and training](https://www.gresb.com/gresb-assessment-resources-and-training/); GRESB; 2026. Тип: `assessment_resource_catalog`; доступ: `public`.
- **DS43** — [GRESB Guides](https://guides.gresb.com/); GRESB; 2026. Тип: `assessment_guidance_catalog`; доступ: `public`.
- **DS44** — [Real Estate Assessment — Asset Portal Guide](https://guides.gresb.com/completingassessments/prepare/setup/asset-portal-guide); GRESB; 2026. Тип: `assessment_import_guidance`; доступ: `public`.
- **DS45** — [2026 Real Estate Asset Spreadsheet — public reference version](https://1003802410-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLeIqEQuq8sE79mOd8GRV%2Fuploads%2FyixuUEcVXwwvCr2cp8Fz%2F2026_Real_Estate_Asset_Spreadsheet_public.xlsx?alt=media&token=d538477a-a332-4a00-9a9b-832c2b7a219e); GRESB; 2026. Тип: `official_reference_template`; доступ: `public_download_verified`.
- **DS46** — [B Lab Standards — Performance Requirements](https://www.bcorporation.net/en-us/standards/performance-requirements/); B Lab; new standards launched 2025; transition2026. Тип: `certification_standards_overview`; доступ: `public`.
- **DS47** — [B Lab publishes new B Corp standards](https://www.bcorporation.net/en-us/news/press/b-lab-publishes-new-b-corp-standards-raising-the-bar-for-businesses-worldwide/); B Lab; 2025-04-08. Тип: `standards_adoption_notice`; доступ: `public`.
- **DS48** — [B Corp Certification Hub](https://www.bcorporation.net/en-us/standards/certification-hub/); B Lab; updated 2026-01-27. Тип: `certification_transition_guidance`; доступ: `public`.
- **DS49** — [Companies achieve B Corp certification under new global standards](https://www.bcorporation.net/en-us/news/press/companies-achieve-b-corp-certification-under-new-global-standards/); B Lab; 2026-06-16. Тип: `certification_status_notice`; доступ: `public`.
- **DS50** — [Download B Lab Standards](https://www.bcorporation.net/en-us/eos/download/); B Lab; catalog checked 2026-10-11. Тип: `standard_download_catalog`; доступ: `public_catalog_download_unavailable`.

- **DS51** — [Valmet Sustainability Statement 2024](https://www.valmet.com/globalassets/sustainability/documents/sustainability-statement--csrd/valmet_sustainability_statement_2024.pdf); Valmet Oyj; FY 2024, financial report published 2025-02-27. Тип: `public_issuer_sustainability_statement`; доступ: `public_download_verified`.
