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
* Mapping rules stored in database as JSONB in `questionnaire_registry` table.
* Rules are updatable via admin interface without code deployment.
* User may skip the questionnaire and manually select report types from a list.

### 2.3. Reports

* Reports are pre-built web templates containing input fields, labels, and contextual guidance.
* **User-facing terminology**: Reports are called "Report Types" or "Report Standards" (e.g., "ISO 14067", "CBAM")
* **Technical terminology**: Internally called "templates" in code and database
* Reports are **not user-editable structurally**; they are designed and maintained by administrators.
* Users can:
  * Fill data directly in input fields.
  * **Request data from contacts** directly from report fields (same functionality as in Dataset)
  * Remove or add report types from the project.
  * Export reports (PDF via browser print) — all formatted according to official standards.
* Deleting a report does not remove related data from the project dataset.

### 2.4. Shared Dataset

* Each project contains one unified dataset shared by all reports.
* Data points (DPs) have unique IDs and can belong to multiple reports.
* Completing or updating a DP updates the completion status of all linked reports.
* Data points can be **scalar** (single values) or **tabular** (repeating rows, e.g., purchase tables).
* DP IDs are predefined in report templates and consistent across projects (e.g., `field-ProductName`).
* When multiple reports use the same field with identical validation/boundaries, they share one DP.
* Different boundaries/validation rules = different DPs (e.g., `TotalCFP_ISO14067` vs `TotalCFP_CBAM`).

#### Dataset Interface (MVP)

* Single route `/projects/:id/dataset` renders a spreadsheet-like table with all project data points; there is no separate "advanced" or "normal" mode.
* Inline cell editing, row insertion/removal, filtering, and sorting are available directly in the grid when supported by the UI library.
* “Request Data” actions are surfaced from each relevant cell/row and share UX with report field requests.
* CSV export runs from the same page and exposes loading and failure feedback.
* Bulk edits, save operations, and exports display in-context loading indicators and non-blocking error toasts.

#### Dataset JSONB Structure (MVP)

Simplified structure based on field-value pairs:

```json
{
  "data_points": [
    {
      "field_id": "ProductName",
      "item_id": null,
      "value": "Reusable Bottle 750 mL"
    },
    {
      "field_id": "MaterialInputName",
      "item_id": "1",
      "value": "Stainless steel 18/8"
    },
    {
      "field_id": "MaterialInputAmount",
      "item_id": "1",
      "value": "0.30"
    },
    {
      "field_id": "MaterialInputName",
      "item_id": "2",
      "value": "Polypropylene cap"
    }
  ]
}
```

**Key principles**:
- `field_id`: Matches report template field identifier
- `item_id`: `null` for scalar fields; `"1"`, `"2"`, `"3"` etc. for tabular rows
- `value`: Always stored as string; type validation happens at application layer
- Unique key: `(field_id, item_id)` within a project

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
* Hints are stored in `report_templates.metadata.hints` JSONB field and populated during project initialization.

### 2.7. Address Book (Contacts)

* Contacts are **not platform users**; they represent external collaborators.
* Fields: `id`, `name`, `position` (optional), `email`, `created_at`, `updated_at`, `archived`.
* Contacts are user-specific (scoped to the owning account).

#### Contact Usage

* Each data point allows triggering a “Request Data” action.
* On click, user selects a contact (existing or new) and a mailto link is generated using a predefined template.
* Mail clients always open with a `mailto:` link; if template metadata is missing or malformed the body falls back to an empty message instead of failing the interaction.
* System logs the request in `data_requests` with fields:

  * `id`, `user_id`, `project_id`, `contact_id`, `data_point_id`, `requested_at`, `revoked_at`, `external_access` (default false).
* If a link between contact and DP is removed, `revoked_at` timestamp is set.

#### Contact Interface

* In data entry view: shows the last contact associated with each data point.
* In the address book: each contact card displays:

  * Active requests.
  * Historical (revoked) requests with timestamps.

