# SBTI_COMMITMENT — SBTi Target Preparation

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: SBTi target-setting commitment and validation.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Corporate Net-ZeroV2 опубликованиюнь 2026; текущие подачи 2026 используют V1.3.1. Открытие validation V2 запланировано Q1 2027; переход не считать уже исполненным [DS37].

Corporate/SME/financial institution и sector/FLAG маршрут выбираются отдельно. Commitment, target preparation, submitted и validated — разные состояния [DS37].

## Выдаваемый результат

В зависимости от этапа: commitment evidence либо пакет целей/inventory/evidence для SBTi Services. Создание письма не означает validation [DS37–DS38].

## Входные данные

- Entity/group, sector/FLAG/financial status, выбранная standard edition, submission date/stage [DS37].
- Boundary/base year, scope 1/2/3 inventory, target coverage/years/method и evidence [DS38].
- Governance approvals, supporting calculation tools и документы для selected validation pathway [DS37–DS38].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS37; version gate] Для подачи 2026 не назначать preliminary V2 форму как обязательную active submission.
- [DS37; схема] Commitment≠validated target; verified status требует решения SBTi Services.
- [UX-предложение на основе DS38] Проверять coverage/base-year/target consistency по выбранной версии и sector route; не одним общим процентом required-fields.

## Проверка человеком

- Target-setting specialist проверяет boundary, coverage и sector criteria.
- Уполномоченное руководство одобряет commitment; SBTi Services отдельно валидирует цели [DS37].

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение; DS37] Всегда показывать version+stage; не использовать validated без evidence.
- generated/sbti_commitment.ts97 полей не содержит sbti_*fieldId, зато CDP/EcoVadis поля.
- Название подготовки к целям не заменяет отдельные стадии commitment/near-term/net-zero validation и их доказательства.
- Нет версионного маршрута V1.3.1 → V2 и sector-specific gates.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: Название Commitment Letter скрывает различия commitment/near-term/net-zero validation.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/SBTI_COMMITMENT/README.md)

Официальный XLSX предварительной подачи V2: instructions/company/governance/base year/GHG/targets/sector. Это справочный образец будущего процесса, не действующая форма 2026 и не подтверждение приёма.

## Источники

- **DS37** [The new Corporate Net-Zero Standard Version 2.0](https://sciencebasedtargets.org/corporate-net-zero-standard-v2) — SBTi; V2 published 2026-06; 2026 submissions V1.3.1; доступ: public. План: V2 validation Q1 2027; параллельный приём V1.3.1/V2 до 2028-01-31. Это опубликованный будущий график схемы, не уже работающая подача V2.
- **DS38** [Preliminary Submission Form — Corporate Net-Zero Standard V2](https://docs.sbtiservices.com/resources/PreliminarySubmissionFormCNZSV2.xlsx) — SBTi Services; V2 preliminary; downloaded 2026-10-11; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/sbti-v2-preliminary-submission.xlsx). Instructions прямо обозначают предварительную структуру и будущие изменения. Не current 2026 submission form и не commitment letter. Проверка 2026-10-11: 433072bytes; HTTP MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; magic OOXML XLSX; SHA256 7d700812845b0db6d6e843d5ccc86ddf1b1c70a360f4a2cb2dfef46aec3b8e1e.

## Сопоставление с кодом

Название в интерфейсе: **SBTi Target Preparation**. Внутреннее имя шаблона: `SBTi Target Preparation`.

В реестре кода: 97 уникальных полей, 89 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/sbti_commitment.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
