# ISO_14064_CERT — ISO 14064-1 Inventory Preparation

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: corporate_iso_inventory.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

ISO 14064-1:2018 и отдельная база проверки ISO 14064-3:2019: текущие опубликованные редакции; полный текст не изучался.

Организационная GHG-инвентаризация по ISO; применимая программа может добавлять требования.

## Выдаваемый результат

Инвентаризационный отчёт и, если выполнено, отдельное заключение о проверке. Код CERT не создаёт сертификат.

## Входные данные

- [PG09] Организация, период, границы, выбросы/удаления, методы, данные и управление инвентаризацией.
- [UX-проектирование; PG10] Критерии, версия, объём и уровень проверки; проверяющий, подписанное заключение и оговорки.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Область нормы PG09/PG10] Разделить inventory и verification statement; точные обязательные раскрытия сверить с лицензированными текстами.
- [UX-контроль; PG09/PG26] Не переносить GHG scopes в категории ISO без проверенного мэппинга.
- [UX-контроль; PG32] Самогенерируемый PDF не является сертификатом ISO.

## Проверка человеком

- [PG09/PG10] Инвентаризатор и компетентный независимый проверяющий сверяют соответствующие лицензированные стандарты.

## Риски текущего интерфейса и пробелы реализации

- Inventory report и verification statement — разные документы.
- generated/iso_14064_cert.ts: 87 полей, 63 required; смесь GHG/SEC/GRESB/aviation. Полный ISO-мэппинг не доказан.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/ISO_14064_CERT/README.md)

GHG-формы PG18/PG19 — только смежные примеры состава. Это не ISO-формы и не сертификаты; завершённое ISO 14064 verification statement не получено.

## Источники

- **PG09** [ISO 14064-1:2018 — Organization-level quantification/reporting](https://www.iso.org/standard/66453.html) — ISO; 2018-12 edition 2; confirmed 2024; revision in progress; доступ: public_metadata. Programme-neutral inventory requirements; not a certificate issued by the application. Licensed text not read.
- **PG10** [ISO 14064-3:2019 — Verification and validation of GHG statements](https://www.iso.org/standard/66455.html) — ISO; 2019-04 edition 2; confirmed 2024; доступ: public_metadata. Applies to organisation, project and product statements. Only public scope/status, no clause-level audit.
- **PG18** [GHG Protocol Reporting Template](https://ghgprotocol.org/sites/default/files/2022-12/GHG-Protocol-Reporting-Template.docx) — GHG Protocol / WRI / WBCSD; Listed February 2017; legacy contents; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-corporate-reporting-template.docx). Legacy form omits NF3 and has one Scope 2 line; needs PG30 and PG27 updates. Not a completed or verified inventory. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG19** [Sample GHG Inventory Reporting Template](https://ghgprotocol.org/sites/default/files/2023-07/Sample%20GHG%20Inventory%20Reporting%20Template%20%28updated%207.10.23%29.docx) — GHG Protocol / WRI / WBCSD; Updated 2023-07-10; доступ: public_download_copyright_retained. [Локальный материал](../../report-reference/assets/product-ghg/ghg-inventory-reporting-template-2023.docx). DOCX includes 15 Scope 3 categories, methods/data quality, supplier-data share and seven gases; no real company values. Download checks and hashes: assets/product-ghg/download-manifest.json.
- **PG32** [ISO — Certification](https://www.iso.org/certification.html) — ISO; Live page checked 2026-10-11; доступ: public_fulltext. ISO does not perform certification or issue certificates.
- **PG26** [Corporate Standard — full text](https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf) — GHG Protocol / WRI / WBCSD; Revised 2004; reporting ch. 9 printed pp. 62–65; доступ: public_fulltext. Read with PG30 gases amendment and PG27 scope2 update. Public PDF not stored as a report example.

## Сопоставление с кодом

Название в интерфейсе: **ISO 14064-1 Inventory Preparation**. Внутреннее имя шаблона: `ISO 14064-1 Inventory Preparation`.

В реестре кода: 87 уникальных полей, 63 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/iso_14064_cert.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
