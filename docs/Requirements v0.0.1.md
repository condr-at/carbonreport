# System Requirements Specification — Carbon Project Platform (v0.1)

---

## 1. Overview

A web application designed to create, manage, and complete carbon footprint assessment projects. The platform guides users through project creation via a questionnaire, manages reports generated from standardized templates (e.g., CBAM, ISO 14067), and centralizes data collection and collaboration tools.

The MVP focuses on single-user functionality, modular architecture, and strong forward compatibility with upcoming modules such as billing, organizational accounts, and LLM-assisted automation.

---

## 2. Core Functional Flow

### 2.1. Project Creation

* Users initiate project creation by completing an adaptive questionnaire or by manually selecting desired reports.
* A project cannot be created without at least one report selected.
* **First-time user flow**: after email verification the user is redirected to `/projects/new`; choosing "Exit" cancels the wizard after confirmation and no project record is created.
* The wizard persists a project only after the user clicks **Save** or finishes the flow; abandoning the form discards all inputs.
* Save actions surface a blocking loading state with clear error messaging on failure before the user is returned to the dashboard or project overview.
* Upon choosing **“Create Project”**:

  * If unauthenticated: the user is prompted to register or log in.
  * If authenticated: the project is appended to the user's dashboard.
* Each project appears as a card in the dashboard and contains its dataset, report set, checklist, and file storage.

### 2.2. Questionnaire

* Dynamically maps user responses (e.g., type of production, logistics chain, region) to recommended report types.
* **User-facing terminology**: "Which type of report do you need?" or "Which standard should you follow?"
* **Implementation**: Questionnaire logic and mapping rules are stored as TypeScript configuration in `src/lib/questionnaires/`.
* Configuration includes question structure, answer options, and mapping rules (responses → recommended report template codes).
* Versioned through Git; updates require code deployment.
* **Post-MVP**: Admin interface for non-technical questionnaire editing may migrate configuration to database.
* User may skip the questionnaire and manually select report types from a list.

### 2.3. Reports

* Reports are pre-built web templates containing input fields, labels, and contextual guidance.
| status            | Enum (planned)      | Reserved for future (`REQUESTED`, `RECEIVED`, `DECLINED`) |
* **Technical terminology**: Internally called "templates" in code; template configurations stored as TypeScript/JSON in `src/lib/report-templates/`
* **Template versioning**: Managed through Git version control; template code updates require deployment
* Reports are **not user-editable structurally**; they are designed and maintained by administrators.
* Users can:
  * Fill data directly in input fields.
  * **Request data from contacts** directly—either for a single field or a bulk selection (see §§2.4, 2.10).
  * Remove or add report types from the project.
  * Export reports (PDF via browser print) — all formatted according to official standards.
* Deleting a report does not remove related data from the project dataset.

### 2.4. Shared Dataset

* Each project contains one unified dataset shared by all reports.
* Data points (DPs) have unique IDs and can belong to multiple reports.
* Completing or updating a DP updates the completion status of all linked reports.
* Data points can be **scalar** (single values) or **tabular** (repeating rows, e.g., purchase tables).
* DP IDs are defined centrally in the database (table `DatasetFieldDefinition`) and are consistent across projects (e.g., `product_name`).
* When multiple reports use the same field with identical validation/boundaries, they share one DP.
* Different boundaries/validation rules = different DPs (e.g., `total_cfp_co2e_iso14067` vs `total_cfp_co2e_cbam`).

#### Field ID Naming Convention

**Format**: `snake_case` identifiers aligned with database columns

**Examples**:
| reminders       | JSONB     | Reserved: array of reminder timestamps                    |
- `product_description` — scalar field
- `material_input_name` — repeatable group field (paired by `item_id`)
- `material_input_amount` — repeatable group field (paired by `item_id`)
- `total_cfp_co2e` — calculation result (if standard-specific, keep separate IDs by standard)

**Rules**:
1. Use lowercase snake_case for readability and consistency with DB (`DatasetFieldDefinition.fieldId`)
2. Keep stable IDs across templates; if validation or semantics differ by standard, define separate IDs
3. For repeatable data: use the same `field_id` with different `item_id` values, not suffixed IDs
4. Source of truth is the database; templates consume field IDs, not define them

