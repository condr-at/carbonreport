# RECS_STRATEGY — Renewable Certificate Planning

Проверено: **2026-10-11**. Категория: `internal_workpaper`. Семейство: Renewable electricity procurement.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

План закупки EAC/REC — внутренний документ. Правила заявления о возобновляемой энергии зависят от рынка и применяемого стандарта учёта.

Организация выбирает закупку сертификатов; юрисдикция и система реестра обязательны для интерпретации.

## Выдаваемый результат

Матрица потребления/сертификатов/бюджета, доказательства владения и погашения, ограничения заявлений.

## Входные данные

- Страна/рынок и реестр
- Потребление MWh, год/период и площадки
- Технология, vintage, номера EAC, бенефициар погашения
- Цена, объём, права и ограничения

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- Не смешивать MWh сертификатов с tCO2e offsets [CE06].
- Исключить двойной учёт одного сертификата и проверить цепочку владения/retirement [CE06, CE08].
- US REC guidance не применять автоматически к Guarantees of Origin другой страны [CE06].
- Планируемая покупка не подтверждает состоявшееся погашение (наш контроль).

## Проверка человеком

- Специалист по выбранному рынку и учётной методике проверяет пригодность инструмента.

## Риски текущего интерфейса и пробелы реализации

- Документ не выдаёт сертификаты и не гарантирует нулевые выбросы.
- Нужны реестр инструментов, проверка retirement и связь с потреблением.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/RECS_STRATEGY/README.md)

Сохранён официальный procurement guide; единого нормативного отчёта RECs Strategy нет.

## Источники

- **CE06** [Renewable Energy Certificates (RECs)](https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs) — US EPA; Live page checked 2026-10-11; доступ: public. US market guidance, not automatically a rule for EU guarantees of origin or another national EAC system.
- **CE08** [Guide to Purchasing Green Power, chapter 6: Contracting](https://www.epa.gov/sites/default/files/2018-08/documents/guide-purchasing-green-power-6.pdf) — EPA / DOE / WRI / CRS / NREL; 2018; linked by EPA page updated 2026-09-21; доступ: public. [Локальный материал](../../report-reference/assets/client-energy/epa-green-power-contracting-2018.pdf). Procurement reference and contract considerations; not a signed contract or official strategy form.

## Сопоставление с кодом

Название в интерфейсе: **Renewable Certificate Planning**. Внутреннее имя шаблона: `Renewable Certificate Planning`.

В реестре кода: 53 уникальных полей, 47 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/recs_strategy.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/client-energy.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
