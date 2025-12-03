# Design System - Carbon Report Platform

Design system documentation for the Carbon Report Platform built on **shadcn/ui**, Tailwind CSS, and a curated set of complementary libraries.

---

## Contents

1. [Color Palette and Themes](#1-color-palette-and-themes)
2. [Typography](#2-typography)
3. [UI Components](#3-ui-components)
4. [Patterns and Blocks](#4-patterns-and-blocks)
5. [Layouts and Grid](#5-layouts-and-grid)
6. [Spacing and Sizing](#6-spacing-and-sizing)
7. [Icons and Visual Elements](#7-icons-and-visual-elements)
8. [States and Animations](#8-states-and-animations)
9. [Responsive Design](#9-responsive-design)
10. [Additional Product Surfaces](#10-additional-product-surfaces)
11. [Recommended Libraries](#11-recommended-libraries)
12. [Accessibility (A11y)](#12-accessibility-a11y)
13. [Theming and Customisation](#13-theming-and-customisation)
14. [shadcn/ui Install Checklist](#14-shadcnui-install-checklist)

---

## 1. Color Palette and Themes

### Core Palette (light/dark mode ready)

```css
/* CSS variables consumed by shadcn/ui and Tailwind */
:root {
  /* Primary - brand green */
  --primary: 142 76% 36%;         /* #16a34a / green-600 */
  --primary-foreground: 0 0% 100%; /* white text */

  /* Secondary - neutral background */
  --secondary: 210 40% 96%;        /* slate-50 */
  --secondary-foreground: 222 47% 11%; /* slate-900 */

  /* Destructive - errors and destructive CTA */
  --destructive: 0 84% 60%;        /* red-500 */
  --destructive-foreground: 0 0% 100%;

  /* Muted - subdued surfaces */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%; /* slate-600 */

  /* Accent - hover state background */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Surface */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Borders */
  --border: 214 32% 91%;          /* slate-200 */
  --input: 214 32% 91%;
  --ring: 142 76% 36%;            /* focus ring */

  /* Chart palette */
  --chart-1: 142 76% 36%;         /* green */
  --chart-2: 221 83% 53%;         /* blue */
  --chart-3: 45 93% 47%;          /* yellow */
  --chart-4: 9 100% 64%;          /* red */
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

### Semantic Colors

- **Success**: `green-500` (#22c55e) - confirmations, completed fields
- **Warning**: `amber-500` (#f59e0b) - warning states, partial completion
- **Error**: `red-500` (#ef4444) - validation errors, destructive actions
- **Info**: `blue-500` (#3b82f6) - informational hints, banners

---

## 2. Typography

### Fonts

```tsx
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})
```

### Typographic Scale

| Element | Class | Size | Line Height | Weight |
|---------|-------|------|-------------|--------|
| H1 (Page title) | `text-4xl` | 36px | 40px | 700 |
| H2 (Section) | `text-3xl` | 30px | 36px | 600 |
| H3 (Subsection) | `text-2xl` | 24px | 32px | 600 |
| H4 (Card title) | `text-xl` | 20px | 28px | 600 |
| Body Large | `text-lg` | 18px | 28px | 400 |
| Body | `text-base` | 16px | 24px | 400 |
| Body Small | `text-sm` | 14px | 20px | 400 |
| Caption | `text-xs` | 12px | 16px | 400 |
| Label | `text-sm` | 14px | 20px | 500 |

Guidelines:
- Use H1 once per page (actual markup from page components).
- Prefer `leading-relaxed` for long-form content.
- Keep paragraph line length between 60 and 75 characters.

---

## 3. UI Components

### 3.1. shadcn/ui Base Components

#### Base Elements
- **Button** - variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Input** - text input with inline validation feedback
- **Textarea** - multi-line text entry
- **Label** - form field labels
- **Checkbox** - multi-select controls
- **Radio Group** - single-choice controls
- **Switch** - binary toggles (for example, "show empty fields only")
- **Select** - dropdown (shadcn/ui `Select`)

#### Navigation
- **Navigation Menu** - top-level app navigation
- **Breadcrumb** - hierarchical navigation (Dashboard -> Project -> Dataset)
- **Tabs** - local section switches (Reports, Contacts, etc.)
- **Sidebar** - persistent project navigation (Overview, Dataset, Reports, ...)
- **Dropdown Menu** - contextual user menus and row actions

#### Feedback and Status
- **Alert** - inline notifications (success/warning/error/info)
- **Toast** (`sonner`) - transient notifications (trigger via `notifications` helper for consistency)
- **Progress** - linear progress bars (completion %)
- **Badge** - status chips (Active, Archived, 67% Complete)
- **Skeleton** - loading placeholder skeletons
- **Spinner** - `Loader2` icon with `animate-spin`

#### Modals and Overlays
- **Dialog** - create/edit forms, contact selector, Request Data dialog
- **Alert Dialog** - delete/archival confirmations, unsaved changes warning
- **Sheet** - filters (dataset, contacts), mobile navigation, contact details
- **Popover** - contextual information blocks
- **Tooltip** - hover hints for icon buttons, truncated text

#### Data Display
- **Card** - summary surfaces (projects, reports, stats)
- **Table** - data grids for contacts, files, requests
- **Accordion** - collapsible sections (report groups, FAQ)
- **Separator** - horizontal/vertical dividers
- **Avatar** - user/contact avatars with initials fallback
- **ScrollArea** - constrained scroll containers
- **Pagination** - list pagination controls

### 3.2. Extended Components

- **Advanced table** (dataset grid): sortable columns, filters, inline editing, batch actions, CSV export.
- **Forms**: `react-hook-form` + `zod` with manual save workflow and navigation guard.
- **Rich text / Markdown** (post-MVP): `@tiptap/react` or `react-markdown` for formatted guidance copy.
- **Command palette** (post-MVP): quick search using shadcn/ui `Command` (shortcut `Cmd/Ctrl + K`).

---

## 4. Patterns and Blocks

### 4.0. Core Patterns
- Modals and overlays: Dialog, AlertDialog, Sheet, Popover, Tooltip.
- Navigation: Tabs, Breadcrumb, Navigation Menu, Dropdown Menu, Sidebar.
- Forms and inputs: Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Date Picker (Calendar + Popover), Combobox.
- Feedback: Alert, Toast, Badge, Progress, Skeleton, Spinner.
- Data display: Card, Table, Accordion, Separator, Avatar, ScrollArea, Pagination.
- Additional patterns: Command palette, Context menu, Hover card, Resizable panels, Collapsible sections.

### 4.1. Project Card

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
    <Button size="sm">Open</Button>
  </CardFooter>
</Card>
```

### 4.2. Contacts List Surface

| Column | Description | Sortable | Filterable |
|--------|-------------|----------|------------|
| Name | Name with avatar initials | ✅ | ✅ (search) |
| Position | Role/title | ✅ | ❌ |
| Email | Email address | ✅ | ✅ (search) |
| Active Requests | Count of active requests | ✅ | ❌ |
| Actions | Dropdown with edit/archive/delete | ❌ | ❌ |

### 4.3. Contact Select Card (Request Data dialog)

```tsx
<button
  onClick={() => onSelect(contact)}
  className={cn(
    'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors',
    'hover:bg-accent hover:border-primary',
    isSelected && 'border-primary bg-accent'
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
  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
</button>
```

### 4.4. Data Point Field (normal view)

```tsx
<div className="space-y-2">
  <Label htmlFor={fieldId}>
    {fieldLabel}
    {required && <span className="text-destructive">*</span>}
  </Label>

  {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

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

  {error && <p className="text-xs text-destructive">{error}</p>}
</div>
```

### 4.5. Request Data Dialog
- Search contacts, allow inline contact creation, preview generated email.
- Buttons: Cancel, Generate Email (disabled until contact selected).
- Supports placeholders `{{field_display_name}}`, `{{field_list}}`, `{{contact_name}}`, `{{project_name}}`, `{{deadline}}`, `{{requester_signature}}`.

### 4.6. Roadmap / Checklist Item

```tsx
<div className="flex items-start gap-3 p-4 border rounded-lg">
  <Checkbox checked={isCompleted} onCheckedChange={handleToggle} id={itemId} />
  <div className="flex-1">
    <Label
      htmlFor={itemId}
      className={cn('text-base font-medium cursor-pointer', isCompleted && 'line-through text-muted-foreground')}
    >
      {title}
    </Label>
    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    {linkedDataPoint && (
      <Button variant="link" size="sm" className="px-0 mt-2" onClick={goToDataPoint}>
        Go to field ->
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
- Drag-and-drop area with highlight when dragging.
- Support copy: "Drag and drop files" and secondary "Browse" button.

### 4.8. Empty States
- Icon circle, title, description, primary call to action.
- Examples: no projects, no contacts, no files.

### 4.9. Loading States
- Buttons with spinner, skeleton cards for lists, skeleton layout for page load.

### 4.12. Confirmation Dialogs
- Use `AlertDialog` for delete/archive/clear actions.
- Copy should mention irreversibility.

### 4.13. Search and Filters
- Combine search input, status filter select, sort select, advanced `Sheet` filters.

### 4.14. Bulk Actions
- Show batch toolbar when selections exist; include archive/delete actions.

### 4.15. Keyboard Shortcut Hints
- Display keyboard hints near pro features (`Cmd+K`, `Cmd+S`).

### 4.16. Header and Navigation
- Authenticated header: logo, project switcher, quick links, theme toggle, user menu.

### 4.17. Project Sidebar
- Navigation items: Overview, Dataset, Reports, Roadmap, Files, Contacts, Settings.
- Show completion percentage, outstanding requests badges.

### 4.18. Entity Property Panel
- Sheet with contextual metadata (dataset field history, report info).

### 4.19. Breadcrumbs
- Dynamic breadcrumb reflecting current location.

### 4.20. Stats Cards
- Dashboard summary cards: total projects, outstanding requests, completion snapshot.

### 4.21. Theme Toggle
- Use shadcn/ui `ModeToggle`, persist preference via `next-themes`.

### 4.22. Landing Page Components
- Hero, feature grid, testimonial cards, call-to-action banner built from shared primitives.

### 4.23. Authentication Forms
- Centered card layout using `Form` primitives for login/register/reset flows.

### 4.24. Email Verification
- Confirmation screen with resend button and status banner.

---

## 5. Layouts and Grid

### 5.1. Page Layout (protected pages)
- Sidebar (min-width 260px), header (64px), main content with max-width 1200px.
- Sidebar collapses into Sheet below `lg` breakpoint.

### Dataset Surface Example

```tsx
<section className="flex flex-col gap-4">
  <header className="flex flex-wrap items-center gap-3">
    <DatasetBreadcrumb projectId={projectId} />
    <div className="ml-auto flex gap-2">
      <Button variant="outline" size="sm" onClick={handleFilterClick}>
        <Filter className="mr-2 h-4 w-4" /> Filters
      </Button>
      <Button variant="outline" size="sm" onClick={handleShowOnlyEmptyToggle}>
        <EyeOff className="mr-2 h-4 w-4" /> Empty fields only
      </Button>
      <Button size="sm" onClick={handleExportCsv} disabled={isExporting}>
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
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

---

## 6. Spacing and Sizing
- Tailwind scale (`4` equals 1rem) as base unit.
- Page padding: `px-6` desktop, `px-4` tablet, `px-3` mobile.
- Section spacing: `py-8` desktop, `py-6` tablet, `py-4` mobile.
- Card padding: `p-6` primary, `p-4` nested.
- Grid gaps: `gap-4` desktop, `gap-3` tablet, `gap-2` mobile.

---

## 7. Icons and Visual Elements
- Icon set: `lucide-react` (16px or 20px stroke 1.5px).
- Use muted background circles for icon badges.
- Charts: light gridlines, brand color palette.

---

## 8. States and Animations

### Component States
- Disabled: reduced opacity, `pointer-events-none`.
- Hover/focus: accent background and visible ring.
- Error: `text-destructive` with border highlight.
- Success: `bg-emerald-50` with `text-emerald-700`.

### Animations
- Tailwind `transition` utilities for hover and focus states.
- Use shadcn/ui default transitions for dialogs and sheets.
- Keep durations under 200ms.

---

## 9. Responsive Design

### Breakpoints (Tailwind defaults)
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

### Adaptive Patterns
- Sidebar collapses into sheet below `lg`.
- Tables fall back to stacked cards on narrow screens.
- Condense toolbar labels into icons on mobile.
- Use responsive typography (`text-lg md:text-xl`).

---

## 10. Additional Product Surfaces
- Dataset toolbar chips for active filters with clear-all action.
- Completion widgets combining progress bar and percentage.
- Print-friendly report view (`/print` route) with simplified layout and print instructions.

---

## 11. Recommended Libraries

| Category | Library | Notes |
|----------|---------|-------|
| Tables | `@tanstack/react-table` | Flexible headless table logic |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | Form state and validation |
| Notifications | `sonner` | Toast notifications |
| Dates | `date-fns`, `react-day-picker` | Formatting and calendars |
| Drag and Drop | `@dnd-kit/core` | Optional for reordering |
| Charts (post-MVP) | `recharts` or `nivo` | Dataset visualisations |
| Export | `papaparse`, `pdf-lib` | CSV parsing and PDF generation |

---

## 12. Accessibility (A11y)
- Keyboard navigable controls with visible focus states.
- Minimum WCAG AA contrast for interactive elements.
- Semantic HTML for headings, lists, tables.
- Use Radix UI primitives (via shadcn/ui) for built-in focus management.
- Add `aria-label` to icon-only buttons.

---

## 13. Theming and Customisation
- CSS variables defined in `src/app/globals.css` and mirrored in Tailwind config.
- Tailwind colour utilities reference CSS variables (`rgb(var(--primary) / <alpha-value>)`).
- Dark mode handled via `class` strategy and `next-themes` persistence.

---

## 14. shadcn/ui Install Checklist

Install component groups with `npx shadcn-ui@latest add ...`:

- Base: `button`, `input`, `textarea`, `label`, `checkbox`, `radio-group`, `select`, `switch`, `slider`, `badge`, `separator`
- Navigation: `navigation-menu`, `tabs`, `breadcrumb`, `dropdown-menu`, `sidebar` (or custom)
- Feedback: `alert`, `progress`, `skeleton`, `toast`
- Overlays: `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`
- Data display: `card`, `table`, `accordion`, `avatar`, `scroll-area`, `pagination`
- Extended: `command`, `context-menu`, `hover-card`, `resizable`, `collapsible`, `form`
- Supporting packages: `lucide-react`, `class-variance-authority`, `tailwind-merge`, `@hookform/resolvers`, `zod`, `sonner`, `react-day-picker`

---

Keep this document updated as new components are implemented. Link to live component examples in the codebase and run `npm run lint` and `npm run test` after integrating UI changes.# Design System — Carbon Report Platform

Design system documentation for the Carbon Report Platform built on **shadcn/ui**, Tailwind CSS, and a curated set of complementary libraries.

---

## Contents

1. [Color Palette and Themes](#1-color-palette-and-themes)
2. [Typography](#2-typography)
3. [UI Components](#3-ui-components)
4. [Patterns and Blocks](#4-patterns-and-blocks)
5. [Layouts and Grid](#5-layouts-and-grid)
6. [Spacing and Sizing](#6-spacing-and-sizing)
7. [Icons and Visual Elements](#7-icons-and-visual-elements)
8. [States and Animations](#8-states-and-animations)
9. [Responsive Design](#9-responsive-design)
10. [Additional Product Surfaces](#10-additional-product-surfaces)
11. [Recommended Libraries](#11-recommended-libraries)
12. [Accessibility (A11y)](#12-accessibility-a11y)
13. [Theming and Customisation](#13-theming-and-customisation)
14. [shadcn/ui Install Checklist](#14-shadcnui-install-checklist)

---

## 1. Color Palette and Themes

### Core Palette (light/dark mode ready)

```css
/* CSS variables consumed by shadcn/ui and Tailwind */
:root {
  /* Primary — brand green */
  --primary: 142 76% 36%;         /* #16a34a / green-600 */
  --primary-foreground: 0 0% 100%; /* white text */

  /* Secondary — neutral background */
  --secondary: 210 40% 96%;        /* slate-50 */
  --secondary-foreground: 222 47% 11%; /* slate-900 */

  /* Destructive — errors & destructive CTA */
  --destructive: 0 84% 60%;        /* red-500 */
  --destructive-foreground: 0 0% 100%;

  /* Muted — subdued surfaces */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%; /* slate-600 */

  /* Accent — hover state background */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Surface */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Borders */
  --border: 214 32% 91%;          /* slate-200 */
  --input: 214 32% 91%;
  --ring: 142 76% 36%;            /* focus ring */

  /* Chart palette */
  --chart-1: 142 76% 36%;         /* green */
  --chart-2: 221 83% 53%;         /* blue */
  --chart-3: 45 93% 47%;          /* yellow */
  --chart-4: 9 100% 64%;          /* red */
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

### Semantic Colors

- **Success**: `green-500` (#22c55e) — confirmations, completed fields
- **Warning**: `amber-500` (#f59e0b) — warning states, partial completion
- **Error**: `red-500` (#ef4444) — validation errors, destructive actions
- **Info**: `blue-500` (#3b82f6) — informational hints, banners

---

## 2. Typography

### Fonts

```tsx
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})
```

### Typographic Scale

| Element | Class | Size | Line Height | Weight |
|---------|-------|------|-------------|--------|
| H1 (Page title) | `text-4xl` | 36px | 40px | 700 |
| H2 (Section) | `text-3xl` | 30px | 36px | 600 |
| H3 (Subsection) | `text-2xl` | 24px | 32px | 600 |
| H4 (Card title) | `text-xl` | 20px | 28px | 600 |
| Body Large | `text-lg` | 18px | 28px | 400 |
| Body | `text-base` | 16px | 24px | 400 |
| Body Small | `text-sm` | 14px | 20px | 400 |
| Caption | `text-xs` | 12px | 16px | 400 |
| Label | `text-sm` | 14px | 20px | 500 |

Guidelines:
- Use H1 once per page (actual markup from page components).
- Prefer `leading-relaxed` for long-form content.
- Keep paragraph line length between 60–75 characters.

---

## 3. UI Components

### 3.1. shadcn/ui Base Components

#### Base Elements
- **Button** — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Input** — text input with inline validation feedback
- **Textarea** — multi-line text entry
- **Label** — form field labels
- **Checkbox** — multi-select controls
- **Radio Group** — single-choice controls
- **Switch** — binary toggles (e.g., “show empty fields only”)
- **Select** — dropdown (shadcn/ui `Select`)

#### Navigation
- **Navigation Menu** — top-level app navigation
- **Breadcrumb** — hierarchical navigation (Dashboard → Project → Dataset)
- **Tabs** — local section switches (Reports, Contacts, etc.)
- **Sidebar** — persistent project navigation (Overview, Dataset, Reports…)
- **Dropdown Menu** — contextual user menus and row actions

#### Feedback & Status
- **Alert** — inline notifications (success/warning/error/info)
- **Toast** (`sonner`) — transient notifications
- **Progress** — linear progress bars (completion %)
- **Badge** — status chips (Active, Archived, 67% Complete)
- **Skeleton** — loading placeholder skeletons
- **Spinner** — `Loader2` icon with `animate-spin`

#### Modals & Overlays
- **Dialog** — create/edit forms, contact selector, Request Data dialog
- **Alert Dialog** — delete/archival confirmations, unsaved changes warning
- **Sheet** — filters (dataset, contacts), mobile navigation, contact details
- **Popover** — contextual information blocks
- **Tooltip** — hover hints for icon buttons, truncated text

#### Data Display
- **Card** — summary surfaces (projects, reports, stats)
- **Table** — data grids for contacts, files, requests
- **Accordion** — collapsible sections (report groups, FAQ)
- **Separator** — horizontal/vertical dividers
- **Avatar** — user/contact avatars with initials fallback
- **ScrollArea** — constrained scroll containers
- **Pagination** — list pagination controls

### 3.2. Extended Components

- **Advanced table** (dataset grid): sortable columns, filters, inline editing, batch actions, CSV export.
- **Forms**: `react-hook-form` + `zod` with manual save workflow and navigation guard.
- **Rich text / Markdown** (post-MVP): `@tiptap/react` or `react-markdown` for formatted guidance copy.
- **Command palette** (post-MVP): Quick search using shadcn/ui `Command` (shortcut `Cmd/Ctrl + K`).

---

## 4. Patterns and Blocks

### 4.0. Core Patterns
- Modals & overlays: Dialog, AlertDialog, Sheet, Popover, Tooltip.
- Navigation: Tabs, Breadcrumb, Navigation Menu, Dropdown Menu, Sidebar.
- Forms & inputs: Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Date Picker (Calendar + Popover), Combobox.
- Feedback: Alert, Toast, Badge, Progress, Skeleton, Spinner.
- Data display: Card, Table, Accordion, Separator, Avatar, ScrollArea, Pagination.
- Additional patterns: Command palette, Context menu, Hover card, Resizable panels, Collapsible sections.

### 4.1. Project Card

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
    <Button size="sm">Open</Button>
  </CardFooter>
</Card>
```

### 4.2. Contacts List Surface

| Column | Description | Sortable | Filterable |
|--------|-------------|----------|------------|
| Name | Name with avatar initials | ✅ | ✅ (search) |
| Position | Role/title | ✅ | ❌ |
| Email | Email address | ✅ | ✅ (search) |
| Active Requests | Count of active requests | ✅ | ❌ |
| Actions | Dropdown with edit/archive/delete | ❌ | ❌ |

### 4.3. Contact Select Card (Request Data dialog)

```tsx
<button
  onClick={() => onSelect(contact)}
  className={cn(
    'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors',
    'hover:bg-accent hover:border-primary',
    isSelected && 'border-primary bg-accent'
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
  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
</button>
```

### 4.4. Data Point Field (normal view)

```tsx
<div className="space-y-2">
  <Label htmlFor={fieldId}>
    {fieldLabel}
    {required && <span className="text-destructive">*</span>}
  </Label>

  {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

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

  {error && <p className="text-xs text-destructive">{error}</p>}
</div>
```

### 4.5. Request Data Dialog
- Search contacts, allow inline contact creation, preview generated email.
- Buttons: Cancel, Generate Email (disabled until contact selected).
- Supports placeholders `{{field_display_name}}`, `{{field_list}}`, `{{contact_name}}`, `{{project_name}}`, `{{deadline}}`, `{{requester_signature}}`.

### 4.6. Roadmap / Checklist Item

```tsx
<div className="flex items-start gap-3 p-4 border rounded-lg">
  <Checkbox checked={isCompleted} onCheckedChange={handleToggle} id={itemId} />
  <div className="flex-1">
    <Label
      htmlFor={itemId}
      className={cn('text-base font-medium cursor-pointer', isCompleted && 'line-through text-muted-foreground')}
    >
      {title}
    </Label>
    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    {linkedDataPoint && (
      <Button variant="link" size="sm" className="px-0 mt-2" onClick={goToDataPoint}>
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
- Drag-and-drop area with highlight when dragging.
- Support copy: “Drag and drop files” and secondary “Browse” button.

### 4.8. Empty States
- Icon circle, title, description, primary CTA.
- Examples: no projects, no contacts, no files.

### 4.9. Loading States
- Buttons with spinner, skeleton cards for lists, skeleton layout for page load.

### 4.12. Confirmation Dialogs
- Use `AlertDialog` for delete/archive/clear actions.
- Copy should mention irreversibility.

### 4.13. Search & Filters
- Combine search input, status filter select, sort select, advanced `Sheet` filters.

### 4.14. Bulk Actions
- Show batch toolbar when selections exist; include archive/delete actions.

### 4.15. Keyboard Shortcut Hints
- Display keyboard hints near pro features (`Cmd+K`, `Cmd+S`).

### 4.16. Header & Navigation
- Authenticated header: logo, project switcher, quick links, theme toggle, user menu.

### 4.17. Project Sidebar
- Navigation items: Overview, Dataset, Reports, Roadmap, Files, Contacts, Settings.
- Show completion %, outstanding requests badges.

### 4.18. Entity Property Panel
- Sheet with contextual metadata (dataset field history, report info).

### 4.19. Breadcrumbs
- Dynamic breadcrumb reflecting current location.

### 4.20. Stats Cards
- Dashboard summary cards: total projects, outstanding requests, completion snapshot.

### 4.21. Theme Toggle
- Use shadcn/ui `ModeToggle`, persist preference via `next-themes`.

### 4.22. Landing Page Components
- Hero, feature grid, testimonial cards, CTA banner built from shared primitives.

### 4.23. Authentication Forms
- Centred card layout using `Form` primitives for login/register/reset flows.

### 4.24. Email Verification
- Confirmation screen with resend button and status banner.

---

## 5. Layouts and Grid

### 5.1. Page Layout (protected pages)
- Sidebar (min-width 260px), header (64px), main content with max-width 1200px.
- Sidebar collapses into Sheet below `lg` breakpoint.

### Dataset Surface Example

```tsx
<section className="flex flex-col gap-4">
  <header className="flex flex-wrap items-center gap-3">
    <DatasetBreadcrumb projectId={projectId} />
    <div className="ml-auto flex gap-2">
      <Button variant="outline" size="sm" onClick={handleFilterClick}>
        <Filter className="mr-2 h-4 w-4" /> Filters
      </Button>
      <Button variant="outline" size="sm" onClick={handleShowOnlyEmptyToggle}>
        <EyeOff className="mr-2 h-4 w-4" /> Empty fields only
      </Button>
      <Button size="sm" onClick={handleExportCsv} disabled={isExporting}>
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
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

---

## 6. Spacing and Sizing
- Tailwind scale (`4` = 1rem) as base unit.
- Page padding: `px-6` desktop, `px-4` tablet, `px-3` mobile.
- Section spacing: `py-8` desktop, `py-6` tablet, `py-4` mobile.
- Card padding: `p-6` primary, `p-4` nested.
- Grid gaps: `gap-4` desktop, `gap-3` tablet, `gap-2` mobile.

---

## 7. Icons and Visual Elements
- Icon set: `lucide-react` (16px or 20px stroke 1.5px).
- Use muted background circles for icon badges.
- Charts: light gridlines, brand color palette.

---

## 8. States and Animations

### Component States
- Disabled: reduced opacity, `pointer-events-none`.
- Hover/focus: accent background and visible ring.
- Error: `text-destructive` with border highlight.
- Success: `bg-emerald-50` with `text-emerald-700`.

### Animations
- Tailwind `transition` utilities for hover/focus states.
- Use shadcn/ui default transitions for dialogs and sheets.
- Keep durations under 200ms.

---

## 9. Responsive Design

### Breakpoints (Tailwind defaults)
- `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

### Adaptive Patterns
- Sidebar collapses into sheet below `lg`.
- Tables fall back to stacked cards on narrow screens.
- Condense toolbar labels into icons on mobile.
- Use responsive typography (`text-lg md:text-xl`).

---

## 10. Additional Product Surfaces
- Dataset toolbar chips for active filters with clear-all action.
- Completion widgets combining progress bar and percentage.
- Print-friendly report view (`/print` route) with simplified layout and print instructions.

---

## 11. Recommended Libraries

| Category | Library | Notes |
|----------|---------|-------|
| Tables | `@tanstack/react-table` | Flexible headless table logic |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | Form state + validation |
| Notifications | `sonner` | Toast notifications |
| Dates | `date-fns`, `react-day-picker` | Formatting + calendars |
| Drag & Drop | `@dnd-kit/core` | Optional for reordering |
| Charts (post-MVP) | `recharts` or `nivo` | Dataset visualisations |
| Export | `papaparse`, `pdf-lib` | CSV parsing and PDF generation |

---

## 12. Accessibility (A11y)
- Keyboard navigable controls with visible focus states.
- Minimum WCAG AA contrast for interactive elements.
- Semantic HTML for headings, lists, tables.
- Use Radix UI primitives (via shadcn/ui) for built-in focus management.
- Add `aria-label` to icon-only buttons.

---

## 13. Theming and Customisation
- CSS variables defined in `src/app/globals.css` and mirrored in Tailwind config.
- Tailwind colour utilities reference CSS variables (`rgb(var(--primary) / <alpha-value>)`).
- Dark mode handled via `class` strategy and `next-themes` persistence.

---

## 14. shadcn/ui Install Checklist

Install component groups with `npx shadcn-ui@latest add ...`:

- Base: `button`, `input`, `textarea`, `label`, `checkbox`, `radio-group`, `select`, `switch`, `slider`, `badge`, `separator`
- Navigation: `navigation-menu`, `tabs`, `breadcrumb`, `dropdown-menu`, `sidebar` (or custom)
- Feedback: `alert`, `progress`, `skeleton`, `toast`
- Overlays: `dialog`, `alert-dialog`, `sheet`, `popover`, `tooltip`
- Data display: `card`, `table`, `accordion`, `avatar`, `scroll-area`, `pagination`
- Extended: `command`, `context-menu`, `hover-card`, `resizable`, `collapsible`, `form`
- Supporting packages: `lucide-react`, `class-variance-authority`, `tailwind-merge`, `@hookform/resolvers`, `zod`, `sonner`, `react-day-picker`

---

Keep this document updated as new components are implemented. Link to live component examples in the codebase and run `npm run lint` / `npm run test` after integrating UI changes.
