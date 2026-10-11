# Проверка публикации 2026-10-11

Проверяемый код: `02ab2103b4a4466babc3b899cc70f8a2250a06a0` в `condr-at/carbonreport`, ветка `main`. Он включает `a019946` с supplier review package и `3d3c767` с исправлением сборки/зависимостей. Все три коммита отправлены в GitHub.

## Исправления перед публикацией

- Полная сборка выявила ошибку prerender `/contacts`: получение текущего пользователя во время статической генерации приводило к 401. Страницы списка и карточки контакта явно переведены в `force-dynamic`; проверки доступа сохранены.
- Next.js и eslint-config-next обновлены с 15.5.4 до 15.5.27, React/react-dom — с 19.1.0 до 19.1.9. Изменение major-версии не выполнялось.
- В инструкции разработки удалён опасный пример полного seed при деплое существующей базы. Для новых полей предусмотрен отдельный добавочный sync.
- Production smoke первой публикации выявил отдельную ошибку: без cookies `/contacts` отвечал HTML 200 с `Application error` вместо перехода на вход. Middleware лежал в корне при приложении в `src/app`; Next не включал его в сборку (пустой middleware manifest). Файл перенесён в `src/middleware.ts`, импорт тестов исправлен; содержимое и auth-правила не менялись. [Воспроизведение](contacts-before-middleware-fix.png), [правило Next 15](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware).

## Локальные проверки

| Проверка | Результат / доказательство |
| --- | --- |
| `npm run build`, Node 22.23.2 | Успешно; [лог](build-patched.log). Шесть прежних предупреждений unused variables; ошибок lint/TypeScript нет |
| `npm run test:sanity`, Node 20.20.0 | 147/147; [лог](sanity-patched.log) |
| `npm run test:integration` с отдельной локальной тестовой PostgreSQL | 70/70; [лог](integration-patched.log). Production для тестов не использовался |
| Первоначальная сборка до исправления Contacts | Падение сохранено в [логе](build-before-fix.log) |
| После переноса middleware | 5/5 существующих middleware tests; полная сборка успешна, manifest содержит `/`, вывод включает `ƒ Middleware 40.2 kB`; [лог](build-middleware-fixed.log) |

Локальный production smoke после переноса: `/contacts`, `/contacts/example`, `/requests`, `/dashboard` → 307 на `/login?redirect=…`; `/api/projects` → 401; `/login` → 200 без серверной ошибки. Это проверка собранного приложения, а не только прямой вызов функции middleware в unit-тесте.

Сборка выполнена в изолированной копии исходников `/tmp/carbonreport-deploy-check-a019946`, с зависимостями из обновлённого lockfile и фиктивным недоступным локальным DATABASE_URL. Она не требовала production-БД. Рабочий локальный dev-server не перезапускался.

В sanity-логе скрыты два синтетических JWT тестов; в build-логах нормализованы переносы и конечные пробелы. Результаты и содержимое сообщений сохранены. Временный файл с production env после проверки удалён.

## GitHub и Vercel

После пуша новый автоматический deployment, GitHub status или check не появился. Проект Vercel `carbonreport` (`conrad-projects`) по-прежнему связан с правильным repoId `1074893955`, веткой `main`; создание deployment включено.

Попытка публикации через Git-source API с точным SHA создала `dpl_4r4huWnv4GBPLExyYQMM9AsP55SX`, но завершилась `ERROR`, `git_info_fail`, до сборки. [Запрос и безопасная часть ответа](deploy-request.json). Это подтверждает проблему получения исходников через Git-интеграцию; конкретная причина или исправление интеграции пока не доказаны.

Для CLI-публикации подготовлен `/tmp/carbonreport-release-3d3c767` из `git archive` указанного коммита: runtime-исходники, public, Prisma, lockfile и конфигурация. Каталог не содержит `.env`, локальных данных или рабочего `node_modules`. Vercel получил 410 файлов (~2.5 MB) с учётом `.vercelignore`. Метаданные `sourceCommit` и `sourceRepository` указывают происхождение; это CLI-деплой, не успешный автоматический Git-деплой.

