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

**Что уже есть в `DatasetFieldDefinition` (срез 25.11.2025)**

- Шапка и продуктовый контекст: `organization_name`, `organization_address`, `report_date`, `report_language`, `product_name`, `product_description`, `intended_market`, `functional_unit`, `system_boundary`, `total_cfp_co2e`, `cfp_result_unit`, `hotspots_summary`.
- Повторяемые группы ввода LCA: `material_input_*` (`name/amount/unit/origin_country/data_source`), `energy_input_*` (`type/amount/unit/renewable_percent`), `transport_*` (`mode/distance/load_factor`), `waste_*` (`type/quantity/treatment_route`).
- Поддержка рецензентов: `reviewer_name`, `reviewer_affiliation`.
- Всё перечисленное заточено под ISO 14067 / продуктовый CFP; корпоративных, регуляторных и финансовых полей пока нет.
- Вывод: любые новые `fieldId` из блоков 1–12 ниже отсутствуют и требуют явного описания в `DatasetFieldDefinition` перед тем, как их смогут читать шаблоны отчётов.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: — (в датасете присутствуют только `organization_name`/`organization_address`, которых нет в списке требований).
- ➕ требуется добавить: все перечисленные выше `fieldId`; `countries_of_operation` и `consolidated_entities_list` лучше задавать как repeatable структуры с `item_id`.
- 📄 шаблон-only: — (все значения редактируемы пользователем и должны жить в датасете).

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все корпоративные агрегаты Scope 1/2/3 и базовый год (`scope1_total_co2e`, …, `base_year_recalculation_policy`). Каждое поле — отдельный `number` (т/г), без повторяемости.
- 📄 шаблон-only: —.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: `verification_required`, `verification_standard`, `verifier_*`, `verification_level_assurance`, `offsets_*`, `carbon_neutral_claim_boundary`. `offsets_programs_list` логично оформить как repeatable (`program_name`, `registry`, `volume_co2e`).
- 📄 шаблон-only: —.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все перечисленные narrative/structured поля. `emission_reduction_targets_list` → repeatable группа (`target_base_year`, `target_year`, `target_scope_coverage`, `target_reduction_percent`, `target_status`). Остальные можно хранить как text/longtext.
- 📄 шаблон-only: — (даже текстовые описания нужны как переиспользуемые DPs).

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все финансовые KPI/списки (`financed_emissions_total_co2e`, …, `lenders_investors_list`). Списки банков/инвесторов и референсы на формы логично хранить как repeatable записи с `item_id`.
- 📄 шаблон-only: —.

---

**6. Биржи / листинг (SEC, HKEX, UK TCFD)**

- `listing_exchanges` — список бирж (EU, LSE, NYSE/NASDAQ, HKEX, др.).
- `issuer_is_sec_registrant` — да/нет.
- `sec_filer_category` — large accelerated / accelerated / др.
- `public_filing_documents_list` — ссылки на 10‑K, годовой отчёт и т.п.
- `hkex_esg_compliance_level` — comply/explain summary.
- `uk_tcfd_mandatory_scope` — к каким подразделениям/отчётам применимо.

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все перечисленные поля (`listing_exchanges`, …, `uk_tcfd_mandatory_scope`). `public_filing_documents_list` — repeatable (title/url/date), `listing_exchanges` может быть массивом строк.
- 📄 шаблон-only: —.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все перечисленные id (`cdp_*`, `ecovadis_*`, `re100_*`, `gresb_*`, `bcorp_*`). Значения комбинируют `text`/`number`/`year`. Для исторических/предыдущих оценок можно ввести repeatable структуру `program_score_history`.
- 📄 шаблон-only: —.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все авиационные/морские/строительные/IT поля (`aviation_*`, `shipping_*`, `building_*`, `it_*`, `data_center_pue`, `cloud_*`, `supplier_emissions_data_coverage_percent`). Часть значений — `number`, часть — текст/списки.
- 📄 шаблон-only: —.

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

_Статус данных (25.11.2025):_
- ✅ уже есть: — (в продуктовой схеме есть только данные о материалах/энергии, но нет статусов реестра).
- ➕ требуется добавить: `cbam_importer_eori`, `cbam_authorised_declarant_id`, `cbam_goods_cn_codes`, `cbam_reporting_quarter`, `cbam_total_embedded_emissions_co2e`, `cbam_free_allowances_quantity`, `cbam_certificates_*`, `cbam_monitoring_methodology_description`, `cbam_supplier_data_availability`.
- 📄 шаблон-only: —.

