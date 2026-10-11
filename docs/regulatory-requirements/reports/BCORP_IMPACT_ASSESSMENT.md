# BCORP_IMPACT_ASSESSMENT — B Corp Assessment Preparation

Проверено: **2026-10-11**. Категория: `assessment`. Семейство: B Lab B Corp certification assessment.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Новые стандарты опубликованы 08.04.2025, переход к сертификации начался 2026; первые certifications по ним объявлены 16.06.2026 [DS47–DS49]. Старое правило 80 points нельзя универсально применять к новым требованиям.

Certification/recertification cohort, company size/sector/location, foundation eligibility и risk profile определяют применимые требования; точную edition подтвердить в BImpact [DS46,DS48,DS50].

## Выдаваемый результат

Evidence/readiness pack по foundation и семи impact topics, затем независимая проверка/решение сертификации. Это не один carbon report и не самостоятельно созданный сертификат [DS46–DS49].

## Входные данные

- Юрлицо/возраст/structure, country/sector/size, certification cohort и legal stakeholder-governance requirements [DS46,DS48].
- Evidence по семи impact topics, risk profile, governance и применимым minimum requirements [DS46].
- Owners, implementation dates, improvement milestones и независимые verification findings [DS48–DS49].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS46–DS48; схема] Проверять отдельные mandatory requirements применимого профиля; не заменять общей суммой 80.
- [DS48; version gate] Сохранять edition/cohort и official portal requirements, не смешивать legacy BIA с new standards.
- [UX-предложение; контекст DS46] Сертификационный статус менять только по подтверждению B Lab/уполномоченного verification process.

## Проверка человеком

- B Corp lead/legal проверяет eligibility и stakeholder governance.
- Независимый verifier оценивает соответствие; generator только готовит evidence [DS49].

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Разделить readiness/evidence submission/certified; явно указать новую модель требований.
- generated/bcorp_impact_assessment.ts95 полей содержит EUETS/SFDR/aviation и лишь отдельные social metrics.
- Нет семи topic-specific requirement lists, foundation/risk gates и cohort/version selection.
- Код B CorpImpactAssessment не подтверждает покрытие текущей сертификационной модели.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/BCORP_IMPACT_ASSESSMENT/README.md)

Публичные standards/resources найдены; общий заполненный BImpactform не получен. Download page открылся черезweb, прямой fetch403; PDF не скачан. Closed assessment portal не обходился; точная V2.1 не заявляется.

## Источники

- **DS46** [B Lab Standards — Performance Requirements](https://www.bcorporation.net/en-us/standards/performance-requirements/) — B Lab; new standards launched 2025; transition2026; доступ: public. Семь impact topics и обязательные минимумы; не только климатическая анкета.
- **DS47** [B Lab publishes new B Corp standards](https://www.bcorporation.net/en-us/news/press/b-lab-publishes-new-b-corp-standards-raising-the-bar-for-businesses-worldwide/) — B Lab; 2025-04-08; доступ: public. Новый подход заменяет накопление баллов пороговыми требованиями по темам; не переносить старое правило 80 points автоматически.
- **DS48** [B Corp Certification Hub](https://www.bcorporation.net/en-us/standards/certification-hub/) — B Lab; updated 2026-01-27; доступ: public. Путь зависит от certification / recertification cohort; foundation requirements, risk profile, применимые impact requirements.
- **DS49** [Companies achieve B Corp certification under new global standards](https://www.bcorporation.net/en-us/news/press/companies-achieve-b-corp-certification-under-new-global-standards/) — B Lab; 2026-06-16; доступ: public. Первые сертификации по новым стандартам состоялись; independent verification не выполняется генератором документов.
- **DS50** [Download B Lab Standards](https://www.bcorporation.net/en-us/eos/download/) — B Lab; catalog checked 2026-10-11; доступ: public_catalog_download_unavailable. Web-страница описывает PDF разделов. Прямой fetch получил 403; PDF не получен, точная редакция V2.1 здесь не подтверждена и не фиксируется.

## Сопоставление с кодом

Название в интерфейсе: **B Corp Assessment Preparation**. Внутреннее имя шаблона: `B Corp Assessment Preparation`.

В реестре кода: 95 уникальных полей, 85 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/bcorp_impact_assessment.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
