Начну с краткого вывода, потом список.

**Краткий вывод**

- Сейчас датасет покрывает только продуктовый LCA (ISO 14067 / CBAM).
- Для остальных форматов из decision engine нужны отдельные, часто корпоративные и финансовые DPs.
- Ниже — минимальный, но полный список новых полей, сгруппированный по классам отчётов; часть может переиспользоваться многими форматами.
- Любой пользовательский ввод (числа, статусы, текст, включая дисклеймеры и описания) хранится в `Project.dataset` как data point и может переиспользоваться разными отчётами.

---

**Архитектурный контракт**

- Источник данных: единый датасет проекта (`Project.dataset`, JSONB с `field_id`/`item_id`/`value`).
- Шаблоны отчётов:
  - не содержат собственного состояния;
  - только читают значения по `fieldId` из датасета и определяют layout/структуру секций;
  - могут включать статический boilerplate (фиксированный текст стандартов), но всё, что пользователь может редактировать, должно быть представленo как data point в датасете.
- Логика применимости отчётов (юридические пороги, комбинации драйверов) живёт только в decision engine (`rules.ts`, `validation-rules.ts`) и не влияет на список `fieldId` в этом документе: числовые/фактовые поля (`organization_headcount`, `organization_revenue_eur`, `listing_exchanges` и т.п.) описываются здесь, а сами пороги — в правилах.

---

**1. Базовый корпоративный профиль / организационные границы**

- `reporting_period_start` — дата начала отчётного периода.
- `reporting_period_end` — дата окончания отчётного периода.
- `reporting_scope_type` — `'consolidated' | 'standalone' | 'segment'`.
- `legal_entity_identifier` — LEI / ИНН / регистрационный номер.
- `organization_sector_code` — отраслевой код (NACE/ОКВЭД).
- `organization_headcount` — численность сотрудников (среднегодовая).
- `organization_revenue_eur` — выручка за период (EUR).
- `organization_assets_eur` — активы / AUM (для финсектора).
- `reporting_boundary_approach` — equity / control / operational control.
- `countries_of_operation` — список стран присутствия.
- `consolidated_entities_list` — включённые юрлица / площадки.
- `exclusions_scope_explanation` — что исключено и почему.

---

**2. GHG-инвентарь: Scope 1, 2, 3 (корпоративный уровень)**

_Агрегаты по компании, не по продукту._

- `scope1_total_co2e` — суммарные прямые выбросы (т CO2e).
- `scope1_breakdown_stationary_co2e` — стационарное сжигание.
- `scope1_breakdown_mobile_co2e` — транспорт (свой парк).
- `scope1_breakdown_fugitive_co2e` — фугитивные выбросы.
- `scope1_breakdown_process_co2e` — процессные выбросы.

- `scope2_total_location_based_co2e` — Scope 2 location-based.
- `scope2_total_market_based_co2e` — Scope 2 market-based.
- `scope2_electricity_consumption_mwh` — потребление эл.энергии.
- `scope2_steam_heat_cold_energy_mwh` — тепло/пар/холод.

- `scope3_category1_purchased_goods_co2e`
- `scope3_category2_capital_goods_co2e`
- `scope3_category3_fuel_energy_activities_co2e`
- `scope3_category4_upstream_transport_co2e`
- `scope3_category5_waste_generated_co2e`
- `scope3_category6_business_travel_co2e`
- `scope3_category7_employee_commuting_co2e`
- `scope3_category8_upstream_leased_assets_co2e`
- `scope3_category9_downstream_transport_co2e`
- `scope3_category10_processing_of_sold_products_co2e`
- `scope3_category11_use_of_sold_products_co2e`
- `scope3_category12_end_of_life_treatment_co2e`
- `scope3_category13_downstream_leased_assets_co2e`
- `scope3_category14_franchises_co2e`
- `scope3_category15_investments_co2e`

- `total_corporate_ghg_co2e` — суммарный корпоративный GHG.
- `base_year` — базовый год.
- `base_year_emissions_co2e` — выбросы базового года.
- `base_year_recalculation_policy` — политика перерасчёта.

---

**3. Данные для сертификации / верификации (ISO 14064, PAS 2060 и др.)**

- `verification_required` — да/нет.
- `verification_standard` — ISO 14064-3 / ISAE 3410 / другое.
- `verifier_organization_name`
- `verifier_scope_statement` — охват верификации.
- `verification_level_assurance` — limited / reasonable.
- `offsets_purchased_co2e` — объём офсетов (т CO2e).
- `offsets_programs_list` — типы/программы офсетов.
- `carbon_neutral_claim_boundary` — граница carbon-neutral заявления (компания/продукт/событие).

---

**4. Политики, риски, цели (CSRD / TCFD / SBTi / климат-планы)**

_Главное: качественные, но нужны как DPs, чтобы переиспользовать между отчётами._

