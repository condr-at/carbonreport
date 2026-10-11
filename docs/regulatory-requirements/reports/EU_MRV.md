# EU_MRV — EU MRV Shipping Data

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: Maritime MRV / EU ETS.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Regulation 2015/757 as amended; templates 2023/2449. MRV продолжается одновременно с shipping EU ETS, не только до onboarding. [TR11, TR13, TR14]

Cargo/passenger ships >=5000 GT; с 2025 также general cargo 400–<5000 GT и offshore >=400 GT при EEA-related voyages; проверить exclusions, port calls, responsibility and reporting year. ETS охват отдельно. [TR14, TR15, TR39]

## Выдаваемый результат

Ship emissions report/partial report + verification; ETS company aggregate report там, где применим; submission THETIS-MRV, document of compliance выдает verifier. Templates Annex I–IV 2023/2449. [TR13, TR14]

## Входные данные

- Ship IMO/name/type/GT, company/ISM responsibility, authority, reporting period and approved MP [TR13, TR39]
- Voyages/ports/dates, fuel and emission sources/factors, CO2 CH4 N2O, transport work/distance/cargo/time, data gaps [TR13, TR39]
- Ship transfers/partial periods, verifier report, ETS scope aggregation, derogations and phase-in [TR11, TR14, TR39]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: MRV включает CH4/N2O с 2024; maritime ETS включает их с 2026. Не смешивать totals [TR11, TR14]
- Норма: phase-in по emission year 2024/2025/2026 = 40%/70%/100%; surrender следующий год, не занижать MRV emissions этими коэффициентами [TR11]
- Норма: annual ship report к 31 March следующего года; authority может требовать раньше, но не раньше 28 February; company ETS report отдельно [TR14]
- UX: суммировать ship/partial periods без пропуска/дубля при смене company; не применять ETS 50% extra-EEA voyage к gross MRV inventory [TR11, TR39]

## Проверка человеком

- Правильно ли определены ship type, GT, voyages/port calls, exemptions и company responsible? [TR39]
- Verifier/authority подтверждают MP, emissions reports/DoC; не смешаны ли MRV, ETS и FuelEU? [TR13, TR39, TR42]

## Риски текущего интерфейса и пробелы реализации

- MRV шире/параллелен shipping ETS; применимость и результаты этих процессов проверять отдельно. [TR11, TR14]
- THETIS доступен после регистрации; выгрузка сервиса не равна accepted report/DoC. [TR38, TR39]
- generated/eu_mrv.ts: 45 полей, нет ни ship/IMO/GT, ни fuel/voyage/emission methods; обязательны gender pay gap/privacy/SBTi.
- Нужны ship entities, voyage/port model, company responsibility history, gas-specific emissions, actual Annex mappings.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: Удалить обещание prior to ETS onboarding. MRV шире/параллелен ETS. [TR11, TR14]

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/EU_MRV/README.md)

Нормативные бланки в Annexes TR13 проверены онлайн, локально сохранены EMSA structure tutorial и legal-table crosswalk. Полный текущий THETIS annual submission sample/XML не получен.

## Источники

- **TR11** [Reducing emissions from the shipping sector](https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector_en) — European Commission, DG CLIMA; проверено 2026-10-11; доступ: public. Открыта. MRV/ETS overlap и phase-in. Июльская 2026 реформа на странице названа proposal, не принятая норма.
- **TR12** [Regulation (EU) 2015/757, consolidated MRV maritime](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02015R0757-20240101) — European Union, EUR-Lex; 2024-01-01; доступ: public_intermittent. Первое открытие вернуло полный текст; повторный find перенаправлялся. Изменения последующих лет дополнительно сверены через TR14/TR39; эта старая consolidation не объявляется полной редакцией 2026.
- **TR13** [Implementing Regulation (EU) 2023/2449: MRV forms](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2449) — European Commission, EUR-Lex; 2023-11-06; доступ: public_intermittent. Первое открытие вернуло 1218 строк; повторный fetch/host blocked. Annex I monitoring plan, Annex II emissions/partial report, Annex III document of compliance, Annex IV company report. Локальный PDF не получен; официальный crosswalk сохранён TR42.
- **TR14** [MRV Regulation: amended obligations](https://www.emsa.europa.eu/reducing-emissions/mrv-changes.html) — EMSA; проверено 2026-10-11; доступ: public. Открыта. Расширение на газы и суда, годовой ship report и отдельный company report для ETS, сроки и право authority назначить более ранний срок.
- **TR15** [FAQ MRV Regulation](https://www.emsa.europa.eu/reducing-emissions/mrv-changes/faq-mrv-changes.html) — EMSA; страница указывает update 2024-08-23; проверено 2026-10-11; доступ: public. Открыта. Сама направляет к более подробному и свежему TR39; не заменяет закон.
- **TR38** [THETIS-MRV webinar: monitoring plan structure](https://www.emsa.europa.eu/we-do/digitalisation/maritime-monitoring/download/7764/5154/23.html) — EMSA; 2024-03-05; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/mrv-thetis-monitoring-plan-training-20240305.pdf). 10 slides, slide 7 maps Annex I A–F to THETIS. Учебный UI/process reference; не заполненный annual report.
- **TR39** [EU ETS and MRV Maritime: General guidance for shipping companies](https://climate.ec.europa.eu/document/download/31875b4f-39b9-4cde-a4e2-fbb8f65ee703_en?filename=policy_transport_shipping_gd1_maritime_en.pdf) — European Commission, DG CLIMA; 2025-11-18 updated version; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/mrv-ets-general-guidance.pdf). 125 pages; найден через EMSA. Более свежий guide имеет приоритет над устаревшими FAQ по интерпретации, но не над законом.
- **TR42** [THETIS-MRV monitoring plan: reference to tables of legal acts](https://www.emsa.europa.eu/thetis-mrv/download/7902/5281/23.html) — EMSA; дата PDF не указана; linked FuelEU integration 2024; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/mrv-monitoring-plan-legal-template-crosswalk.pdf). 3 pages, реально скачан и визуально проверен: crosswalk MRV/FuelEU. Не сами annual report формы; разделяет общие и специальные поля.

## Сопоставление с кодом

Название в интерфейсе: **EU MRV Shipping Data**. Внутреннее имя шаблона: `EU MRV Shipping Data`.

В реестре кода: 45 уникальных полей, 43 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/eu_mrv.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
