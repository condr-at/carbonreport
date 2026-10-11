# SFDR — SFDR Entity PAI — Initial Inputs

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: EU financial market entity PAI.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

SFDR Article 4 и RTS2022/1288/Annex I действуют; Council position24.06.2026 по реформе не равна принятой замене [DS12–DS16].

Entity PAI относится к FMP, которые обязаны учитывать PAI (>500 сотрудников либо parent large group по Article 4(3)/(4)) или выбрали это; для остальных работает Article 4(1) disclosure/explanation. Не выводить обязанность из AUM€500m [DS12].

## Выдаваемый результат

Entity-level principal adverse sustainability impacts statement по Annex I; product Article 8/9/11 annexes — отдельный вид результата [DS13–DS15].

## Входные данные

- FMP/adviser legal type, employee/group test, voluntary PAI election и reporting year [DS12].
- Investee holdings/valuations и данные PAI: environmental и social, не только собственный scope 1/2; quarter-end snapshots, coverage/missing-data estimates [DS13].
- Due diligence/engagement policies, приоритеты, действия и historical comparison [DS13].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS12; правовой gate] Entity-level PAI не назначать по произвольному AUM; product classification не заменяет entity test.
- [DS13; расчёт] Применять определения/denominators Annex I и среднее quarter-end impacts по Article 6, а не годовую сумму emissions самой фирмы.
- [DS13–DS15; форма] Table 1 и требуемые дополнительные индикаторы Tables 2/3, explanations/actions заполнять по актуальному RTS; сверить публикацию к 30June за предыдущий календарный год.

## Проверка человеком

- Compliance/legal определяет Article 4 scope и применимую редакцию RTS.
- Investment-data specialist проверяет aggregation, EVIC/denominators, coverage и estimates.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] В выборе результата явно разделить entity PAI и product disclosures.
- Check applicability не реализует полный Article 4 employee/group/opt-in test и определение применимого результата; эти условия остаются для формализации.
- generated/sfdr.ts:50 полей, нет ни одного sfdr_* fieldId; присутствуют SEC climate и hkex_esg_compliance_level.
- Нет явной структуры holdings→quarterly PAI indicators→Annex I tables; корпоративный inventory её не заменяет.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: R8 назначал SFDR по finance+AUM500m+. AUM-shortcut и категоричная рекомендация заменены предупреждением о проверке применимости.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SFDR/README.md)

Официальный редактируемый Annex I DOCX. Это entity PAI, не Article 8/9 pre-contractual или periodic product template; перед выпуском сверить с authentic OJ [DS14].

## Источники

- **DS12** [Regulation (EU) 2019/2088 — Article 4](https://eur-lex.europa.eu/eli/reg/2019/2088/2020-07-12/eng) — European Union; consolidated 2020-07-12; доступ: public. Доступная консолидированная редакция для entity-level PAI; не выдана за полную консолидацию всех актов на 2026 год.
- **DS13** [Commission Delegated Regulation (EU) 2022/1288 — RTS and Annex I](https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32022R1288) — European Commission; 2022-04-06; applicable from 2023-01-01; доступ: public. Annex I — entity PAI; Annexes II–V — отдельные product disclosures. Официальный OJ имеет приоритет над редактируемыми копиями.
- **DS14** [Principal adverse impact and product templates for SFDR](https://www.eiopa.europa.eu/publications/principal-adverse-impact-and-product-templates-sustainable-finance-disclosure-regulation_en) — EBA / EIOPA / ESMA; 2022-07-26; updated 2023-03-23; доступ: public. Web fetch получил 429; прямое публичное HTML открытие удалось. Каталог предоставляет DOCX Annex I и отдельные product templates.
- **DS15** [Annex I — principal adverse sustainability impacts statement, editable template](https://www.eiopa.europa.eu/document/download/9a7fd137-3cc6-4324-834a-6272350353d1_en?filename=C%202022%201931%20annex%201%20principal%20adverse%20sustainability%20impacts%20statement.docx) — European Supervisory Authorities / EIOPA; catalog file 2023-01-31; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/sfdr-annex-i-pai-template.docx). Настоящая незаполненная форма PAI, не пример достижения показателей. Проверка 2026-10-11: 154284bytes; HTTP MIME application/vnd.openxmlformats-officedocument.wordprocessingml.document; magic OOXML DOCX; SHA256 d171c1bf9ac20397b5e833ee463d84c98d6ea65a52cb3531e39e24496097fe3f.
- **DS16** [Council agrees position on simpler transparency rules for sustainable financial products](https://www.consilium.europa.eu/en/press/press-releases/2026/06/24/council-agrees-position-on-simpler-transparency-rules-for-sustainable-financial-products/) — Council of the EU; 2026-06-24; доступ: public. Позиция Совета по реформе SFDR; сама по себе не замена действующим RTS.

## Сопоставление с кодом

Название в интерфейсе: **SFDR Entity PAI — Initial Inputs**. Внутреннее имя шаблона: `SFDR Entity PAI — Initial Inputs`.

В реестре кода: 50 уникальных полей, 47 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/sfdr.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