- `climate_governance_description` — роль совета директоров / менеджмента.
- `climate_risk_management_process` — описание процессов по управлению рисками.
- `climate_risks_physical_description`
- `climate_risks_transition_description`
- `climate_scenarios_used` — набор сценариев (1.5°C / 2°C / 4°C и т.п.).
- `climate_scenario_results_summary` — ключевые выводы сценарного анализа.
- `emission_reduction_targets_list` — цели по выбросам (структурированный список, можно как repeatable).
  - `target_base_year`  
  - `target_year`  
  - `target_scope_coverage` (S1/S2/S3)  
  - `target_reduction_percent`  
- `net_zero_target_year` — год достижения net-zero (если есть).
- `decarbonisation_strategy_summary` — резюме плана действий.
- `energy_efficiency_measures_summary`
- `renewable_energy_strategy_summary` — RECs/PPA и т.п.

_SBTi‑специфично (но переиспользуемо для SBTI_COMMITMENT, CSRD, TCFD):_

- `sbti_commitment_status` — committed / approved / planning.
- `sbti_scope_coverage` — covered scopes.
- `sbti_target_type` — near-term / long-term / net-zero.
- `sbti_sector_classification` — sector pathway.

---

**5. Финансовый сектор / SFDR / банки / инвесторы**

- `financed_emissions_total_co2e` — финансируемые выбросы портфеля.
- `portfolio_coverage_percent` — доля охваченных активов.
- `sfdr_pai_indicators_summary` — сводка PAI (как текстовое поле).
- `green_assets_ratio` — доля «зелёных» активов (%).
- `taxonomy_aligned_revenue_percent`
- `taxonomy_aligned_capex_percent`
- `taxonomy_aligned_opex_percent`
- `banks_data_template_reference` — идентификатор/ссылка на форму банка.
- `lenders_investors_list` — основные банки/инвесторы (для переклика с CDP/SFDR).

---

**6. Биржи / листинг (SEC, HKEX, UK TCFD)**

- `listing_exchanges` — список бирж (EU, LSE, NYSE/NASDAQ, HKEX, др.).
- `issuer_is_sec_registrant` — да/нет.
- `sec_filer_category` — large accelerated / accelerated / др.
- `public_filing_documents_list` — ссылки на 10‑K, годовой отчёт и т.п.
- `hkex_esg_compliance_level` — comply/explain summary.
- `uk_tcfd_mandatory_scope` — к каким подразделениям/отчётам применимо.

---

**7. Программы и рейтинги (CDP, EcoVadis, GRESB, RE100, B Corp)**

- `cdp_questionnaire_type` — Climate / Supply Chain / др.
- `cdp_reporting_year`
- `cdp_previous_score` — прошлый рейтинг (если есть).
- `ecovadis_scope_description` — охват/границы для EcoVadis.
- `ecovadis_previous_score`
- `re100_commitment_scope` — какие юрлица/локации охвачены.
- `re100_target_year` — год 100% ВИЭ.
- `re100_current_renewable_share_percent`
- `gresb_portfolio_description` — портфель недвижимости / фонд.
- `gresb_previous_score`
- `bcorp_assessment_scope_description`
- `bcorp_target_certification_year`

---

**8. Секторальные отчёты (авиация, морской транспорт, здания, IT)**

_Авиация / CORSIA:_

- `aviation_total_fuel_consumption_tonnes`
- `aviation_total_emissions_co2e`
- `aviation_routes_coverage_description`
- `aviation_offset_programs` — программы компенсации.

_Морской транспорт / EU MRV / EU ETS‑shipping:_

- `shipping_voyages_covered_description`
- `shipping_total_emissions_co2e`
- `shipping_fuel_consumption_tonnes`
- `shipping_eu_ports_share_percent`

_Здания / BUILDING_CARBON_FOOTPRINT / GRESB:_

- `building_floor_area_m2`
- `building_energy_consumption_mwh`
- `building_occupancy_rate_percent`
- `building_certifications_existing` — действующие сертификаты (LEED/BREEAM).

_IT / дата‑центры / SCOPE2_DETAILED / SCOPE3_CATEGORY1_SUPPLIERS:_

- `it_data_centers_owned_list` — перечень ЦОД.
- `it_data_centers_total_energy_mwh`
- `data_center_pue` — средний PUE.
- `cloud_providers_list` — hyperscalers / SaaS.
- `cloud_usage_emissions_co2e`
- `supplier_emissions_data_coverage_percent` — доля поставщиков с данными.

---

**9. CBAM‑специфика сверх текущего ISO/CBAM набора**

_У тебя уже есть продукт/материалы/транспорт/CFP. Не хватает «регистровых» полей и статусов._

- `cbam_importer_eori` — EORI импортёра.
- `cbam_authorised_declarant_id`
- `cbam_goods_cn_codes` — список CN‑кодов.
- `cbam_reporting_quarter` — квартал отчётности.
- `cbam_total_embedded_emissions_co2e`
- `cbam_free_allowances_quantity` — количество освобождённых объёмов (если применимо).
- `cbam_certificates_purchased_quantity`
- `cbam_certificates_used_quantity`
- `cbam_monitoring_methodology_description`
- `cbam_supplier_data_availability` — статус данных по поставщикам (supplier-only/importer-of-record/нет данных).

