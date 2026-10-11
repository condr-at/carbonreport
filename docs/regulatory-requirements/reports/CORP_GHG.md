# CORP_GHG — Corporate GHG Inventory Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: corporate_ghg.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

GHG Corporate Standard 2004 + amendment 2013 + Scope 2 Guidance 2015. ISO 14064 — альтернативная выбранная база, не автоматическая эквивалентность.

Базовая корпоративная инвентаризация. Scope 3 не становится обязательным только из-за выбора Corporate Standard.

## Выдаваемый результат

Корпоративный GHG-отчёт по явно выбранной базе.

## Входные данные

- [PG18/PG19] Организация, период, consolidation approach, границы, исключения, исходные данные и факторы.
- [PG19/PG30] Результаты по scopes/газам, GWP, методы, качество, базовый год и пересчёты; Scope 3 — по выбранной базе.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма выбранной базы PG26 ch9] Scope 1 и 2 отдельно, до GHG trades; раскрыть границы, методы и исключения.
- [Норма выбранной базы PG27/PG30] Применить Scope 2 Guidance и поправку по газам/GWP; legacy-форма PG18 сама по себе недостаточна.
- [UX-контроль; PG19] Проверить трассировку итогов и сопоставимость лет; вариант интерфейса не меняет нормативную базу.

## Проверка человеком

- [PG19/PG26] Инвентаризатор проверяет организационную полноту, качество и пересчёт базы.

## Риски текущего интерфейса и пробелы реализации

- Вариант annual/public/simplified не является отдельным стандартом.
- Публикация и независимая проверка требуют отдельных подтверждений.
- generated/corp_ghg.ts: набор полей не является полным контрактом раскрытий. CORP_GHG/ANNUAL/PUBLIC/VERIFIED имеют одинаковые 84 fieldId, но разные isRequired; присутствуют посторонние отраслевые поля.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CORP_GHG/README.md)

PG18/PG19 — официальные пустые формы, без реальных значений и verification statement. PG18 требует обновления по PG27/PG30. Отдельный завершённый пример этого варианта не получен.

## Источники

- **PG05** [Corporate Accounting and Reporting Standard](https://ghgprotocol.org/corporate-standard) — GHG Protocol / WRI / WBCSD; Revised edition 2004; gases amendment 2013; Scope 2 Guidance 2015; доступ: public_fulltext. Inventory accounting; not an offset-project standard or a verification procedure.
- **PG09** [ISO 14064-1:2018 — Organization-level quantification/reporting](https://www.iso.org/standard/66453.html) — ISO; 2018-12 edition 2; confirmed 2024; revision in progress; доступ: public_metadata. Programme-neutral inventory requirements; not a certificate issued by the application. Licensed text not read.
- **PG10** [ISO 14064-3:2019 — Verification and validation of GHG statements](https://www.iso.org/standard/66455.html) — ISO; 2019-04 edition 2; confirmed 2024; доступ: public_metadata. Applies to organisation, project and product statements. Only public scope/status, no clause-level audit.
- **PG18** [GHG Protocol Reporting Template](https://ghgprotocol.org/sites/default/files/2022-12/GHG-Protocol-Reporting-Template.docx) — GHG Protocol / WRI / WBCSD; Listed February 2017; legacy contents; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-corporate-reporting-template.docx). Legacy form omits NF3 and has one Scope 2 line; needs PG30 and PG27 updates. Not a completed or verified inventory. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG26** [Corporate Standard — full text](https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf) — GHG Protocol / WRI / WBCSD; Revised 2004; reporting ch. 9 printed pp. 62–65; доступ: public_fulltext. Read with PG30 gases amendment and PG27 scope2 update. Public PDF not stored as a report example.
- **PG27** [Scope 2 Guidance — full text](https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf) — GHG Protocol / WRI / WBCSD; 2015; ch. 6–7, printed pp. 56–65; доступ: public_fulltext. Conditional dual reporting, factor hierarchy/residual mix and contractual-instrument quality criteria.
- **PG30** [Required Greenhouse Gases and GWP Values — amendment](https://ghgprotocol.org/sites/default/files/2022-12/Required%20gases%20and%20GWP%20values_0.pdf) — GHG Protocol / WRI / WBCSD; 2013; доступ: public_fulltext. Includes NF3; source and consistency of 100-year IPCC GWP values. Old example/template gas lists do not override amendment.
- **PG31** [Land Sector and Removals Standard](https://ghgprotocol.org/land-sector-and-removals-standard) — GHG Protocol / WRI / WBCSD; v1.1 is current linked version; effective 2027-01-01; доступ: public_fulltext. Published 2026 and not yet effective on checked_on. Evaluate land/removals applicability; forest accounting remains separate work.
- **PG32** [ISO — Certification](https://www.iso.org/certification.html) — ISO; Live page checked 2026-10-11; доступ: public_fulltext. ISO does not perform certification or issue certificates.
- **PG33** [Key Standard Development Updates: FAQ](https://ghgprotocol.org/blog/ghg-protocol-announces-key-standard-development-updates-faq-resource) — GHG Protocol; 2026-07-29; доступ: public_fulltext. New consolidated ISO/GHG corporate consultation planned Q2 2027, publication Q4 2028. Supersedes earlier planning timelines; proposals are not current obligations.

## Сопоставление с кодом

Название в интерфейсе: **Corporate GHG Inventory Data**. Внутреннее имя шаблона: `Corporate GHG Inventory Data`.

В реестре кода: 84 уникальных полей, 51 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/corp_ghg.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
