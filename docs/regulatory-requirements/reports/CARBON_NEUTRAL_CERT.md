# CARBON_NEUTRAL_CERT — Carbon Neutrality Claim Preparation

Проверено: **2026-10-11**. Категория: `voluntary_standard`. Семейство: carbon_neutrality.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

ISO 14068:2026 заменил отозванный ISO 14068-1:2023; PAS 2060:2014 отозван 01.12.2025. Публичные заявления регулируются отдельно.

Конкретный субъект и период заявления: организация либо продукт. До коммуникации определить аудиторию и юрисдикцию.

## Выдаваемый результат

Отчёт и обоснование заявления: след, сокращения, остаток и доказательства компенсации. Независимое заключение — отдельный реально выполненный этап.

## Входные данные

- [PG15] Субъект, период, границы, методика следа, сокращения/удаления и остаток.
- [UX-проектирование; PG15] План сокращения; реестр credits с serials, vintage, retirement и доказательствами уникального использования.
- [PG34/PG35] Текст, аудитория и страна claim; выбранная схема и внешняя проверка.

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [Норма выбранной базы PG15] Сокращения и удаления в цепочке имеют приоритет перед компенсацией; carbon neutrality не тождественна net zero.
- [Правовая проверка PG34/PG35] С 27.09.2026 учитывать EU запрет потребительских product claims о нейтральном/сниженном/положительном GHG-воздействии на основе offsets. Национальное применение проверяет юрист.
- [UX-контроль; PG16/PG17] Отозванные PAS 2060 и ISO 14068-1:2023 не представлять текущими редакциями; историческую базу старых заключений сохранять.
- [UX-контроль; PG15/PG32] Не генерировать статус verified/certificate без настоящего заключения; покупка credits не доказывает retirement.

## Проверка человеком

- [PG15] Эксперт сверяет полный лицензированный ISO 14068:2026 и выбранную схему.
- [PG34/PG35] Юрист проверяет публичное заявление; компетентный проверяющий оценивает его доказательства.

## Риски текущего интерфейса и пробелы реализации

- Приложение не выдаёт сертификаты ISO.
- Компенсации не превращают CFP в ноль и не разрешают запрещённый consumer claim.
- generated/carbon_neutral_cert.ts: 107 полей, 97 required. Есть offsets_purchased_co2e и граница claim; отдельного реестра serials/retirement в списке полей нет. Полное соответствие ISO не проверено.
- Общий report client показывает редактируемый DatasetTable и заполненность; законченный расчёт/экспорт/проверка соответствия этим исследованием не подтверждены (src/app/projects/[id]/reports/[reportId]/report-page-client.tsx:269).

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/CARBON_NEUTRAL_CERT/README.md)

Текущее завершённое заключение по ISO 14068:2026 в ограниченном поиске не получено. Старый PAS 2060 и сам стандарт не подменяют такой пример.

## Источники

- **PG15** [ISO 14068:2026 — Climate change management — Carbon neutrality](https://www.iso.org/standard/14068) — ISO; Published 2026-09-11, edition1; доступ: public_metadata. Prioritises reductions and removal enhancement within value chain over offsetting; does not specify net-zero requirements. Licensed text not accessed.
- **PG16** [ISO 14068-1:2023 — withdrawn record](https://www.iso.org/standard/43279.html) — ISO; Withdrawn 2026-09-11; replaced by ISO 14068:2026; доступ: public_metadata. Historical edition only; do not advertise it as current in a new report.
- **PG17** [PAS 2060:2014 — withdrawn record](https://knowledge.bsigroup.com/products/specification-for-the-demonstration-of-carbon-neutrality-1) — BSI; Published 2014-04-30; withdrawn 2025-12-01; доступ: public_metadata. BSI product record gives exact withdrawal date. Do not confuse withdrawal of document with earlier scheme-sales deadlines. Full paid text not obtained.
- **PG32** [ISO — Certification](https://www.iso.org/certification.html) — ISO; Live page checked 2026-10-11; доступ: public_fulltext. ISO does not perform certification or issue certificates.
- **PG34** [ECGT Questions and Answers](https://commission.europa.eu/document/download/3c257883-bb2a-4dd9-a6dc-501d587bb34f_en?filename=faq-empowerting-consumers-gtd.pdf) — European Commission; Index dated 2026-09-22; questions 6 and 10; доступ: public_fulltext. Explains UCPD Annex I 4c product-claim prohibition based on offsets. Guidance, not the legislative text; scope/national implementation needs legal review.
- **PG35** [Sustainable consumption — implementation of Directive (EU) 2024/825](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/sustainable-consumption_en) — European Commission; Application 2026-09-27; checked 2026-10-11; доступ: public_fulltext. Date confirmed by Commission; do not present ISO carbon-neutrality conformance as permission for EU consumer claims.

## Сопоставление с кодом

Название в интерфейсе: **Carbon Neutrality Claim Preparation**. Внутреннее имя шаблона: `Carbon Neutrality Claim Preparation`.

В реестре кода: 107 уникальных полей, 97 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/carbon_neutral_cert.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/product-ghg.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
