# CBAM_DATA_PACKAGE — CBAM Supplier Review Package

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Собственный supplier review profile cbam-supplier-review/1.0 реализован как internal workpaper. Он поддерживает подготовку данных, но не является statutory declaration, обязательным operator emissions report/summary или подтверждением верификации. Готовность означает комплектность для проверки получателем, а не юридическую готовность. [TR25, TR26]

Реализованный профиль: один продукт, одна производящая установка, один календарный год производства начиная с 2026; фактические даты покрытия не позднее даты проверки, неполный год явно provisional/YTD. CN проверяется только на восемь цифр. Юридическую применимость CBAM, CN/TARIC, происхождение, исключения, роль импортёра/представителя/оператора и 50 t порог необходимо устанавливать отдельно; это не критерий автоматического освобождения поставщика. [TR01, TR25, TR29]

## Выдаваемый результат

Реализован собственный downloadable supplier REVIEW ZIP: читаемое HTML-представление, data.json, values.csv, evidence.csv и README.txt; active values, ссылки на доказательства, предупреждения, период и версия набора данных. Это не официальный XLSX, обязательная форма или отправка через O3CI. Guided input, сохранение черновика и проверки находятся в [core profile](../../../src/lib/cbam/supplier-package.ts); [экспорт](../../../src/lib/cbam/supplier-package-export.ts); [контракт и границы](../CBAM_SUPPLIER_PACKAGE_CONTRACT.md). Полные monitoring plan/operator report/verification materials остаются внешними доказательствами, которые должны соответствовать своему назначению. [TR07, TR25, TR26]

## Входные данные

- Профиль продукта: получатель, составитель, роль поставщика; для trader отдельное юридическое наименование поставщика; оператор/контакт, имя/адрес/страна установки, продукт, CN8 и заявленный статус проверки классификации. Это минимальные поля нашей подготовки, а не универсальный statutory field list. [TR25, TR26]
- Год производства >=2026, фактическое начало/конец покрытия, явное описание границы процесса/атрибуции и уже учтённых релевантных прекурсоров. Полная нормативная методика требует дополнительных исходных данных и отраслевых условий; профиль их не выводит. [TR25, TR26]
- Сообщённый direct SEE в tCO2e/t goods, actual/default/mixed и ID источника; indirect отдельно reported либо not_applicable с обоснованием. Unknown блокирует готовность. Для default/mixed каждого активного компонента — sourceId, точная версия, строка таблицы и контекст markup. Необязательная масса партии в тоннах. [TR26, TR27]
- Реестр evidence: id/title/reference/version/period/owner/disclosure; заявленный verification status, условно verifier и evidence ID. Это ссылки, а не загруженные или проверенные приложением документы. [TR07, TR25]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: operator reporting calendar year; применение actual values требует подходящей аккредитованной верификации. Наш частичный/YTD review package не заменяет годовой operator report и не доказывает допустимость actual values. [TR25, TR26]
- Реализованные UX/инженерные проверки: комплектность активных полей, валидные даты в указанном году не позднее сегодня, CN8 syntax, поддерживаемая единица, конечные неотрицательные числа, zero != blank/unknown, уникальные evidence IDs и разрешение ссылок. Это наши gates подготовки, а не подтверждение нормативного расчёта. [TR25, TR26]
- Реализованная арифметика: optional lot tonnes × отдельно сообщённый direct SEE; независимо lot tonnes × reported indirect SEE. Нет direct+indirect total, повторного сложения прекурсоров, вычисления SEE, выбора/коррекции defaults или пересчёта функциональных единиц. [TR26, TR27]
- Реализованный review gate допускает actual without declared verification с явным предупреждением; declared_verified остаётся заявлением составителя. Неактивные условные строки сохраняются в draft и исключены из активных export assertions. Неоднозначные scalar datapoints блокируются. [TR25, TR26]

## Проверка человеком

- Подтверждены CN/юридическая применимость, период, границы процесса, производственные выходы и атрибуция? Можно ли восстановить SEE и chain of precursors из внешних первичных материалов без двойного счёта? [TR01, TR26]
- Применимы ли indirect treatment, exact default table/version/row/year/country и markup; соответствуют ли заявленная верификация, аккредитация и scope фактической установке/товару/периоду? [TR25, TR26, TR27]
- Согласованы передача коммерчески чувствительных сведений и права recipient/O3CI? Клиент принял именно наш review format и достаточность внешних evidence? Такая приёмка пока не подтверждена. [TR07, TR25]

## Риски текущего интерфейса и пробелы реализации

- Own supplier review ZIP != filed declaration, mandatory operator report, verification statement or official template. BOM/invoices сами по себе не универсально достаточны. [TR07, TR25, TR26]
- Ready for recipient review не означает legal-ready: actual/default/mixed, CN review и verification status заявлены пользователем; приложение не подтверждает методику, аккредитацию или точность исходных документов. Partial-year values provisional. [TR25, TR26]
- Текущая обязательная definitive-period operator form/summary и полное соответствие её структуре не реализованы; исторический 2024 workbook нельзя использовать как доказательство такого соответствия. O3CI/Registry submission отсутствует. [TR07, TR25]
- Нет подтверждённой внешней/клиентской приёмки собственного формата и независимого нормативного golden calculation. Синтетические unit/route/export tests подтверждают программное поведение в своём scope, а не compliance. [TR25, TR26]
- Профиль хранит ссылки на evidence; retrieval, проверка содержимого/прав, методический вывод SEE, goods-specific scope, accreditation check, функциональные единицы и специальные правила electricity не реализованы. Необходима проверка человеком. [TR25, TR26]

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM_DATA_PACKAGE/README.md)

