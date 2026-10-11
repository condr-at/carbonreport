# SCOPE123_DATASET — Scope 1–3 Data Collection

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: corporate_workpaper.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Внутренний набор данных; не форма регулятора и не самостоятельный стандарт.

Подготовка и передача данных для выбранной корпоративной методики.

## Выдаваемый результат

Версионированный dataset, словарь полей, источники/факторы и реестр пробелов.

## Входные данные

- [PG19] Организация, период, scopes/категории, значения, методы и качество.
- [UX-проектирование; PG19] Источник каждой строки, единица, версия фактора, ответственный и состояние missing/not applicable/estimated.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [UX-контроль; PG19/PG28] Неизвестное не равно нулю; категории и исключения должны быть объяснимы.
- [UX-контроль; PG27] Не складывать location-based и market-based Scope 2 в один двойной итог.
- [UX-контроль; PG19] Схема и заполненность не означают assurance.

## Проверка человеком

- [PG26/PG28] Инвентаризатор подтверждает границы, мэппинг и пригодность источников.

## Риски текущего интерфейса и пробелы реализации

- Dataset ещё не является готовым GHG-отчётом.
- generated/scope123_dataset.ts: 75 из 75 полей required. Нужна условная применимость и модель качества/пробелов, а не одинаковая обязательность всех итогов.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SCOPE123_DATASET/README.md)

PG19 иллюстрирует состав инвентаризации, но не универсальную import schema.

## Источники

- **PG05** [Corporate Accounting and Reporting Standard](https://ghgprotocol.org/corporate-standard) — GHG Protocol / WRI / WBCSD; Revised edition 2004; gases amendment 2013; Scope 2 Guidance 2015; доступ: public_fulltext. Inventory accounting; not an offset-project standard or a verification procedure.
- **PG07** [Corporate Value Chain (Scope 3) Standard](https://ghgprotocol.org/corporate-value-chain-scope-3-standard) — GHG Protocol / WRI / WBCSD; 2011 with published corrections; доступ: public_fulltext. 15 categories; use together with Corporate Standard.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG26** [Corporate Standard — full text](https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf) — GHG Protocol / WRI / WBCSD; Revised 2004; reporting ch. 9 printed pp. 62–65; доступ: public_fulltext. Read with PG30 gases amendment and PG27 scope2 update. Public PDF not stored as a report example.
- **PG27** [Scope 2 Guidance — full text](https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf) — GHG Protocol / WRI / WBCSD; 2015; ch. 6–7, printed pp. 56–65; доступ: public_fulltext. Conditional dual reporting, factor hierarchy/residual mix and contractual-instrument quality criteria.
- **PG28** [Scope3 Standard — full text](https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf) — GHG Protocol / WRI / WBCSD; 2011; ch. 6 and 11; table 5.4; доступ: public_fulltext. Minimum boundaries and disclosure of exclusions; separate category totals and methodologies. Read with gases amendment.

## Сопоставление с кодом

Название в интерфейсе: **Scope 1–3 Data Collection**. Внутреннее имя шаблона: `Scope 1–3 Data Collection`.

В реестре кода: 75 уникальных полей, 75 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/scope123_dataset.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
