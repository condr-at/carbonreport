# Documentation

This folder contains all project documentation for the Carbon Report Platform.

---

## Core Documents

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

### 👤 [USER_FLOW.md](./USER_FLOW.md)
User journey documentation and interaction patterns.

**Contents**:
- Step-by-step user flows
- Screen wireframes and navigation
- User stories and scenarios

**When to use**: Understanding user experience, planning features, UX reviews

---

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
2. Read [USER_FLOW.md](./USER_FLOW.md) to understand user experience
3. Check [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for current status

**Building frontend?**
1. Read [API_REFERENCE.md](./API_REFERENCE.md) for endpoint specs
2. Use [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for UI components
3. Follow [USER_FLOW.md](./USER_FLOW.md) for navigation patterns

**Working on backend?**
1. Refer to [Requirements v0.0.1](./Requirements%20v0.0.1.md) for data model
2. Check [API_REFERENCE.md](./API_REFERENCE.md) for endpoint contracts
3. Update [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) when completing tasks

---

## Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Requirements v0.0.1 | ✅ Complete | Oct 12, 2025 |
| DESIGN_SYSTEM | ✅ Complete | Oct 12, 2025 |
| USER_FLOW | ✅ Complete | Oct 12, 2025 |
| API_REFERENCE | ✅ Complete | Oct 12, 2025 |
| IMPLEMENTATION_CHECKLIST | 🟡 In Progress | Oct 12, 2025 |

---

## Architecture Summary

**Key Principles** (from Requirements):
- **Single Source of Truth**: All field data in `Project.dataset` JSONB
- **Code-Based Configuration**: Templates and questionnaires in `src/lib/` (Git-versioned)
- **Optimistic Locking**: Concurrent edit prevention via `datasetVersion` counter
- **Type Safety**: FieldId enum and Zod validation throughout
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