---

**10. Клиентские отчёты / пакеты данных (CLIENT_SCOPE3_PACKAGE, SCOPE3_DETAILED, SCOPE123_DATASET и др.)**

- `client_request_reference` — идентификатор/название запроса клиента.
- `client_required_categories_scope3_list` — список категорий Scope 3 по запросу.
- `client_reporting_format` — GHG Protocol / Excel‑шаблон / API.
- `client_data_delivery_deadline`
- `client_data_delivery_channels` — e‑mail / портал / API.
- `data_package_coverage_description` — что именно включает пакет (источники, годы, юрлица).

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все поля блока (`client_request_reference`, …, `data_package_coverage_description`). `client_required_categories_scope3_list` и `client_data_delivery_channels` удобнее хранить как массивы строк.
- 📄 шаблон-only: —.

---

**11. Энергетика, ВИЭ, планы действий (CLIMATE_ACTION_PLAN, RECS_OR_PPA_STRATEGY, ENERGY_AUDIT_SCOPE12)**

- `energy_total_consumption_mwh` — суммарное потребление энергии (вне продуктового контекста).
- `renewable_energy_share_percent` — доля ВИЭ в общем потреблении.
- `ppa_contracts_list` — список PPA/долгосрочных контрактов.
- `recs_certificates_purchased_mwh` — объём RECs/GO.
- `energy_audit_scope_description` — охват энергоаудита.
- `energy_saving_potential_estimate_percent`
- `climate_action_measures_list` — меры с оценкой ожидаемого сокращения.

_Статус данных (25.11.2025):_
- ✅ уже есть: — (существующие `energy_input_*` относятся к продукту, а не корпоративным суммарным данным).
- ➕ требуется добавить: все перечисленные поля, причём `ppa_contracts_list`, `recs_certificates_purchased_mwh`, `climate_action_measures_list` → repeatable записи с деталями по каждому контракту/мере.
- 📄 шаблон-only: —.

---

**12. Метаполя для повторного использования и трекинга**

_Не про конкретный стандарт, но нужны для удобной перекладки данных между отчётами._

- `data_quality_assessment_summary` — общая оценка качества данных (по секторам/скоупам).
- `methodology_reference_documents` — перечень методик / PCR / стандартов.
- `limitations_and_uncertainties_summary`

_Статус данных (25.11.2025):_
- ✅ уже есть: —.
- ➕ требуется добавить: все четыре метаполя (`data_quality_assessment_summary`, `methodology_reference_documents`, `limitations_and_uncertainties_summary`, `comparability_notes`). `methodology_reference_documents` можно хранить как массив ссылок/идентификаторов.
- 📄 шаблон-only: —.


**Карта decision engine → классы данных (reports.ts + docs/questionare logic.md)**

- **Регуляторные** (`CSRD`, `EU_ETS`, `CBAM`, `CBAM_*`, `UK_SECR`, `SEC_CLIMATE`, `CORSIA`, `EU_MRV`, `SFDR`, `UK_TCFD`, `HKEX_ESG`): требуют полного набора корпоративных полей блоков 1–4, биржевых данных блока 6, CBAM-специфики блока 9, а также метаполей блока 12 для traceability.
- **Финансовые** (`TCFD_REPORT`, `BANK_TEMPLATE_FILL`, `SCOPE123_DATASET`, `CORP_GHG_VERIFIED`, `SFDR`): помимо блоков 1–4 им нужны KPI из блока 5 и часть полей блока 11 (энергетические планы) для объяснения траекторий.
- **Клиентские / программы** (`CLIENT_SCOPE3_PACKAGE`, `CLIENT_TEMPLATE_FILL`, `SCOPE3_DETAILED`, `CARBON_NEUTRAL_CERT`, `ISO_14064_CERT`, `CDP_DISCLOSURE`, `SBTI_COMMITMENT`, `RE100_REPORTING`, `GRESB_ASSESSMENT`, `ECOVADIS_SCORE`, `BCORP_IMPACT_ASSESSMENT`): опираются на блоки 1–4 и требуют специфики блоков 7, 10, 11.
- **Секторальные** (`BUILDING_CARBON_FOOTPRINT`, `SCOPE2_DETAILED`, `SCOPE3_CATEGORY1_SUPPLIERS`, `CORSIA`, `EU_MRV`): критично зависят от блока 8 плюс обще-корпоративных данных блоков 1–2.
- **Внутренние / data packages** (`CLIMATE_ACTION_PLAN`, `RECS_OR_PPA_STRATEGY`, `ENERGY_AUDIT_SCOPE12`, `PREP_GHG`, `SCOPE123_DATASET`): требуют блоков 1, 2, 4, 11 и метаполей блока 12, чтобы прогресс мер можно было переиспользовать.