### 2.8. File Repository (Project Files)

* Each project includes a structured file storage area for incoming materials (e.g., Excel sheets, photos, scanned tables).
* Supports drag-and-drop and manual upload.
* **File size limit**: 10 MB per file.
* **Allowed file types**: All formats (xlsx, pdf, jpg, png, csv, doc, etc.).
* Metadata: `id`, `user_id`, `project_id`, `filename`, `type`, `size`, `uploaded_at`, `linked_data_points[]`, `status`.
* Linking to data points is handled through a tag-style multi-select with autosuggest inside a file properties side panel; the same pattern is reused for other entity property editors.
* Initially passive (storage only). Future integration: OCR and LLM-assisted data extraction.

### 2.9. Progress Tracking

* Completion percentage per report and overall project calculated dynamically based on filled data points.
* All data points are weighted equally in completion calculation.
* Linked data points synchronize progress across multiple reports.

### 2.10. Exports

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

| Field            | Type      | Notes                           |
| ---------------- | --------- | ------------------------------- |
| id               | UUID      | Primary key                     |
| user_id          | UUID      | FK to users                     |
| name             | Text      | Project title                   |
| created_at       | Timestamp | —                               |
| deleted_at       | Timestamp | Soft delete (30 days retention) |
| dataset          | JSONB     | Dynamic data structure          |
| checklist        | JSONB     | Steps for roadmap               |
| status           | Enum      | (active, archived, deleted)     |
| twin_project_id  | UUID      | Nullable; FK to projects        |

### 3.3. Reports

| Field       | Type      | Notes                  |
| ----------- | --------- | ---------------------- |
| id          | UUID      | Primary key            |
| project_id  | UUID      | FK to projects         |
| template_id | UUID      | FK to report_templates |
| completion  | Float     | 0–100%                 |
| created_at  | Timestamp | —                      |
| updated_at  | Timestamp | —                      |

### 3.4. Report Templates

| Field    | Type  | Notes                                                                                             |
| -------- | ----- | ------------------------------------------------------------------------------------------------- |
| id       | UUID  | Primary key                                                                                       |
| code     | Text  | Identifier (e.g., CBAM, ISO14067)                                                                 |
| name     | Text  | Display name                                                                                      |
| version  | Text  | Template version                                                                                  |
| metadata | JSONB | Field structure, labels, mailto templates, hints, validation rules. Structure defined at runtime. |

### 3.5. Contacts

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

### 3.6. Data Requests

| Field           | Type      | Notes                |
| --------------- | --------- | -------------------- |
| id              | UUID      | Primary key          |
| user_id         | UUID      | FK to users          |
| project_id      | UUID      | FK to projects       |
| contact_id      | UUID      | FK to contacts       |
| data_point_id   | Text      | Data point reference |
| requested_at    | Timestamp | —                    |
| revoked_at      | Timestamp | Nullable             |
| external_access | Boolean   | Default false        |

### 3.7. Project Files

| Field              | Type      | Notes                         |
| ------------------ | --------- | ----------------------------- |
| id                 | UUID      | Primary key                   |
| user_id            | UUID      | FK to users                   |
| project_id         | UUID      | FK to projects                |
| filename           | Text      | Original filename             |
| mime_type          | Text      | —                             |
| size               | Integer   | Bytes                         |
| linked_data_points | JSONB     | Array of DP IDs               |
| uploaded_at        | Timestamp | —                             |
| status             | Enum      | (uploaded, processed, linked) |

**Future extensibility (post-MVP)**:
* `confidence` field: Float (0-1) for OCR/LLM extraction confidence
* `source_type` enum: Manual | OCR | LLM  
* `extraction_metadata` JSONB: Raw OCR/LLM output

### 3.8. Questionnaire Registry

