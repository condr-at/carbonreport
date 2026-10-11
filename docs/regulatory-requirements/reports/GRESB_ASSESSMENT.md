# GRESB_ASSESSMENT — GRESB Assessment Preparation

Проверено: **2026-10-11**. Категория: `assessment`. Семейство: GRESB real asset ESG assessment.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Ежегодная добровольная investor-driven assessment. Для 2026 official guidance перенесена в GRESB Guides; realestate и несколько infrastructure assessment types различаются [DS42–DS43].

Выбрать assessment year и тип: Real Estate, Infrastructure Fund/Asset/Development и др.; portfolio/entity boundary определяется выбранной схемой [DS42–DS44].

## Выдаваемый результат

Portal assessment + asset data и evidence; GRESB выдаёт benchmark/score. Сервис может подготовить submission package, но не собственный официальный рейтинг.

## Входные данные

- Assessment type/year, reporting entity/portfolio и asset inventory с GAV/GFA/ownership dates [DS44–DS45].
- Energy/GHG/water/waste, coverage, certifications/efficiency measures по активам [DS45].
- Policies/governance, indicator evidence и aggregation status выбранного assessment [DS42–DS44].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS44; импорт] Сохранять workbook schema/IDs; public reference XLSX не импортировать.
- [DS44; boundary] Купленные/проданные в году assets отражать с датами владения, не удалять проданные как способ исключения.
- [DS44; submission] Различать blocking errors и outliers; перед submission выполнить aggregation из asset portal.

## Проверка человеком

- Portfolio manager подтверждает boundary, ownership и floor-area/coverage.
- GRESB response owner проверяет evidence и окончательную portal submission; официальный validation/scoring остаётся GRESB.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение] Выбор года/assessmenttype до списка данных; reference template и import-ready export помечать отдельно.
- Нейтральное название подготовки не подтверждает поддержку разных assessment types; тип, год и модель данных должны быть согласованы отдельно.
- 106 полей на корпоративном уровне не заменяют asset-level workbook с coverage/ownership periods.
- Нет подтверждённой схемы 2026 import и ответа по каждому indicator.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: UI обещает realestate/infrastructure, generated/gresb_assessment.ts именует только RealEstate.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/GRESB_ASSESSMENT/README.md)

2026RealEstate public Asset Spreadsheet3.10MB — справочный защищённый XLSX, явно не импортируемый. Для реальной подачи нужен экспорт участника из Asset Portal. Не маппировать автоматически на infrastructure.

## Источники

- **DS42** [2026 GRESB Assessment resources and training](https://www.gresb.com/gresb-assessment-resources-and-training/) — GRESB; 2026; доступ: public. Real Estate и отдельные Infrastructure Fund / Asset / Development. Legacy2025 PDF нельзя выдавать за форму 2026.
- **DS43** [GRESB Guides](https://guides.gresb.com/) — GRESB; 2026; доступ: public. Публичный новый каталог проверен. Часть старых ссылок 2026 переименована; использованы найденные действующие страницы.
- **DS44** [Real Estate Assessment — Asset Portal Guide](https://guides.gresb.com/completingassessments/prepare/setup/asset-portal-guide) — GRESB; 2026; доступ: public. Публичный reference XLSX защищён и не импортируется; рабочая таблица выгружается из портала участника. Сохранены screenshots/worksheet distinctions только как описание, без доступа к частным данным.
- **DS45** [2026 Real Estate Asset Spreadsheet — public reference version](https://1003802410-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLeIqEQuq8sE79mOd8GRV%2Fuploads%2FyixuUEcVXwwvCr2cp8Fz%2F2026_Real_Estate_Asset_Spreadsheet_public.xlsx?alt=media&token=d538477a-a332-4a00-9a9b-832c2b7a219e) — GRESB; 2026; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/gresb-public-asset-spreadsheet-2026.xlsx). Публичная CDN-ссылка из DS44. Disclaimer: For Reference Only. Лист Структура листов и текст Disclaimer проверены без изменения/снятия защиты. Проверка 2026-10-11: 3098263bytes; HTTP MIME application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; magic OOXML XLSX; SHA256 9f7ce8180948a595eefc2d7a7cf59c3e3acea582db5728775752b860f6e344b7.

## Сопоставление с кодом

Название в интерфейсе: **GRESB Assessment Preparation**. Внутреннее имя шаблона: `GRESB Assessment Preparation`.

В реестре кода: 106 уникальных полей, 81 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/gresb_assessment.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
