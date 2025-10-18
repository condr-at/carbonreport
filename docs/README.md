# Documentation

This folder contains all project documentation for the Carbon Report Platform.

---

## 🚀 Quick Start

### For Developers

1. **Setup Database**: 
   ```bash
   npm run db:push   # Sync schema (uses DIRECT_URL)
   npm run db:seed   # Seed DB-backed field definitions and sample data
   npm run dev       # Start dev server
   ```
2. **Read First**: [Requirements v0.0.1](./Requirements%20v0.0.1.md) — updated for DB-backed field definitions
3. **API**: [API_REFERENCE.md](./API_REFERENCE.md) — endpoints and contracts
4. **UI Components**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

### For Product/UX

1. **UX Flows**: [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md)
2. **Architecture**: [REPORT_TEMPLATES_ARCHITECTURE.md](./REPORT_TEMPLATES_ARCHITECTURE.md) and [Requirements v0.0.1](./Requirements%20v0.0.1.md)

---

## 📚 Core Documents

### 📋 [Requirements v0.0.1](./Requirements%20v0.0.1.md)
**Primary source of truth** for all system requirements, data model, and architecture decisions.

**Contents**:
- User roles and workflows
- Questionnaire system architecture (code-based)
- Report templates architecture (code-based)
- Database schema and field ID conventions
- Mailto template customization
- Future-proofing and AI integration plans

**When to use**: Understanding system design, making architectural decisions, resolving ambiguities

---

### 🎨 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
Visual design system and UI component specifications.

**Contents**:
- Color palette and typography
- Component library (buttons, forms, cards, etc.)
- Layout patterns and spacing
- Accessibility guidelines

**When to use**: Building frontend components, ensuring visual consistency

---

### 👤 [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md)
UX specifications, information architecture, and user interaction patterns.

**Contents**:
- Information Architecture (site map, layouts, page blocks)
- Layout templates (PublicLayout, DashboardLayout, ProjectLayout, PrintLayout)
- Reusable page blocks (ProjectCard, DataPointRow, ContactSelector, etc.)
- Component hierarchy (Pages → Blocks → UI Components)
- Page-to-API mapping (which endpoints each page uses)
- User flows and navigation diagrams
- Screen wireframes and scenarios

**When to use**: Understanding user experience, planning features, UX reviews, frontend architecture

---

## 📊 Dataset System (DB-backed)

The dataset is now fully defined by database field definitions (`DatasetFieldDefinition`).

Key references:
- Field definitions API: `/api/dataset-fields`
- Seed source: `prisma/seed-data/dataset-fields.ts`
- Runtime helpers: `src/lib/dataset-init.ts`, `src/lib/dataset-utils-v2.ts`

Concepts:
- `field_id`: snake_case string ID stored in DB
- `is_repeatable`, `repeatable_key`: mark and group repeatable fields
- `item_id`: numeric string to distinguish rows within a repeatable group

### 🔧 [API_REFERENCE.md](./API_REFERENCE.md)
Complete REST API documentation for backend endpoints.

**Contents**:
- All endpoints (Projects, Dataset, Reports, Mailto Templates)
- Request/response schemas
- Error handling patterns
- Optimistic locking implementation
- Code examples and testing commands

**When to use**: Implementing frontend API calls, testing, debugging

---

### ✅ [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
Development progress tracker and implementation roadmap.

**Contents**:
- Phase-by-phase task breakdown (Database, API, Frontend, Testing, Deployment)
- Current progress: 43% (31/72 tasks)
- Next action items and priorities

**When to use**: Tracking development progress, planning sprints, onboarding developers

---

## Quick Navigation

**New to the project?**
1. Start with [Requirements v0.0.1](./Requirements%20v0.0.1.md)
2. Read [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md) to understand user experience
3. Check [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for current status

**Working with Dataset?** ⭐
1. **Field definitions**: `prisma/seed-data/dataset-fields.ts`
2. **API**: `/api/dataset-fields`
3. **Helpers**: `src/lib/dataset-utils-v2.ts`

**Building frontend?**
1. Read [API_REFERENCE.md](./API_REFERENCE.md) for endpoint specs
2. Use [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md) for page structure and IA
3. Use [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for UI components
4. Follow page-to-API mapping for data flow

**Working on backend?**
1. Refer to [Requirements v0.0.1](./Requirements%20v0.0.1.md) for data model
2. Check [API_REFERENCE.md](./API_REFERENCE.md) for endpoint contracts
3. Update [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) when completing tasks

---

<!-- Removed stale Document Status table to avoid drift -->

---

## Architecture Summary

**Key Principles** (from Requirements):
- **Single Source of Truth**: All field data in `Project.dataset` JSONB
- **Code-Based Configuration**: Templates and questionnaires in `src/lib/` (Git-versioned)
- **Optimistic Locking**: Concurrent edit prevention via `datasetVersion` counter
- **DB-backed Field Definitions**: Single source of truth in DB, fetched via API
- **Type Safety**: Zod validation throughout
- **Flexible Reports**: Reports are filtered views of Project.dataset

**Tech Stack**:
- Next.js 15 App Router
- PostgreSQL (Supabase) + Prisma ORM
- TypeScript + Zod validation
- Tailwind CSS (UI)

---

## Contributing

When updating documentation:
1. Update relevant `.md` files
2. Update "Last Updated" dates
3. Keep [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) in sync with actual progress
4. Cross-reference related sections in other docs

---

**Questions?** Open an issue or contact the development team.
