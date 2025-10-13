# Documentation

This folder contains all project documentation for the Carbon Report Platform.

---

## 🚀 Quick Start

### For Developers

1. **Setup Database**: 
   ```bash
   npm run db:seed  # Fill with mock data
   npm run dev      # Start dev server
   ```
2. **Read First**: [Requirements v0.0.1](./Requirements%20v0.0.1.md) - System overview
3. **Mock Data**: [DATABASE_MOCK_DATA.md](./DATABASE_MOCK_DATA.md) - Sample projects
4. **Implementation**: [DATASET_QUICK_REFERENCE.md](./DATASET_QUICK_REFERENCE.md) - Code examples
5. **UI Components**: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Visual guidelines

### For Product/UX

1. **UX Flows**: [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md)
2. **User Guide**: [DATASET_TABLE_USER_GUIDE.md](./DATASET_TABLE_USER_GUIDE.md)
3. **Architecture**: [Requirements v0.0.1](./Requirements%20v0.0.1.md)

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

## 📊 Dataset System (Iteration 6)

### 🎯 [DATASET_QUICK_REFERENCE.md](./DATASET_QUICK_REFERENCE.md) ⭐
**Start here** for dataset implementation. Quick reference with code examples.

**Contents**:
- Key concepts and files
- Commands and API examples
- Code snippets (init, enrich, group, transform)
- Troubleshooting guide

**When to use**: Implementing dataset features, debugging, quick lookup

---

### 📖 [FULL_DATASET_SCHEMA.md](./FULL_DATASET_SCHEMA.md)
Complete guide to the 162-field dataset system.

**Contents**:
- Dataset vs Report Templates concept
- Schema structure (19 sections, 162 fields)
- Implementation details (parser, generator, initialization)
- Workflow for adding new fields

**When to use**: Understanding dataset architecture, extending the system

---

### 🏗️ [DATASET_INITIALIZATION.md](./DATASET_INITIALIZATION.md)
Strategy and best practices for dataset initialization.

**Contents**:
- Comparison of approaches (template-based vs full schema)
- Implementation patterns
- Migration strategies

**When to use**: Understanding initialization logic, refactoring

---

### 📋 [DATASET_TABLE_REQUIREMENTS.md](./DATASET_TABLE_REQUIREMENTS.md)
Original specification for dataset table UI.

**Contents**:
- TanStack Table v8 requirements
- Data transformation flow
- Visual grouping specifications
- Inline editing behaviors

**When to use**: UI implementation, feature planning

---

### 👥 [DATASET_TABLE_USER_GUIDE.md](./DATASET_TABLE_USER_GUIDE.md)
End-user guide for dataset table features.

**Contents**:
- Feature overview with screenshots
- Step-by-step guides
- Tips and shortcuts
- FAQ

**When to use**: User training, support documentation

---

### ✅ [ITERATION_6_COMPLETION.md](./ITERATION_6_COMPLETION.md)
Summary of Iteration 6 implementation.

**Contents**:
- Completed tasks checklist
- Metrics and performance
- Known issues
- Sign-off and criteria

**When to use**: Progress tracking, handoff documentation

---

### 🔧 [DATASET_REPEATABLE_FIX.md](./DATASET_REPEATABLE_FIX.md) ⭐
**Critical fix** for repeatable fields behavior.

**Contents**:
- Правильное понимание repeatable fields (минимум один item)
- Правила удаления items
- Изменения в коде и UI
- Примеры и валидация

**When to use**: Understanding repeatable field logic, debugging delete behavior

---

### 📊 [DATASET_STRUCTURE_VISUAL.md](./DATASET_STRUCTURE_VISUAL.md)
Visual guide to dataset structure with diagrams.

**Contents**:
- ASCII diagrams of dataset structure
- UI behavior examples
- Code logic explanations
- Decision tables

**When to use**: Quick visual reference, onboarding, understanding structure

---

### 📝 [DATASET_FIX_SUMMARY.md](./DATASET_FIX_SUMMARY.md)
Short summary of repeatable fields fix.

**Contents**:
- Changes overview
- Validation results
- Commit messages

**When to use**: Quick reference, changelog

---

### 🗄️ [DATABASE_MOCK_DATA.md](./DATABASE_MOCK_DATA.md) ⭐
Complete guide to mock data for development.

**Contents**:
- Sample projects (E-Bike, Steel)
- User, contacts, reports structure
- Commands for testing
- How to extend mock data

**When to use**: Setting up dev environment, testing, understanding sample data

---

### 📄 [MOCK_DATA_SUMMARY.md](./MOCK_DATA_SUMMARY.md)
Short summary of mock data implementation.

**Contents**:
- What's created
- Quick commands
- File changes

**When to use**: Quick reference for mock data

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
2. Read [UX_REQUIREMENTS.md](./UX_REQUIREMENTS.md) to understand user experience
3. Check [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for current status

**Working with Dataset?** ⭐
1. **Quick start**: [DATASET_QUICK_REFERENCE.md](./DATASET_QUICK_REFERENCE.md) - Code examples
2. **Architecture**: [FULL_DATASET_SCHEMA.md](./FULL_DATASET_SCHEMA.md) - 162 fields structure
3. **Visual guide**: [DATASET_STRUCTURE_VISUAL.md](./DATASET_STRUCTURE_VISUAL.md) - Diagrams
4. **Repeatable fix**: [DATASET_REPEATABLE_FIX.md](./DATASET_REPEATABLE_FIX.md) - Important rules

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

## Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Requirements v0.0.1 | ✅ Complete | Oct 12, 2025 |
| UX_REQUIREMENTS | ✅ Complete | Oct 12, 2025 |
| DESIGN_SYSTEM | ✅ Complete | Oct 12, 2025 |
| API_REFERENCE | ✅ Complete | Oct 12, 2025 |
| IMPLEMENTATION_CHECKLIST | 🟡 In Progress | Oct 12, 2025 |
| **DATASET_QUICK_REFERENCE** | ✅ Complete | **Oct 13, 2025** |
| **FULL_DATASET_SCHEMA** | ✅ Complete | **Oct 13, 2025** |
| **DATASET_REPEATABLE_FIX** | ✅ Complete | **Oct 13, 2025** |
| **DATASET_STRUCTURE_VISUAL** | ✅ Complete | **Oct 13, 2025** |
| **ITERATION_6_COMPLETION** | ✅ Complete | **Oct 13, 2025** |

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