---

**10. Клиентские отчёты / пакеты данных (CLIENT_SCOPE3_PACKAGE, SCOPE3_DETAILED, SCOPE123_DATASET и др.)**

- `client_request_reference` — идентификатор/название запроса клиента.
- `client_required_categories_scope3_list` — список категорий Scope 3 по запросу.
- `client_reporting_format` — GHG Protocol / Excel‑шаблон / API.
- `client_data_delivery_deadline`
- `client_data_delivery_channels` — e‑mail / портал / API.
- `data_package_coverage_description` — что именно включает пакет (источники, годы, юрлица).

---

**11. Энергетика, ВИЭ, планы действий (CLIMATE_ACTION_PLAN, RECS_OR_PPA_STRATEGY, ENERGY_AUDIT_SCOPE12)**

- `energy_total_consumption_mwh` — суммарное потребление энергии (вне продуктового контекста).
- `renewable_energy_share_percent` — доля ВИЭ в общем потреблении.
- `ppa_contracts_list` — список PPA/долгосрочных контрактов.
- `recs_certificates_purchased_mwh` — объём RECs/GO.
- `energy_audit_scope_description` — охват энергоаудита.
- `energy_saving_potential_estimate_percent`
- `climate_action_measures_list` — меры с оценкой ожидаемого сокращения.

---

**12. Метаполя для повторного использования и трекинга**

_Не про конкретный стандарт, но нужны для удобной перекладки данных между отчётами._

- `data_quality_assessment_summary` — общая оценка качества данных (по секторам/скоупам).
- `methodology_reference_documents` — перечень методик / PCR / стандартов.
- `limitations_and_uncertainties_summary`
- `comparability_notes` — заметки о сопоставимости с другими годами/компаниями.



**13. По исчерпывающим источникам**

- **Исчерпывающие / обязательные:**
  - `docs→questionare logic.md` — одиночный источник правды по перечню отчётов, правилам и контексту (какие драйверы → какие форматы). Без него легко пропустить часть форматов или неверно понять приоритеты.
  - `src→lib→questionnaires→decision-engine→reports.ts` — фактический каталог `report.id` c категориями, приоритетами и кратким описанием; это «runtime»-перечень всех отчётов, с которыми реально работает движок.
  - `src→lib→questionnaires→decision-engine→rules.ts` — полный список правил, показывающий все реально используемые `report.id` и связи с вопросами (регулятор/клиент/банк/сектор). Нужен, чтобы не пропустить «второстепенные» или дублирующие форматы (CBAM_* пакеты, PREP_GHG, секторные отчёты и т.п.).

- **Полезные, но вспомогательные:**
  - `prisma→seed-data→dataset-fields.ts` — показывает, что уже есть в датасете (нужно, чтобы не дублировать существующие DPs).
  - `prisma→seed-data→report-templates.ts`, `src→lib→report-templates→iso14067.ts`, `src→lib→report-templates→cbam.ts` — дают примеры, как продуктовые отчёты используют общие поля; но для «универсума» форматов не добавляют новых ID сверх того, что видно из тройки выше.
  - `docs→archive→Requirements v0.0.1.md`, `docs→archive→REPORT_TEMPLATES_ARCHITECTURE.md`, `docs→reference→data-points-hints.md` — задают архитектурные принципы, примеры именования и повторного использования, но не расширяют список самих отчётов.

**Практический ответ**

Чтобы составить полную картину по **видам отчётов** и требуемым данным, достаточно смотреть в первую очередь:

1. `docs→questionare logic.md`  
2. `src→lib→questionnaires→decision-engine→reports.ts`  
3. `src→lib→questionnaires→decision-engine→rules.ts`  

Плюс точечно сверяться с:

4. `prisma→seed-data→dataset-fields.ts` — только чтобы понять, какие DPs уже есть и что нужно добавить.

Остальные файлы нужны больше как контекст/реализация, а не как источник полного перечня форматов и полей.

---

**Следующий шаг: сверка с интернетом**

- Отдельной задачей (для другого агента) нужно пройтись по официальным гайдам/руководствам по ключевым форматам (CSRD, SFDR, SEC Climate, EU ETS, CORSIA, CBAM, ISO 14064/14067, TCFD, SBTi, CDP, EcoVadis, GRESB, RE100, B Corp и т.п.) и:
  - проверить, не fehlen ли в этом списке дополнительные поля (включая текстовые разделы и дисклеймеры), обязательные по стандартам;
  - разделить найденные элементы на:
    - те, что должны стать новыми `DatasetFieldDefinition` (редактируются пользователем и/или переиспользуются между отчётами);
    - и чисто шаблонные элементы (фиксированный boilerplate конкретного формата, остающийся в конфиге отчёта);
  - предложить патч к этому файлу: добавить недостающие `fieldId` и пометить спорные/опциональные поля.
- При выполнении этой интернет‑сверки агент должен использовать только файлы из блока «исчерпывающие источники» как правду о том, какие `report.id` и правила реально существуют в коде.