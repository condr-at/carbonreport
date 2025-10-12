# Design System — Carbon Report Platform

Документация дизайн-системы на основе **shadcn/ui** и совместимых библиотек.

---

## Содержание

1. [Цветовая палитра и темы](#1-цветовая-палитра-и-темы)
2. [Типографика](#2-типографика)
3. [Компоненты UI](#3-компоненты-ui)
4. [Паттерны и блоки](#4-паттерны-и-блоки)
5. [Layouts и Grid](#5-layouts-и-grid)
6. [Spacing и Sizing](#6-spacing-и-sizing)
7. [Icons и визуальные элементы](#7-icons-и-визуальные-элементы)
8. [Состояния и анимации](#8-состояния-и-анимации)
9. [Responsive Design](#9-responsive-design)

---

## 1. Цветовая палитра и темы

### Основная палитра (Light/Dark mode support)

```css
/* CSS Variables для shadcn/ui */
:root {
  /* Primary — основной бренд (зелёный, экологический) */
  --primary: 142 76% 36%;         /* #16a34a - green-600 */
  --primary-foreground: 0 0% 100%; /* белый текст */
  
  /* Secondary — вспомогательный цвет */
  --secondary: 210 40% 96%;        /* slate-50 */
  --secondary-foreground: 222 47% 11%; /* slate-900 */
  
  /* Destructive — удаление, ошибки */
  --destructive: 0 84% 60%;        /* red-500 */
  --destructive-foreground: 0 0% 100%;
  
  /* Muted — приглушённые элементы */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%; /* slate-600 */
  
  /* Accent — акценты, hover states */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  
  /* Background */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  
  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  
  /* Borders */
  --border: 214 32% 91%;          /* slate-200 */
  --input: 214 32% 91%;
  --ring: 142 76% 36%;            /* focus ring - primary */
  
  /* Chart colors */
  --chart-1: 142 76% 36%;         /* green */
  --chart-2: 221 83% 53%;         /* blue */
  --chart-3: 45 93% 47%;          /* yellow */
  --chart-4: 9 100% 64%;          /* red/orange */
  --chart-5: 262 83% 58%;         /* purple */
}

.dark {
  --primary: 142 76% 36%;
  --primary-foreground: 0 0% 100%;
  
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  
  --card: 217 33% 17%;
  --card-foreground: 210 40% 98%;
  
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  
  --border: 217 33% 17%;
  --input: 217 33% 17%;
}
```

### Семантические цвета

- **Success**: `green-500` (#22c55e) — успешные операции, заполненные поля
- **Warning**: `amber-500` (#f59e0b) — предупреждения, частично заполненные данные
- **Error**: `red-500` (#ef4444) — ошибки валидации
- **Info**: `blue-500` (#3b82f6) — информационные подсказки

---

## 2. Типографика

### Шрифты

```css
/* Next.js font import */
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter'
})
```

### Типографическая шкала

| Элемент | Класс | Размер | Высота строки | Вес |
|---------|-------|--------|---------------|-----|
| H1 (Page Title) | `text-4xl` | 36px | 40px | 700 |
| H2 (Section) | `text-3xl` | 30px | 36px | 600 |
| H3 (Subsection) | `text-2xl` | 24px | 32px | 600 |
| H4 (Card Title) | `text-xl` | 20px | 28px | 600 |
| Body Large | `text-lg` | 18px | 28px | 400 |
| Body | `text-base` | 16px | 24px | 400 |
| Body Small | `text-sm` | 14px | 20px | 400 |
| Caption | `text-xs` | 12px | 16px | 400 |
| Label | `text-sm` | 14px | 20px | 500 |

---

## 3. Компоненты UI

### 3.1. shadcn/ui Base Components

#### Базовые элементы

- **Button** — с вариантами: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Input** — текстовые поля с валидацией
- **Textarea** — многострочные текстовые поля
- **Label** — подписи к полям форм
- **Checkbox** — чекбоксы для множественного выбора
- **Radio Group** — радио-кнопки
- **Switch** — тогглы (например, фильтр "Показывать только незаполненные" в Dataset)
- **Select** — выпадающие списки (встроенный shadcn/ui Select)

#### Навигация

- **Navigation Menu** — верхняя навигация с dropdown
- **Breadcrumb** — хлебные крошки
- **Tabs** — вкладки внутри страниц проекта (Overview, Dataset, Reports, etc.)
- **Sidebar** — боковая навигация проекта
- **Dropdown Menu** — контекстные меню, User menu

#### Feedback

- **Alert** — информационные блоки (success, warning, error, info)
- **Toast** — всплывающие уведомления (react-hot-toast или sonner)
- **Progress** — прогресс-бары для completion %
- **Badge** — метки статуса (Active, Archived, 67% Complete)
- **Skeleton** — загрузочные плейсхолдеры

#### Модальные окна

- **Dialog** — модальные окна (Select Contact, Create Contact, Confirm Delete)
- **Alert Dialog** — подтверждение действий (Delete Project, Unsaved Changes Warning)
- **Sheet** — боковые панели (настройки, фильтры)
- **Popover** — всплывающие подсказки и меню

#### Отображение данных

- **Card** — карточки проектов, отчётов, контактов
- **Table** — базовые таблицы (список проектов, список контактов)
- **Accordion** — сворачиваемые секции (FAQ, группировка полей в формах)
- **Separator** — разделители секций

### 3.2. Продвинутые компоненты (расширения)

#### Таблицы — Продвинутая таблица (TBD)

**Использование**:
- **Dataset Grid** (`/projects/:id/dataset`) — Excel-like таблица с сортировкой, фильтрацией, inline editing
- **Contacts list** — таблица контактов с поиском и фильтрами
- **Files repository** — список файлов с метаданными

**Возможности** (требования к библиотеке):
- Сортировка по колонкам
- Фильтрация (текстовая, по типу, по дате)
- Пагинация (опционально)
- Inline editing ячеек
- Selection (чекбоксы для batch actions)
- CSV export
- Sticky header
- Responsive columns

**Выбор библиотеки**: TBD (рассматриваются @tanstack/react-table, AG Grid Community, или кастомное решение на shadcn/ui Table)

**Пример колонок для Dataset Grid**:

| Колонка | Описание | Тип | Editable |
|---------|----------|-----|----------|
| Field ID | Идентификатор поля | text | ❌ |
| Item ID | ID элемента (для табличных) | text | ❌ |
| Value | Значение | text/number | ✅ |
| Last Updated | Дата обновления | datetime | ❌ |
| Actions | Request Data, Clear | buttons | — |

#### Формы — React Hook Form + Zod

**Библиотека**: `react-hook-form` + `zod` для валидации

**Использование**:
- Project creation form
- Report editing forms
- Contact creation/editing
- Settings (profile, password)
- Authentication forms

**Паттерн**:
```tsx
const formSchema = z.object({
  projectName: z.string().min(3, "Минимум 3 символа"),
  description: z.string().optional(),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
})
```

**Особенности**:
- Валидация на клиенте (Zod)
- Error messages под полями
- Warning при навигации с несохранёнными изменениями
- Manual save (кнопка "Save"), без autosave

#### Rich Text / Markdown (опционально, пост-MVP)

**Библиотека**: `@tiptap/react` или `react-markdown`

**Использование**:
- Project description (если нужно форматирование)
- Hints и guidance текст (пока просто текст)

---

## 4. Паттерны и блоки

### 4.0. Базовые UI паттерны (из shadcn/ui)

#### 4.0.1. Модальные окна и оверлеи

**Dialog (Modal)** — модальное окно
- **Использование**: Подтверждение действий, формы создания/редактирования, выбор контакта
- **Компонент**: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- **Примеры**:
  - Create/Edit Contact
  - Request Data (выбор контакта)
  - Add Report Type
  - Create Project (если одностраничная форма вместо wizard)

**Alert Dialog** — диалог подтверждения
- **Использование**: Подтверждение деструктивных действий
- **Компонент**: `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, etc.
- **Примеры**:
  - Delete Project
  - Delete Contact
  - Remove Report
  - Unsaved Changes Warning
  - Archive Project

**Sheet** — боковая панель
- **Использование**: Фильтры, настройки, дополнительная информация
- **Компонент**: `Sheet`, `SheetContent`, `SheetHeader`, etc.
- **Направления**: `left`, `right`, `top`, `bottom`
- **Примеры**:
  - Mobile navigation menu
  - Advanced filters (Dataset, Contacts)
  - Contact details / history
  - Quick settings

**Popover** — всплывающее окно
- **Использование**: Контекстные меню, подсказки, дополнительная информация
- **Компонент**: `Popover`, `PopoverContent`, `PopoverTrigger`
- **Примеры**:
  - Info hints (иконка "i" с подсказкой)
  - Date picker
  - Color picker (если нужен)
  - Quick actions menu

**Tooltip** — всплывающая подсказка
- **Использование**: Краткие пояснения при наведении
- **Компонент**: `Tooltip`, `TooltipContent`, `TooltipTrigger`, `TooltipProvider`
- **Примеры**:
  - Пояснения к иконочным кнопкам
  - Дополнительная информация о полях
  - Сокращённый текст (при overflow)

#### 4.0.2. Навигация

**Tabs** — вкладки
- **Использование**: Переключение между разделами на одной странице
- **Компонент**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- **Примеры**:
  - Settings (Profile / Password / Notifications)
  - Project Overview sections (если несколько вкладок)
  - Report sections (если длинный отчёт разбит на вкладки)

**Breadcrumb** — хлебные крошки
- **Использование**: Навигация по иерархии страниц
- **Компонент**: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`
- **Примеры**:
  - Dashboard → Project → Dataset
  - Dashboard → Project → Reports → ISO14067

**Navigation Menu** — навигационное меню
- **Использование**: Верхняя навигация с dropdown
- **Компонент**: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`
- **Примеры**:
  - Top navigation: Projects (dropdown), Contacts, Settings
  - User menu dropdown

**Dropdown Menu** — выпадающее меню
- **Использование**: Контекстные действия, меню настроек
- **Компонент**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`
- **Примеры**:
  - User menu (Profile, Settings, Logout)
  - Table row actions (Edit, Delete, Archive)
  - Project card actions (Duplicate, Archive, Delete)
  - Report actions menu

**Sidebar** — боковая навигация
- **Использование**: Постоянная навигация внутри проекта
- **Компонент**: Кастомный или использование shadcn/ui `Sidebar` (если есть)
- **Примеры**:
  - Project Sidebar (Overview, Dataset, Reports, etc.)
  - Settings Sidebar

#### 4.0.3. Формы и инпуты

**Input** — текстовое поле
- **Типы**: text, email, password, number, tel, url
- **Состояния**: default, focus, error, disabled
- **Примеры**:
  - Project Name
  - Contact Name, Email, Position
  - Search fields
  - Data point values

**Textarea** — многострочное текстовое поле
- **Использование**: Длинные тексты, описания
- **Примеры**:
  - Project Description
  - Notes field
  - Email template body (пост-MVP)

**Select** — выпадающий список
- **Компонент**: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- **Примеры**:
  - Report Type selection
  - Filter by status (Active, Archived)
  - Sort by (Name, Date, Progress)
  - Questionnaire answers

**Checkbox** — чекбокс
- **Состояния**: unchecked, checked, indeterminate
- **Примеры**:
  - Report type selection (multiple)
  - Roadmap checklist items
  - Table row selection
  - Terms & Conditions agreement

**Radio Group** — радио-кнопки
- **Использование**: Выбор одного варианта из нескольких
- **Компонент**: `RadioGroup`, `RadioGroupItem`
- **Примеры**:
  - Questionnaire answers (single choice)
  - Project view mode selection (если нужно)

**Switch** — переключатель
- **Использование**: Вкл/Выкл настроек, фильтров
- **Компонент**: `Switch`
- **Примеры**:
  - Show archived projects
  - Enable notifications
  - Dark mode toggle
  - Show empty fields only

**Slider** — ползунок
- **Использование**: Выбор числового значения в диапазоне
- **Компонент**: `Slider`
- **Примеры**:
  - Filter by completion % (0-100%)
  - Date range (пост-MVP)

**Date Picker** — выбор даты
- **Компонент**: `Calendar` + `Popover` (shadcn/ui pattern)
- **Библиотека**: `react-day-picker`
- **Примеры**:
  - Project creation date filter
  - Data request deadline (пост-MVP)
  - Report generation date

**Combobox** — комбинированный список (autocomplete)
- **Использование**: Поиск + выбор из списка
- **Компонент**: `Combobox` (shadcn/ui pattern)
- **Примеры**:
  - Contact search and select (Request Data dialog)
  - Project search (если много проектов)

**Form** — обёртка формы
- **Компонент**: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
- **Интеграция**: `react-hook-form` + `zod`
- **Использование**: Все формы в приложении

#### 4.0.4. Feedback и статусы

**Alert** — информационное сообщение
- **Варианты**: default, destructive, warning, success
- **Компонент**: `Alert`, `AlertTitle`, `AlertDescription`
- **Примеры**:
  - Success message после сохранения
  - Error message при валидации
  - Info hint на странице
  - Warning о несохранённых изменениях

**Toast** — всплывающее уведомление
- **Библиотека**: `sonner` (рекомендация shadcn/ui) или `react-hot-toast`
- **Типы**: success, error, info, warning, loading
- **Примеры**:
  - "Project created successfully"
  - "Contact deleted"
  - "Data saved"
  - "Error: Failed to load data"

**Badge** — метка, тег
- **Варианты**: default, secondary, destructive, outline, success
- **Компонент**: `Badge`
- **Примеры**:
  - Project status (Active, Archived)
  - Report count (3 reports)
  - Completion % (67% Complete)
  - Active requests count
  - New/Updated indicators

**Progress** — индикатор прогресса
- **Типы**: Linear (линейный), Circular (кольцевой)
- **Компонент**: `Progress`
- **Примеры**:
  - Report completion (0-100%)
  - Project overall progress
  - File upload progress (пост-MVP)
  - Loading data

**Skeleton** — загрузочный плейсхолдер
- **Компонент**: `Skeleton`
- **Примеры**:
  - Loading project cards
  - Loading table rows
  - Loading report form
  - Loading contact list

**Spinner** — индикатор загрузки
- **Компонент**: `Loader2` (из lucide-react) с `animate-spin`
- **Примеры**:
  - Button loading state
  - Page loading
  - Fetching data

#### 4.0.5. Отображение данных

**Card** — карточка
- **Компонент**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- **Примеры**:
  - Project Card
  - Report Card
  - Contact Select Card
  - Empty State Card
  - Stats Card (Dashboard overview)

**Table** — таблица
- **Компонент**: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`
- **Примеры**:
  - Contacts table
  - Files list
  - Data requests history
  - Basic project list (если не карточки)

**Accordion** — сворачиваемые секции
- **Компонент**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **Примеры**:
  - FAQ section (Landing page)
  - Grouped dataset fields (Normal View)
  - Report sections (если нужна группировка)
  - Roadmap groups

**Separator** — разделитель
- **Компонент**: `Separator`
- **Ориентация**: horizontal, vertical
- **Примеры**:
  - Разделение секций формы
  - Разделение dropdown menu items
  - Визуальное разделение контента

**Avatar** — аватар
- **Компонент**: `Avatar`, `AvatarImage`, `AvatarFallback`
- **Примеры**:
  - User avatar (header, settings)
  - Contact avatar (table, cards)
  - Fallback с инициалами

**ScrollArea** — область прокрутки
- **Компонент**: `ScrollArea`
- **Примеры**:
  - Contact list в Request Data dialog
  - Long dropdown menus
  - Sidebar navigation (если много пунктов)

**Pagination** — пагинация
- **Компонент**: `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious`
- **Примеры**:
  - Contacts table
  - Projects list (если много)
  - Files list

#### 4.0.6. Дополнительные паттерны

**Command** — командная палитра
- **Компонент**: `Command`, `CommandInput`, `CommandList`, `CommandItem`
- **Примеры**:
  - Quick search (Cmd+K) — пост-MVP
  - Global navigation search

**Context Menu** — контекстное меню (правый клик)
- **Компонент**: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`
- **Примеры**:
  - Right-click на Project Card (Edit, Duplicate, Delete)
  - Right-click на Table Row

**Hover Card** — карточка при наведении
- **Компонент**: `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
- **Примеры**:
  - Preview contact info при наведении на имя
  - Preview project details

**Resizable** — изменяемые панели
- **Компонент**: `ResizablePanel`, `ResizablePanelGroup`, `ResizableHandle`
- **Примеры**:
  - Split view (Dataset Normal + Preview) — пост-MVP
  - Adjustable sidebar width

**Collapsible** — сворачиваемый блок
- **Компонент**: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- **Примеры**:
  - Sidebar sections
  - Dataset field groups
  - Advanced filters toggle

### 4.1. Карточка проекта (Project Card)

**Расположение**: Dashboard

**Структура**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>{projectName}</CardTitle>
    <CardDescription>Created {date}</CardDescription>
  </CardHeader>
  <CardContent>
    <div>
      <Progress value={completionPercentage} />
      <p>{completionPercentage}% Complete</p>
    </div>
    <div className="flex gap-2 mt-4">
      <Badge variant="secondary">{reportCount} reports</Badge>
      <Badge variant="outline">{filesCount} files</Badge>
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Duplicate</Button>
    <Button variant="default" size="sm">Open</Button>
  </CardFooter>
</Card>
```

**Вариации**:
- Empty state card (Create your first project)
- Archived project (приглушённые цвета)

### 10.2. Dataset Surface

**Структура**: Одна страница `/projects/:id/dataset` с табличным видом, тулбаром фильтров и контекстными действиями.

**Роуты**:
- `/projects/:id/dataset` — основная таблица данных проекта (inline edit, Request Data, CSV export)

**Layout**:
```tsx
<section className="flex flex-col gap-4">
  <header className="flex flex-wrap items-center gap-3">
    <DatasetBreadcrumb projectId={projectId} />
    <div className="ml-auto flex gap-2">
      <Button variant="outline" size="sm" onClick={handleFilterClick}>
        <Filter className="mr-2 h-4 w-4" /> Фильтры
      </Button>
      <Button variant="outline" size="sm" onClick={handleShowOnlyEmptyToggle}>
        <EyeOff className="mr-2 h-4 w-4" /> Только пустые
      </Button>
      <Button size="sm" onClick={handleExportCsv} disabled={isExporting}>
        {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        Export CSV
      </Button>
    </div>
  </header>

  <DatasetGridTable
    data={rows}
    onCellEdit={handleCellEdit}
    onRequestData={handleRequestData}
    savingState={savingState}
  />

  <DatasetPropertyPanel
    open={isPanelOpen}
    onOpenChange={setPanelOpen}
    dataPoint={selectedDataPoint}
  />
</section>
```

**Особенности UX**:
- Состояния сохранения/ошибок отображаются на уровне строк и глобальным toast.
- Request Data кнопки встроены в действия строки/ячейки.
- Фильтры и поиск через Sheet/Popover, результаты отражаются в тулбаре в виде чипов.
    <Button onClick={handleAddContact}>
      <Plus className="mr-2 h-4 w-4" />
      Add Contact
    </Button>
  </div>

  {/* Таблица контактов */}
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Active Requests</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{contact.initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{contact.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {contact.position || '—'}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {contact.email}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="secondary">
                {contact.activeRequestsCount}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewHistory(contact.id)}>
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(contact.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleArchive(contact.id)}
                    className="text-muted-foreground"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  {/* Пагинация (опционально) */}
  {totalPages > 1 && (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {startIndex}-{endIndex} of {totalContacts} contacts
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )}
</div>
```

**Колонки**:
| Колонка | Описание | Сортировка | Фильтрация |
|---------|----------|------------|------------|
| Name | Имя с аватаром (инициалы) | ✅ | ✅ (search) |
| Position | Должность | ✅ | ❌ |
| Email | Email адрес | ✅ | ✅ (search) |
| Active Requests | Количество активных запросов | ✅ | ❌ |
| Actions | Dropdown меню действий | ❌ | ❌ |

### 4.3.1. Contact Select Card (для диалога Request Data)

**Расположение**: Dialog "Request Data" в Dataset/Report

**Структура** (компактная карточка для выбора):
```tsx
<button
  onClick={() => onSelect(contact)}
  className={cn(
    "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors",
    "hover:bg-accent hover:border-primary",
    isSelected && "border-primary bg-accent"
  )}
>
  <Avatar className="h-10 w-10">
    <AvatarFallback>{contact.initials}</AvatarFallback>
  </Avatar>
  <div className="flex-1 text-left">
    <p className="font-medium text-sm">{contact.name}</p>
    <p className="text-xs text-muted-foreground">
      {contact.position} • {contact.email}
    </p>
  </div>
  {isSelected && (
    <CheckCircle2 className="h-5 w-5 text-primary" />
  )}
</button>
```

### 4.4. Data Point Field (Normal View)

**Расположение**: Dataset, Report Editor

**Структура**:
```tsx
<div className="space-y-2">
  <Label htmlFor={fieldId}>
    {fieldLabel}
    {required && <span className="text-destructive">*</span>}
  </Label>
  
  {hint && (
    <p className="text-sm text-muted-foreground">{hint}</p>
  )}
  
  <div className="flex gap-2">
    <Input 
      id={fieldId}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="flex-1"
    />
    <Button 
      variant="outline" 
      size="icon"
      onClick={openRequestDataDialog}
      title="Request Data from Contact"
    >
      <MailIcon className="h-4 w-4" />
    </Button>
  </div>
  
  {lastContact && (
    <p className="text-xs text-muted-foreground">
      Last requested from {lastContact.name}
    </p>
  )}
  
  {error && (
    <p className="text-xs text-destructive">{error}</p>
  )}
</div>
```

### 4.5. Request Data Dialog

**Использование**: Dataset, Report Editor

**Структура**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Request Data</DialogTitle>
      <DialogDescription>
        Select a contact to request "{fieldLabel}" data
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Search existing contacts */}
      <Input 
        placeholder="Search contacts..." 
        value={searchQuery}
        onChange={handleSearch}
      />
      
      {/* Contact list */}
      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredContacts.map(contact => (
          <ContactSelectCard 
            key={contact.id}
            contact={contact}
            onSelect={handleSelectContact}
          />
        ))}
      </div>
      
      {/* Create new contact inline */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={toggleCreateNewContact}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Create New Contact
      </Button>
      
      {showCreateForm && (
        <CreateContactInlineForm 
          onSuccess={handleContactCreated}
        />
      )}
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={handleGenerateMailto} disabled={!selectedContact}>
        Generate Email
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 4.6. Roadmap / Checklist Item

**Расположение**: `/projects/:id/roadmap`

**Структура**:
```tsx
<div className="flex items-start gap-3 p-4 border rounded-lg">
  <Checkbox 
    checked={isCompleted}
    onCheckedChange={handleToggle}
    id={itemId}
  />
  
  <div className="flex-1">
    <Label 
      htmlFor={itemId}
      className={cn(
        "text-base font-medium cursor-pointer",
        isCompleted && "line-through text-muted-foreground"
      )}
    >
      {title}
    </Label>
    
    {description && (
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>
    )}
    
    {linkedDataPoint && (
      <Button 
        variant="link" 
        size="sm" 
        className="px-0 mt-2"
        onClick={goToDataPoint}
      >
        Go to field →
      </Button>
    )}
  </div>
  
  {hint && (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">{hint}</p>
      </PopoverContent>
    </Popover>
  )}
</div>
```

### 4.7. File Upload Zone

**Расположение**: `/projects/:id/files`

**Структура**:
```tsx
<div 
  className={cn(
    "border-2 border-dashed rounded-lg p-8 text-center",
    isDragging && "border-primary bg-primary/5"
  )}
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
  <p className="mt-4 text-sm font-medium">
    Drag and drop files here
  </p>
  <p className="text-xs text-muted-foreground mt-1">
    or click to browse (max 10 MB per file)
  </p>
  <Button variant="outline" size="sm" className="mt-4">
    Browse Files
  </Button>
</div>
```

### 4.8. Empty State

**Использование**: Пустые списки (проекты, контакты, отчёты)

**Структура**:
```tsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div className="rounded-full bg-muted p-6 mb-4">
    <EmptyIcon className="h-12 w-12 text-muted-foreground" />
  </div>
  <h3 className="text-xl font-semibold mb-2">{title}</h3>
  <p className="text-sm text-muted-foreground max-w-md mb-6">
    {description}
  </p>
  <Button onClick={onAction}>
    {actionLabel}
  </Button>
</div>
```

**Примеры**:
- No projects yet → "Create your first project"
- No contacts → "Add your first contact"
- No files uploaded → "Upload first file"

### 4.9. Loading States

**Паттерн**: Показывать состояния загрузки для лучшего UX

**Варианты**:

**Button Loading**:
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

**Page Loading** (skeleton):
```tsx
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-32 w-full" />
  <div className="grid grid-cols-3 gap-4">
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
</div>
```

**List Loading** (skeleton cards):
```tsx
{isLoading ? (
  Array.from({ length: 3 }).map((_, i) => (
    <Card key={i}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  ))
) : (
  projects.map(project => <ProjectCard key={project.id} {...project} />)
)}
```

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
      <AlertDialogDescription>
        You have unsaved changes. Are you sure you want to leave this page?
        Your changes will be lost.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleStay}>
        Stay on Page
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleLeave} className="bg-destructive">
        Leave Without Saving
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Использование**:
- Формы проектов
- Report editor
- Dataset editing
- Settings forms

### 4.12. Confirmation Dialogs

**Паттерн**: Подтверждение деструктивных действий

**Delete Confirmation**:
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Project
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete the project "{projectName}" and all 
        associated data. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleDelete}
        className="bg-destructive hover:bg-destructive/90"
      >
        Delete Project
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Примеры**:
- Delete Project
- Delete Contact
- Remove Report
- Archive Project
- Clear all data

### 4.13. Search & Filters

**Паттерн**: Поиск и фильтрация списков

**Simple Search**:
```tsx
<div className="flex items-center gap-2 max-w-md">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search projects..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />
  </div>
  {searchQuery && (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSearchQuery('')}
    >
      <X className="h-4 w-4" />
    </Button>
  )}
</div>
```

**Search + Filters**:
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Search */}
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-9"
    />
  </div>
  
  {/* Filters */}
  <div className="flex items-center gap-2">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
      </SelectContent>
    </Select>
    
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="progress">Progress</SelectItem>
      </SelectContent>
    </Select>
    
    {/* Advanced Filters (Sheet) */}
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
        </SheetHeader>
        {/* Filter options */}
      </SheetContent>
    </Sheet>
  </div>
</div>
```

### 4.14. Bulk Actions

**Паттерн**: Массовые действия над выбранными элементами

```tsx
{selectedItems.length > 0 && (
  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
    <p className="text-sm font-medium">
      {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
    </p>
    <div className="flex gap-2 ml-auto">
      <Button variant="outline" size="sm" onClick={handleBulkArchive}>
        <Archive className="mr-2 h-4 w-4" />
        Archive
      </Button>
      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClearSelection}>
        Clear
      </Button>
    </div>
  </div>
)}
```

**Использование**:
- Contacts table (bulk delete, bulk archive)
- Files list (bulk delete)
- Dataset grid (bulk clear values, массовое применение подсказок)

### 4.15. Keyboard Shortcuts Hints

**Паттерн**: Подсказки о горячих клавишах

```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <span>Quick search</span>
  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
    <span className="text-xs">⌘</span>K
  </kbd>
</div>
```

**Общие shortcuts** (пост-MVP):
- `Cmd/Ctrl + K` — Quick search
- `Cmd/Ctrl + S` — Save
- `Cmd/Ctrl + N` — New project
- `Esc` — Close dialog/sheet

### 4.16. Header & Navigation

**Top Header** — для авторизованных пользователей

```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center">
    {/* Logo */}
    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
      <span className="font-bold text-xl">Carbon Report</span>
    </Link>
    
      
      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          {/* Mobile navigation */}
        </SheetContent>
      </Sheet>
    </div>
  </div>
</header>
```

### 4.17. Project Sidebar

```tsx
<aside className="w-64 border-r bg-muted/40 min-h-screen">
  <div className="flex h-14 items-center border-b px-4">
    <h2 className="font-semibold truncate">{projectName}</h2>
  </div>

  <nav className="space-y-1 p-4">
    <SidebarLink href={`/projects/${projectId}`} icon={LayoutDashboard}>
      Overview
    </SidebarLink>

    <SidebarLink href={`/projects/${projectId}/dataset`} icon={Database}>
      Dataset
    </SidebarLink>

    <SidebarLink href={`/projects/${projectId}/roadmap`} icon={ListChecks}>
      Roadmap
    </SidebarLink>

    <SidebarLink href={`/projects/${projectId}/reports`} icon={FileText}>
      Reports
      {reportCount > 0 && (
        <Badge variant="secondary" className="ml-auto">
          {reportCount}
        </Badge>
      )}
    </SidebarLink>

    <SidebarLink href={`/projects/${projectId}/files`} icon={Paperclip}>
      Files
      {filesCount > 0 && (
        <Badge variant="secondary" className="ml-auto">
          {filesCount}
        </Badge>
      )}
    </SidebarLink>
  </nav>

  <div className="mt-auto border-t p-4 bg-background">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <MoreHorizontal className="mr-2 h-4 w-4" />
          Project Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate Project
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</aside>
```

**SidebarLink компонент**:
```tsx
function SidebarLink({
  href,
  icon: Icon,
  children,
  className
}: SidebarLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-medium",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{children}</span>
    </Link>
  )
}
```

**UX-рекомендации**:
- Активное состояние подсвечивается через `bg-accent`.
- Для мобильных повторяем ссылки в `Sheet`.
- Кнопки действий блокируются, пока выполняется запрос (loading state).

### 4.18. Панель свойств сущности

**Назначение**: боковая панель с минимальным набором editable-полей для файлов, data points и контактов.

**Компоненты**: `Sheet`, `Form`, `TagCombobox` (autocomplete + chips), `Button`, `Separator`.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[360px] sm:w-[420px]">
    <SheetHeader>
      <SheetTitle>{entityTitle}</SheetTitle>
      <SheetDescription>Редактируйте только необходимые свойства.</SheetDescription>
    </SheetHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <FormField
          control={form.control}
          name="linkedDataPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Points</FormLabel>
              <TagCombobox
                value={field.value}
                onChange={field.onChange}
                placeholder="Свяжите с датапоинтом"
                fetchOptions={searchDataPoints}
              />
              <FormDescription>
                Автодополнение + чипсы; каждый тег можно удалить.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <Textarea rows={3} placeholder="Краткий контекст" {...field} />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
          <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </form>
    </Form>
  </SheetContent>
</Sheet>
```

**Принципы**:
- Показываем только ключевые поля (для файлов: имя, привязанные data points, заметка).
- `TagCombobox` блокирует дубли и показывает количество выбранных датапоинтов.
- Loading и error состояния отображаются в кнопке и через toast.
- Панель закрывается автоматически после успешного сохранения.

**Повторное использование**:
- `Files` — привязка файла к data points.
- `Dataset` — назначение ответственного контакта или заметки.
- `Contacts` — быстрое обновление должности/роли.

### 4.19. Breadcrumbs

**Паттерн**: Навигация по иерархии

```tsx
<Breadcrumb className="mb-6">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href={`/projects/${projectId}`}>
        {projectName}
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dataset</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### 4.20. Stats Cards (Dashboard Overview)

**Паттерн**: Карточки со статистикой

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
      <Folder className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{totalProjects}</div>
      <p className="text-xs text-muted-foreground">
        {activeProjects} active
      </p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{avgCompletion}%</div>
      <p className="text-xs text-muted-foreground">
        Average across all projects
      </p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Reports</CardTitle>
      <FileText className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{totalReports}</div>
      <p className="text-xs text-muted-foreground">
        {completedReports} completed
      </p>
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Contacts</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{totalContacts}</div>
      <p className="text-xs text-muted-foreground">
        {activeRequests} active requests
      </p>
    </CardContent>
  </Card>
</div>
```

### 4.21. Theme Toggle

**Паттерн**: Переключатель темы (Light/Dark)

```tsx
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 4.22. Landing Page Components

**Hero Section**:
```tsx
<section className="container flex flex-col items-center gap-8 py-24 text-center">
  <Badge variant="secondary" className="mb-4">
    🌱 Sustainable Carbon Reporting
  </Badge>
  
  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
    Simplify Your
    <span className="text-primary"> Carbon Footprint</span>
    <br />
    Reporting
  </h1>
  
  <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
    Create compliant carbon reports with ease. Manage data collection,
    collaborate with your team, and generate ISO 14067 and CBAM reports.
  </p>
  
  <div className="flex flex-col gap-4 sm:flex-row">
    <Button size="lg" asChild>
      <Link href="/register">
        Get Started Free
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
    <Button size="lg" variant="outline" asChild>
      <Link href="/login">
        Sign In
      </Link>
    </Button>
  </div>
</section>
```

**Features Section**:
```tsx
<section className="container py-24">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">Features</h2>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      Everything you need to create compliant carbon footprint reports
    </p>
  </div>
  
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    <FeatureCard
      icon={FileText}
      title="Multiple Report Standards"
      description="Support for ISO 14067, CBAM, and other carbon reporting standards"
    />
    <FeatureCard
      icon={Database}
      title="Centralized Data Collection"
      description="One dataset shared across all reports. Update once, reflect everywhere"
    />
    <FeatureCard
      icon={Users}
      title="Contact Management"
      description="Request data from suppliers and partners via email templates"
    />
    <FeatureCard
      icon={ListChecks}
      title="Guided Roadmap"
      description="Step-by-step checklist to complete your carbon footprint report"
    />
    <FeatureCard
      icon={Download}
      title="Easy Export"
      description="Print to PDF directly from your browser. No complex setup needed"
    />
    <FeatureCard
      icon={Shield}
      title="Secure & Private"
      description="Your data is encrypted and stored securely. We never share it"
    />
  </div>
</section>
```

**FeatureCard**:
```tsx
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
```

### 4.23. Authentication Forms

**Login Form**:
```tsx
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle className="text-2xl">Sign In</CardTitle>
    <CardDescription>
      Enter your credentials to access your account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  </CardContent>
  <CardFooter className="flex flex-col gap-4">
    <Separator />
    <p className="text-sm text-muted-foreground text-center">
      Don't have an account?{' '}
      <Link href="/register" className="text-primary hover:underline">
        Sign up
      </Link>
    </p>
  </CardFooter>
</Card>
```

**Register Form** — аналогично, с дополнительными полями (name, confirm password, terms agreement)

### 4.24. Email Verification

**Паттерн**: Страница подтверждения email

```tsx
<div className="flex flex-col items-center justify-center min-h-screen p-4">
  <Card className="w-full max-w-md">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="text-2xl">Check Your Email</CardTitle>
      <CardDescription>
        We've sent a verification link to
        <br />
        <strong>{email}</strong>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click the link in the email to verify your account.
          The link will expire in 24 hours.
        </AlertDescription>
      </Alert>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleResend}
        disabled={isResending || cooldown > 0}
      >
        {isResending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : cooldown > 0 ? (
          `Resend in ${cooldown}s`
        ) : (
          'Resend Email'
        )}
      </Button>
      
      <Button variant="ghost" className="w-full" asChild>
        <Link href="/login">Back to Sign In</Link>
      </Button>
    </CardContent>
  </Card>
</div>
```

---

## 5. Layouts и Grid

### 5.1. Page Layout (Protected Pages)

```tsx
<div className="min-h-screen flex flex-col">
  {/* Top Navigation */}
  <Header />
  
  <div className="flex-1 flex">
    {/* Sidebar (если внутри проекта) */}
    {isProjectPage && <ProjectSidebar />}
    
    {/* Main Content */}
    <main className="flex-1 p-6 lg:p-8">
      {children}
    </main>
  </div>
</div>
```

| 4 | `m-4`, `p-4` | 16px |
| 6 | `m-6`, `p-6` | 24px |
| 8 | `m-8`, `p-8` | 32px |
| 12 | `m-12`, `p-12` | 48px |

### Sizing Guidelines

**Кнопки**:
- `size="sm"` — 32px height
- `size="default"` — 40px height
- `size="lg"` — 48px height
- `size="icon"` — 40x40px square

**Input Fields**:
- Default height: 40px
- Small: 32px

**Cards**:
- Padding: `p-6` (24px)
- Gap между карточками: `gap-6` (24px)

---

## 8. Состояния и анимации

### Состояния компонентов

**Button**:
- `:hover` — opacity 90%, scale 98%
- `:active` — scale 95%
- `:disabled` — opacity 50%, cursor not-allowed
- `:focus` — ring (focus ring)

**Input**:
- `:focus` — border primary color, ring
- `:error` — border destructive, ring destructive
- `:disabled` — bg muted, cursor not-allowed

**Card**:
- `:hover` — subtle shadow increase (опционально)

### Анимации

**Transition defaults**:
```css
transition: all 150ms ease-in-out;
```

**Loading states**:
- Skeleton loaders для списков
- Spinner для кнопок (`<Loader2 className="animate-spin" />`)

**Toast notifications**:
- Slide in from top-right
- Auto-dismiss через 3-5 секунд
- Success, Error, Info variants

**Dialog/Sheet**:
- Fade in backdrop
- Slide in content (Dialog from center, Sheet from side)

---

## 9. Responsive Design

### Breakpoints (Tailwind)

| Breakpoint | Размер | Prefix |
|------------|--------|--------|
| Mobile | < 640px | — |
| Tablet | ≥ 640px | `sm:` |
| Desktop small | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Desktop large | ≥ 1280px | `xl:` |

### Адаптивные паттерны

**Navigation**:
- Mobile: Hamburger menu + Sheet для sidebar
- Desktop: Горизонтальная навигация + боковой Sidebar внутри проекта

**Cards Grid**:
- Mobile: 1 колонка
- Tablet: 2 колонки
- Desktop: 3 колонки (для мелких карточек)

**Forms**:
- Mobile: 1 колонка
- Desktop: 2 колонки для коротких полей (имя/фамилия)

### 10.3. Progress Indicator

**Компонент**: Кольцевой прогресс или линейный прогресс-бар

```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">Completion</span>
    <span className="text-sm text-muted-foreground">{completion}%</span>
  </div>
  <Progress value={completion} className="h-2" />
</div>
```

**Вариант с кольцом** (для report cards):
```tsx
<div className="relative inline-flex items-center justify-center">
  <svg className="w-20 h-20">
    <circle 
      className="text-muted" 
      strokeWidth="4" 
      stroke="currentColor" 
      fill="transparent" 
      r="30" 
      cx="40" 
      cy="40"
    />
    <circle 
      className="text-primary" 
      strokeWidth="4" 
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      strokeLinecap="round"
      stroke="currentColor" 
      fill="transparent" 
      r="30" 
      cx="40" 
      cy="40"
    />
  </svg>
  <span className="absolute text-lg font-semibold">{completion}%</span>
</div>
```

### 10.4. Print-Friendly Report View

**Расположение**: `/projects/:id/reports/:reportId/print`

**Паттерн**:
```tsx
<div className="print:max-w-none max-w-4xl mx-auto p-8 bg-white">
  {/* Header с логотипом */}
  <div className="flex items-center justify-between mb-8 pb-4 border-b print:border-black">
    <div>
      <h1 className="text-3xl font-bold">{reportTitle}</h1>
      <p className="text-muted-foreground">{projectName}</p>
    </div>
    <div className="text-right">
      <p className="text-sm">Generated: {date}</p>
    </div>
  </div>
  
  {/* Report content */}
  <div className="space-y-6">
    {sections.map(section => (
      <section key={section.id} className="page-break-inside-avoid">
        <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
        {/* Fields */}
      </section>
    ))}
  </div>
  
  {/* Print button (hidden при печати) */}
  <div className="fixed bottom-8 right-8 print:hidden">
    <Button size="lg" onClick={window.print}>
      <Printer className="mr-2 h-5 w-5" />
      Print to PDF
    </Button>
  </div>
</div>
```

**Print CSS**:
```css
@media print {
  .print\:hidden { display: none; }
  .page-break-inside-avoid { page-break-inside: avoid; }
  body { background: white; }
}
```

---

## 11. Рекомендуемые дополнительные библиотеки

### Таблицы

- **Продвинутая таблица** (библиотека TBD) — таблицы с сортировкой, фильтрацией, inline editing
- Интеграция с shadcn/ui Table для базовых случаев

### Формы

- **react-hook-form** — управление формами
- **zod** — валидация схем

### Уведомления

- **sonner** — красивые toast-уведомления (рекомендация shadcn/ui)
- Или **react-hot-toast**

### Даты

- **date-fns** — работа с датами (форматирование, парсинг)
- **react-day-picker** — date picker (интегрирован с shadcn/ui)

### Drag & Drop

- **@dnd-kit/core** — для drag-drop файлов, сортировки элементов roadmap (опционально)

### Charts (пост-MVP)

- **recharts** — графики для дашбордов (например, прогресс по времени)
- Или **chart.js** / **tremor** (специально для дашбордов)

### Экспорт

- **papaparse** — CSV экспорт/импорт для Dataset Grid
- **jsPDF** или **Puppeteer** (серверный) — PDF generation (пост-MVP)

---

## 12. Accessibility (A11y)

### Основные принципы

- Все интерактивные элементы доступны с клавиатуры (Tab navigation)
- `aria-label` для иконочных кнопок
- `aria-describedby` для полей с подсказками
- Focus visible (`:focus-visible` ring)
- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<article>`)
- Color contrast ≥ 4.5:1 для текста

### shadcn/ui A11y features

- Все компоненты следуют WAI-ARIA patterns
- Keyboard navigation встроен
- Screen reader support

---

## 13. Темизация и кастомизация

### CSS Variables

Вся палитра настраивается через CSS-переменные в `globals.css`.

### Tailwind Config

```js
// tailwind.config.ts
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... остальные цвета
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### Dark Mode

Поддержка через `class` strategy:

```tsx
// app/layout.tsx
<html lang="en" className={theme}>
  {/* ... */}
</html>
```

Переключение темы через `next-themes`:

```tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

---

## Итого: Список компонентов для установки (shadcn/ui CLI)

```bash
# Базовые UI элементы
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add select
npx shadcn@latest add slider
npx shadcn@latest add calendar

# Навигация
npx shadcn@latest add navigation-menu
npx shadcn@latest add breadcrumb
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add context-menu
npx shadcn@latest add pagination

# Feedback
npx shadcn@latest add alert
npx shadcn@latest add toast
npx shadcn@latest add progress
npx shadcn@latest add badge
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip

# Модальные окна
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add sheet
npx shadcn@latest add popover

# Отображение данных
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add accordion
npx shadcn@latest add separator
npx shadcn@latest add avatar
npx shadcn@latest add scroll-area
npx shadcn@latest add hover-card

# Расширенные компоненты
npx shadcn@latest add form
npx shadcn@latest add command
npx shadcn@latest add combobox
npx shadcn@latest add collapsible
npx shadcn@latest add resizable

# Установка дополнительных библиотек
npm install react-hook-form zod @hookform/resolvers
npm install sonner
npm install date-fns
npm install lucide-react
npm install papaparse
npm install @types/papaparse --save-dev
npm install next-themes
```

---

**Версия документа**: 1.0  
**Дата**: Октябрь 2025  
**Статус**: В разработке (синхронизировано с Requirements v0.0.1 и USER_FLOW.md)