Собственный review profile реализован: синтетические regression fixtures и локальный инженерный пример фактически скачанного browser ZIP приведены ниже. Они не являются независимым нормативным golden case или подтверждением приёмки клиентом. Локальный Communication XLSX 2024 исторический/transitional и не подменяет definitive-period mandatory operator form. Актуальный полный mandatory operator workbook не получен. Current guidance 3 содержит методические примеры; ни они, ни наш ZIP не являются заверенным клиентским package. Исторический illustrative filled sector ZIP не скачался за две попытки.

### Локальный инженерный пример

Синтетический инженерный пример собственного review profile: ZIP фактически скачан через браузер из приложения 11 октября 2026 года. Сохранены точный входной dataset и распакованные выходы. Для этой фикстуры масса 12 t, сообщённые direct SEE 2.5 и indirect SEE 0.5 tCO2e/t дают отдельно 30 и 6 tCO2e; данные частичного периода actual остаются заявленными и непроверенными. Это проверка программного поведения, не официальный CBAM sample, независимый нормативный golden case или клиентская приёмка. Статус golden test: не утверждён.

- [Скачанный review ZIP](../../qa/supplier-package-2026-10-11/downloaded-package.zip)
- [Читаемый HTML-пример](../../qa/supplier-package-2026-10-11/example/summary.html)
- [Точные входы — input-dataset.json](../../qa/supplier-package-2026-10-11/input-dataset.json)
- [Машиночитаемый результат — data.json](../../qa/supplier-package-2026-10-11/example/data.json)
- [Активные значения — values.csv](../../qa/supplier-package-2026-10-11/example/values.csv)
- [Ссылки на доказательства — evidence.csv](../../qa/supplier-package-2026-10-11/example/evidence.csv)
- [Описание содержимого и ограничений — README.txt](../../qa/supplier-package-2026-10-11/example/README.txt)
- [Проверяемые утверждения — verify-artifact.py](../../qa/supplier-package-2026-10-11/verify-artifact.py)

## Источники

- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.
- **TR04** [Implementing Regulation (EU) 2025/2547: embedded-emissions methods](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2547) — European Commission, EUR-Lex; 2025-12; доступ: public_access_problem. Открыта ELI и TXT-ссылка, обе JS-проверка. Использованы доступные официальные guidance TR25/TR26; необходима окончательная сверка Annexes закона.
- **TR07** [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR23** [CBAM communication template for installations](https://taxation-customs.ec.europa.eu/document/download/2c15cd0e-2447-4ef8-ab70-68b80b66ede8_en?filename=CBAM%20Communication%20template%20for%20installations_en_20241213.xlsx) — European Commission, DG TAXUD; 2024-12-13; webpage 2024-12-18; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-communication-template-20241213.xlsx). 19 sheets. Transitional supplier communication workbook; использовать только как исторический структурный ориентир и не как annual declaration за 2026.
- **TR25** [CBAM Guidance No. 2: quick guide non-EU operators](https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-2-operators-20260814.pdf). Definitive period; методический ориентир, не обязательный бланк.
- **TR26** [CBAM Guidance No. 3: methods for embedded emissions](https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf) — European Commission, DG TAXUD; 2026-08-14; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-guidance-3-methods-20260814.pdf). 147 pages; non-binding. Monitoring plan, boundaries, production processes, source streams, precursors; примеры/структуры иллюстративны.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.
- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR24** [CBAM communication template: sector examples](https://taxation-customs.ec.europa.eu/document/download/8d00a979-e57d-4e53-a11f-8b01370236a9_en?filename=Communication-template-examples.zip) — European Commission, DG TAXUD; 2024-06-20; доступ: public_download_failed. Ссылка найдена в открытой TR08; 429, затем premature response. Две попытки исчерпаны, ZIP не сохранён. Сам архив: illustrative sector examples, не нормативный эталон definitive.
- **TR27** [CBAM default values definitive period, corrected](https://taxation-customs.ec.europa.eu/document/download/1c05d211-80cb-4aaa-8ef0-e08005a95d7e_en?filename=DV%20correcting%20act_final%20update_06.08.xlsx) — European Commission, DG TAXUD; page 2026-08-10; filename 2026-08-06; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-default-values-20260810.xlsx). Информационный Excel; юридически обязательны 2025/2621 + correcting 2026/1740 из TR02. Не отчёт и не расчёт пользователя.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Supplier Review Package**. Внутреннее имя шаблона: `CBAM Supplier Review Package`.

В реестре кода: 34 уникальных полей, 23 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/cbam-data-package.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
