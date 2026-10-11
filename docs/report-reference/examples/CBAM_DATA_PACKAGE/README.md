# Образцы: CBAM_DATA_PACKAGE

Дата проверки: 2026-10-11. Статус материала: **own_review_profile_implemented_official_form_and_client_acceptance_gap**.

Собственный review profile реализован: синтетические regression fixtures и локальный инженерный пример фактически скачанного browser ZIP приведены ниже. Они не являются независимым нормативным golden case или подтверждением приёмки клиентом. Локальный Communication XLSX 2024 исторический/transitional и не подменяет definitive-period mandatory operator form. Актуальный полный mandatory operator workbook не получен. Current guidance 3 содержит методические примеры; ни они, ни наш ZIP не являются заверенным клиентским package. Исторический illustrative filled sector ZIP не скачался за две попытки.

### Локальный инженерный пример

Синтетический инженерный пример собственного review profile: ZIP фактически скачан через браузер из приложения 11 октября 2026 года. Сохранены точный входной dataset и распакованные выходы. Для этой фикстуры масса 12 t, сообщённые direct SEE 2.5 и indirect SEE 0.5 tCO2e/t дают отдельно 30 и 6 tCO2e; данные частичного периода actual остаются заявленными и непроверенными. Это проверка программного поведения, не официальный CBAM sample, независимый нормативный golden case или клиентская приёмка. Статус golden test: не утверждён.

- [Скачанный review ZIP](../../../qa/supplier-package-2026-10-11/downloaded-package.zip)
- [Читаемый HTML-пример](../../../qa/supplier-package-2026-10-11/example/summary.html)
- [Точные входы — input-dataset.json](../../../qa/supplier-package-2026-10-11/input-dataset.json)
- [Машиночитаемый результат — data.json](../../../qa/supplier-package-2026-10-11/example/data.json)
- [Активные значения — values.csv](../../../qa/supplier-package-2026-10-11/example/values.csv)
- [Ссылки на доказательства — evidence.csv](../../../qa/supplier-package-2026-10-11/example/evidence.csv)
- [Описание содержимого и ограничений — README.txt](../../../qa/supplier-package-2026-10-11/example/README.txt)
- [Проверяемые утверждения — verify-artifact.py](../../../qa/supplier-package-2026-10-11/verify-artifact.py)

## Доступные ориентиры

- **TR23** [CBAM communication template for installations](https://taxation-customs.ec.europa.eu/document/download/2c15cd0e-2447-4ef8-ab70-68b80b66ede8_en?filename=CBAM%20Communication%20template%20for%20installations_en_20241213.xlsx) — European Commission, DG TAXUD; 2024-12-13; webpage 2024-12-18; доступ: public_downloaded. [Локальный материал](../../assets/trade-transport/cbam-communication-template-20241213.xlsx). 19 sheets. Transitional supplier communication workbook; использовать только как исторический структурный ориентир и не как annual declaration за 2026.
- **TR24** [CBAM communication template: sector examples](https://taxation-customs.ec.europa.eu/document/download/8d00a979-e57d-4e53-a11f-8b01370236a9_en?filename=Communication-template-examples.zip) — European Commission, DG TAXUD; 2024-06-20; доступ: public_download_failed. Ссылка найдена в открытой TR08; 429, затем premature response. Две попытки исчерпаны, ZIP не сохранён. Сам архив: illustrative sector examples, не нормативный эталон definitive.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.

## Как использовать

- Сначала сопоставить страну, период, редакцию, объект и границы с нашим кейсом.
- Официальная форма задаёт структуру только для своей схемы и версии. Публичный заполненный отчёт показывает один конкретный случай.
- Не переносить чужие цифры, подписи, логотипы проверки и утверждения о сертификации в наш результат.
- Для проверки расчёта нужны исходные данные, коэффициенты и ожидаемый результат; одного красивого PDF недостаточно.
- Статус golden test: **не утверждён**. Отдельно согласовать контракт и критерии численной/содержательной приёмки.

[Требования и ограничения этого типа](../../../regulatory-requirements/reports/CBAM_DATA_PACKAGE.md) · [Контракт будущего E2E](../../../regulatory-requirements/RULE_MODEL.md)

Карточка сформирована из исследования; не редактировать параллельную копию фактов.