#### Dataset Interface (MVP)

* Single route `/projects/:id/dataset` renders a spreadsheet-like table with all project data points; there is no separate "advanced" or "normal" mode.
* Inline cell editing, row insertion/removal, filtering, and sorting are available directly in the grid when supported by the UI library.
* "Request Data" works for single rows and bulk selections; chosen fields produce one email with a bullet list.
* Rows with an active request show a "Request sent [Contact]" badge and a "Change contact" action.
* CSV export runs from the same page and exposes loading and failure feedback.
* Bulk edits, save operations, and exports display in-context loading indicators and non-blocking error toasts.

#### Dataset JSONB Structure (MVP)

Simplified structure based on field-value pairs:

```json
{
  "data_points": [
    {
  "field_id": "product_name",
      "item_id": null,
      "value": "Reusable Bottle 750 mL"
    },
    {
  "field_id": "material_input_name",
      "item_id": "1",
      "value": "Stainless steel 18/8"
    },
    {
  "field_id": "material_input_amount",
      "item_id": "1",
      "value": "0.30"
    },
    {
  "field_id": "material_input_name",
      "item_id": "2",
      "value": "Polypropylene cap"
    }
  ]
}
```

**Key principles**:
- `field_id`: Matches DB-backed field identifier from `DatasetFieldDefinition`
- `item_id`: `null` for scalar fields; `"1"`, `"2"`, `"3"` etc. for repeatable rows
- `value`: Always stored as string; type validation happens at application layer
- Unique key: `(field_id, item_id)` within a project
- Field-to-contact assignments and request deadlines are not stored in the JSON; the `data_requests` table (see §3.5) holds that metadata.

### 2.5. Project Dashboard

* Displays list of user projects.
* Each project includes:

  * Reports with completion progress.
  * Dataset summary.
  * Roadmap / checklist with actionable steps.
  * File repository ("project files").
* Projects can be cloned, duplicated, or deleted (soft-delete with 30-day retention).
* **Duplicate/Clone**: Creates a full copy of the project including all data, reports, and files. New project gets name "[Original Name] (Copy)" and fresh UUID.
* Duplication triggers a modal progress indicator; completion or failure appears as success/error banners before routing to the copied project.

### 2.6. Roadmap / Checklist

* Contains sequential steps guiding the user toward project completion.
* Each step can be marked complete and includes links to relevant report sections or data points.
* Checklist items are generated in the background immediately after project creation, combining existing data point coverage with predefined hints; users see a loading state until population completes.
* Each checklist item includes:
  * Reference to specific data point(s)
  * Pre-written guidance hint (e.g., "Ask Production Manager for energy consumption data")
  * Link to relevant form section in report interface
* Hints are stored in report template configuration files (`src/lib/report-templates/*.ts`) and populated during project initialization.

### 2.7. Address Book (Contacts)

* Contacts are **not platform users**; they represent external collaborators.
* Fields: `id`, `name`, `position` (optional), `email`, `created_at`, `updated_at`, `archived`.
* Contacts are user-specific (scoped to the owning account).

#### Contact Usage

* Every field supports "Request Data" — individually or as part of a bulk selection.
* The user picks a contact (from the address book or inline creation); the system generates a mailto using the project template, inserting `{{field_list}}` for multi-field requests.
* Mail clients always open via `mailto:`; if template substitution fails the body remains empty so the action is not blocked.
* The system logs requests in `data_requests` (see §3.5). When a field is reassigned to a new contact, the previous record receives `revoked_at` and stays in history.

#### Contact Interface

* In the data entry view: each row shows a badge with the current contact and a "Change contact" action.
* In the address book the contact has a "Requests" tab containing:
  * Active requests across all projects with a quick "Resend" action.
  * History (revoked/completed) with timestamps and links to the project/data point.

### 2.8. File Repository (Project Files) ⏸️ Post-MVP

> **Status**: Deferred to Post-MVP. Not required for initial deployment.

