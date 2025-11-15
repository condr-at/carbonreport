# Carbon Report Platform

A carbon footprint assessment platform for preparing ISO 14067, CBAM, and other environmental reports.

## Overview

This platform helps users:
- Collect and organize data for carbon footprint assessments
- Generate standardized reports (ISO 14067, EU CBAM)
- Request data from external contacts
- Track progress through roadmap checklists
- Upload and link supporting documentation

See [docs/Requirements v0.0.1.md](docs/Requirements%20v0.0.1.md) for complete specifications.

### Recent API additions

- **User settings**: `GET /api/user/settings`, `PATCH /api/user/settings`, plus a `POST /api/user/settings/change-password` placeholder for upcoming auth work.
- **Membership self-service**: invitees now use `POST /api/organizations/:organizationId/members/:membershipId/{accept|decline}` to control their seat assignment (with plan limit checks on acceptance).
- **Lifecycle safety nets**: owners can restore soft-deleted organizations via `POST /api/organizations/:organizationId/restore`, then refresh counters with `POST /api/organizations/:organizationId/usage/recompute`.

### Upload guardrails

The upload pipeline currently supports organization logos and user avatars only:

- MIME types: `image/png`, `image/jpeg` (or `image/jpg` alias), `image/svg+xml`.
- File size: ≤ **512 KB** (enforced at presign + server validation).
- Dimensions: logos and avatars must be square within ±10% aspect-ratio tolerance—crop before calling the API to avoid validation errors when applying assets.
- Local development automatically falls back to disk-based storage (`public/dev-uploads`) when `ASSETS_BUCKET_NAME` is not set. Use `ENABLE_LOCAL_UPLOADS=false` to force-disable the fallback and surface configuration errors early.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM (Supabase)
- **UI**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: JWT (email/password)
- **Email**: Resend (optional for MVP)
- **File Storage**: S3-compatible object storage (presigned uploads for org logos & avatars) with an automatic disk fallback in local dev

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier works fine)
- (Optional) Resend account for emails

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carbonreport
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase database:

**Option A: Use existing Supabase project**
- Go to [supabase.com](https://supabase.com) and create/open your project
- Navigate to **Settings → Database**
- Copy **Connection string** from **Session Pooler** (port 5432)

**Option B: Use provided connection string**
- Already configured in `.env.example`

4. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase connection string:
- `DATABASE_URL` - Supabase Session Pooler URL (port 5432) for local development
- `JWT_SECRET` - Default is fine for dev (change in production!)
- `RESEND_API_KEY` - Optional, leave empty for now

5. Initialize database:
```bash
npm run db:push      # Create tables in Supabase
```

6. Configure uploads (optional):
   - For S3-compatible storage, set `ASSETS_BUCKET_NAME`, `ASSETS_BUCKET_REGION`, `ASSETS_PUBLIC_BASE_URL`, `ASSETS_UPLOADS_PREFIX`, `ASSETS_UPLOAD_TTL_SECONDS`, `ASSETS_S3_ENDPOINT` (when using a custom endpoint like Cloudflare R2), plus `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.
   - Providers that do not support presigned POST forms (e.g., Cloudflare R2) should use `ASSETS_S3_UPLOAD_STRATEGY=put`. We automatically default to `put` whenever the endpoint contains `.r2.cloudflarestorage.com`, but you can override this behavior explicitly with `post` or `put`.
   - If your storage endpoint blocks browser-side PUT/POST requests (no CORS on the S3 API), enable `ASSETS_UPLOADS_REQUIRE_RELAY=true`. In this mode the client sends the cropped file to `/api/uploads/relay`, and the backend pushes it to the presigned URL on your behalf.
   - If these variables are omitted in local development, the app automatically falls back to disk-backed uploads under `public/dev-uploads`. You can force-enable or tune this mode with `ENABLE_LOCAL_UPLOADS`, `LOCAL_UPLOADS_DIR`, `LOCAL_UPLOADS_PUBLIC_PATH`, and `LOCAL_UPLOADS_PUBLIC_URL`.
   - Cloudflare R2 example: `ASSETS_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com` (S3 API) and `ASSETS_PUBLIC_BASE_URL=https://pub-<account-id>.r2.dev/<bucket>` (public CDN). Repo defaults already point to `carbonreport-assets` in region `eeur`—replace these credentials if you provision a different storage backend.

7. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

```bash
# Prisma
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to Supabase
npm run db:studio    # Open Prisma Studio (GUI for Supabase)
```

## Project Structure

```
carbonreport/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # Backend API endpoints
│   │   ├── (auth)/       # Auth pages (login, register, etc.)
│   │   └── (dashboard)/  # Protected dashboard pages
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui components
│   └── lib/              # Utilities & helpers
│       ├── db.ts         # Prisma client singleton
│       ├── auth.ts       # JWT utilities
│       └── s3.ts         # S3 storage utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── docs/                 # Project documentation
└── public/               # Static assets
```

## Deployment

### Option 1: Vercel (Recommended)

### Option 1: Vercel (Recommended)

1. Connect repository to Vercel
2. Add PostgreSQL database:
   - **Vercel Postgres** (recommended, integrated)
   - Or use existing Supabase project
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - Use Transaction Pooler (port 6543) for production
4. Deploy automatically on push to main

### Option 2: Self-hosted (Docker)

```bash
docker build -t carbonreport .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-supabase-url" \
  -e JWT_SECRET="your-secret" \
  carbonreport
```

See [docs/Requirements v0.0.1.md § 6.5](docs/Requirements%20v0.0.1.md#65-deployment) for details.

## Development

- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## Architecture

This is a **monolithic Next.js application** with code-based configuration:

**Frontend**: React Server Components in `src/app`  
**Backend**: API Routes in `src/app/api` (serverless functions)  
**Database**: PostgreSQL via Prisma ORM (Supabase)  
**File Storage**: S3-compatible object storage

### Key Architectural Decisions

**Code-Based Templates** (MVP approach):
- Questionnaires: `src/lib/questionnaires/` (JSON + TypeScript engine)
- Report Templates: `src/lib/report-templates/` (TypeScript configs)
- **Rationale**: Faster iteration, no DB migrations for config changes
- **Future**: May migrate to database with admin UI post-MVP

**Single Source of Truth**:
- All field data stored in `Project.dataset` JSONB column
- Reports are filtered views of project dataset (no duplicate data)
- `Report.metadata` stores UI preferences only (sort order, filters)

**Optimistic Locking**:
- `Project.datasetVersion` counter prevents concurrent edit conflicts
- Incremented atomically on each save
- Returns 409 Conflict if version mismatch detected

**Type Safety**:
- FieldId enum in `src/lib/field-ids.ts` (50+ predefined values)
- Zod validation schemas in `src/lib/dataset-validation.ts`
- PascalCase naming: `Entity_Attribute_Subtype` (e.g., `Material_Weight_Kg`)

See [Requirements v0.0.1 § 2](docs/Requirements%20v0.0.1.md#2-functional-requirements) for complete details.

## Documentation

- [docs/README.md](docs/README.md) – Documentation index & onboarding links
- [Requirements v0.0.1](docs/Requirements%20v0.0.1.md) – Baseline functional spec
- [API Reference](docs/API_REFERENCE.md) – Full list of REST endpoints, including the new user settings, membership acceptance, and organization restore routes
- [UX Guide](docs/UX_GUIDE.md) – Information architecture, flows, and component guidance (avatars/logos, restore UX, invitation handling)
- [Development Guide](docs/DEVELOPMENT.md) – Engineering workflows, migrations, helper modules, and runbooks
- [Billing Playbook](docs/BILLING_PLAYBOOK.md) – Plan defaults, seat enforcement, upgrade intent logging, and usage recompute runbook
- [Planning Roadmap](docs/planning/ROADMAP.md) – Next steps & release sequencing
- [Data Points Glossary](docs/reference/data-points-hints.md) – Field definitions and hint copy for dataset builders

## License

Private project - not licensed for public use.

