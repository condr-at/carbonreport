# TCFD_REPORT — TCFD Disclosure Preparation

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: Legacy TCFD recommendations.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Рекомендации 2017 и implementation annex2021; TCFD распущена 12.10.2023, сайт архивный сноября 2023. Мониторинг передан IFRS Foundation [DS28].

Добровольный investor/client-requested TCFD narrative; там, где TCFD встроена в закон, выбирать отдельный местный regime [DS28,DS17].

## Выдаваемый результат

Четыре pillars и 11 recommended disclosures с index/cross-references: governance, strategy, risk management, metrics/targets [DS28].

## Входные данные

- Boundary/period/audience, governance responsibilities, climate risks/opportunities и scenarios [DS28].
- Risk process, GHG metrics, targets/progress и locations существующих раскрытий [DS28].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS28; добровольный framework] Проверить покрытие 11recommendations, включая причины пропусков и cross-references.
- [DS23,DS28; scope] Не называть TCFD-only документ полным IFRS S2 report или юридическим compliance во всех странах.
- [UX-предложение; контекст DS28] Различать подтверждённые факты и планируемые действия; ссылки должны вести к конкретным страницам.

## Проверка человеком

- Board/risk owner подтверждает содержание; юрист проверяет claims и местную обязательность.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение; DS28] Метка legacy framework и направление к ISSB/local regime при необходимости.
- Нужна явная фиксация выбранного legacy framework либо применимого local regime; снятие обещания single PDF не создаёт такую модель.
- generated/tcfd_report.ts112 полей включает CSRD и RE100 вместо явной структуры 11 disclosures.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: user-facing.ts single PDF не раскрывает legacy status и ограниченность международной применимости.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/TCFD_REPORT/README.md)

Governance workshop2022 содержит реальные опубликованные excerpts, в том числе National Grid2020/21 на с.13. TCFD предупреждает, что это иллюстрации, не endorsement и не весь report.

## Источники

- **DS28** [TCFD Publications](https://www.fsb-tcfd.org/publications/) — Task Force on Climate-related Financial Disclosures; recommendations 2017; implementing annex 2021; archived 2023-11; доступ: public. TCFD завершила работу 2023-10-12. Annex2021 заменяет 2017. Workshops2022 включают реальные раскрытия; это не актуализируемый орган сертификации.
- **DS29** [TCFD Governance Workshop — examples of disclosures](https://assets.bbhub.io/company/sites/60/2022/02/TCFD-Governance-Workshop.pdf) — TCFD; 2022-02; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/tcfd-governance-workshop-2022.pdf). Слайд 13: выдержка National Grid Annual Report2020/21; слайды с примерами показывают только governance, не весь TCFD report. Проверка 2026-10-11: 1367610bytes; HTTP MIME application/pdf; magic PDF; SHA256 822842fe37e7b019f83e718128facd0aa2d4bc7ad44fc25a206353c5b8012d3c.
- **DS23** [IFRS S2 Climate-related Disclosures](https://www.ifrs.org/issued-standards/ifrs-sustainability-standards-navigator/ifrs-s2-climate-related-disclosures/) — IFRS Foundation / ISSB; issued 2023; standard effective 2024-01-01; доступ: public. Публичный каталог и описание. Полный licensed navigator может требовать аккаунт; обход не выполнялся.
- **DS17** [Sustainability reporting requirements](https://www.fca.org.uk/firms/climate-change-sustainable-finance/reporting-requirements) — FCA; updated 2026-09-30; доступ: public. Различает listed issuers и asset managers / regulated asset owners.

## Сопоставление с кодом

Название в интерфейсе: **TCFD Disclosure Preparation**. Внутреннее имя шаблона: `TCFD Disclosure Preparation`.

В реестре кода: 112 уникальных полей, 98 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/tcfd_report.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
