# SCOPE3_CATEGORY1_SUPPLIERS — Scope 3 Purchased Goods Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: scope3_category1.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Category 1 Scope 3 Standard; расчётное руководство 2013.

Закупленные товары/услуги вне категорий 2–8; границы от добычи сырья до выхода с предприятия поставщика.

## Выдаваемый результат

Расчёт Category 1 и пакет данных поставщиков с охватом, факторами, единицами и пробелами.

## Входные данные

- [PG08] Объёмы/стоимость закупок, единицы/валюта/год; product-level CFP или подходящие вторичные факторы.
- [PG08] Метод: supplier-specific, hybrid, average-data или spend-based; allocation, границы, первичные источники и качество.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма границы PG28 table5.4] Category 1 охватывает cradle-to-gate вне категорий 2–8.
- [Руководство PG08] Количество × продуктовый фактор для supplier-specific; весь корпоративный след поставщика не подставляется вместо фактора продукта.
- [UX-контроль; PG08] Проверять kg/tonne, валюту/год, границы CFP и долю охвата закупок; отсутствие ответа не считать нулём.

## Проверка человеком

- [PG08/PG28] Эксперт проверяет границы CFP/allocation; закупки — полноту популяции.

## Риски текущего интерфейса и пробелы реализации

- Ответ поставщика не является независимой верификацией.
- generated/scope3_category1_suppliers.ts: 56 полей, 51 required. Нужны отдельные входы методов расчёта и coverage закупок; отраслевые поля не заменяют их.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SCOPE3_CATEGORY1_SUPPLIERS/README.md)

PG08 Example 1.1 — явно синтетический учебный расчёт, не реальный клиентский отчёт; PG19 — пустая форма.

## Источники

- **PG07** [Corporate Value Chain (Scope 3) Standard](https://ghgprotocol.org/corporate-value-chain-scope-3-standard) — GHG Protocol / WRI / WBCSD; 2011 with published corrections; доступ: public_fulltext. 15 categories; use together with Corporate Standard.
- **PG08** [Scope 3 Calculation Guidance — Category 1, Purchased goods and services](https://ghgprotocol.org/sites/default/files/2022-12/Chapter1.pdf) — GHG Protocol / Carbon Trust; April 2013; PDF pp.20–35 printed; доступ: public_fulltext. Supplier-specific, hybrid, average-data and spend-based methods; numerical examples explicitly illustrative, not real completed reports.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG28** [Scope3 Standard — full text](https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf) — GHG Protocol / WRI / WBCSD; 2011; ch. 6 and 11; table 5.4; доступ: public_fulltext. Minimum boundaries and disclosure of exclusions; separate category totals and methodologies. Read with gases amendment.

## Сопоставление с кодом

Название в интерфейсе: **Scope 3 Purchased Goods Data**. Внутреннее имя шаблона: `Scope 3 Purchased Goods Data`.

В реестре кода: 56 уникальных полей, 51 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/scope3_category1_suppliers.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
