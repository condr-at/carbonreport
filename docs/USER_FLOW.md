# User Flow & Page Structure

Диаграмма структуры страниц и навигации пользователя в Carbon Report Platform.

## Общая структура навигации

```mermaid
graph TD
    Start([Пользователь заходит на сайт]) --> Auth{Авторизован?}
    
    Auth -->|Нет| Landing[Landing Page<br/>Главная страница]
    Landing --> Login[Login Page<br/>Вход]
    Landing --> Register[Register Page<br/>Регистрация]
    
    Login --> Dashboard
    Register --> EmailVerify[Email Verification<br/>Подтверждение email]
    EmailVerify --> Dashboard
    
    Auth -->|Да| Dashboard[Dashboard<br/>Список проектов]
    
    Dashboard --> CreateProject[Create Project<br/>Создание проекта]
    Dashboard --> ProjectDetail[Project Detail<br/>Детали проекта]
    
    ProjectDetail --> Dataset[Dataset<br/>Сбор данных]
    ProjectDetail --> Roadmap[Roadmap<br/>Дорожная карта]
    ProjectDetail --> Reports[Reports<br/>Отчёты]
    ProjectDetail --> Files[Files<br/>Файлы]
    ProjectDetail --> Contacts[Contacts<br/>Контакты]
    
    Dataset --> QuestionnaireStart[Questionnaire<br/>Анкета для начала]
    Dataset --> ManualEntry[Manual Entry<br/>Ручной ввод данных]
    
    Reports --> CreateReport[Create Report<br/>Выбор шаблона]
    CreateReport --> FillReport[Fill Report<br/>Заполнение отчёта]
    FillReport --> PreviewReport[Preview Report<br/>Предпросмотр]
    PreviewReport --> ExportReport[Export Report<br/>Скачать HTML/PDF]
    
    Files --> UploadFile[Upload File<br/>Загрузка файла]
    Files --> LinkFile[Link to Data Point<br/>Привязка к данным]
    
    Contacts --> AddContact[Add Contact<br/>Добавить контакт]
    Contacts --> RequestData[Request Data<br/>Запросить данные]
    RequestData --> EmailSent[Email Sent<br/>Письмо отправлено]
    
    Dashboard --> Settings[Settings<br/>Настройки профиля]
    Settings --> Profile[Profile<br/>Имя, email, аватар]
    Settings --> Password[Change Password<br/>Смена пароля]
```

## Детальная структура страниц

```mermaid
graph LR
    subgraph "Public Pages"
        A1[/ <br/>Landing Page]
        A2[/login<br/>Вход]
        A3[/register<br/>Регистрация]
        A4[/verify-email<br/>Подтверждение]
        A5[/forgot-password<br/>Восстановление пароля]
    end
    
    subgraph "Protected Pages (требуют авторизации)"
        B1[/dashboard<br/>Главная]
        
        subgraph "Project Pages"
            C1[/projects/new<br/>Создать проект]
            C2[/projects/:id<br/>Обзор проекта]
            C3[/projects/:id/dataset<br/>Сбор данных]
            C4[/projects/:id/questionnaire<br/>Анкета]
            C5[/projects/:id/roadmap<br/>Дорожная карта]
            C6[/projects/:id/reports<br/>Список отчётов]
            C7[/projects/:id/reports/new<br/>Новый отчёт]
            C8[/projects/:id/reports/:reportId<br/>Редактор отчёта]
            C9[/projects/:id/files<br/>Файлы]
            C10[/projects/:id/contacts<br/>Контакты]
        end
        
        subgraph "Settings Pages"
            D1[/settings<br/>Настройки]
            D2[/settings/profile<br/>Профиль]
            D3[/settings/password<br/>Пароль]
        end
    end
    
    B1 --> C1
    B1 --> C2
    C2 --> C3
    C2 --> C4
    C2 --> C5
    C2 --> C6
    C2 --> C9
    C2 --> C10
    C6 --> C7
    C7 --> C8
    B1 --> D1
    D1 --> D2
    D1 --> D3
```

