# HKEX_ESG — HKEX ESG Data Preparation

Проверено: **2026-10-11**. Категория: `regulated`. Семейство: Hong Kong listed issuer ESG code.

Карточка первичного сбора, а не заключение о соответствии. Требования и трактовки ещё нужно превратить в проверенный набор правил выбранной версии.

## Статус и применимость

Действующее название — Appendix C2 ESG Reporting Code. Part B mandatory, Part C comply-or-explain, Part D климат с phasing2025/2026 [DS21–DS22].

Выяснить Main Board/GEM и весь предшествующий финансовый год членства в Hang Seng Composite LargeCap Index. Для LargeCap Part D обязателен с FY 2026 и сохраняется при последующем выходе из индекса; остальные tiers отличаются [DS21].

## Выдаваемый результат

Annual ESG disclosure по применимой части Code: governance/materiality/boundary, environmental/social KPIs, климатические risks/strategy/metrics с cross-references [DS21–DS22].

## Входные данные

- Board/market tier, reporting year и история HSCLI membership [DS21].
- ESG reporting boundary, materiality и board statement; KPIs с методиками [DS22].
- Climate governance, risks/opportunities, strategy/resilience, emissions и targets; relief/explanation по своему tier [DS21–DS22].

## Проверки и контрольные вопросы

Это требования и контрольные вопросы для данного типа; наши UX/инженерные проверки не становятся нормативными обязанностями. Реализованное покрытие и оставшиеся ограничения указаны ниже.

- [DS21; правовой gate] Вычислять Part D phasing по периоду и issuer tier, не одному HKEX flag.
- [DS21–DS22; disclosure] Различать mandatory, comply-or-explain и encouraged metrics, хранить причины пропусков.
- [DS22; crosswalk] Совпадение части Code с IFRS S2 не считать полной IFRS S2 compliance.

## Проверка человеком

- Hong Kong listing adviser подтверждает rules/transition relief и issuer tier.
- Board/ESG reviewer проверяет statement, boundary, materiality и полноту KPI.

## Риски текущего интерфейса и пробелы реализации

- [UX-предложение; DS21] Для Appendix C2 показывать фазу и уровень обязательности конкретного disclosure.
- Нужна формализованная модель issuer tiers и FY 2025/26 phasing; Check applicability не доказывает полноту выбранного disclosure scope.
- generated/hkex_esg.ts:132 поля, нет явного per-paragraphC2 mapping, HSCLI-history gate и структуры explain.

## Наблюдения исходного снимка до CATALOG-01

Исторические наблюдения о коде на 2026-10-11 до CATALOG-01. Исправления текста и рекомендаций не подтверждают нормативную готовность или production-проверку. [Задачи и статусы — BACKLOG](../../planning/BACKLOG.md).

- До CATALOG-01: user-facing.ts до сих пор Appendix 27 compliance.
- До CATALOG-01: HKEX получал автоматический mandatory без подтверждения применимости. Этот статус заменён предупреждением о проверке; issuer tiers и phasing остаются текущим пробелом.

## Примеры

[Материалы и статус эталона для этого типа](../../report-reference/examples/HKEX_ESG/README.md)

Официальная таблица HKEX↔ISSB, PDF20 страниц. Это reference/crosswalk, не заполненный ESG report; универсальный публичный report template не установлен.

## Источники

- **DS21** [Appendix C2 — Environmental, Social and Governance Reporting Code](https://en-rules.hkex.com.hk/entiresection/3742) — HKEX; current code checked 2026-10-11; доступ: public_text_partial_retrieval. Part B mandatory, Part C comply-or-explain, Part D климат и поэтапное применение. Индексированный текст доступен; повторное открытие нестабильно. FAQ17.2 PDF не скачан: TLS-ошибка затем ошибка web; проверки сертификатов не отключались.
- **DS22** [Linking the ISSB Standards and HKEX ESG Reporting Code](https://www.hkex.com.hk/-/media/HKEX-Market/Listing/Rules-and-Guidance/Environmental-Social-and-Governance/Exchanges-guidance-materials-on-ESG/ISSBstd_esgcode.pdf) — HKEX; 2025-09; доступ: public_download_verified. [Локальный материал](../../report-reference/assets/disclosures-schemes/hkex-issb-esg-code-comparison.pdf). Публично размещённая таблица соответствия; не готовый ESG report и не доказательство полной IFRS S2 compliance. Проверка 2026-10-11: 364657bytes; HTTP MIME application/pdf; magic PDF; SHA256 60899ec71fc6bb1bb8552dbe929f7ee3563f724cdfb4b02f306c955b223b70bb.

## Сопоставление с кодом

Название в интерфейсе: **HKEX ESG Data Preparation**. Внутреннее имя шаблона: `HKEX ESG Data Preparation`.

В реестре кода: 132 уникальных полей, 103 помечены required. Это текущее поведение, не подтверждение нормативной полноты.

[Эффективный шаблон в коде](../../../src/lib/report-templates/generated/hkex_esg.ts) · [Снимок полей и версий](../../report-reference/code-catalog.json) · [Редактируемое исследование](../../report-reference/research/disclosures-schemes.json)

Карточка сформирована `scripts/build-report-reference-library.py`; изменения фактов вносить в исследование, затем пересобрать.
