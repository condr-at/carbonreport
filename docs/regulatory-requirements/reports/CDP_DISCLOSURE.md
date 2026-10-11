# CDP_DISCLOSURE — CDP Disclosure Preparation

Проверено: **2026-10-11**. Категория: `assessment`. Семейство: CDP annual environmental questionnaire.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Добровольная/requested схема CDP, версия 2026; corporate disclosure интегрирует environmental topics и tailoring. Это не самостоятельный закон и не только investor climate questionnaire [DS30–DS33].

Company request/self-selection, Full или SME, activity classification, запрошенные темы и дополнительные initiative/supply-chain questions определяют фактическую анкету [DS30–DS33].

## Выдаваемый результат

Ответ на active tailored questionnaire в CDP portal с evidence; score выдаёт CDP после своего процесса, не генератор PDF [DS30–DS33].

## Входные данные

- Reporting year, requester, Full/SME eligibility, revenue/headcount/activity и тематический маршрут [DS32].
- Governance/strategy/risks, environmental inventories/targets и sector-specific answers по active question IDs [DS31].
- Evidence, response approval, disclosures/privacy choice и submission status [DS30–DS33].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS31–DS33; правило схемы] Проверять year+questionnaire path+questionID; не использовать 2025 form как 2026.
- [DS32; routing] Изменение setup может менять вопросы; пересчитать coverage без потери предыдущих ответов.
- [UX-предложение на основе DS30] Data readiness, portal submission и CDP score — разные статусы.

## Проверка человеком

- CDP response owner подтверждает активную анкету/visibility и подписывает ответ.
- Technical reviewer сверяет evidence, units, boundaries и scoring guidance выбранного года.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Название CDP2026 Environmental Disclosure, с Full/SME и тематическими бейджами.
- generated/cdp_disclosure.ts139 полей без year/questionID routing; присутствуют SFDR/HKEX/CSRD поля.
- Нет подтверждённого экспорта, принимаемого CDP, и отделения approval/submission/scoring.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: user-facing.ts Investor version / Climate Questionnaire слишком узко.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CDP_DISCLOSURE/README.md)

Скачаны 2026overview40 pp и setup preview13 pp. Это реальные материалы CDP, но не все tailored questions и не пример полного ответа компании; финальная конфигурация в портале.

## Источники

- **DS30** [How to disclose — 2026 corporate questionnaire resources](https://www.cdp.net/en/disclose/how-to-disclose) — CDP; 2026 reporting cycle; доступ: public. Full / SME, отраслевые и тематические маршруты. Публичные media links получены из HTML каталога, без доступа к аккаунтам.
- **DS31** [CDP Full Corporate Questionnaire Overview 2026](https://www.cdp.net/api/media/3MFY5gykVQn8pxHfuLWsHJ?locale=en) — CDP; 2026; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/cdp-corporate-overview-2026.pdf). 40 страниц, год проверен внутри PDF. Обзор структуры не равен всем вопросам tailored questionnaire. Проверка 2026-10-11: 947553bytes; HTTP MIME application/pdf; magic PDF; SHA256 65bf50ac64d1fe06ab8fd0ef193143e9cbc5000669d0a67c4f2ba2368c3e4939.
- **DS32** [CDP Corporate Questionnaire setup — 2026 Preview](https://www.cdp.net/api/media/2qFFBStRlvdvUVZsbBpFga?locale=en) — CDP; 2026; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/cdp-questionnaire-setup-preview-2026.pdf). 13 страниц, реальные setup questions и варианты ответов; не полный заполненный ответ и не результат scoring. Проверка 2026-10-11: 553113bytes; HTTP MIME application/pdf; magic PDF; SHA256 3bebcd66b263ff829ed3a5e838d683aec57a2e4739baf50a4c02a7f24830399e.
- **DS33** [Accessing CDP questionnaires and guidance](https://help.cdp.net/en-US/knowledgebase/article/KA-01025) — CDP Help Center; 2026 cycle checked 2026-10-11; доступ: public. Индивидуальный questionnaire определяется в портале. Универсальная форма не заменяет активную конфигурацию участника.

## Сопоставление с кодом

Название в интерфейсе: **CDP Disclosure Preparation**. Внутреннее имя шаблона: `CDP Disclosure Preparation`.

В реестре кода: 139 уникальных полей, 122 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/cdp_disclosure.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
