# Справочник новых Data Points

Описание всех 48 добавленных data points с указанием типа данных и применимости.

---

## CSRD - Corporate Sustainability Reporting Directive

### csrd_double_materiality_assessment
- **Тип:** JSON/Text (structured)
- **Описание:** Результаты обязательной оценки двойной материальности (impact materiality + financial materiality)
- **Обязательность:** Mandatory для CSRD
- **Формат:** Структурированный список тем с оценками по обеим осям

### csrd_esrs_disclosure_requirements
- **Тип:** JSON array
- **Описание:** Список применимых требований раскрытия по ESRS (E1-E5, S1-S4, G1)
- **Пример:** ["ESRS E1", "ESRS E2", "ESRS S1"]

### csrd_value_chain_mapping
- **Тип:** Text/JSON
- **Описание:** Детальное картирование цепочки создания стоимости (upstream/downstream)
- **Связь:** Расширяет `value_chain_description`

### narrative_disclosures_quality_metrics
- **Тип:** JSON
- **Описание:** Метрики качества нарративных раскрытий (completeness, consistency, etc.)
- **Использование:** Для внутреннего контроля качества

### taxonomy_alignment_criteria_details
- **Тип:** JSON
- **Описание:** Детализация соответствия критериям EU Taxonomy (DNSH, minimum safeguards)
- **Связь:** Дополняет taxonomy_aligned_*_percent поля

### csrd_assurance_provider_details
- **Тип:** Text
- **Описание:** Информация о провайдере независимого аудита CSRD отчётности
- **Обязательность:** Mandatory с 2024 (limited assurance), 2028 (reasonable assurance)

---

## EU ETS - Emissions Trading System

### eu_ets_installation_permit_numbers
- **Тип:** Array of strings
- **Описание:** Номера разрешений (permits) для установок, участвующих в EU ETS
- **Формат:** ["EU-123456", "EU-789012"]

### eu_ets_activity_level_data
- **Тип:** JSON
- **Описание:** Данные уровня активности установок (production volumes, operating hours)
- **Использование:** Для расчёта benchmarks

### eu_ets_fall_back_methodology_used
- **Тип:** Boolean + Text
- **Описание:** Флаг и описание использования резервных (fall-back) методологий расчёта
- **Требуется:** Только если стандартные методы неприменимы

---

## CBAM - Carbon Border Adjustment Mechanism

### cbam_production_process_description
- **Тип:** Text (detailed)
- **Описание:** Детальное описание производственного процесса для товаров CBAM
- **Обязательность:** Mandatory для импортёров

### cbam_precursor_materials_emissions
- **Тип:** Number (tCO2e)
- **Описание:** Выбросы от производства исходных материалов (precursors)
- **Методология:** System boundary включает precursors

### cbam_installation_boundaries
- **Тип:** Text/JSON
- **Описание:** Определение границ установки для целей CBAM
- **Критично:** Влияет на расчёт embedded emissions

---

## UK SECR - Streamlined Energy and Carbon Reporting

### uk_secr_company_size_category
- **Тип:** Enum
- **Значения:** "Large", "Quoted", "LLP"
- **Использование:** Определяет применимые требования

### uk_secr_energy_intensity_ratio
- **Тип:** Number
- **Описание:** Обязательный коэффициент энергоэффективности (energy per revenue/FTE/m²)
- **Формат:** Value + denominator description

### uk_secr_quantification_methodology
- **Тип:** Text
- **Описание:** Описание методологии квантификации для UK SECR
- **Стандарт:** Обычно GHG Protocol или ISO 14064-1

---

## SEC Climate Disclosure

### sec_materiality_determination_process
- **Тип:** Text (narrative)
- **Описание:** Описание процесса определения материальности климатических рисков
- **Обязательность:** Required для large accelerated filers

### sec_severe_weather_event_descriptions
- **Тип:** JSON array
- **Описание:** Описания значимых погодных событий с финансовым воздействием > 1%
- **Формат:** [{event, date, impact_amount, capitalized, expensed}]

### sec_attestation_provider_details
- **Тип:** Text
- **Описание:** Информация о провайдере аттестации Scope 1&2 emissions
- **Требуется:** Для accelerated/large accelerated filers (отложено)

