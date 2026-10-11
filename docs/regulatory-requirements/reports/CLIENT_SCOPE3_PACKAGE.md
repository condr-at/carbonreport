# CLIENT_SCOPE3_PACKAGE — Client Scope 3 Data Preparation

Проверено: **2026-10-11**. Категория: `client_defined`. Семейство: Client / supplier data exchange.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Договорный пакет данных; формат и границы определяет получатель. PACT — возможный согласованный профиль обмена, а не обязательная форма для всех клиентов.

Поставщик передаёт заказчику данные для определённой категории Scope 3; сначала выяснить, нужен PCF продукта, активность, расходы или корпоративная инвентаризация.

## Выдаваемый результат

Согласованный dataset + методика, период, границы, единицы и evidence; JSON PACT только при договорённости.

## Входные данные

- Запрос получателя и категория Scope 3
- Идентификаторы компании/продукта и период
- Значение PCF либо activity/spend; единица и объём поставки
- Методика, границы, источники/качество и разрешение передачи

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Уточнить ожидаемый формат до ввода: отсутствие формы не выбирать за клиента [CE01].
- При PACT сопоставить выбранную версию schema, declared unit, system boundary и metadata [CE01, CE03].
- Не выдавать корпоративные Scope 1–3 за PCF поставляемого продукта; это разные объекты [CE01].
- Валидация/подпись поставщика и PCF verification имеют отдельные статусы [CE01].

## Проверка человеком

- Получатель подтверждает структуру и границы; специалист проверяет методику PCF, если она входит в результат.

## Риски текущего интерфейса и пробелы реализации

- Совместимость с PACT API не реализована и не следует из набора полей.
- Нужны профиль получателя, версия формы, сопоставление полей/единиц и реальная выгрузка.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CLIENT_SCOPE3_PACKAGE/README.md)

Официальные модель/схема PACT сохранены; не образец любого клиентского запроса.

## Источники

- **CE01** [PACT Technical Specifications for PCF Data Exchange](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/) — WBCSD PACT; 3.0.3; checked 2026-10-11; доступ: public. Technical exchange specification, not a universal client questionnaire or independent verification.
- **CE02** [PACT Simplified Data Model](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/pact-simplified.xlsx) — WBCSD PACT; 3.0.3 snapshot 2026-10-11; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/pact-v3.0.3-data-model.xlsx). Dictionary/workbook, not a filled client report; latest URL is mutable.
- **CE03** [PACT OpenAPI including examples](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/openapi.yaml) — WBCSD PACT; 3.0.3 (verified info.version); доступ: public. [Локальный материал](../../report-reference/assets/client-energy/pact-v3.0.3-openapi.yaml). Source schemas and example values for an agreed PACT exchange. Does not implement PCF calculation.

## Сопоставление с кодом

Название в интерфейсе: **Client Scope 3 Data Preparation**. Внутреннее имя шаблона: `Client Scope 3 Data Preparation`.

В реестре кода: 70 уникальных полей, 66 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/client_scope3_package.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/client-energy.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
