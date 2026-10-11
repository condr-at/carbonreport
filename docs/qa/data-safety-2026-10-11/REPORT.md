# Dataset: сохранность черновиков и конкурентное сохранение — 2026-10-11

Проверены общая таблица dataset, очередь изменений, версии, сетевые сбои и смена аккаунта. Использованы синтетические данные и отдельная локальная БД `carbonreport_e2e_test`; production и реальные письма в этот проход не входили.

**Статус проверки.** Финальный runner текущего кода прошёл: **242/242 sanity**, production build с TypeScript/lint и **20/20 browser checks**, failures/skipped — 0. В него входят оба дополнительных replay-исправления ниже. До финального прогона прошли **29/29 focused tests**, независимое воспроизведение подтвердило устранение lost update. Первый снимок до этих исправлений дал 237/237 + 20/20; это не подмена финального результата.

[Точные assertions и результат сборки](checks.txt), [структурированные результаты и последовательности ответов](data-safety-results.json), [состояние конфликта](dataset-conflict-draft-retained.png), [изоляция черновика после смены аккаунта](dataset-other-account-no-draft-leak.png). Проверенный [синтетический ZIP](synthetic-review-package.zip), его [ожидаемые данные](expected-package.json) и [независимая проверка](zip-verification.json) сохранены. Условия запуска и ограничения БД заданы в [E2E README](../../../scripts/e2e/README.md).

| Сценарий финального браузерного прогона | Наблюдаемый результат |
| --- | --- |
| Две сессии редактируют одну исходную версию | Первая сохраняет `First session saved name`, v1. Вторая получает `VERSION_CONFLICT`; её черновик переживает reload. Явный выбор серверных значений сохраняет победившую запись. |
| Ввод и немедленный reload до Enter/blur | `Typed draft before leaving the cell` восстановлен и сохранён, v1. |
| HTTP 500, reload, ручной retry | После трёх синтетических отказов сервер остаётся на v0; черновик сохраняется в браузере. Retry записывает `Draft retained after server failure`, v1, затем очищает очередь. |
| Сервер записал изменение, браузер потерял ответ | Первый ответ API — 200, версия стала v1. Повтор после reload успешен; значение и v1 неизменны, второй записи нет. |
| Истечение access/refresh и смена аккаунта | Refresh отвечает 200, затем при истёкшем refresh — 401. У второго аккаунта с правом редактирования того же workspace нет автоматической отправки чужой очереди; прямой replay чужого `actorId` — 401. Исходный владелец возвращается и сохраняет свой черновик, v1 → v2. |

Точные проверки значений, версий и ответов находятся в [browser regression](../../../scripts/e2e/data-safety.test.mjs). HTTP 500, потеря ответа и истёкшие токены создаются тестом; это проверка восстановления при заданном сбое, а не наблюдение production-инцидента.

**Исправления и регрессии.**

- [Очередь](../../../src/lib/sync/queue.ts) хранит исходную версию и автора, синхронно сохраняет edits и удаляет их только после подтверждения. [Sync manager](../../../src/lib/sync/sync-manager.tsx) разделяет `sessionStorage` по аккаунту, не импортирует старую общую очередь автоматически и ограничивает запрос вместе с ожиданием refresh десятью секундами. Покрытие: [queue tests](../../../src/lib/sync/queue.test.ts), [deadline tests](../../../src/lib/sync/deadline.test.ts).
- [Batch API](../../../src/app/api/batch/route.ts) проверяет автора, членство и роль EDITOR, требует исходную версию и пишет через CAS. Конфликт не вызывает скрытый повтор на свежей версии. No-op возвращает `writeApplied:false`; только подтверждённый CAS с ожидаемым увеличением на один разрешает перенос ещё не отправленных edits. Покрытие: [route tests](../../../src/app/api/batch/route.test.ts), включая `a matching replay cannot authorize a queued edit over another session newer value`.
- [Обычный dataset PATCH](../../../src/app/api/projects/[id]/dataset/route.ts) также требует `datasetVersion`; [регрессия](../../../src/app/api/projects/[id]/dataset/route.test.ts) проверяет отказ при её отсутствии и сохранение остальных данных.
- [Таблица](../../../src/components/dataset-table.tsx) сохраняет ввод до blur; [страница dataset](../../../src/app/projects/[id]/dataset/dataset-page-client.tsx) показывает статус, retry и явное сравнение с сервером. [Login](../../../src/app/login/login-form.tsx) выполняет полную навигацию после входа, очищая прежний клиентский кеш при сохранении очереди исходного аккаунта.

