1. Общая стратегия
Вводим многорганизационную модель без сущности Account.
Центр: Organization + OrganizationMembership + роли.
Задел для будущего биллинга: планы, лимиты, дата истечения (для платных), API-заглушки, неизбыточные связи.
Биллинг сейчас вручную (смена плана через обновление в БД), интерфейс показывает планы и лимиты, без оплаты.
2. Планы (Tariffs)
Переименовано: Beta Free → Free.
Планы на старт:
Free: max_active_projects = 1, max_editors = 0 (только owner), max_verifiers = 0, viewers = unlimited, без срока окончания.
Pro Beta: max_active_projects = 3, max_editors = 2 (плюс owner), max_verifiers = 0, viewers = unlimited, имеет истекающую дату (устанавливается вручную).
В БД:
Таблица plan_definitions: plan_code, label, description, лимиты.
В organizations: plan_code, plan_assigned_at, plan_valid_until (nullable).
Возможна эволюция: вынести назначение в organization_plan_assignments (история смен).
Интерфейс настроек: список планов (карточки с лимитами). Кнопки Upgrade → модал “Связаться с поддержкой”.
3. Роли и доступы
Роли: OWNER, ADMIN, EDITOR, VIEWER_READONLY, VIEWER_VERIFIER.
VIEWER_VERIFIER зарезервирован (пока без функционала подтверждения; future feature flag).
Ограничения лимитов применимы к editor/verifier; viewers всегда unlimited (но значение хранится для гибкости).
Owner передача — “coming soon” (не реализуем сейчас, закладка в документации).
4. Организации
Неограниченное число организаций per user (никакого лимита на владение для Free).
Поля organizations:
id, slug, display_name (редактируемое), description (nullable),
logo_asset_id (связь с таблицей файлов) или logo_url (MVP),
plan_code, plan_assigned_at, plan_valid_until,
created_by_user_id, status (active, deleted, pending_transfer),
deleted_at (nullable), metadata JSONB.
Косметика: только имя, описание, логотип; цветовая тема глобальная (accent_color не нужен).
Soft-delete организации: status=deleted, deleted_at + каскад soft-delete проектов. Retention 30 дней (восстановление возможно вручную).
5. Участники
Таблица organization_memberships: id, organization_id, user_id, role, invited_by, invite_status, joined_at, last_active_at.
Список и управление ролями в Organization Settings.
Лимиты проверяются при назначении editor/verifier.
Viewers добавляются без ограничений.
6. Пользователь (User Settings)
Поля пользователя: first_name, last_name, job_title, avatar_asset_id (или avatar_url), email, password_hash, timezone, created_at, updated_at.
Настройки пользователя: профиль (имя, должность, аватар), смена пароля, просмотр списка организаций + ролей, действие “Leave” (кроме OWNER).
Заглушка текущего дев-юзера: seed создаёт одного пользователя + две организации (одна Free, одна Pro Beta) для тестирования лимитов.
7. Проекты и статусы
Добавить organization_id ко всем сущностям проекта (projects, contacts, data_requests, etc.).
Пересмотр статусов проектов:
active — считается в лимит.
archived — не считается.
reported (новое название вместо submitted) — финализирован, read-only, не считается.
deleted — soft, retention 30 дней.
Восстановление из archived/reported/deleted → проверка лимита активных; при превышении показать предупреждение и варианты (удалить/заархивировать другие или запросить апгрейд).
Data requests и mail templates остаются привязанными к проекту (не к организации напрямую).
Лимиты и учёт использования
Счётчики активных: проекты (status=active), editors (role=EDITOR), verifiers (role=VIEWER_VERIFIER, когда станет активным), owner считается как управляющий но не входит в лимит editors.
Таблица organization_usage_snapshots (крон или on-demand): organization_id, computed_at, active_projects, active_editors, active_verifiers, active_viewers.
Реал-тайм проверки (middleware/guard) при создании проекта / назначении роли.
9. API (внутренний слой)
POST /api/organizations — создать организацию (авто plan_code=free).
GET /api/organizations/current — активная организация + лимиты.
PATCH /api/organizations/:id — обновить display_name, description, logo.
GET /api/organizations/:id/members + POST + PATCH + DELETE.
POST /api/organizations/:id/invite — заготовка (email отправка позже).
DELETE /api/organizations/:id — soft-delete + каскад проектов.
GET /api/user/settings / PATCH /api/user/settings.
Плановая заглушка: POST /api/organizations/:id/plan/upgrade → 501 (готово для будущего биллинга).
10. Frontend / UX
Sidebar:
Organization switcher: логотип (инициалы fallback), имя, метка плана (Free, Pro Beta), счётчик активных проектов X / limit.
Опции: “Create organization”, “Manage organization”.
User блок в футере остаётся (профиль + ссылка в настройки).
Organization Settings (/settings/organization):
Tabs:
Profile: имя, описание, логотип (upload), slug (read-only или скрыт), план + дата истечения (если есть).
Members: таблица пользователей (avatar, name, role, last active), actions (Change role, Remove, Resend invite).
Usage & Limits: плановые лимиты vs текущее использование, CTA “Upgrade plan” (модал с контактами).
Danger Zone: удалить организацию (soft delete + пояснение про 30 дней).
User Settings (/settings):
Профиль (имя, фамилия, должность, аватар).
Без смены email (read-only в бете), пароль — модал.
Organizations: список (роль, кнопка Open, Leave).
Invite Modal: ввод email + выбор роли; при выборе editor/verifier — проверка лимита (disabled если исчерпано, всплывающая подсказка).
Tooltip для роли Verifier: “Approval tools coming soon”.
Файлы и загрузки
Предложение для логотипов/аватаров:
MVP: upload to object storage (S3 / R2) через signed URL; запись в assets таблицу: id, type (org_logo|user_avatar), url, created_at, uploaded_by.
Быстрая альтернатива до настройки CDN: хранить base64 в БД (нежелательно при росте).
Выбор: реализовать сразу storage + signed POST (надёжнее для будущего).
Валидация: размер ≤ 512KB, форматы PNG/SVG/JPEG, квадратная рекомендация.
12. Soft-delete политика
Organization: status=deleted, deleted_at.
Projects: status=deleted, deleted_at.
Retention: 30 дней; план действий при восстановлении — проверка лимитов.
Очистка (future): scheduled job — окончательное удаление по истечении срока.
13. Миграции
Новые таблицы: organizations, organization_memberships, plan_definitions, organization_usage_snapshots, assets.
Добавить organization_id в projects, contacts, data_requests, прочие зависимые.
Добавить status + deleted_at в projects (и при необходимости в связанные).
Seed:
Планы: free, pro_beta.
Demo user.
Demo org (Free) + demo org (Pro Beta).
Memberships: owner + несколько тестовых viewers/editors (соблюсти лимит).
Удалить или мигрировать старые записи (допустимо просто очистить все).
14. Guard / Middleware
Функции:
assertOrgMembership(userId, orgId, minRole)
assertWithinLimit(orgId, resourceType)
getPlan(orgId) → объединяет plan_definitions + организационный valid_until.
Feature flags (пока статично): verifierRoleEnabled=false, billingUiEnabled=true (informational).
Документация
Обновить: ARCHITECTURE.md (доменная диаграмма, роли, планы, статусы проектов).
UX_GUIDE.md: разделы Organization Settings, Project status lifecycle, Switcher.
API_REFERENCE.md: новые эндпоинты.
DEVELOPMENT.md: миграции, seed, тестирование лимитов, как вручную менять plan_code и plan_valid_until.
Добавить BILLING_PLAYBOOK.md (или секцию) — будущая эволюция: подключение оплаты, история планов.
16. Тестирование
Unit: лимит-проверки, роль-проверки, переключение организации.
Integration: создание организации → план=free, добавление editor (ошибка на Free), удаление орг → статус, запрет доступа.
E2E: переключатель организаций, восстановление проекта при переполненных лимитах.
Восстановление soft-deleted: сценарий превышения активных.
17. Открытые моменты (фиксируем для future)
Передача ownership — отложено.
Активное внедрение verifier-рабочего процесса — после запуска основы.
Точная терминология для reported можно утвердить (варианты: finalized, submitted, reported). Предложено: использовать reported (семантика “ушло наружу”).
История смены планов — при необходимости вынести в отдельную таблицу позднее.
Архивирование vs удаление: уточнить различия в UI (архив = можно вернуть без лимитного предупреждения? Сейчас возврат из archive тоже проверяет лимит активных).
18. Заглушка пользователя (dev)
Существующую заглушку адаптировать:
При старте: если нет demo user → создать + две орг.
Хранить идентификаторы в .env.dev или просто находить по email.
Возможность сброса: npm run db:seed:reset.
Это финальный консолидированный объём того, что реализуем и закладываем. Если нужно изменить терминологию статусов или добавить ещё поля — уточнить до начала миграций.

