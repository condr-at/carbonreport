# CBAM_ALLOWANCES — CBAM Certificate Planning

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: CBAM.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Внутренний реестр/прогноз CBAM certificates, не EU ETS allowances и не новая statutory форма.

CN/TARIC и непреференциальное происхождение; роль импортёра/indirect representative/operator; режим и год; exempt origins; суммарная годовая net mass охваченных cement/iron-steel/aluminium/fertilisers по импортёру. 50 t исключение не распространяется на electricity/hydrogen. [TR01, TR29]

## Выдаваемый результат

Ledger и forecast обязательств с reconciliation к registry; certificates приобретаются с 01.02.2027, обязательства по импорту 2026 погашаются до 30.09.2027. [TR29]

## Входные данные

- Annual imports и embedded emissions, actual/default route, benchmarks/adjustment, carbon-price-paid evidence [TR05, TR29]
- Certificate transactions, import quarter/year, applicable published prices, purchases/surrender/repurchase/cancellation and account balances [TR01, TR29]

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Норма: TR05 free allocation adjustment уменьшает surrender quantity; не выдаёт бесплатные CBAM allowances [TR05]
- Норма: CBAM certificates нельзя передавать другим лицам или использовать как EU ETS allowances [TR29]
- UX: forecast отделён от purchased/available/surrendered; quarterly balance control с 2027 отделён от annual declaration [TR07, TR29]

## Проверка человеком

- Сверены ли registry balance и операции, formula/benchmark/year, carbon price deduction и корректировки? [TR05, TR29]
- Точный календарь 50%-контроля и новые акты о carbon price deduction перепроверены по действующему праву до автоматизации? [TR02, TR29]

## Риски текущего интерфейса и пробелы реализации

- Не отображать forecast как приобретённые сертификаты или free allocation entitlement. [TR05, TR29]
- Поле cbam_free_allowances_quantity остаётся семантически неоднозначным; корректировка free allocation не равна бесплатной выдаче сертификатов импортёру. [TR05, TR29]
- Нет журналов transactions/reconciliation в плоском шаблоне, purchase/use required независимо от даты.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: Переименовать Allowance Ledger в CBAM Certificate Register/Forecast. [TR05, TR29]
- До CATALOG-01: user-facing.ts useWhen предлагал Plan free allocations; эта формулировка пользовательского каталога удалена. Семантика поля cbam_free_allowances_quantity остаётся текущим пробелом.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CBAM_ALLOWANCES/README.md)

Benchmarks XLSX — официальный справочник, не ledger template; обязательный универсальный ledger не обнаружен.

## Источники

- **TR01** [CBAM definitive regime](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en) — European Commission, DG TAXUD; страница проверена 2026-10-11; доступ: public. Открыта. Краткий обзор; исключения 50 т проверять по TR29, а не одной общей формулировке страницы.
- **TR05** [Implementing Regulation (EU) 2025/2620: free allocation adjustment](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R2620) — European Commission, EUR-Lex; 2025-12-16; OJ 2025-12-22; доступ: public. Текст открыт. Это уменьшение числа CBAM certificates к погашению, не выдача импортёру EU ETS allowances. Articles 1–4 и Annex.
- **TR07** [CBAM Registry](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-registry_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта; AMM, DRMC, O3CI. Сам реестр требует регистрации/EU Login 2FA. Подача не выполнялась.
- **TR28** [CBAM benchmarks definitive period](https://taxation-customs.ec.europa.eu/document/download/9877523c-2a02-4926-a211-aefae7cf6d0d_en?filename=CBAM%20Benchmarks_20260206.xlsx) — European Commission, DG TAXUD; file 2026-02-06; page 2026-02-13; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-benchmarks-20260206.xlsx). Информационная таблица benchmarks; юридический источник TR05, не бесплатные allowances импортёру.
- **TR29** [CBAM Questions and Answers](https://taxation-customs.ec.europa.eu/document/download/013fa763-5dce-4726-a204-69fec04d5ce2_en?filename=CBAM_Questions%20and%20Answers.pdf) — European Commission, DG TAXUD; 2026-05-28; доступ: public_downloaded. [Локальный материал](../../report-reference/assets/trade-transport/cbam-faq-20260528.pdf). 63 pages; объясняет сроки, thresholds, certificates, calculations; возможные редакционные неточности (например квартальная дата 31 October) не превращать в автоматическое правило без сверки закона.
- **TR02** [CBAM legislation and guidance](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en) — European Commission, DG TAXUD; проверено 2026-10-11; доступ: public. Открыта. Перечень 2023/956, 2025/2083, актов 2025/2546–2551, 2025/2620–2621 и корректировки default values 2026/1740; предложения выделены отдельно.

## Сопоставление с кодом

Название в интерфейсе: **CBAM Certificate Planning**. Внутреннее имя шаблона: `CBAM Certificate Planning`.

В реестре кода: 51 уникальных полей, 51 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/cbam_allowances.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/trade-transport.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