**Точное adverse-воспроизведение no-op → lost update.** Выполнено настоящими `POST /api/batch` и `settleBatch` с мокнутым Prisma, без БД. Сервер: v4, `a="already-saved"`, `b="OTHER EDITOR VALUE"`. Отправленная операция `sent`: actor `actor`, expected v3, `a="already-saved"`, processing. Напечатанная во время запроса операция `typed-while-saving`: тот же actor/project, expected v3, `b="LOCAL DRAFT"`, pending. Последовательность: отправить `sent` → `settleBatch([sent,newer],[sent],results)` → отправить оставшуюся очередь.

```json
{
  "beforeFix": {
    "firstResults": [{"id":"sent","success":true,"datasetVersion":4}],
    "pendingVersionAfterSettle": 4,
    "secondResults": [{"id":"typed-while-saving","success":true,"datasetVersion":5}],
    "finalB": "LOCAL DRAFT"
  },
  "afterFix": {
    "firstResults": [{"id":"sent","success":true,"datasetVersion":4,"writeApplied":false}],
    "pendingVersionAfterSettle": 3,
    "secondResults": [{"id":"typed-while-saving","success":false,"code":"VERSION_CONFLICT","currentVersion":4}],
    "writes": 0,
    "finalB": "OTHER EDITOR VALUE"
  }
}
```

Второй ответ приведён без поясняющего поля `error`; остальные перечисленные значения — наблюдаемые. До исправления no-op присваивал ожидающим изменениям чужую версию; после исправления исходная версия сохраняется и чужое значение не перезаписывается.

**Ложный конфликт повторного add + update.** Дополнительное воспроизведение: из v3 отправлены `add-facility {id:"new-facility",name:"",address:"",country:""}` и `update-facility name="Filled after add"`. Первая отправка записала v4; точный повтор вернул обоим ops `VERSION_CONFLICT`, `This facility changed. Review the latest values.`, при одной записи всего. Причина: сравнение исходного add с уже отредактированным объектом раньше проверки конечного результата. В текущем коде `applyEntityAddition` реконструирует старый replay только во временной копии; разрешён no-op лишь при совпадении всего конечного dataset. Любое отличие отсекает version guard, свежая коллизия UUID также отклоняется. Новые три tests для facility/energy/BOM проверяют commit → exact replay без второй записи → отказ после чужого изменения → отказ свежей коллизии. Исправление вошло в успешный финальный runner; сама комбинация facility/energy/BOM проверяется focused tests, не отдельным UI-сценарием.

**Оставшиеся ограничения.** `sessionStorage` обеспечивает восстановление в той же вкладке при reload/login, но не является долговременной или межустройственной резервной копией; после закрытия вкладки/очистки данных восстановление не гарантируется. Сбой браузерного хранилища показывается пользователю. Старая очередь без автора и версии доступна только для ручного скачивания/проверки и не отправляется автоматически. Серверного реестра idempotency keys нет: безопасный retry определяется конечным состоянием и CAS, не историей исполнения; после последующего чужого изменения возможен явный конфликт. Браузерный проход покрывает общую таблицу и перечисленные сбои; комбинированные facility/energy/BOM replay пока подтверждены focused tests. Production, прочие устройства/браузеры и произвольные последовательности длительного offline этим отчётом не проверены.
