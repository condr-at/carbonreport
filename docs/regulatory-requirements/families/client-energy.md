# Клиентские формы, закупка энергии и энергоаудит

Проверено 2026-10-11. Подробные карточки по кодам создаются из [исследования](../../report-reference/research/client-energy.json). Это первичная спецификация для дальнейшей проверки специалистом, а не утверждённый механизм автоматического определения обязанностей.

## Развилки для будущего интерфейса

1. Сначала спросить, кто получает результат и какая страна/схема/версия формы применима.
2. Для клиентского файла получить сам шаблон и критерии приёмки; отсутствие шаблона — незакрытый вход, а не разрешение выбрать его автоматически.
3. Для банка разделить ответ заёмщика и собственный financed-emissions inventory финансовой организации.
4. Для энергии разделить инвентаризацию выбросов, обязательный энергоаудит, закупку EAC и стратегию договора PPA.
5. Зафиксировать, кто проверяет и подписывает результат, и какой шаг выполняется вне сервиса.

Эти развилки — наши UX-рекомендации. Нормативная применимость устанавливается по указанным ниже источникам и выбранной юрисдикции.

## CLIENT_SCOPE3_PACKAGE

Договорный пакет данных; формат и границы определяет получатель. PACT — возможный согласованный профиль обмена, а не обязательная форма для всех клиентов.

Поставщик передаёт заказчику данные для определённой категории Scope 3; сначала выяснить, нужен PCF продукта, активность, расходы или корпоративная инвентаризация.

**Выдаваемый результат:** Согласованный dataset + методика, период, границы, единицы и evidence; JSON PACT только при договорённости.

**Образец:** Официальные модель/схема PACT сохранены; не образец любого клиентского запроса.

**Остаётся проверить:** Получатель подтверждает структуру и границы; специалист проверяет методику PCF, если она входит в результат.; Нужны профиль получателя, версия формы, сопоставление полей/единиц и реальная выгрузка.

## CLIENT_TEMPLATE_FILL

Универсальной нормативной формы нет: источником требований будет версия файла/портала конкретного заказчика.

Только после получения формы, инструкции и условий передачи данных клиента.

**Выдаваемый результат:** Заполненный исходный шаблон без потери структуры; список незаполненных/неприменимых полей и evidence.

**Образец:** Публичного универсального эталона не существует; CE02 — лишь возможная согласованная структура для PCF, не подмена реального шаблона.

**Остаётся проверить:** Заказчик подтверждает mapping и полученный файл; неоднозначные вопросы возвращаются ему.; В коде статический общий dataset; нет пользовательского контракта формы и round-trip теста.

## BANK_TEMPLATE_FILL

Банковская анкета определяется банком. PCAF Part A относится к финансовой организации и не делает каждую анкету заёмщика нормативным PCAF-отчётом.

Сначала роль: заёмщик отвечает банку или финансовая организация рассчитывает financed emissions.

**Выдаваемый результат:** Ответ в форме банка; при отдельном PCAF-заказе — раскрытие по выбранным классам активов с attribution и качеством данных.

**Образец:** CE04 содержит sample tables, CE05 — более ранний checklist. Настоящая анкета конкретного банка остаётся обязательным входом.

**Остаётся проверить:** Банк принимает анкету; профильный специалист проверяет attribution и применимый класс активов.; Не реализованы банковский mapping, классы активов/attribution и согласованный формат передачи.

## RECS_STRATEGY

План закупки EAC/REC — внутренний документ. Правила заявления о возобновляемой энергии зависят от рынка и применяемого стандарта учёта.

Организация выбирает закупку сертификатов; юрисдикция и система реестра обязательны для интерпретации.

**Выдаваемый результат:** Матрица потребления/сертификатов/бюджета, доказательства владения и погашения, ограничения заявлений.

**Образец:** Сохранён официальный procurement guide; единого нормативного отчёта RECs Strategy нет.

**Остаётся проверить:** Специалист по выбранному рынку и учётной методике проверяет пригодность инструмента.; Нужны реестр инструментов, проверка retirement и связь с потреблением.

## PPA_STRATEGY

Стратегия PPA — коммерческий анализ; отчёт и договор требуют выбранного рынка и условий контрагентов.

Выбирающий физический или финансовый PPA покупатель электроэнергии.

**Выдаваемый результат:** Сравнение вариантов и сценариев, распределение рисков, права на EAC и согласуемый term sheet.

**Образец:** Официальные contract considerations — ориентир структуры; универсального PPA Strategy filing/template нет.

**Остаётся проверить:** Профильный юрист и финансовая команда проверяют реальный договор и риски; сервис не подписывает контракт.; Текущие поля не образуют финансовую модель или договор; нужен отдельный scope.

## ENERGY_AUDIT_SCOPE12

Энергоаудит не равен инвентаризации Scope 1/2. Обязательный аудит определяется страной и схемой; ниже EU EED и UK ESOS как отдельные ветки.

EU: Article 11 связывает обязанности со средним потреблением за три года, включая все энергоносители; требуется национальная имплементация. UK: отдельные критерии ESOS и выбранная phase.

