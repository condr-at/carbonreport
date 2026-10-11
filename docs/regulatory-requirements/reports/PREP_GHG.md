# PREP_GHG — GHG Preparation Checklist

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: corporate_workpaper.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Подготовительный чеклист; отдельного внешнего стандарта PREP_GHG нет в проверенных источниках.

Подготовка к инвентаризации, распределение ответственности и сбор данных.

## Выдаваемый результат

Реестр границ, источников, ответственных, пробелов и выбранных правил.

## Входные данные

- [UX-проектирование; PG19/PG26] Цель, получатель, методика, организация, предварительные границы и период.
- [UX-проектирование; PG18/PG19] Источники, evidence, ответственные и сроки закрытия пробелов.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [UX-контроль; PG26] Результат называется подготовкой, а не compliant inventory/verified report.
- [UX-контроль; PG19] Для пробела определить действие; unknown не считать измеренными выбросами.

## Проверка человеком

- [PG26] Инвентаризатор утверждает план и применимость методики.

## Риски текущего интерфейса и пробелы реализации

- Готовность к сбору не равна завершённой инвентаризации.
- generated/prep_ghg.ts: 43 поля, 35 required. Таблица содержит конечные totals и отраслевые поля, а отдельный подготовительный результат не определён.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/PREP_GHG/README.md)

PG18/PG19 — ориентиры состава данных; отдельный официальный отчёт PREP_GHG не выявлен.

## Источники

- **PG05** [Corporate Accounting and Reporting Standard](https://ghgprotocol.org/corporate-standard) — GHG Protocol / WRI / WBCSD; Revised edition 2004; gases amendment 2013; Scope 2 Guidance 2015; доступ: public_fulltext. Inventory accounting; not an offset-project standard or a verification procedure.
- **PG18** [GHG Protocol Reporting Template](https://ghgprotocol.org/sites/default/files/2022-12/GHG-Protocol-Reporting-Template.docx) — GHG Protocol / WRI / WBCSD; Listed February 2017; legacy contents; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-corporate-reporting-template.docx). Legacy form omits NF3 and has one Scope 2 line; needs PG30 and PG27 updates. Not a completed or verified inventory. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG26** [Corporate Standard — full text](https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf) — GHG Protocol / WRI / WBCSD; Revised 2004; reporting ch. 9 printed pp. 62–65; доступ: public_fulltext. Read with PG30 gases amendment and PG27 scope2 update. Public PDF not stored as a report example.

## Сопоставление с кодом

Название в интерфейсе: **GHG Preparation Checklist**. Внутреннее имя шаблона: `GHG Preparation Checklist`.

В реестре кода: 43 уникальных полей, 35 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/prep_ghg.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
