# CLIMATE_ACTION_PLAN — Climate Action Planning Data

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: Internal corporate climate transition planning.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Универсальной обязательной формы для этого кода не установлено. TPT — voluntary framework; IFRS S2 disclosure guidance не требует каждой организации создать transition plan [DS26–DS27]. Отдельные законы/контракты проверяются вне этого общего кода.

Внутренний план компании или согласованный с клиентом deliverable; цель/периметр/аудитория и framework выбираются явно.

## Выдаваемый результат

Утверждённый roadmap: baseline/targets, measures, responsible owners, milestones, resources, dependencies, risks и progress review; это рекомендуемый продуктовый результат на основе TPT [DS27].

## Входные данные

- Baseline/year/boundary и цели с отдельно показанными gross emissions/removals/credits [DS26–DS27; good practice].
- Реестр мер с owners, dates, abatement assumptions, capex/opex, dependencies и финансированием [DS27; good practice].
- Scenarios, риски исполнения, governance approvals и план мониторинга [DS26–DS27; good practice].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [UX-предложение на основе DS27] Каждая мера имеет owner, milestone и измеримый expected effect; не суммировать пересекающиеся эффекты без коррекции.
- [UX-предложение на основе DS26–DS27] Проверять единицы/базовый год/границы, согласование target trajectory с финансированием и assumptions.
- [DS26; граница нормы] Отдельно проверять требование disclose existing plan; не превращать его в универсальную обязанность иметь план.

## Проверка человеком

- Руководство/finance approve реалистичность бюджета и ответственность.
- Technical reviewer проверяет abatement и uncertainties; применимый regulatory disclosure отдельно смотрит counsel.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Называть внутренним планом с выбранной методикой; approval и implementation progress отделить от заполненности.
- generated/climate_action_plan.ts120 полей, но не содержит climate_action_measures_list, хотя включает EUETS и GRESB поля.
- Нет полноценного реестра action→owner→budget→milestone→impact→evidence.
- Не выбран planning framework и не отделён внутренний документ от внешнего disclosure.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CLIMATE_ACTION_PLAN/README.md)

IFRS S2 transition guidance66 pp и публичные TPT resources — reference для структуры. Универсальный официальный заполненный climate action plan не установлен; localPDF не выдаётся за такой пример.

## Источники

- **DS26** [Disclosing information about climate-related transition, including transition plans, in accordance with IFRS S2](https://www.ifrs.org/content/dam/ifrs/supporting-implementation/ifrs-s2/transition-plan-disclosure-s2.pdf) — IFRS Foundation; 2025-06; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/ifrs-s2-transition-plan-guidance-2025.pdf). 66 страниц: требования, иллюстрации и связь с TPT. Не вводит новое требование иметь transition plan; не универсальный заполненный отчёт. Проверка 2026-10-11: 1370695bytes; HTTP MIME application/pdf; magic PDF; SHA256 c90027041817e2e9bbaa7510843c29649e5e454cfce891718512e03bc2a39e8c.
- **DS27** [Transition Plan Taskforce resources](https://www.ifrs.org/sustainability/knowledge-hub/transition-plan-taskforce-resources/) — IFRS Foundation hosting TPT; TPT framework 2023; sector resources 2024; доступ: public. Пять элементов / 19 sub-elements: ориентир хорошей практики; hosting IFRS не делает TPT самостоятельным законом.

## Сопоставление с кодом

Название в интерфейсе: **Climate Action Planning Data**. Внутреннее имя шаблона: `Climate Action Planning Data`.

В реестре кода: 120 уникальных полей, 112 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/climate_action_plan.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
