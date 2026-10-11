# CSRD — CSRD / ESRS Data Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: EU corporate sustainability disclosure.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Omnibus окончательно одобрен 24.02.2026 [DS01]; stop-the-clock2025/794 уже принят [DS02]. Revised ESRS2026/1563 приняты 03.07 и опубликованы 21.09.2026 [DS03–DS04]. Заявленное применение — FY с 01.01.2027, раннее FY 2026 после вступления в силу [DS05]; точный commencement Article 2 требует ручной сверки.

Для нового EU scope ориентир: более 1 000 работников И net turnover более€450m; нужны группа/юрисдикция/отчётный год/национальная имплементация, отдельный non-EU test. Wave1 out-of-scope relief за 2025/26 проверяется по местному акту [DS01].

## Выдаваемый результат

Sustainability statement в management report: double materiality, применимые ESRS disclosures, политики/действия/цели/метрики и основания пропусков; assurance и формат публикации по применимому режиму [DS03].

## Входные данные

- Юрлицо, parent/group, EU/non-EU, net turnover, средняя численность, финансовый период, national transposition [DS01–DS02].
- Реестр impacts/risks/opportunities и документированная double materiality; value chain, политики, actions, targets, метрики и источники [DS03].
- Выбранная редакция ESRS, использованные reliefs, comparative data, evidence для assurance [DS03–DS05].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS01–DS05; правовой gate] Определять scope и reporting period до назначения обязательных полей; не применять EMP250 или €40m как текущий автоматический CSRD trigger.
- [DS03; правило стандарта] Для каждого пропуска сохранить materiality/relief rationale; не считать заполнение общего carbon inventory полным statement.
- [DS06; статус проекта] Не требовать draft2026 XBRL taxonomy как действующий filing rule.

## Проверка человеком

- Специалист по местному праву подтверждает transposition, exemptions и commencement [DS01–DS05].
- Ответственный за sustainability и assurance reviewer проверяют materiality, полноту narrative и согласование с финансовой отчётностью [DS03].

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение; DS01–DS05] Показать правовой scope отдельно от готовности данных и выбранную ESRS edition.
- [UX-предложение] Не обещать ESRS-compliant по одному проценту заполненности.
- Нужна полная модель scope по организации/группе, стране и периоду; грубые диапазоны анкеты и Check applicability не заменяют юридические тесты.
- generated/csrd.ts смешивает 207 полей нескольких схем; нет видимой связи field→параграф/редакция ESRS и основания materiality/relief.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: R1_SIZE/R1_REVENUE использовал 250 сотрудников/€40m и PUBLIC для категоричной рекомендации CSRD. Эти shortcuts и автоматический mandatory заменены предупреждением о проверке применимости.
- До CATALOG-01: user-facing.ts: безусловный subtitle ESRS-compliant annual disclosure завышает доказанный результат.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CSRD/README.md)

Valmet Oyj, Sustainability Statement за 2024; исходный financial report опубликован 27.02.2025. PDF 81 страница:2 — ESRS basis и phase-ins;21 — индекс disclosure requirements;41 — заполненная E1-6 (печатные 1/20/40). Историческая редакция ESRS для FY 2024, не revised ESRS 2026. Чужой отчёт — иллюстрация структуры, не golden reference и не доказательство правильности или применимости его раскрытий к другому эмитенту.

## Источники

- **DS01** [Council signs off simplification of sustainability reporting and due diligence requirements](https://www.consilium.europa.eu/en/press/press-releases/2026/02/24/council-signs-off-simplification-of-sustainability-reporting-and-due-diligence-requirements-to-boost-eu-competitiveness/) — Council of the EU; 2026-02-24; доступ: public. Финальное одобрение Omnibus. Текст Directive (EU) 2026/470 на EUR-Lex дважды не открылся из-за проверки JavaScript; национальная имплементация здесь не проверялась.
- **DS02** [Directive (EU) 2025/794 — stop-the-clock](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=oj%3AL_202500794) — European Union; 2025-04-14; OJ 2025-04-16; доступ: public. Отсрочка прежних волн 2/3 на два года; не заменяет последующие изменения круга обязанных лиц.
- **DS03** [Commission Delegated Regulation (EU) 2026/1563 — revised ESRS](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=oj%3AL_202601563) — European Commission / EUR-Lex; adopted 2026-07-03; OJ 2026-09-21; доступ: public. Полный текст первоначально был доступен; повторное открытие и альтернативный CELEX встретили JavaScript challenge. Точная дата вступления в силу Article 2 не извлечена; её нельзя вычислять по предположению.
- **DS04** [European Commission adopts revised ESRS and voluntary sustainability reporting standard](https://www.efrag.org/en/news-and-calendar/news/european-commission-adopts-revised-esrs-and-voluntary-sustainability-reporting-standard-efrag) — EFRAG; 2026-09-22; доступ: public. Подтверждает публикацию revised ESRS в Official Journal; июльское ожидание scrutiny больше не описывает стадию принятия.
- **DS05** [European Commission publishes delegated act on revised ESRS and voluntary sustainability reporting](https://www.efrag.org/en/news-and-calendar/news/european-commission-publishes-delegated-act-on-revised-esrs-and-voluntary-sustainability-reporting) — EFRAG; 2026-07-03; доступ: public. Объявленное применение: финансовые годы с 2027-01-01, раннее применение за 2026 после вступления в силу; июльский статус scrutiny исторический.
- **DS06** [ESRS XBRL Taxonomy — Exposure Draft Consultation](https://www.efrag.org/en/projects/esrs-xbrl-taxonomy/exposure-draft-consultation) — EFRAG; 2026-09-17; consultation through 2026-11-11; доступ: public. Draft taxonomy не равна вступившему в силу требованию цифровой разметки.
- **DS51** [Valmet Sustainability Statement 2024](https://www.valmet.com/globalassets/sustainability/documents/sustainability-statement--csrd/valmet_sustainability_statement_2024.pdf) — Valmet Oyj; FY 2024; included in financial report published 2025-02-27; historical ESRS before 2026 revision; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/valmet-sustainability-statement-2024.pdf). Реальный отчёт эмитента с официального сайта. Проверены PDF-страницы 2/21/41 (печатные 1/20/40): basis, индекс disclosures, E1-6. Образец структуры, не golden reference и не независимое подтверждение корректности. Проверка2026-10-11: 778781 bytes; HTTP MIME application/pdf; magic PDF; SHA256 4e7a1ea10522768d92dffc03ca60832382b16c6cb9d47be846536f4e53f768de.

## Сопоставление с кодом

Название в интерфейсе: **CSRD / ESRS Data Preparation**. Внутреннее имя шаблона: `CSRD / ESRS Data Preparation`.

В реестре кода: 207 уникальных полей, 172 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/csrd.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