**Черновик новых DatasetFieldDefinition (предложение для `prisma/seed-data/dataset-fields.ts`)**

_Блок 1 — корпоративный профиль_
- `reporting_period_start` — `date`, single, для всех регуляторных отчётов.
- `reporting_period_end` — `date`, single.
- `reporting_scope_type` — `string` (enum), single.
- `legal_entity_identifier` — `string`, single.
- `organization_sector_code` — `string`, single (код NACE/ОКВЭД, label можно класть в `metadata`).
- `organization_headcount` — `number`, single (среднегодовой headcount).
- `organization_revenue_eur`, `organization_assets_eur` — `number`, single, валюта фиксирована EUR.
- `reporting_boundary_approach` — `string` (enum equity/control/operational), single.
- `countries_of_operation` — repeatable (`repeatableKey=countries_of_operation`, поля `country_code`, `share_percent?`).
- `consolidated_entities_list` — repeatable (`repeatableKey=consolidated_entity`, поля `entity_name`, `jurisdiction`, `boundary_note`).
- `exclusions_scope_explanation` — `text`, single.

_Блок 2 — корпоративный GHG_
- `scope1_total_co2e`, `scope1_breakdown_stationary_co2e`, `scope1_breakdown_mobile_co2e`, `scope1_breakdown_fugitive_co2e`, `scope1_breakdown_process_co2e` — `number` (т CO2e), single.
- `scope2_total_location_based_co2e`, `scope2_total_market_based_co2e`, `scope2_electricity_consumption_mwh`, `scope2_steam_heat_cold_energy_mwh` — `number`, single.
- `scope3_category1_purchased_goods_co2e` … `scope3_category15_investments_co2e` — `number`, single (15 отдельных полей по категориям GHG Protocol).
- `total_corporate_ghg_co2e` — `number`, single.
- `base_year` — `number` (год), single.
- `base_year_emissions_co2e` — `number`, single.
- `base_year_recalculation_policy` — `text`, single.

_Блок 3 — сертификация/верификация_
- `verification_required` — `boolean`, single.
- `verification_standard` — `string`, single (ISO 14064-3 / ISAE 3410 / другое).
- `verifier_organization_name` — `string`, single.
- `verifier_scope_statement` — `text`, single.
- `verification_level_assurance` — `string` (enum limited/reasonable), single.
- `offsets_purchased_co2e` — `number`, single.
- `offsets_programs_list` — repeatable (`repeatableKey=offset_program`, поля `program_name`, `registry`, `vintage`, `volume_co2e`).
- `carbon_neutral_claim_boundary` — `string`, single.