Первая CLI-публикация `dpl_7wpDEs4ttLpnHSPVA5Tn858sDaCh` достигла READY и получила `carbonreport.app`; [лог](vercel-first-release.log). После smoke исправление middleware отправлено отдельным коммитом `02ab210`; для него тем же способом подготовлен `/tmp/carbonreport-release-02ab210`.

**Итоговая публикация:** `dpl_C1af8zPQbo1P52rK74LyEqwmzmzx`, `READY`, production; домены `carbonreport.app` и `carbonreport.vercel.app` назначены. Код `02ab2103b4a4466babc3b899cc70f8a2250a06a0`; [метаданные](production-deployment.json), [облачная сборка](vercel-final-release.log), [deployment](https://carbonreport-1xmn2efpt-conrad-projects.vercel.app).

На основном домене **9/9 smoke**: главная/вход/регистрация — 200; Contacts/detail, Requests и Dashboard без cookies — 307 на вход с сохранением целевого пути; защищённый API — 401; неверные данные входа — 401 вместо прежнего 500. [Точные запросы и ответы](production-smoke.json), [повторяемый скрипт](smoke.mjs). В Chrome подтверждены переход Contacts → login и открытие формы регистрации; [снимок исправления](production-contacts-redirect.png).

Автодеплой не восстановлен. Доступ CLI достаточен для публикации; браузерная сессия Vercel принадлежит другому аккаунту и не открывает настройки `conrad-projects`. Владельцу предложено войти под аккаунтом проекта. До проверки следующего Git-triggered deployment успешную ручную публикацию не считать восстановлением автоматики.

## База данных

До публикации старая production-версия возвращала 500 на вход с синтетическим несуществующим аккаунтом; подключение к базе из production env не работало. После входа владельца Supabase показал, что связанный проект `qdwbxmgojariranrjoat` (`carbonreport-dev`, несмотря на использование production-сайтом) приостановлен. Выполнено Resume, dashboard подтвердил восстановление; [скриншот](supabase-restored.png). Подключение через production DATABASE_URL снова успешно, неверный вход возвращает 401 вместо 500.

В базе не было ни одного `cbam_pkg_*` определения. Выполнен существующий `npm run db:sync-cbam-fields` с явно загруженным production env: [лог](cbam-sync.log). Отдельный запрос подтвердил все **34/34** используемых поля (28 новых + 6 общих), missing=[]: [точный список](catalog-verified.json).

`templates:check` тоже прошёл ([лог](templates-check.log)), но он проверяет объединение seed и DB IDs и сам по себе не доказывает присутствие всех новых полей в БД. Поэтому выше выполнена отдельная проверка фактических записей.

Отсутствие DB-записи шаблона `CBAM_DATA_PACKAGE` не требует исправления: проект/отчёт и supplier package используют статический registry приложения и `templateCode`; FK на DB-шаблон необязателен. Секции, mappings и все 48 DB-шаблонов не синхронизировались без необходимости.

Полный seed, reset, db push и изменение схемы не запускались. Ключи, пароли и полный production env в доказательства не включаются.

## Ограничения и следующие действия

- Это проверка публикации и доступности, не полный production E2E от нового аккаунта до ZIP. Новые аккаунты и клиентские проекты на production в этом проходе не создавались; email, приглашения, платежи и storage не проверялись.
- Восстановить Git-интеграцию и подтвердить автоматическую публикацию реального следующего коммита. Причину `git_info_fail` не подменять предположением о webhook или правах GitHub App.
- Production сейчас использует проект Supabase с именем `carbonreport-dev`; отдельность окружений и backup/restore для клиентского пилота ещё требуют решения. Resume приостановленного сервиса не является проверкой восстановления из резервной копии.
- Ленддинг сохраняет неподтверждённые обещания нормативных отчётов, тарифов и функций; сама публикация не подтверждает готовность публичных обещаний или self-service запуска.
- Рабочая очередь и дальнейшие критерии находятся в [BACKLOG](../../planning/BACKLOG.md), а не в отдельном deployment-плане.
