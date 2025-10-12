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

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: JWT (email/password)
- **Email**: Resend
- **Storage**: S3-compatible (AWS S3 or MinIO)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier works fine)
- (Optional) S3-compatible storage for file uploads
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
- `DATABASE_URL` - Supabase Session Pooler URL (port 5432)
- `JWT_SECRET` - Default is fine for dev (change in production!)
- `RESEND_API_KEY` - Optional, leave empty for now
- `S3_*` - Optional, leave empty for now

5. Initialize database:
```bash
npm run db:push      # Create tables in Supabase
```

6. Run development server:
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

This is a **monolithic Next.js application** using:
- **Frontend**: React components in `src/app` (Server Components by default)
- **Backend**: API Routes in `src/app/api` (serverless functions)
- **Database**: PostgreSQL via Prisma ORM
- **File Storage**: S3-compatible object storage

All backend logic runs as Next.js API Routes - no separate backend server needed.

## Documentation

- [Requirements v0.0.1](docs/Requirements%20v0.0.1.md) - Complete specifications
- [Project Overview](docs/PROJECT_OVERVIEW.md) - Original project context
- [Changelog](docs/CHANGELOG.md) - Version history

## License

Private project - not licensed for public use.