_Блок 4 — политики, риски, SBTi_
- `climate_governance_description`, `climate_risk_management_process`, `climate_risks_physical_description`, `climate_risks_transition_description`, `climate_scenarios_used`, `climate_scenario_results_summary`, `decarbonisation_strategy_summary`, `energy_efficiency_measures_summary`, `renewable_energy_strategy_summary` — `text`, single.
- `emission_reduction_targets_list` — repeatable (`repeatableKey=emission_target`, поля `target_base_year` (`number`), `target_year` (`number`), `target_scope_coverage` (`string`), `target_reduction_percent` (`number`), `target_status` (`string`).
- `net_zero_target_year` — `number`, single.
- `sbti_commitment_status`, `sbti_scope_coverage`, `sbti_target_type`, `sbti_sector_classification` — `string`, single (enum значения можно зашить в `options`).

_Блок 5 — финсектор_
- `financed_emissions_total_co2e` — `number` (т CO2e), single.
- `portfolio_coverage_percent`, `green_assets_ratio`, `taxonomy_aligned_revenue_percent`, `taxonomy_aligned_capex_percent`, `taxonomy_aligned_opex_percent` — `number` (%), single.
- `sfdr_pai_indicators_summary` — `text`, single.
- `banks_data_template_reference` — `string`, single (URL/ID).
- `lenders_investors_list` — repeatable (`repeatableKey=capital_provider`, поля `name`, `type`, `exposure_or_role`).

_Блок 6 — листинг/SEC/HKEX_
- `listing_exchanges` — `string[]` или repeatable `listing_exchange` с `code`, `segment`.
- `issuer_is_sec_registrant` — `boolean`.
- `sec_filer_category` — `string` (enum large_accelerated/accelerated/non_accelerated/foreign_private).
- `public_filing_documents_list` — repeatable (`repeatableKey=public_filing`, поля `title`, `url`, `fiscal_year`).
- `hkex_esg_compliance_level` — `string` (enum comply/explain/planning).
- `uk_tcfd_mandatory_scope` — `text`.

_Блок 7 — программы и рейтинги_
- `cdp_questionnaire_type` (`string`), `cdp_reporting_year` (`number`), `cdp_previous_score` (`string`).
- `ecovadis_scope_description` (`text`), `ecovadis_previous_score` (`string`).
- `re100_commitment_scope` (`text`), `re100_target_year` (`number`), `re100_current_renewable_share_percent` (`number`).
- `gresb_portfolio_description` (`text`), `gresb_previous_score` (`string`).
- `bcorp_assessment_scope_description` (`text`), `bcorp_target_certification_year` (`number`).
- (Опционально) `program_score_history` — repeatable для хранения прошлых оценок (`program_code`, `year`, `score`).

_Блок 8 — сектора_
- `aviation_total_fuel_consumption_tonnes`, `aviation_total_emissions_co2e` — `number`.
- `aviation_routes_coverage_description`, `aviation_offset_programs` — `text`.
- `shipping_voyages_covered_description` (`text`), `shipping_total_emissions_co2e` (`number`), `shipping_fuel_consumption_tonnes` (`number`), `shipping_eu_ports_share_percent` (`number`).
- `building_floor_area_m2`, `building_energy_consumption_mwh`, `building_occupancy_rate_percent` — `number`.
- `building_certifications_existing` — repeatable (`repeatableKey=building_cert`, поля `scheme`, `level`, `valid_until`).
- `it_data_centers_owned_list` — repeatable (`repeatableKey=data_center`, поля `name`, `location`, `ownership_status`).
- `it_data_centers_total_energy_mwh`, `data_center_pue`, `cloud_usage_emissions_co2e`, `supplier_emissions_data_coverage_percent` — `number`.
- `cloud_providers_list` — repeatable (`repeatableKey=cloud_provider`, поля `provider_name`, `service_type`, `emissions_method`).

_Блок 9 — CBAM_
- `cbam_importer_eori`, `cbam_authorised_declarant_id` — `string`.
- `cbam_goods_cn_codes` — `string[]` (массив CN кодов с `item_id`).
- `cbam_reporting_quarter` — `string` (`YYYY-Q#`).
- `cbam_total_embedded_emissions_co2e` — `number`.
- `cbam_free_allowances_quantity`, `cbam_certificates_purchased_quantity`, `cbam_certificates_used_quantity` — `number` (штук сертификатов).
- `cbam_monitoring_methodology_description` — `text`.
- `cbam_supplier_data_availability` — `string` (enum supplier_only / importer_of_record / no_data).

_Блок 10 — клиентские пакеты_
- `client_request_reference` — `string`.
- `client_required_categories_scope3_list` — `string[]` (категории Scope 3).
- `client_reporting_format` — `string` (enum ghg_protocol / excel / api / other).
- `client_data_delivery_deadline` — `date`.
- `client_data_delivery_channels` — `string[]`.
- `data_package_coverage_description` — `text`.

_Блок 11 — энергетика/планы_
- `energy_total_consumption_mwh`, `renewable_energy_share_percent`, `recs_certificates_purchased_mwh`, `energy_saving_potential_estimate_percent` — `number`.
- `ppa_contracts_list` — repeatable (`repeatableKey=ppa_contract`, поля `counterparty`, `volume_mwh`, `start_year`, `end_year`, `status`).
- `energy_audit_scope_description` — `text`.
- `climate_action_measures_list` — repeatable (`repeatableKey=climate_measure`, поля `measure_name`, `expected_reduction_co2e`, `status`, `target_year`).

_Блок 12 — метаполя_
- `data_quality_assessment_summary`, `limitations_and_uncertainties_summary`, `comparability_notes` — `text`.
- `methodology_reference_documents` — repeatable (`repeatableKey=methodology_reference`, поля `title`, `publisher`, `url`).



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