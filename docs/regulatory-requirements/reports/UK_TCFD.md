# UK_TCFD — UK Climate Disclosure Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: UK climate financial disclosure and UK SRS transition.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Текущие TCFD-aligned режимы различаются по issuer/sector. UK SRS опубликованы 25.02.2026; FCA final PS26/19 опубликован 30.09.2026, применяется к accounting periods с 01.01.2027, первые reports2028 [DS17–DS20].

Сначала определить FCA listing category, asset manager/asset owner regime либо Companies Act/LLP CFD. Последний включает отдельные >500 employee tests и для крупных private/LLP >£500m turnover; simple LSE flag недостаточен [DS17–DS20].

## Выдаваемый результат

Режимный annual disclosure: TCFD statement либо применимый UK SRS disclosure / comply-or-explain; сохранять basis, места cross-reference и причины исключений [DS17–DS20].

## Входные данные

- Listing category / legal entity / sector, отчётный период, headcount/turnover/group и применимый regime [DS17–DS20].
- Governance, strategy, material climate risks, scenario/resilience, metrics/targets и evidence [DS20,DS28].
- Для FY 2027+ выбранные UK SRS transition reliefs и причины comply-or-explain [DS18–DS19].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS18; временное правило] Учитывать один год Scope 3 relief и два года wider S1 relief для нового FCA режима; не считать все требования уже действующими для FY 2026.
- [DS17–DS20; правовой gate] Listed issuer, Companies Act CFD и financial-sector TCFD не сливать в один checklist.
- [DS28; framework] Сохранять mapping к 11 recommended disclosures и объяснения неприменимости для TCFD-пути.

## Проверка человеком

- UK counsel/company secretary выбирает режим и проверяет applicable listing category.
- Board/finance reviewer согласует resilience, targets и financial effects.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Нужен выбор режима и периода перехода 2027/2028; пояснение в каталоге не заменяет regime selector.
- Нужны проверяемый выбор listing/entity regime и версия требований по отчётному периоду; предупреждение о применимости не выполняет эти проверки.
- generated/uk_tcfd.ts:110 полей без versioned UK SRS transition mapping, с посторонними B Corp полями.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: user-facing.ts ограничивает описание premium listings и обещает PRA/FCA-ready без определения режима.
- До CATALOG-01: rules.ts трактует LSE/запрос регулятора как универсальную обязанность.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/UK_TCFD/README.md)

TCFD workshop: National Grid governance excerpt. Подходит как пример подачи governance для legacy TCFD; не полный UKCFD/UK SRS compliance example.

## Источники

- **DS17** [Sustainability reporting requirements](https://www.fca.org.uk/firms/climate-change-sustainable-finance/reporting-requirements) — FCA; updated 2026-09-30; доступ: public. Различает listed issuers и asset managers / regulated asset owners.
- **DS18** [PS26/19 — Aligning listed issuers sustainability disclosures with international standards](https://www.fca.org.uk/publications/policy-statements/ps26-19-aligning-listed-issuers-sustainability-disclosures-international-standards) — FCA; published 2026-09-30; accounting periods from 2027-01-01; доступ: public. Final rules, первые отчёты в 2028; scope 3 relief один год, wider S1 два года. Отдельная Technical Note ещё консультируется до 2026-10-28.
- **DS19** [UK Sustainability Reporting Standards S1 and S2](https://www.gov.uk/government/publications/uk-sustainability-reporting-standards-uk-srs-s1-and-uk-srs-s2) — UK Government; published 2026-02-25; доступ: public. Публикация стандарта не означает обязанность каждой UK-компании: нужен применимый режим.
- **DS20** [Climate-related financial disclosures for companies and LLPs](https://www.gov.uk/government/publications/climate-related-financial-disclosures-for-companies-and-limited-liability-partnerships-llps) — DESNZ / BEIS; published 2022-02-21; financial years from 2022-04-06; доступ: public. Пояснение SI 2022/31 и SI 2022/46: отдельный Companies Act / LLP regime, не все LSE-листинги и не только premium.
- **DS28** [TCFD Publications](https://www.fsb-tcfd.org/publications/) — Task Force on Climate-related Financial Disclosures; recommendations 2017; implementing annex 2021; archived 2023-11; доступ: public. TCFD завершила работу 2023-10-12. Annex2021 заменяет 2017. Workshops2022 включают реальные раскрытия; это не актуализируемый орган сертификации.
- **DS29** [TCFD Governance Workshop — examples of disclosures](https://assets.bbhub.io/company/sites/60/2022/02/TCFD-Governance-Workshop.pdf) — TCFD; 2022-02; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/tcfd-governance-workshop-2022.pdf). Слайд 13: выдержка National Grid Annual Report2020/21; слайды с примерами показывают только governance, не весь TCFD report. Проверка 2026-10-11: 1367610bytes; HTTP MIME application/pdf; magic PDF; SHA256 822842fe37e7b019f83e718128facd0aa2d4bc7ad44fc25a206353c5b8012d3c.

## Сопоставление с кодом

Название в интерфейсе: **UK Climate Disclosure Preparation**. Внутреннее имя шаблона: `UK Climate Disclosure Preparation`.

В реестре кода: 110 уникальных полей, 81 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/uk_tcfd.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