# PROMT
Ты — системный аналитик. Тебе нужно подготовить полный пакет документации и спецификаций для реализации мультиорганизационной модели без сущности Account, с планами (Free и Pro Beta), ролями и лимитами, софт-удалением и заделом под будущий биллинг. Считай, что исходно у тебя нет контекста и ты «с нуля». Работай только с документацией в репозитории, код пока не меняй.

Контекст (зафиксированные решения)

Модель без Account. Основные сущности: Organization, OrganizationMembership, User, Project (и связанные Project-ресурсы).
Роли: OWNER, ADMIN, EDITOR, VIEWER_READONLY, VIEWER_VERIFIER. Verifier — роль с будущими возможностями «аппрува», сейчас только просмотр (заложить фичефлаг).
Планы (tariffs):
Free: max_active_projects=1, max_editors=0 (только owner), max_verifiers=0, viewers=unlimited, без срока окончания.
Pro Beta: max_active_projects=3, max_editors=2 (включая только двух помимо owner), max_verifiers=0, viewers=unlimited, с датой истечения (plan_valid_until задаётся вручную в БД).
Organization: имя (обяз.), описание (необяз.), логотип (загрузка), slug (служебно), план, дата назначения и срок действия плана, soft-delete с retention 30 дней. Accent color не используем (задаётся глобально).
Пользователь может владеть неограниченным числом организаций. Для само-созданной организации — план Free.
Проекты: статусы пересмотреть: active (считается в лимит), archived (не считается), reported (новое название финализированного, read-only; не считается), deleted (soft, 30 дней). Восстановление требует проверки лимита активных; если лимит исчерпан — показать предупреждение и варианты (удалить/заархивировать другие или запросить апгрейд).
Data requests и mail templates относятся к проекту (не к организации напрямую).
Загрузка файлов (логотип организаций, аватар пользователей): предложить схему через object storage (S3/R2) + signed URL, таблица assets; валидация форматов/размеров. Альтернативы и риски отметить.
В Sidebar уже есть пункт Settings (пока это User Settings). Organization Settings открывается через Organization Switcher (кнопка Manage organization) и живёт по пути /settings/organization (уточнить в UX). В сайдбаре оставить существующее расположение user-блока (внизу).
Планы будут назначаться и изменяться вручную через БД в бете. В интерфейсе: страница планов с карточками и CTA «Upgrade plan» (модал со способами связи), без фактической оплаты. Placeholder API для будущего апгрейда.
Предупреждения на 80% лимита сейчас не нужны.
Ограничения для беты: нет лимита на количество организаций на пользователя. В Free — 1 активный проект, редакторов/верификаторов нельзя добавлять (owner — единственный «редактор»), viewers — без ограничений.
Репозиторий документации: смотри docs→README.md, docs→ARCHITECTURE.md, docs→UX_GUIDE.md, docs→API_REFERENCE.md, docs→DEVELOPMENT.md, docs→planning→ROADMAP.md, docs→planning→BACKLOG.md, и архивные документы в docs→archive.
Твоя цель
Создать и обновить документацию так, чтобы разработчики могли приступить к реализации без дополнительных вопросов: архитектура, доменная модель, UX IA, API-контракты, миграции, ограничения/квоты, тест-план, риски.
Привязать к роадмапу и разложить на бэклог (эпики → фичи → задачи).
Подготовить заглушки и ссылки для будущего биллинга.
Что нужно сделать (пошагово)

