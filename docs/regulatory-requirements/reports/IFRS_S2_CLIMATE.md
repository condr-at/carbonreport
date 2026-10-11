# IFRS_S2_CLIMATE — IFRS S2 Climate Data

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: ISSB climate disclosure standard.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

IFRS S2 standard действует для периодов с 01.01.2024; юридическая обязательность зависит от местного внедрения [DS23,DS25]. Поправки GHG опубликованыдекабрь 2025, применяются с FY 2027; early application разрешено [DS24].

Для добровольного заявления о соответствии нужен IFRS basis, включая связанные S1 requirements; для regulated use выбрать jurisdiction, entity scope, phase-in и локальные отличия [DS23–DS25].

## Выдаваемый результат

Climate-related financial disclosures: governance, strategy, risk management, metrics/targets и связь с financial reporting; не только GHG inventory [DS23,DS26].

## Входные данные

- Jurisdiction/adoption basis, reporting entity/period, chosen edition/reliefs [DS23–DS25].
- Material climate risks/opportunities, scenarios/resilience, current/anticipated financial effects [DS23,DS26].
- Scope1/2/3 inventory and assumptions, industry metrics, targets/progress, financed emissions where relevant [DS23–DS24].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS25; правовой gate] Standard effective date не равна дате обязательности в каждой стране; profile не путать с preliminary snapshot.
- [DS24; edition gate] Применять 2025GHG amendments с FY 2027 либо отмеченным early adoption; сохранить основания reliefs.
- [DS26; disclosure] Отсутствие transition plan не автоматически нарушение S2: проверить требуемую информацию о фактической стратегии и materiality.

## Проверка человеком

- ISSB/local reporting specialist подтверждает basis и полноту S1/S2.
- Finance/board reviewer проверяет financial effects, assumptions и consistency с accounts.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Выбрать jurisdiction и basis: voluntary IFRS / local mandate; показывать versioned reliefs.
- generated/ifrs_s2_climate.ts135 полей не образуют проверяемый S1/S2 paragraph map.
- Нет видимой настройки даты применения 2025 amendments и jurisdiction-specific scope.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: user-facing.ts ahead of jurisdictional mandates скрывает уже введённые режимы.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/IFRS_S2_CLIMATE/README.md)

June2025 implementation guidance с requirements/illustrations/TPT mapping; не универсальный completed IFRS S2 report и не certificate.

## Источники

- **DS23** [IFRS S2 Climate-related Disclosures](https://www.ifrs.org/issued-standards/ifrs-sustainability-standards-navigator/ifrs-s2-climate-related-disclosures/) — IFRS Foundation / ISSB; issued 2023; standard effective 2024-01-01; доступ: public. Публичный каталог и описание. Полный licensed navigator может требовать аккаунт; обход не выполнялся.
- **DS24** [ISSB issues targeted amendments to IFRS S2](https://www.ifrs.org/news-and-events/news/2025/12/issb-issues-targeted-amendments-ifrs-s2/) — IFRS Foundation / ISSB; 2025-12; effective periods from 2027-01-01; early application permitted; доступ: public. Изменения GHG disclosures, включая financed-emissions scope category15, industry classification и jurisdictional reliefs; версия должна фиксироваться по периоду.
- **DS25** [Use of IFRS Sustainability Disclosure Standards by jurisdiction](https://www.ifrs.org/ifrs-sustainability-disclosure-standards-around-the-world/use-by-jurisdiction/) — IFRS Foundation; updated 2026-09-24; доступ: public. Finalised profiles и preliminary snapshots различаются; местный закон, scope и reliefs проверяются отдельно.
- **DS26** [Disclosing information about climate-related transition, including transition plans, in accordance with IFRS S2](https://www.ifrs.org/content/dam/ifrs/supporting-implementation/ifrs-s2/transition-plan-disclosure-s2.pdf) — IFRS Foundation; 2025-06; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/ifrs-s2-transition-plan-guidance-2025.pdf). 66 страниц: требования, иллюстрации и связь с TPT. Не вводит новое требование иметь transition plan; не универсальный заполненный отчёт. Проверка 2026-10-11: 1370695bytes; HTTP MIME application/pdf; magic PDF; SHA256 c90027041817e2e9bbaa7510843c29649e5e454cfce891718512e03bc2a39e8c.
- **DS27** [Transition Plan Taskforce resources](https://www.ifrs.org/sustainability/knowledge-hub/transition-plan-taskforce-resources/) — IFRS Foundation hosting TPT; TPT framework 2023; sector resources 2024; доступ: public. Пять элементов / 19 sub-elements: ориентир хорошей практики; hosting IFRS не делает TPT самостоятельным законом.

## Сопоставление с кодом

Название в интерфейсе: **IFRS S2 Climate Data**. Внутреннее имя шаблона: `IFRS S2 Climate Data`.

В реестре кода: 135 уникальных полей, 105 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/ifrs_s2_climate.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
