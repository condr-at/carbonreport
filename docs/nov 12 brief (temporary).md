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