Обнови и дополни архитектуру
В docs→ARCHITECTURE.md:
Добавь раздел «Multi-organization model (без Account)»: ER-диаграмму (текстовое описание связей, если нет рисунка), поля сущностей и связи: organizations, organization_memberships, users, projects (+ contacts, data_requests, mail_templates как дочерние проекта).
Опиши роли и права (OWNER/ADMIN/EDITOR/VIEWER_READONLY/VIEWER_VERIFIER) с матрицей разрешений (CRUD по проектам, настройкам организации, участникам).
Опиши планы: Free и Pro Beta, их лимиты, понятие plan_assigned_at и plan_valid_until, политика истечения Pro Beta.
Опиши статусы проектов: active, archived, reported, deleted (soft, 30 дней), правила подсчёта в лимиты, восстановление и UX при переполнении.
Опиши политику soft-delete для организаций и проектов (retention 30 дней), каскад soft-delete проектов при удалении организации.
Опиши загрузку логотипов/аватаров: рекомендуемая схема S3/R2 + signed URLs, таблица assets, валидация (PNG/JPEG/SVG, ≤512KB).
Определи feature flags: verifierRoleEnabled=false, billingUiEnabled=true (информативный режим), future: approvalsEnabled.
Укажи, что data_requests и mail_templates — дочерние проекта.
Расширь UX-гайд и IA
В docs→UX_GUIDE.md:
Обнови Site Map: добавь Organization Settings (/settings/organization), User Settings (/settings) и Organization Switcher в sidebar.
Добавь раздел Organization Switcher: контент (логотип, имя, метка плана Free/Pro Beta, счётчик активных проектов X / limit), действия (Create organization, Manage organization).
Добавь раздел Organization Settings с вкладками:
Profile: имя (обяз.), описание (опц.), логотип (upload), slug (readonly), план и valid_until (readonly), Danger Zone (soft delete: 30 дней).
Members: список участников, роль, last active, действия (Change role, Remove, Resend invite). Ограничения ролей: editors/verifiers учитывают лимит, viewers — unlimited.
Usage & Limits: отображение лимитов и текущего использования, CTA Upgrade plan (модал с контактами).
Обнови User Settings: профиль (имя, фамилия, должность, аватар), email (readonly в бете), смена пароля (модал), Organizations (список, роль, Open, Leave — кроме OWNER).
Добавь User flows: создание организации (авто Free), приглашение участника (editor/verifier блокируются на Free), удаление организации (soft delete), восстановление/перевод проекта (проверка лимита).
Page-to-API mapping для новых страниц/операций.
Пропиши API контракты
В docs→API_REFERENCE.md:
Organizations:
POST /api/organizations — создать (auto: Free), поля: display_name, description?, logo upload flow (signed URL).
GET /api/organizations/current — вернуть активную организацию, план, usage, лимиты.
PATCH /api/organizations/:id — обновить имя, описание, логотип.
DELETE /api/organizations/:id — soft-delete (каскад проектов).
Memberships:
GET/POST/PATCH/DELETE /api/organizations/:id/members — управление ролями, проверки лимитов для EDITOR/VERIFIER, viewers без ограничений.
POST /api/organizations/:id/invite — заглушка (описать payload и ожидаемый ответ).
Usage:
GET /api/organizations/:id/usage — агрегаты: active_projects, editors, verifiers, viewers.
Projects:
POST /api/projects — создание (требует проверки лимита активных).
PATCH /api/projects/:id — изменение статуса (active↔archived, →reported), правила read-only для reported.
DELETE /api/projects/:id — soft-delete.
POST /api/projects/:id/restore — восстановление (проверка лимита).
Users:
GET/PATCH /api/user/settings — профиль, аватар (upload), пароль (отдельный маршрут).
Billing placeholder:
GET /api/plan-definitions — список тарифов (Free, Pro Beta) для UI.
POST /api/organizations/:id/plan/upgrade — 501 Not Implemented (описать контракт на будущее).
Uploads:
POST /api/uploads/sign — получение signed URL, ограничения по типу/размеру, тип ресурса (org_logo|user_avatar).
Спецификации данных и миграций
В docs→DEVELOPMENT.md:
Описать миграции БД: создать таблицы organizations, organization_memberships, plan_definitions (seed), organization_usage_snapshots, assets; добавить organization_id в projects, contacts, data_requests; добавить статусы и deleted_at.
Seed: создать тестового пользователя, две организации (Free, Pro Beta) и membership’ы, пару проектов со статусами для демонстрации лимитов.
Команды для разработчиков: как выполнить миграции и сидинг, как сбросить данные.
Описать dev-стаб аутентификации/пользователя (если уже есть) и как он создаёт демо-данные.
Обнови индекс и добавь раздел про биллинг
В docs→README.md:
Обнови структуру и ссылки на новые/обновлённые документы.
Создай новый файл docs→BILLING_PLAYBOOK.md:
Опиши целевую архитектуру будущего биллинга (без Account сейчас), точки интеграции, жизненный цикл планов, историю назначений (future), вебхуки, источники usage, правила истечения Pro Beta.
Опиши UI-UX апгрейда (карточки планов и CTA), без фактических платежей в бете.
Привяжи к роадмапу и разложи в бэклог
В docs→planning→ROADMAP.md:
Добавь фазу «Multi-Org (без Account) & Plans» с вехами: Schema & Migrations → Org Settings & Switcher → Memberships & Roles → Project Status Lifecycle → Uploads (logos/avatars) → Soft-deletes & Retention → Usage snapshots → API hardening → Docs freeze.
Укажи внешние зависимости (object storage, env vars).
В docs→planning→BACKLOG.md:
Разбей на эпики и задачи с критериями приёмки:
Epic: Schema & Migrations (DDL, seed, feature flags).
Epic: Organization Settings (Profile, Members, Usage & Limits, Danger Zone).
Epic: Organization Switcher (UI, state, data binding).
Epic: Roles & Permissions (guards, checks).
Epic: Project Statuses (active/archived/reported/deleted, restore flow).
Epic: Uploads & Assets (signed URL, validation, linking).
Epic: Usage & Limits (counters, snapshots, checks).
Epic: API Contracts (routes, error codes, pagination).
Epic: Docs & QA (updates, test plan, a11y).
Для каждой задачи опиши DoD и Acceptance Criteria.
Подготовь тест-план
В docs→DEVELOPMENT.md или отдельным разделом:
Unit: проверки лимитов, ролей, статусов.
Integration: создание организации (Free), попытка добавить editor на Free (ошибка), удаление/восстановление проекта с проверкой лимита.
E2E: переключатель организаций, управление участниками, загрузка логотипа/аватара.
Политика soft-delete/retention, восстановление при переполнении лимита.
Зафиксируй риски и открытые вопросы
Добавь раздел «Open Questions & Risks» (в ARCHITECTURE.md или README):
Передача ownership (отложено).
Активирование verifier workflow (после запуска).
Хранилище и CDN для логотипов/аватаров (выбор провайдера).
Терминология reported vs finalized (решение: reported).
История смен планов — потенциально отдельная таблица позже.
Формальные требования к оформлению

