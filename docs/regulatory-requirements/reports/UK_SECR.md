# UK_SECR — UK SECR Data Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: UK energy and carbon reporting.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

SECR действует для периодов с 01.04.2019; руководство 2019 остаётся опубликованным [DS07–DS08]. Treasury2025–26 отдельно поясняет, что повышение общих company-size thresholds2025 не повысило SECR thresholds [DS09].

UK quoted companies; для unquoted/LLP тест как минимум двух из turnover>£36m, balance sheet>£18m, employees>250 с правилами групп/лет и исключениями. Проверить low energy use40MWh и иные разрешённые исключения [DS08–DS09].

## Выдаваемый результат

Энергия/выбросы, intensity ratio, comparatives, methodology и energy-efficiency actions в Directors Report либо LLP Energy and Carbon Report; quoted global/UK split отличается от unquoted UK boundary [DS08].

## Входные данные

- Quoted/unquoted/LLP, размер, группа, период и потребление для exemption test [DS08–DS09].
- Электричество/газ/transport fuels, территории, activity data, factors, gross emissions, intensity denominator и прошлый год [DS08].
- Методика, недоступные данные/оценки и действия по энергоэффективности [DS08].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS08–DS09; правовой gate] Не ограничивать SECR публичными компаниями или одним headcount test.
- [DS08; требования disclosure] Сверить kWh, tCO2e, boundary, intensity и comparison year; optional строки не делать statutory-required.
- [UX-предложение на основе DS08] Баланс энергии и единицы проверять отдельно от юридической полноты отчёта.

## Проверка человеком

- Company secretary/accountant подтверждает scope, групповые исключения и место раскрытия [DS08–DS09].
- GHG reviewer проверяет factors, estimates и intensity denominator [DS08].

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение; DS08] Сначала выбрать quoted/unquoted/LLP и границу UK/global.
- Маршрут Check applicability учитывает необходимость проверки unquoted/LLP; полные финансовые/групповые тесты, границы и исключения ещё требуют формализации.
- generated/uk_secr.ts:57 полей включают SEC attestation/issuer и shipping; нет связи с обязательными строками таблицы SECR.
- EUR revenue field не заменяет GBP turnover/balance sheet для scope.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: R4 ограничивал SECR триггером UK+PUBLIC+headcount. Локально добавлены маршруты проверки для других случаев; полные финансовые тесты остаются текущим пробелом.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/UK_SECR/README.md)

С.51–57 — официальные пустые отчётные таблицы и narrative examples; исторические годы внутри образца заменить своим периодом. Не готовая подача в Companies House.

## Источники

- **DS07** [Environmental reporting guidelines including mandatory GHG reporting guidance](https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance) — DESNZ / DEFRA / GOV.UK; updated 2019-03-29; доступ: public. Страница действующего руководства SECR; применять вместе с текущими законодательными тестами.
- **DS08** [Environmental Reporting Guidelines — SECR guidance](https://assets.publishing.service.gov.uk/media/67161e8696def6d27a4c9ab3/environmental-reporting-guidance-secr-march-2019.pdf) — UK Government; 2019-03; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/secr-guidance-2019.pdf). С. 51–57: иллюстративные таблицы quoted/unquoted, обязательные и добровольные строки; это не заполненный реальный отчёт компании. Проверка 2026-10-11: 1538540bytes; HTTP MIME application/pdf; magic PDF; SHA256 3ea42e20da70551094edd42a3cbde2188f3c25b38d33be184b6c4643d667c66f.
- **DS09** [Sustainability Reporting Guidance 2025–26, SECR section and footnote 5](https://www.gov.uk/government/publications/sustainability-reporting-guidance-2025-26/sustainability-reporting-guidance-2025-26) — HM Treasury; 2025–2026 reporting guidance; доступ: public. Уточняет: после увеличения company-size thresholds в апреле 2025 SECR больше не совпадает с общим определением large. Здесь используется только разъяснение SECR, не правила отчётности госсектора для всех компаний.

## Сопоставление с кодом

Название в интерфейсе: **UK SECR Data Preparation**. Внутреннее имя шаблона: `UK SECR Data Preparation`.

В реестре кода: 57 уникальных полей, 47 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/uk_secr.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