### sec_safe_harbor_forward_looking_statements
- **Тип:** Text (legal)
- **Описание:** Safe harbor оговорки для прогнозных заявлений о климате
- **Использование:** Legal boilerplate для transition plans

---

## CORSIA - Aviation

### corsia_eligible_fuel_types
- **Тип:** Array of strings
- **Описание:** Типы используемого допустимого авиатоплива
- **Примеры:** ["Jet A-1", "SAF-HEFA", "Jet A"]

### corsia_sustainability_certification_scheme
- **Тип:** Text
- **Описание:** Схема сертификации устойчивости SAF (если используется)
- **Примеры:** "RSB", "ISCC", "SCS"

### corsia_offset_credits_vintage_year
- **Тип:** Integer (year)
- **Описание:** Год выпуска компенсационных кредитов
- **Правило:** Должен быть не ранее baseline year

### corsia_monitoring_plan_reference
- **Тип:** Text/URL
- **Описание:** Ссылка на утверждённый план мониторинга выбросов
- **Обязательность:** Required для всех операторов

---

## EU MRV - Maritime Reporting and Verification

### eu_mrv_ship_imo_number
- **Тип:** String (7 digits)
- **Описание:** Уникальный идентификационный номер ИМО судна
- **Формат:** "IMO1234567"

### eu_mrv_ship_technical_efficiency
- **Тип:** Number
- **Описание:** Показатель технической эффективности судна (EEDI/EEXI)
- **Единицы:** gCO2/tonne-mile

### eu_mrv_cargo_carried_tonnes
- **Тип:** Number
- **Описание:** Масса перевозимого груза за отчётный период
- **Единицы:** Metric tonnes

### eu_mrv_ice_class_notation
- **Тип:** Text
- **Описание:** Ледовый класс судна (если применимо)
- **Примеры:** "1A Super", "1A", "1B", "PC6"

---

## SFDR - Sustainable Finance Disclosure Regulation

### sfdr_article_classification
- **Тип:** Enum
- **Значения:** "Article 6", "Article 8", "Article 9"
- **Критично:** Определяет все остальные требования SFDR

### sfdr_do_no_significant_harm_assessment
- **Тип:** JSON/Text
- **Описание:** Оценка соответствия принципу DNSH для 6 экологических целей
- **Структура:** Assessment per environmental objective

### sfdr_principal_adverse_impacts_metrics
- **Тип:** JSON array
- **Описание:** Расширенные метрики основных неблагоприятных воздействий (14 обязательных + доп.)
- **Стандарт:** RTS Delegated Regulation (EU) 2022/1288

---

## TCFD - Task Force on Climate-related Financial Disclosures

### tcfd_metrics_targets_disclosure
- **Тип:** JSON
- **Описание:** Структурированное раскрытие метрик и целей согласно TCFD
- **Категории:** GHG emissions, climate-related risks, opportunities, capital deployment

### tcfd_resilience_assessment_results
- **Тип:** Text/JSON
- **Описание:** Результаты оценки устойчивости бизнес-модели к климатическим сценариям
- **Сценарии:** Обычно включает 2°C и 4°C scenarios

---

## HKEX ESG - Hong Kong Exchange ESG Reporting

### hkex_esg_kpi_list
- **Тип:** JSON array
- **Описание:** Список раскрываемых КПЭ согласно HKEX ESG Guide
- **Структура:** [{aspect, kpi_code, value, unit, target}]

### hkex_esg_reporting_principles_application
- **Тип:** Text
- **Описание:** Описание применения принципов отчётности (Materiality, Quantitative, Balance, Consistency)
- **Обязательность:** Comply or explain

---

## CDP - Carbon Disclosure Project

### cdp_water_security_metrics
- **Тип:** JSON
- **Описание:** Метрики водной безопасности для CDP Water questionnaire
- **Включает:** Water withdrawal, discharge, consumption, stress assessment

### cdp_forest_commodities_risk
- **Тип:** JSON
- **Описание:** Оценка рисков, связанных с лесными товарами (timber, palm oil, cattle, soy)
- **Применимость:** Relevant sectors only