| Field      | Type      | Notes                                    |
| ---------- | --------- | ---------------------------------------- |
| id         | UUID      | Primary key                              |
| version    | Text      | Registry version                         |
| rules      | JSONB     | Mapping rules: responses → report_ids    |
| created_at | Timestamp | —                                        |
| updated_at | Timestamp | —                                        |
| active     | Boolean   | Only one active version at a time        |

**Rules structure (indicative)**:
```json
{
  "questions": [
    {
      "id": "q1",
      "text": "What type of product are you assessing?",
      "type": "single-choice",
      "options": ["Physical goods", "Services", "Software"]
    }
  ],
  "mappings": [
    {
      "condition": {"q1": "Physical goods", "q2": "EU market"},
      "recommended_reports": ["ISO14067", "CBAM"],
      "priority": 1
    }
  ]
}
```

### 3.9. Logs (optional for MVP)

| Field     | Type      | Notes                            |
| --------- | --------- | -------------------------------- |
| id        | UUID      | Primary key                      |
| user_id   | UUID      | FK to users                      |
| entity    | Text      | (project, report, contact, file) |
| entity_id | UUID      | —                                |
| action    | Text      | (create, update, delete, export) |
| timestamp | Timestamp | —                                |

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
5. **Versioning Hooks** — store `template_id` and `version` for all reports to support template updates.
6. **File Metadata extensibility** — structure allows adding `confidence` and `source_type` (OCR/Manual) fields post-MVP.
7. **API routes** — designed to support eventual organization-level scoping and role-based access control.
8. **Mailto templates** — stored in report_templates metadata; post-MVP users can customize per data point.

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
| **File Storage**  | S3-compatible (AWS S3 or MinIO)                  | 10 MB file uploads, future OCR integration     |
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
│   │   │   └── files/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Form components
│   │   └── layout/          # Layout components
│   │
│   └── lib/                 # Utilities and services
│       ├── db.ts            # Prisma client singleton
│       ├── auth.ts          # JWT helpers, session management
│       ├── email.ts         # Resend integration
│       ├── storage.ts       # S3 client
│       ├── validations.ts   # Zod schemas
│       └── utils.ts         # General utilities
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
✅ **User-facing terminology**: "Report Types" or "Report Standards" (not "templates")  
✅ Report types (ISO 14067, CBAM) with dynamic forms  
✅ Reports with unified edit mode (no separate preview/edit modes)  
✅ **Request Data functionality in both Dataset AND Report views**  
✅ Shared dataset with scalar and tabular data points  
✅ **Global contact management** (contacts shared across all user's projects)  
✅ Mailto-based data requests from data points (in Dataset or Reports)  
✅ File repository with upload (10 MB limit, all file types) and linking  
✅ Progress tracking and completion calculation  
✅ Export to PDF via browser print functionality (dedicated print page)  
✅ Transactional emails (verification, password reset)  
✅ `/projects/:id/dataset` spreadsheet-style view with inline editing, filtering, CSV export, and Request Data actions  
✅ Manual save with unsaved changes warning  

### Out of Scope (Post-MVP)
❌ Admin interface and user management  
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
- **Global contacts**: Contacts are user-scoped (not project-scoped), with full history of data requests across all projects
- **Dataset page**: Single route (`/projects/:id/dataset`) delivering a spreadsheet-style grid with inline editing, filtering, CSV export, and Request Data actions
- **Report editing**: Single unified mode without separate preview — users edit and print directly
- **Request Data everywhere**: Available in both Dataset view AND within Report editors (same functionality)
- **Project creation flow**: Multi-step process requiring at least one report type selection (via questionnaire or manual)
- **First-time user experience**: Auto-redirect to project creation wizard after email verification (can exit to Dashboard)
- **User-facing terminology**: "Report Types" or "Report Standards" (not "templates") for better UX

Each module (Projects, Reports, Dataset, Contacts, Files) operates independently but shares a consistent identifier model and unified synchronization logic, ensuring interoperability and scalability without future schema rewrites.