## Основные User Stories

```mermaid
sequenceDiagram
    actor User as Пользователь
    participant Landing as Landing Page
    participant Auth as Auth System
    participant Dashboard as Dashboard
    participant Project as Project Page
    participant Report as Report Builder
    
    Note over User,Report: Сценарий 1: Новый пользователь
    User->>Landing: Заходит на сайт
    Landing->>User: Показывает возможности
    User->>Auth: Регистрируется
    Auth->>User: Отправляет email подтверждение
    User->>Auth: Подтверждает email
    Auth->>Dashboard: Редирект на Dashboard
    
    Note over User,Report: Сценарий 2: Создание проекта
    User->>Dashboard: Создать новый проект
    Dashboard->>Project: Открывает форму
    User->>Project: Вводит название
    Project->>User: Предлагает анкету
    User->>Project: Заполняет анкету
    Project->>Project: Автозаполняет dataset
    
    Note over User,Report: Сценарий 3: Генерация отчёта
    User->>Project: Переходит в Reports
    Project->>Report: Выбирает ISO14067
    User->>Report: Заполняет поля
    Report->>User: Показывает % заполнения
    User->>Report: Нажимает Preview
    Report->>User: Показывает HTML отчёт
    User->>Report: Скачивает PDF
```

## Навигационная структура (Header/Sidebar)

```mermaid
graph TD
    subgraph "Top Navigation (для авторизованных)"
        Nav1[Logo → Dashboard]
        Nav2[Projects dropdown]
        Nav3[User menu]
    end
    
    Nav2 --> Nav2a[Мои проекты]
    Nav2 --> Nav2b[Создать новый]
    Nav2 --> Nav2c[Архивированные]
    
    Nav3 --> Nav3a[Настройки]
    Nav3 --> Nav3b[Выход]
    
    subgraph "Project Sidebar (внутри проекта)"
        Side1[Overview]
        Side2[Dataset]
        Side3[Roadmap]
        Side4[Reports]
        Side5[Files]
        Side6[Contacts]
    end
```

## Приоритеты разработки (MVP)

### Phase 1: Аутентификация ✅ Начнём с этого
1. `/login` - Вход
2. `/register` - Регистрация
3. `/verify-email` - Подтверждение email
4. Email sending (Resend)
5. JWT auth middleware

### Phase 2: Dashboard & Projects
1. `/dashboard` - Список проектов
2. `/projects/new` - Создание проекта
3. `/projects/:id` - Обзор проекта
4. CRUD операции для проектов

### Phase 3: Dataset & Roadmap
1. `/projects/:id/dataset` - Сбор данных (JSONB)
2. `/projects/:id/questionnaire` - Анкета
3. `/projects/:id/roadmap` - Чеклист roadmap

### Phase 4: Reports
1. `/projects/:id/reports` - Список отчётов
2. `/projects/:id/reports/new` - Выбор шаблона
3. `/projects/:id/reports/:id` - Редактор отчёта
4. HTML export

### Phase 5: Files & Contacts
1. `/projects/:id/files` - Загрузка файлов
2. S3 integration
3. `/projects/:id/contacts` - Управление контактами
4. Email requests

---

## Технические детали

### Routing (Next.js App Router)
```
src/app/
├── (public)/           # Группа для публичных страниц
│   ├── page.tsx       # Landing /
│   ├── login/
│   └── register/
├── (dashboard)/       # Группа для защищённых страниц
│   ├── layout.tsx     # Layout с навигацией
│   ├── dashboard/
│   ├── projects/
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   ├── dataset/
│   │   │   ├── reports/
│   │   │   └── ...
│   └── settings/
└── api/               # API Routes
    ├── auth/
    ├── projects/
    └── reports/
```

### Защита маршрутов
- Middleware проверяет JWT токен
- Редирект на `/login` если не авторизован
- Редирект на `/dashboard` если уже авторизован (для public pages)