* Each project will include a structured file storage area for incoming materials (e.g., Excel sheets, photos, scanned tables).
* Planned features: drag-and-drop upload, file tagging, linking to data points.
* **Future integration**: OCR and LLM-assisted data extraction from uploaded documents.
* **Implementation**: Will use Vercel Blob storage or similar managed solution when implemented.
* **File size limit**: 10 MB per file.
* **Allowed file types**: All formats (xlsx, pdf, jpg, png, csv, doc, etc.).
* Metadata: `id`, `user_id`, `project_id`, `filename`, `type`, `size`, `uploaded_at`, `linked_data_points[]`, `status`.
* Linking to data points is handled through a tag-style multi-select with autosuggest inside a file properties side panel; the same pattern is reused for other entity property editors.
* Tagging files (e.g., "Material supplier invoice", "Energy bill Q3 2024").
* Linking files to specific data points.
* **Status**: ⏸️ Post-MVP feature, not included in initial deployment.

### 2.9. Progress Tracking

* Completion percentage per report and overall project calculated dynamically based on filled data points.
* All data points are weighted equally in completion calculation.
* Linked data points synchronize progress across multiple reports.
* Fields with an active request remain editable; the UI shows the current contact.

### 2.10. Data Request Management

* The `/projects/:id/data-requests` screen lists all project requests in a table.
* Status filters: **Active** (no `revoked_at`/`completed_at`), **Closed** (`revoked_at` or `completed_at` present), **Overdue** (deadline < now, no `completed_at`).
* Columns: field (label + item), contact, dates (`requested_at`, `deadline`, `completed_at`), status.
* Actions: "Resend request", "Change contact", "Close" (sets `completed_at`).
* Architecture leaves room for future updates: reminders, `received/declined` statuses, bulk follow-ups, and report exports.

### 2.11. Exports

* Reports exportable via browser print-to-PDF functionality:
  * **PDF** — dedicated print-friendly page view, user saves via browser "Print → Save as PDF".
  * Post-MVP: Server-side generation (Puppeteer), XLSX export, JSON backup.

---

## 3. Entities and Data Model

### 3.1. Users

| Field          | Type      | Notes                         |
| -------------- | --------- | ----------------------------- |
| id             | UUID      | Primary key                   |
| name           | Text      | User display name             |
| email          | Text      | Unique, required              |
| password_hash  | Text      | Encrypted (bcrypt)            |
| email_verified | Boolean   | Default false                 |
| avatar_url     | Text      | Optional                      |
| oauth_provider | Text      | Nullable (google, microsoft)  |
| oauth_id       | Text      | Nullable, unique per provider |
| created_at     | Timestamp | —                             |
| deleted_at     | Timestamp | Soft delete                   |

### 3.2. Projects

| Field             | Type      | Notes                           |
| ----------------- | --------- | ------------------------------- |
| id                | UUID      | Primary key                     |
| user_id           | UUID      | FK to users                     |
| name              | Text      | Project title                   |
| created_at        | Timestamp | —                               |
| deleted_at        | Timestamp | Soft delete (30 days retention) |
| dataset           | JSONB     | Dynamic data structure          |
| dataset_version   | Integer   | Optimistic locking counter      |
| mailto_template   | JSONB     | Project-wide mailto template (subject/body)|
| checklist         | JSONB     | Steps for roadmap               |
| status            | Enum      | (active, archived, deleted)     |
| twin_project_id   | UUID      | Nullable; FK to projects        |

### 3.3. Reports

| Field        | Type      | Notes                             |
| ------------ | --------- | --------------------------------- |
| id           | UUID      | Primary key                       |
| project_id   | UUID      | FK to projects                    |
| template_code| Text      | Template identifier (ISO14067, CBAM)|
| metadata     | JSONB     | Report-specific metadata (optional)|
| completion   | Float     | 0–100%                            |
| created_at   | Timestamp | —                                 |
| updated_at   | Timestamp | —                                 |

**Notes**:
- Reports do NOT store field values — all data lives in `Project.dataset`
- `template_code` references template configuration in `src/lib/report-templates/`
- `metadata` (optional) may store report-specific settings: custom field visibility, export preferences, or report-level mailto template overrides
- Report rendering: load `template_code` config → filter `Project.dataset` by configured `field_id[]` → display form
- Completion calculated by counting filled vs required fields from template config

