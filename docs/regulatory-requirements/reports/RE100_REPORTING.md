# RE100_REPORTING — RE100 Electricity Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: RE100 renewable electricity annual reporting.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Добровольное членское обязательство, criteriaMarch2025 и reporting guidanceJuly2026; отчёт через соответствующие CDP вопросы [DS39–DS41].

RE100 member, заявленный commitment scope и target year; electricity procurement eligibility по рынкам/инструментам/установкам [DS40–DS41].

## Выдаваемый результат

Годовой ответ RE100/CDP с сопоставлением потребления, подтверждённых renewable claims и progress; self-reported renewable share отличается от recognised share [DS41].

## Входные данные

- Группа/boundary/period, commitment/target year; total electricity и self-generation по стране/рынку [DS41].
- MWh закупок/генерации, технологии, instruments/EAC retirement, market/vintage/facility age, исключения/grandfathering [DS40].
- CDP2026 question IDs и breakdowns для проверки признанной renewable share [DS41].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS40; критерии схемы] Сверять market, vintage, ownership/retirement, eligible technology и age exceptions, а не только наличие сертификата.
- [DS41; расчёт] Ограничивать признанный объём потреблением market-by-market; исключать over-procurement и double counting.
- [UX-предложение; контекст DS39] Показывать reported/eligible/recognised MWh раздельно и причины непризнания.

## Проверка человеком

- Energy procurement specialist проверяет EAC/PPA, markets и exceptions.
- RE100 response owner утверждает состав группы и progress calculation.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Не приравнивать zero market-basedScope 2 или общую долю renewable energy к выполнению RE100.
- generated/re100_reporting.ts56 полей не содержит re100_*fieldId; смешивает тепло/пар и ESG поля.
- Нет структуры market→instrument→facility→vintage и формулы recognisedRE share.
- Не зафиксированы current technical criteria и reporting question IDs.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/RE100_REPORTING/README.md)

2026guide включает реальный mapping вопросов и учебную таблицу расчёта на с.19. Не полный публичный отчёт участника; criteria2025 скачаны отдельно как норматив схемы [DS40].

## Источники

- **DS39** [RE100 Technical Guidance & FAQs](https://www.theclimategroup.org/re100/technical-guidance) — Climate Group / RE100; technical criteria March2025; reporting guidance July2026; доступ: public. Старые критерии помечены superseded; дата имени файла не заменяет проверку версии внутри.
- **DS40** [RE100 Technical Criteria and Appendices](https://www.theclimategroup.org/hubfs/RE100/PDFs/RE100%20technical%20criteria%20+%20appendices%20(15%20April%202025).pdf?hsLang=en) — Climate Group / RE100; publication 2025-03-24; distributed filename 2025-04-15; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/re100-technical-criteria-2025.pdf). 45 страниц; правила происхождения, рынков, vintages, возраста установки и исключений. Проверка 2026-10-11: 1014729bytes; HTTP MIME application/pdf; magic PDF; SHA256 f3ee632e66ce10d42c2231bf50d03bb7f6f2fb8394afa02fbc3369059b8f257c.
- **DS41** [2026 RE100 Reporting Guidance](https://www.theclimategroup.org/hubfs/RE100/RE100%20Technical%20and%20FAQ/RE100%20Reporting%20Guidance%202026-2.pdf?hsLang=en) — Climate Group / RE100; 2026; catalog July2026; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/re100-reporting-guidance-2026.pdf). С.8–12 mapping вопросов CDP, с.19 расчётный пример market-by-market cap и признанной доли; не реальный отчёт конкретного участника. Проверка 2026-10-11: 603274bytes; HTTP MIME application/pdf; magic PDF; SHA256 ca61628af00db9c2ca370ea0aece98cb2972e30b28e2b1132ce3076186380e4d.
- **DS30** [How to disclose — 2026 corporate questionnaire resources](https://www.cdp.net/en/disclose/how-to-disclose) — CDP; 2026 reporting cycle; доступ: public. Full / SME, отраслевые и тематические маршруты. Публичные media links получены из HTML каталога, без доступа к аккаунтам.

## Сопоставление с кодом

Название в интерфейсе: **RE100 Electricity Data**. Внутреннее имя шаблона: `RE100 Electricity Data`.

В реестре кода: 56 уникальных полей, 50 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/re100_reporting.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