### cdp_supplier_engagement_rating
- **Тип:** Text/Score
- **Описание:** Рейтинг вовлечения поставщиков (Supplier Engagement Rating - SER)
- **Шкала:** A, A-, B, B-, C, C-, D, D-

---

## Product Carbon Footprint / EPD / ISO 14067

### product_functional_unit_definition
- **Тип:** Text
- **Описание:** Определение функциональной единицы для LCA
- **Пример:** "1 kg of product delivered to customer gate"
- **Критично:** Fundamental для PCF

### product_system_boundary_description
- **Тип:** Text/JSON
- **Описание:** Детальное описание границ системы продукта
- **Включает:** Cradle-to-gate, cradle-to-grave, или custom boundaries

### product_allocation_methodology
- **Тип:** Text
- **Описание:** Методология распределения выбросов (mass, economic, energy)
- **Стандарт:** ISO 14044 guidance

### product_cutoff_criteria
- **Тип:** Text/Number
- **Описание:** Критерии отсечения (cutoff rules) для LCA
- **Типично:** "1% mass/energy contribution"

### product_life_cycle_stages_included
- **Тип:** Array of strings
- **Описание:** Включённые стадии жизненного цикла
- **Значения:** ["Raw material", "Production", "Distribution", "Use", "End-of-life"]

### product_data_quality_indicators
- **Тип:** JSON
- **Описание:** Индикаторы качества данных (DQI) по ISO 14044
- **Параметры:** Temporal, geographical, technological representativeness

---

## SBTi - Science Based Targets initiative

### sbti_base_year_for_targets
- **Тип:** Integer (year)
- **Описание:** Базовый год для science-based targets
- **Правило:** Не старше 5 лет от года подачи

### sbti_boundary_coverage_percent
- **Тип:** Number (percent)
- **Описание:** Процент покрытия границ организации целями SBTi
- **Требование:** Минимум 95% Scope 1+2, 67% Scope 3 (если >40% total)

---

## RE100 - Renewable Energy 100%

### re100_interim_targets_list
- **Тип:** JSON array
- **Описание:** Список промежуточных целей по ВИЭ
- **Формат:** [{year: 2025, target_percent: 60}, {year: 2030, target_percent: 90}]

### re100_re_sourcing_methods
- **Тип:** Array of strings
- **Описание:** Методы обеспечения возобновляемой энергией
- **Значения:** ["On-site solar", "PPAs", "RECs", "Green tariff"]

---

## GRESB - Real Estate Assessment

### gresb_asset_type_breakdown
- **Тип:** JSON
- **Описание:** Разбивка портфеля по типам активов
- **Категории:** Office, Retail, Residential, Industrial, etc.

### gresb_standing_investments_count
- **Тип:** Integer
- **Описание:** Количество действующих инвестиций в портфеле
- **Использование:** Для расчёта coverage metrics

---

## B Corp - Impact Assessment

### bcorp_impact_areas_scores
- **Тип:** JSON
- **Описание:** Баллы по 5 областям воздействия B Corp
- **Области:** Governance, Workers, Community, Environment, Customers
- **Шкала:** 0-200 points (80+ required для сертификации)

### bcorp_governance_structure_description
- **Тип:** Text
- **Описание:** Описание структуры управления с учётом стейкхолдеров
- **Включает:** Benefit corporation status, stakeholder governance

---

## Рекомендации по имплементации

### Приоритет 1 (Critical) - имплементировать первыми:
1. `csrd_double_materiality_assessment` - растущее число CSRD обязанных компаний
2. `cbam_production_process_description` - входит в силу 2026
3. `sec_materiality_determination_process` - US public companies
4. `product_functional_unit_definition` - fundamental для PCF
5. `sfdr_article_classification` - определяет другие требования

### Приоритет 2 (High) - следующая волна:
- Все sector-specific (aviation, maritime)
- TCFD расширения
- SBTi детализация

### Приоритет 3 (Medium) - опционально:
- Voluntary frameworks (RE100, GRESB, B Corp) детали
- Quality metrics и internal control fields

---

**Дата создания:** 26 ноября 2025  
**Версия:** 1.0