Внутренние ссылки на файлы в доках пиши через стрелку, например: docs→ARCHITECTURE.md.
Пиши конкретно и однозначно. Избегай расплывчатых формулировок.
Для всех новых разделов добавь оглавление.
Для API укажи: метод, путь, auth, запрос (schema), ответы (успех/ошибки), коды ошибок, примеры payload’ов, edge cases.
Для БД-изменений: перечисли поля, типы, обязательность, индексы/уникальные ограничения, внешние ключи.
Для лимитов: явно сформулируй правила подсчёта и моменты проверки (при создании, изменении статуса, приглашении).
Для UX: добавь состояния disabled/empty/error и тексты ошибок/подсказок.
Выходные артефакты (Definition of Done)

Обновлённые файлы: docs→ARCHITECTURE.md, docs→UX_GUIDE.md, docs→API_REFERENCE.md, docs→DEVELOPMENT.md, docs→README.md, docs→planning→ROADMAP.md, docs→planning→BACKLOG.md.
Новый файл: docs→BILLING_PLAYBOOK.md.
Все документы согласованы по терминологии (roles, plans, statuses), взаимно ссылаются друг на друга.
Все API и БД-изменения описаны так, что разработчик может приступить к реализации.
Бэклог содержит разложение до уровня задач, готовых к взятию в спринт, с критериями приёмки.
Справочные материалы (где посмотреть контекст)

docs→README.md — индекс документации.
docs→ARCHITECTURE.md — техническая архитектура (нужно обновить).
docs→UX_GUIDE.md — IA и UX (нужно обновить).
docs→planning→ROADMAP.md — роадмап (нужно обновить).
docs→planning→BACKLOG.md — бэклог (нужно обновить).
docs→archive — исторические материалы (для справки).