### 3.4. Contacts

| Field      | Type      | Notes         |
| ---------- | --------- | ------------- |
| id         | UUID      | Primary key   |
| user_id    | UUID      | FK to users   |
| name       | Text      | —             |
| position   | Text      | Optional      |
| email      | Text      | —             |
| archived   | Boolean   | Default false |
| created_at | Timestamp | —             |
| updated_at | Timestamp | —             |

### 3.5. Data Requests

| Field           | Type             | Notes                                                    |
| --------------- | ---------------- | -------------------------------------------------------- |
| id              | UUID             | Primary key                                              |
| user_id         | UUID             | FK to users                                              |
| project_id      | UUID             | FK to projects                                           |
| contact_id      | UUID             | FK to contacts                                           |
| data_point_id   | Text             | Data point reference                                     |
| requested_at    | Timestamp        | —                                                        |
| revoked_at      | Timestamp        | Nullable; set when the field is reassigned to another contact |
| completed_at    | Timestamp        | Nullable; marks "data received"                          |
| deadline        | Timestamp        | Nullable; used to highlight overdue requests             |
| status          | Enum (planned)   | Reserved (`REQUESTED`, `RECEIVED`, `DECLINED`)           |
| reminders       | JSONB            | Reserved: array of sent reminder timestamps              |
| external_access | Boolean          | Default false                                            |

**Notes**:
- The current core uses `requested_at` and `revoked_at`; other fields are reserved for future iterations (see §2.10).
- **Single active contact per field**: Each `(project_id, data_point_id)` pair can have only **one** active request (no `revoked_at`). When reassigning a field to a new contact, the system automatically sets `revoked_at` on the previous request to preserve history.
- **Bulk requests create multiple records**: A single mailto action requesting multiple fields will create one `data_requests` record per field, all sharing the same `contact_id` and `requested_at` timestamp.
- **Revoke mechanism**: When changing the contact for a field, the old request receives `revoked_at = NOW()` and a new request is inserted. Revoked requests remain visible in history but are filtered out of "Active" views.

### 3.6. Project Files ⏸️ Post-MVP

> **Status**: Deferred to Post-MVP. Schema commented out in `schema.prisma`.

| Field              | Type      | Notes                         |
| ------------------ | --------- | ----------------------------- |
| id                 | UUID      | Primary key                   |
| user_id            | UUID      | FK to users                   |
| project_id         | UUID      | FK to projects                |
| filename           | Text      | Original filename             |
| mime_type          | Text      | —                             |
| size               | Integer   | Bytes                         |
| storage_url        | Text      | Vercel Blob or similar        |
| linked_data_points | JSONB     | Array of DP IDs               |
| uploaded_at        | Timestamp | —                             |
| status             | Enum      | (uploaded, processed, linked) |

**Note**: File uploads will be implemented using Vercel Blob Storage when this feature is activated.

**Future extensibility (post-MVP)**:
* `confidence` field: Float (0-1) for OCR/LLM extraction confidence
* `source_type` enum: Manual | OCR | LLM  
* `extraction_metadata` JSONB: Raw OCR/LLM output

---

## 4. System Behavior and UX Requirements

* All forms save explicitly via a **Save** button; navigation away with unsaved changes triggers a confirmation prompt.
* Long-running operations (project save, duplication, dataset export, file upload, mailto generation) expose loading states and resilient error messaging before closing dialogs or redirecting users.
* Deletion actions (project/report/contact) are reversible within 30 days.
* Each report interface includes clear completion indicators and a link to missing data points.
* Data editing and tabular inputs support inline addition/removal.
* Dataset view is a single spreadsheet-like experience (`/projects/:id/dataset`) with inline editing, filtering, and CSV export.
* File repository supports search, filter by file type, and linking files to data points via tag-based selectors.

---

## 5. Future-Proofing and Scalability

The following architectural and data model provisions must be included in MVP schemas and APIs to prevent refactoring during expansion:

