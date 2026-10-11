# PPA_STRATEGY — PPA Planning Data

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: Renewable electricity procurement.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Стратегия PPA — коммерческий анализ; отчёт и договор требуют выбранного рынка и условий контрагентов.

Выбирающий физический или финансовый PPA покупатель электроэнергии.

## Выдаваемый результат

Сравнение вариантов и сценариев, распределение рисков, права на EAC и согласуемый term sheet.

## Входные данные

- Юрисдикция; physical/virtual PPA
- Профиль потребления/генерации, срок, объём, валюта и цены
- Права на атрибуты; settlement и ответственность за отклонения
- Кредитный риск, прекращение, изменения законодательства

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Не трактовать virtual PPA как физическую поставку электричества [CE07].
- Проверить передачу экологических атрибутов отдельно от оплаты электричества [CE08].
- Не обещать фиксированную экономию: показывать сценарии цены/генерации (наш контроль).

## Проверка человеком

- Профильный юрист и финансовая команда проверяют реальный договор и риски; сервис не подписывает контракт.

## Риски текущего интерфейса и пробелы реализации

- Подписанный PPA сам по себе не доказывает право на все заявленные green attributes.
- Текущие поля не образуют финансовую модель или договор; нужен отдельный scope.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/PPA_STRATEGY/README.md)

Официальные contract considerations — ориентир структуры; универсального PPA Strategy filing/template нет.

## Источники

- **CE07** [Green Power Supply Options](https://www.epa.gov/green-power-markets/green-power-supply-options) — US EPA; Live page checked 2026-10-11; доступ: public. Describes different procurement options; not a universal PPA contract.
- **CE08** [Guide to Purchasing Green Power, chapter 6: Contracting](https://www.epa.gov/sites/default/files/2018-08/documents/guide-purchasing-green-power-6.pdf) — EPA / DOE / WRI / CRS / NREL; 2018; linked by EPA page updated 2026-09-21; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/epa-green-power-contracting-2018.pdf). Procurement reference and contract considerations; not a signed contract or official strategy form.

## Сопоставление с кодом

Название в интерфейсе: **PPA Planning Data**. Внутреннее имя шаблона: `PPA Planning Data`.

В реестре кода: 53 уникальных полей, 47 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/ppa_strategy.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/client-energy.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
