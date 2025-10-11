# Carbon Report Platform

A web application for creating, managing, and completing carbon footprint assessment projects based on ISO 14067, CBAM, and other international standards.

## Overview

The Carbon Report Platform guides users through project creation via an adaptive questionnaire, manages reports generated from standardized templates, and centralizes data collection and collaboration tools.

### Key Features (MVP)

- ✅ Single-user accounts with email/password authentication
- ✅ Project creation with adaptive questionnaire
- ✅ Report templates (ISO 14067, CBAM) with dynamic forms
- ✅ Shared dataset with scalar and tabular data points
- ✅ Contact management with mailto-based data requests
- ✅ File repository (10 MB limit per file)
- ✅ Progress tracking and completion calculation
- ✅ PDF export via browser print
- ✅ Advanced dataset view (editable grid, CSV export)

## Tech Stack

- **Frontend**: React + Next.js + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Node.js (NestJS or Express)
- **Database**: PostgreSQL + Prisma ORM
- **File Storage**: S3-compatible (AWS S3 or MinIO)
- **Authentication**: JWT (email/password)
- **Email**: Resend (resend.com)
- **Export**: Browser print-to-PDF

## Project Structure

```
carbonreport/
├── docs/                    # Documentation
│   └── Requirements v0.0.1.md
├── apps/                    # Applications (monorepo structure)
│   ├── web/                # Next.js frontend
│   └── api/                # Backend API
├── packages/               # Shared packages
│   ├── ui/                 # Shared UI components
│   ├── database/           # Prisma schema and migrations
│   └── config/             # Shared configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/carbonreport"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Resend
RESEND_API_KEY="re_..."

# S3 Storage
S3_ENDPOINT="https://s3.amazonaws.com"
S3_BUCKET="carbonreport-files"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."

# App
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Documentation

- [Requirements Specification](./Requirements%20v0.0.1.md)
- API Documentation (coming soon)
- User Guide (coming soon)

## Development Roadmap

### MVP (Current Phase)
- Single-user functionality
- ISO 14067 and CBAM report templates
- Manual save with browser print export

### Post-MVP
- Multi-user organizations
- OAuth providers (Google, Microsoft)
- Real-time collaboration via WebSockets
- OCR/LLM-assisted data extraction
- Billing and subscriptions
- Mobile applications

## Contributing

This is a private project. For questions or contributions, please contact the project maintainer.

## License

Proprietary - All rights reserved

---

**Version**: 0.1.0  
**Last Updated**: October 11, 2025