1. **Dataset JSONB structure** — maintain flexibility for additional data point types; field_id based system allows easy template extension.
2. **Data Requests table** — logs all mailto requests for historical tracking; `external_access` field reserved for future link-based sharing (not used in MVP).
3. **External Access field** — reserved for future external collaborator permissions (ignored in MVP).
4. **Twin Project Field** — prepare nullable `twin_project_id` column for AI-optimized scenario comparison.
5. **Template Configuration Versioning** — Git-based versioning allows rollback and tracking of template changes; `template_code` stored in Reports for template evolution.
6. **File Metadata extensibility** — structure allows adding `confidence` and `source_type` (OCR/Manual) fields post-MVP.
7. **API routes** — designed to support eventual organization-level scoping and role-based access control.
8. **Mailto template** — stored in `Project.mailto_template` (JSONB, subject/body), seeded from report templates and supporting placeholders `{{contact_name}}`, `{{project_name}}`, `{{field_display_name}}`, `{{field_list}}`, `{{deadline}}`, `{{requester_signature}}` (auto-composed from the project owner and project name).
9. **Optimistic locking** — `Project.dataset_version` prevents concurrent edit conflicts in multi-user scenarios.
10. **Lazy payload infrastructure** — feature flags, reusable lazy SSR helpers, and `x-server-timing` instrumentation must ship with MVP routes so payload trimming can be extended to additional pages without reinventing the pattern.

---

## 6. Technology Stack & Architecture

*(Implementation guidance — not part of functional requirements)*

### 6.1. Application Architecture

**Monolithic Next.js Application** (recommended for MVP):
- Single application combining frontend and backend
- Next.js App Router for UI pages
- Next.js API Routes for backend logic
- Simplified deployment and development
- Scales via serverless (Vercel) or containers (Docker)

**Why monolith over microservices:**
- ✅ Faster MVP development (single codebase)
- ✅ Simpler deployment (one service)
- ✅ Built-in API for future mobile apps (API Routes accessible externally)
- ✅ Serverless-ready (Vercel/AWS auto-scales)
- ✅ Easy to extract services later if needed
- ❌ Microservices add unnecessary complexity for single-user MVP

### 6.2. Technology Stack

| Layer             | Technology                                       | Notes                                          |
| ----------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Framework**     | Next.js 15 (App Router)                          | Full-stack React framework                     |
| **Language**      | TypeScript                                       | Type safety across frontend and backend        |
| **UI Toolkit**    | Tailwind CSS + shadcn/ui                         | Utility-first CSS with accessible components   |
| **Database**      | PostgreSQL + Prisma ORM                          | Relational DB with JSONB for dataset           |
| **Authentication**| JWT (email/password); OAuth reserved             | Simple auth in MVP, OAuth post-MVP             |
| **Email Service** | Resend (resend.com)                              | Transactional emails (React Email templates)   |
| **File Storage**  | ⏸️ Post-MVP (Vercel Blob or similar)             | Deferred: File uploads with OCR integration    |
| **API Layer**     | Next.js API Routes                               | RESTful endpoints in `/app/api/*`              |
| **Export Engine** | Browser print-to-PDF (MVP); Puppeteer (post-MVP) | User-initiated PDF export                      |
| **Deployment**    | Vercel (recommended) or Docker/VPS               | Serverless or self-hosted                      |

**Optional Services** (post-MVP):
- OCR: Tesseract / AWS Textract
- LLM: OpenAI API for data extraction
- Real-time: WebSockets (Socket.io)

### 6.3. Project Structure

