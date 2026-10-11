# SCOPE2_DETAILED — Scope 2 Inventory Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: scope2.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Scope 2 Guidance 2015 — действующая основа; изменения PG33 ещё в разработке.

Приобретённые электричество, пар, тепло и охлаждение в выбранной организационной границе.

## Выдаваемый результат

Раздел инвентаризации с location-based и, при применимости, market-based результатами и раскрытиями инструментов.

## Входные данные

- [PG27] Потребление по площадкам/периодам/видам энергии; grid factors, источники и единицы.
- [PG27] Контракты/сертификаты/supplier factors, права на attributes, retirement, рынок/период и residual mix.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма PG27 ch7] При операциях в рынках с product/supplier-specific contractual data требуется dual reporting; только в рынках без таких данных — location-based.
- [Норма PG27 ch7] Инструменты market-based проверяются по восьми quality criteria; residual mix/fallback — по установленной иерархии.
- [UX-контроль; PG27] Renewable percent не даёт автоматический нулевой результат; offsets/avoided emissions не вычитать из Scope 2.
- [UX-контроль; PG33] Hourly matching из проекта не выдавать за уже действующее универсальное требование.

## Проверка человеком

- [PG27] Energy/GHG-специалист проверяет ownership, географию, сроки и применимость методов.

## Риски текущего интерфейса и пробелы реализации

- Location-based и market-based — параллельные результаты, их не суммируют.
- generated/scope2_detailed.ts: 55 полей, 45 required. Два поля итогов не доказывают проверку договорных инструментов и иерархии факторов.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SCOPE2_DETAILED/README.md)

PG19 — общая форма; Scope 2 необходимо раскрывать по Guidance 2015. Завершённый отдельный Scope 2 report не получен.

## Источники

- **PG06** [Scope 2 Guidance](https://ghgprotocol.org/scope-2-guidance) — GHG Protocol / WRI / WBCSD; 2015; consultation October 2025–January 2026; доступ: public_fulltext. Eight quality criteria for contractual instruments; distinguish current requirements from consultation proposals.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG27** [Scope 2 Guidance — full text](https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf) — GHG Protocol / WRI / WBCSD; 2015; ch. 6–7, printed pp. 56–65; доступ: public_fulltext. Conditional dual reporting, factor hierarchy/residual mix and contractual-instrument quality criteria.
- **PG30** [Required Greenhouse Gases and GWP Values — amendment](https://ghgprotocol.org/sites/default/files/2022-12/Required%20gases%20and%20GWP%20values_0.pdf) — GHG Protocol / WRI / WBCSD; 2013; доступ: public_fulltext. Includes NF3; source and consistency of 100-year IPCC GWP values. Old example/template gas lists do not override amendment.
- **PG33** [Key Standard Development Updates: FAQ](https://ghgprotocol.org/blog/ghg-protocol-announces-key-standard-development-updates-faq-resource) — GHG Protocol; 2026-07-29; доступ: public_fulltext. New consolidated ISO/GHG corporate consultation planned Q2 2027, publication Q4 2028. Supersedes earlier planning timelines; proposals are not current obligations.

## Сопоставление с кодом

Название в интерфейсе: **Scope 2 Inventory Data**. Внутреннее имя шаблона: `Scope 2 Inventory Data`.

В реестре кода: 55 уникальных полей, 45 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/scope2_detailed.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
