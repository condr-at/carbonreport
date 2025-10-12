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

- Node.js 20+ and pnpm
- PostgreSQL database
- S3-compatible storage (AWS S3 or local MinIO)
- Resend account for emails

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carbonreport
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Random secret (min 32 chars)
- `RESEND_API_KEY`: API key from resend.com
- `S3_*`: S3 or MinIO credentials

4. Initialize database:
```bash
pnpm db:push      # Create tables
pnpm db:seed      # Seed templates and questionnaires
```

5. Generate Prisma Client:
```bash
pnpm db:generate
```

6. Run development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

```bash
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed initial data
pnpm db:studio    # Open Prisma Studio (GUI)
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

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Option 2: Docker

```bash
docker build -t carbonreport .
docker run -p 3000:3000 carbonreport
```

See [docs/Requirements v0.0.1.md § 6.5](docs/Requirements%20v0.0.1.md#65-deployment) for details.

## Development

- `pnpm dev` - Start dev server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint

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