```
carbonreport/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history
│   └── seed.ts                # Initial data (report templates)
│
├── public/                    # Static assets
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/      # Protected routes
│   │   │   ├── projects/
│   │   │   ├── contacts/
│   │   │   └── settings/
│   │   ├── api/              # Backend API Routes
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── reports/
│   │   │   ├── contacts/
│   │   │   └── files/        # ⏸️ Post-MVP
│   │   ├── layout.tsx
│   │   └── page.tsx          # Marketing landing page
│   │
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components
│   │
│   └── lib/                 # Utilities and services
│       ├── db.ts                  # Prisma client singleton
│       ├── utils.ts               # General utilities
│       ├── dataset-init.ts        # Initialize dataset from DB field defs
│       ├── dataset-utils-v2.ts    # Enrich/flatten helpers, repeatables
│       ├── dataset-validation.ts  # Dataset CRUD and validation (Zod)
│       ├── questionnaires/        # Questionnaire configs (TS)
│       └── report-templates/      # Report template configs (TS)
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 6.4. Deployment Strategy

**MVP Deployment (Recommended: Vercel)**
- One-click deployment from Git
- Automatic HTTPS, CDN, and edge functions
- PostgreSQL via Vercel Postgres or external (Supabase, Neon)
- Environment variables in Vercel dashboard
- Free tier: 100 GB bandwidth, unlimited API requests

**Alternative: Self-hosted (Docker)**
- `next build` → standalone output
- Docker container with Node.js
- Nginx reverse proxy
- PostgreSQL container or managed service
- More control, requires DevOps

### 6.5. Database Hosting Options

| Provider         | Type    | Free Tier          | Notes                      |
| ---------------- | ------- | ------------------ | -------------------------- |
| Vercel Postgres  | Managed | 256 MB, 60h compute| Integrated with Vercel     |
| Supabase         | Managed | 500 MB, 2 projects | Includes auth, storage     |
| Neon             | Managed | 512 MB             | Serverless Postgres        |
| Railway          | Managed | $5 credit          | Easy setup, Docker support |
| Self-hosted      | DIY     | ∞                  | Full control, more work    |

### 6.6. Why Next.js API Routes (not separate backend)

**Advantages:**
- ✅ Same codebase for frontend and API (shared types)
- ✅ Single deployment (no CORS configuration)
- ✅ Serverless auto-scaling on Vercel
- ✅ Built-in middleware for auth, logging
- ✅ API accessible to mobile apps (standard HTTP)

**When to extract backend:**
- 10,000+ concurrent users (rare for MVP)
- Heavy background jobs (OCR/LLM processing)
- Multiple frontend clients (web, iOS, Android) with different teams
- **For this MVP**: Not needed

---

## 7. MVP Authentication & Email Strategy

### 7.1. Authentication

* **MVP**: Email/password authentication with JWT tokens
  * User registration with email verification
  * Password reset flow via email
  * **Logout**: Clears JWT token from client (localStorage/cookies) and redirects to Landing page
  * Session management with refresh tokens
  * **Password requirements**: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
  * **Session duration**: 
    * Access token: 24 hours
    * Refresh token: 30 days (default), 90 days with "Remember me"
    * Auto-refresh on user activity
    * Tokens invalidated on logout
* **Post-MVP**: OAuth 2.0 providers (Google, Microsoft)
  * Database schema already supports `oauth_provider` and `oauth_id` fields (nullable)
  * API designed to allow multiple auth methods per user

### 7.2. Transactional Email

* **Implementation**: Resend (resend.com)
  * Modern API-first email service with excellent developer experience
  * React Email templates support for maintainable HTML emails
  * Built-in deliverability and reputation management
  * Generous free tier: 3,000 emails/month, then $20/month for 50,000
  * Simple integration via REST API or official SDK
* **Required Email Types**:
  * Welcome email (post-registration)
  * Email verification link
  * Password reset link
  * Data request notifications (optional, future)
* **Configuration**: Environment variables for API key; templates can be React components or HTML

### 7.3. Real-time Updates

* **MVP approach**: Manual save with optimistic UI updates
  * No polling or auto-sync
  * Save button commits changes to server
  * Warning on navigation with unsaved changes
  * Conflict resolution: last-write-wins with timestamp comparison
* **Post-MVP**: WebSockets for live collaboration
  * Enable when multi-user organizations are implemented
  * Requires session state management and conflict resolution

### 7.4. Rate Limiting

* **Not implemented in MVP**
  * API designed with middleware hooks for future rate limiting
  * Use reverse proxy (Nginx, Cloudflare) for basic DDoS protection
* **Post-MVP**: Implement per-user/per-IP rate limits when scaling

---

## 8. MVP Scope Boundaries

### In Scope (MVP)
✅ Single-user accounts with email/password authentication  
✅ **Auto-redirect to project creation after first registration**  
✅ Project creation, editing, soft-delete, and full duplication (with data)  
✅ Multi-step project creation with questionnaire or manual report type selection  
✅ **Questionnaire logic stored in code** (`src/lib/questionnaires/`) with Git versioning  
✅ **Report templates stored in code** (`src/lib/report-templates/`) with Git versioning  
✅ **User-facing terminology**: "Report Types" or "Report Standards" (not "templates")  
✅ Report types (ISO 14067, CBAM) with dynamic forms  
✅ Reports with unified edit mode (no separate preview/edit modes)  
✅ **Request Data functionality in both Dataset AND Report views**  
✅ Shared dataset with scalar and tabular data points  
✅ **Field ID naming convention**: snake_case with DB-backed identifiers  
✅ **Global contact management** (contacts shared across all user's projects)  
✅ Mailto-based data requests from data points (in Dataset or Reports)  
✅ **Per-project mailto template customization** (stored in `Project.mailto_template`)  
✅ File repository with upload (10 MB limit, all file types) and linking  
✅ Progress tracking and completion calculation  
✅ Export to PDF via browser print functionality (dedicated print page)  
✅ Transactional emails (verification, password reset)  
✅ `/projects/:id/dataset` spreadsheet-style view with inline editing, filtering, CSV export, and Request Data actions  
✅ Manual save with unsaved changes warning  
✅ **Optimistic locking** for concurrent dataset edits (`dataset_version` field)  

### Out of Scope (Post-MVP)
❌ Admin interface and user management  
❌ **Database-stored questionnaire registry** (code-based in MVP)  
❌ **Database-stored report templates** (code-based in MVP)  
❌ Multi-user organizations and role-based access control  
❌ OAuth authentication providers (Google, Microsoft)  
❌ Real-time collaboration via WebSockets  
❌ OCR and LLM-assisted data extraction  
❌ Billing, subscriptions, and payment processing  
❌ Mobile applications (iOS, Android)  
❌ Public API for third-party integrations  
❌ Advanced analytics dashboards  
❌ Multi-language support (i18n/l10n)  
❌ Rate limiting and abuse prevention  
❌ Data request status tracking (pending/received/declined)  
❌ External user access for contacts  
❌ Server-side PDF/XLSX generation (use browser print in MVP)  
❌ Autosave functionality  
❌ Separate preview mode for reports

---

## 9. Summary

The MVP implements all user-facing features for project creation, report management, dataset editing, contact interaction, and file storage, while reserving architecture for future modules such as billing, multi-user organizations, AI automation, and data extraction.

**Key architectural decisions:**
- **Code-based configuration**: Questionnaires and report templates stored in Git-versioned TypeScript/JSON files (`src/lib/`) for rapid iteration without database migrations
- **Global contacts**: Contacts are user-scoped (not project-scoped), with full history of data requests across all projects
- **Dataset page**: Single route (`/projects/:id/dataset`) delivering a spreadsheet-style grid with inline editing, filtering, CSV export, and Request Data actions
- **Report editing**: Single unified mode without separate preview — users edit and print directly
- **Request Data everywhere**: Available in both Dataset view AND within Report editors (same functionality)
- **Project creation flow**: Multi-step process requiring at least one report type selection (via questionnaire or manual)
- **First-time user experience**: Auto-redirect to project creation wizard after email verification (can exit to Dashboard)
- **User-facing terminology**: "Report Types" or "Report Standards" (not "templates") for better UX
- **Mailto template customization**: Project-wide template stored in `Project.mailto_template`, initialized from report templates, supports placeholders such as `{{field_display_name}}` and `{{field_list}}`, and can be edited at `/projects/:id/mailto-templates`.
- **Data architecture**: All field values live in `Project.dataset`; Reports reference data via `template_code` and filter logic
- **Field ID convention**: snake_case identifiers with database (DatasetFieldDefinition) as source of truth
- **Optimistic locking**: `dataset_version` counter prevents concurrent edit conflicts

Each module (Projects, Reports, Dataset, Contacts, Files) operates independently but shares a consistent identifier model and unified synchronization logic, ensuring interoperability and scalability without future schema rewrites.