**Выдаваемый результат:** Выдаваемый пакет зависит от схемы и способа выполнения требований. ESOS phase 4: при подходящем покрытии total/significant energy consumption сертификацией ISO 50001 отдельный ESOS report и lead assessor не требуются; evidence pack и MESOS notification сохраняются [CE10, §§7, 10–12]. В аудиторской ветке — отчёт, рекомендации и необходимые подписи.

**Образец:** Сохранены phase-4 A3 и B, официальный A1/A2 доступен по ссылке; это UK-примеры, не универсальный EU-аудит.

**Остаётся проверить:** Квалифицированный аудитор/lead assessor, когда требуется схемой; ответственное руководство подписывает результат.; Нет ветвления применимости, плана измерений/site visits, sign-off и схемы подачи; полная правовая проверка EU Annex VI/национального акта ещё нужна.

## Источники и доступ

- **CE01** [PACT Technical Specifications for PCF Data Exchange](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/) — WBCSD PACT; 3.0.3; checked 2026-10-11. Technical exchange specification, not a universal client questionnaire or independent verification.
- **CE02** [PACT Simplified Data Model](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/pact-simplified.xlsx) — WBCSD PACT; 3.0.3 snapshot 2026-10-11. Dictionary/workbook, not a filled client report; latest URL is mutable.
- **CE03** [PACT OpenAPI including examples](https://docs.carbon-transparency.org/tr/data-exchange-protocol/latest/openapi.yaml) — WBCSD PACT; 3.0.3 (verified info.version). Source schemas and example values for an agreed PACT exchange. Does not implement PCF calculation.
- **CE04** [Financed Emissions, Part A, Third Edition](https://carbonaccountingfinancials.com/files/standard-launch-2025/PCAF-PartA-2025-V3-December.pdf) — PCAF; December 2025. Contains reporting examples in section 10.2. For financial institutions; not every borrower questionnaire is PCAF.
- **CE05** [Disclosure Checklist, Part A Financed Emissions](https://carbonaccountingfinancials.com/files/disclosure_checklist/PCAF-Disclosure-Checklist-Part-A-Financed-Emissions-May-2025.pdf) — PCAF; May 2025. Predates third edition December 2025; compare against CE04 before use.
- **CE06** [Renewable Energy Certificates (RECs)](https://www.epa.gov/green-power-markets/renewable-energy-certificates-recs) — US EPA; Live page checked 2026-10-11. US market guidance, not automatically a rule for EU guarantees of origin or another national EAC system.
- **CE07** [Green Power Supply Options](https://www.epa.gov/green-power-markets/green-power-supply-options) — US EPA; Live page checked 2026-10-11. Describes different procurement options; not a universal PPA contract.
- **CE08** [Guide to Purchasing Green Power, chapter 6: Contracting](https://www.epa.gov/sites/default/files/2018-08/documents/guide-purchasing-green-power-6.pdf) — EPA / DOE / WRI / CRS / NREL; 2018; linked by EPA page updated 2026-09-21. Procurement reference and contract considerations; not a signed contract or official strategy form.
- **CE09** [Energy Efficiency Directive, Article 11 and Annex VI](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02023L1791-20260805) — European Union; Consolidation 2026-08-05. EUR-Lex original act links to this consolidation; Article 11 thresholds/dates confirmed in indexed official Romanian text. Direct full text retrieval hit bot challenge, no local HTML saved. National transposition and current full clauses still require review.
- **CE10** [How to comply with ESOS phase 4](https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/how-to-comply-with-the-energy-savings-opportunity-scheme-esos-phase-4) — UK Environment Agency; Published 2026-07-30. Current phase-4 guidance; sections 1.1, 7 and 10 distinguish qualification from compliance route and ISO 50001 exemptions. Do not apply phase-3 forms uncritically.
- **CE11** [ESOS phase 4 report checklists A1/A2](https://www.gov.uk/government/publications/comply-with-the-energy-savings-opportunity-scheme-esos-phase-4/appendices-a1-and-a2-report-checklists-for-participants) — UK Environment Agency; Published 2026-07-30. 
- **CE12** [ESOS phase 4 recommendations template A3](https://assets.publishing.service.gov.uk/media/6a6b5e088319ab05f7caa248/ESOS_Appendix_A3_template.odt) — UK Environment Agency; Phase 4; landing page 2026-07-30. Suggested presentation of recommendations, not the entire mandatory report.
- **CE13** [ESOS phase 4 notification fields, Appendix B](https://assets.publishing.service.gov.uk/media/6a69f658701b2d693e5b9422/ESOS_Appendix_B_phase_4.odt) — UK Environment Agency; Phase 4; landing page 2026-07-30. Fields for MESOS notification; portal submission is separate from report generation.

## Ограничения сбора

- PDF PCAF: визуально проверены титул checklist и страницы таблиц; EPA — раздел contract considerations. Это не проверка всех 209 страниц PCAF.
- XLSX/ODT проверены как ZIP-документы; YAML разобран, version 3.0.3 подтверждена.
- Публичные материалы доступны для справки; права на дальнейшее коммерческое воспроизведение проверять отдельно. Не переносить фирменные логотипы/подписи в наш экспорт.
- Для клиентской/банковской формы нет выдуманного заполненного эталона. Требуется настоящий файл получателя.
