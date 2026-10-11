# SCOPE3_DETAILED — Scope 3 Inventory Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: scope3.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Scope 3 Standard 2011 и amendment 2013; будущая консолидация не заменяет текущую основу.

Корпоративная цепочка стоимости; список ответивших поставщиков не покрывает весь Scope 3.

## Выдаваемый результат

Инвентаризация по категориям с применимостью, исключениями, методами, качеством и отдельным биогенным CO2.

## Входные данные

- [PG28] Карта цепочки стоимости, деятельность отчётного года и minimum boundaries всех категорий.
- [PG19] Activity/spend данные, факторы, методы/allocation, доля supplier data, качество и базовый год при трекинге.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма PG28 ch6/table5.4] Учитывать Scope 3 по минимальным границам; все исключения раскрывать и обосновывать.
- [Норма PG28 ch11] Категории раскрываются отдельно от offsets/биогенного CO2; для conformance нужен связанный Scope 1/2 report.
- [UX-контроль; PG28] Исключать двойной счёт внутри своей инвентаризации; совпадение выбросов в цепочках разных компаний само по себе допустимо.
- [UX-контроль; PG31] Проверить применимость LSR v1.1 и переход с 2027; не объявлять его вступившим в действие раньше срока.

## Проверка человеком

- [PG28] Scope 3 специалист проверяет существенность, категории, downstream-сценарии и качество.

## Риски текущего интерфейса и пробелы реализации

- Category 1 не равна всему Scope 3.
- Черновик пересмотра не является действующим стандартом.
- generated/scope3_detailed.ts: 70 полей, 67 required. Нужен контракт coverage/minimum boundaries/обоснований исключений.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SCOPE3_DETAILED/README.md)

PG19 — пустая форма по 15 категориям, не реальная проверенная инвентаризация.

## Источники

- **PG07** [Corporate Value Chain (Scope 3) Standard](https://ghgprotocol.org/corporate-value-chain-scope-3-standard) — GHG Protocol / WRI / WBCSD; 2011 with published corrections; доступ: public_fulltext. 15 categories; use together with Corporate Standard.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG28** [Scope3 Standard — full text](https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf) — GHG Protocol / WRI / WBCSD; 2011; ch. 6 and 11; table 5.4; доступ: public_fulltext. Minimum boundaries and disclosure of exclusions; separate category totals and methodologies. Read with gases amendment.
- **PG30** [Required Greenhouse Gases and GWP Values — amendment](https://ghgprotocol.org/sites/default/files/2022-12/Required%20gases%20and%20GWP%20values_0.pdf) — GHG Protocol / WRI / WBCSD; 2013; доступ: public_fulltext. Includes NF3; source and consistency of 100-year IPCC GWP values. Old example/template gas lists do not override amendment.
- **PG31** [Land Sector and Removals Standard](https://ghgprotocol.org/land-sector-and-removals-standard) — GHG Protocol / WRI / WBCSD; v1.1 is current linked version; effective 2027-01-01; доступ: public_fulltext. Published 2026 and not yet effective on checked_on. Evaluate land/removals applicability; forest accounting remains separate work.
- **PG33** [Key Standard Development Updates: FAQ](https://ghgprotocol.org/blog/ghg-protocol-announces-key-standard-development-updates-faq-resource) — GHG Protocol; 2026-07-29; доступ: public_fulltext. New consolidated ISO/GHG corporate consultation planned Q2 2027, publication Q4 2028. Supersedes earlier planning timelines; proposals are not current obligations.

## Сопоставление с кодом

Название в интерфейсе: **Scope 3 Inventory Data**. Внутреннее имя шаблона: `Scope 3 Inventory Data`.

В реестре кода: 70 уникальных полей, 67 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/scope3_detailed.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
