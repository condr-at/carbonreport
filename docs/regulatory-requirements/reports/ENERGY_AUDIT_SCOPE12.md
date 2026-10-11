# ENERGY_AUDIT_SCOPE12 — Energy Audit Preparation

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: Energy audit / energy management.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Энергоаудит не равен инвентаризации Scope 1/2. Обязательный аудит определяется страной и схемой; ниже EU EED и UK ESOS как отдельные ветки.

EU: Article 11 связывает обязанности со средним потреблением за три года, включая все энергоносители; требуется национальная имплементация. UK: отдельные критерии ESOS и выбранная phase.

## Выдаваемый результат

Выдаваемый пакет зависит от схемы и способа выполнения требований. ESOS phase 4: при подходящем покрытии total/significant energy consumption сертификацией ISO 50001 отдельный ESOS report и lead assessor не требуются; evidence pack и MESOS notification сохраняются [CE10, §§7, 10–12]. В аудиторской ветке — отчёт, рекомендации и необходимые подписи.

## Входные данные

- Страна/схема/период и границы предприятия
- Для ESOS: данные qualification/group и исключений, покрытие ISO 50001; состав аудиторских полей зависит от выбранной ветки
- Энергопотребление по носителям/площадкам, счета, измерения
- Мероприятия, стоимость, экономия в энергии и деньгах
- Метод, аудитор/assessor, site visits и sign-off

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Не выводить обязанность из наличия Scope 1/2. Для ESOS проверить участие по §1.1: ≥250 работников — самостоятельный критерий, также есть финансовая ветка, правила групп и исключения; затем отдельно определить способ выполнения требований [CE10].
- При EU проверить >10 TJ / >85 TJ, трёхлетний период и национальные правила; точное положение проверить перед автоматизацией [CE09].
- Не использовать phase-3 форму для phase-4 без сверки [CE10].
- Для ESOS проверить условия ISO 50001 и нулевого энергопотребления до требования аудита/отчёта/lead assessor; не отменять оставшиеся notification/evidence обязанности [CE10, §§4.7, 7, 10–12].
- Для ESOS проверить требуемые сведения/подписи по A1/A2; A3 — предложенная форма рекомендаций, не весь отчёт [CE11, CE12].
- Не считать скачанный файл подтверждением подачи MESOS [CE13].

## Проверка человеком

- Квалифицированный аудитор/lead assessor, когда требуется схемой; ответственное руководство подписывает результат.

## Риски текущего интерфейса и пробелы реализации

- Нужен выбор страны и схемы; текущий заголовок Scope1&2 скрывает различие инвентаризации и аудита.
- Нет ветвления применимости, плана измерений/site visits, sign-off и схемы подачи; полная правовая проверка EU Annex VI/национального акта ещё нужна.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/ENERGY_AUDIT_SCOPE12/README.md)

Сохранены phase-4 A3 и B, официальный A1/A2 доступен по ссылке; это UK-примеры, не универсальный EU-аудит.

## Источники

- **CE09** [Energy Efficiency Directive, Article 11 and Annex VI](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02023L1791-20260805) — European Union; Consolidation 2026-08-05; доступ: public. EUR-Lex original act links to this consolidation; Article 11 thresholds/dates confirmed in indexed official Romanian text. Direct full text retrieval hit bot challenge, no local HTML saved. National transposition and current full clauses still require review.
- **CE10** [How to comply with ESOS phase 4](https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/how-to-comply-with-the-energy-savings-opportunity-scheme-esos-phase-4) — UK Environment Agency; Published 2026-07-30; доступ: public. Current phase-4 guidance; sections 1.1, 7 and 10 distinguish qualification from compliance route and ISO 50001 exemptions. Do not apply phase-3 forms uncritically.
- **CE11** [ESOS phase 4 report checklists A1/A2](https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/appendices-a1-and-a2-report-checklists-for-participants) — UK Environment Agency; Published 2026-07-30; доступ: public. 
- **CE12** [ESOS phase 4 recommendations template A3](https://assets.publishing.service.gov.uk/media/6a6b5e088319ab05f7caa248/ESOS_Appendix_A3_template.odt) — UK Environment Agency; Phase 4; landing page 2026-07-30; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/esos-phase4-recommendations-template.odt). Suggested presentation of recommendations, not the entire mandatory report.
- **CE13** [ESOS phase 4 notification fields, Appendix B](https://assets.publishing.service.gov.uk/media/6a69f658701b2d693e5b9422/ESOS_Appendix_B_phase_4.odt) — UK Environment Agency; Phase 4; landing page 2026-07-30; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/esos-phase4-notification-fields.odt). Fields for MESOS notification; portal submission is separate from report generation.

## Сопоставление с кодом

Название в интерфейсе: **Energy Audit Preparation**. Внутреннее имя шаблона: `Energy Audit Preparation`.

В реестре кода: 52 уникальных полей, 46 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/energy_audit_scope12.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/client-energy.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
