# BUILDING_CARBON_FOOTPRINT — Building Carbon Data

Проверено: **2026-10-11**. Категория: `assessment`. Семейство: building_wlca.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Оценка по согласованной методике. RICS WLCA 2nd edition v3 применим при принятии этой базы или профессиональном требовании; местное право проверяется отдельно.

Здание/проект строительства или реконструкции; указать страну, стадию и заказанную методику. RICS не универсальный закон.

## Выдаваемый результат

WLCA-отчёт и ведомость модулей/элементов за расчётный период исследования, с эксплуатационными сценариями и отдельным модулем D.

## Входные данные

- [PG14/PG21] Объект, страна, стадия, площадь/нормирование, reference study period и граница актива.
- [PG14/PG21] Количества материалов/элементов, EPD/факторы, строительство, замены, эксплуатационная энергия/вода и конец жизни.
- [PG14] Сценарии, исключения, качество, неопределённость и результаты по модулям.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма выбранной базы PG14 §2] WLCA охватывает A–C; D раскрывается отдельно. Подтвердить состав по стадии/назначению.
- [UX-контроль; PG14/PG21] Сверять площадь, единицы, период, количество замен и связь ведомости с модулями.
- [UX-контроль; PG14] Сумма EPD материалов без эксплуатации и сценариев не является полной WLCA.

## Проверка человеком

- [PG14] WLCA-специалист проверяет модель, качество и отклонения; команда проекта уточняет местные требования.

## Риски текущего интерфейса и пробелы реализации

- След здания не равен CFP отдельного стройматериала.
- До обещания соответствия определить страну и применимую базу.
- generated/building_carbon_footprint.ts: 61 поле, 52 required. Поля итогов и модулей не доказывают расчёт количеств, замен, сценариев и полный RICS reporting workflow.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/BUILDING_CARBON_FOOTPRINT/README.md)

Скачан пустой RICS workbook. Завершённый проверенный отчёт реального здания в этой выборке не получен.

## Источники

- **PG14** [Whole life carbon assessment for the built environment](https://www.rics.org/content/dam/ricsglobal/documents/standards/Whole_life_carbon_assessment_PS_Sept23.pdf) — RICS; 2nd edition September 2023, version 3 August 2024; effective 2024-07-01; доступ: public_fulltext. Public PDF read, not copied locally. §§2,6: assessment boundaries/modules, reference study period and reporting; national rules take precedence.
- **PG21** [WLCA reporting template — buildings](https://www.rics.org/content/dam/ricsglobal/documents/standards/Reporting-template-buildings.xlsx) — RICS; Current supporting workbook for WLCA 2nd edition; retrieved 2026-10-11; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/rics-wlca-buildings-template.xlsx). Seven sheets: summary, concept, detailed, optional granularity, energy nonresidential/residential and water. Not a completed building assessment. Download checks and hashes: assets/product-ghg/download-manifest.json.

## Сопоставление с кодом

Название в интерфейсе: **Building Carbon Data**. Внутреннее имя шаблона: `Building Carbon Data`.

В реестре кода: 61 уникальных полей, 52 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/building_carbon_footprint.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
