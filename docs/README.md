# Documentation Index

_Last updated: 2025-11-08_

This folder contains the working documentation for the Carbon Report Platform. The layout was refreshed to reduce duplication and make it easier to find the right reference quickly.

---

## 🚀 Quick Start

### For Developers

1. **Environment & Database**
   ```bash
   npm run db:push   # Sync schema (uses DIRECT_URL)
   npm run db:seed   # Seed dataset field definitions and demo data
   npm run dev       # Start dev server
   ```
2. **Validation (after schema or template edits)**
   ```bash
   npm run templates:check  # Ensure report templates match DB field IDs
   ```
3. **Read next**: [`ARCHITECTURE.md`](./ARCHITECTURE.md) → [`DEVELOPMENT.md`](./DEVELOPMENT.md)
4. **API contracts**: [`API_REFERENCE.md`](./API_REFERENCE.md)

### For Product & UX

1. **User flows & IA**: [`UX_GUIDE.md`](./UX_GUIDE.md)
2. **Design system**: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
3. **Product direction**: [`planning/ROADMAP.md`](./planning/ROADMAP.md)

---

## 📚 Core Documents

| File | Who | Why |
| --- | --- | --- |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Engineers, PMs | High-level system & data architecture (supersedes archived requirements docs). |
| [`DEVELOPMENT.md`](./DEVELOPMENT.md) | Engineers | Day-to-day workflow, active technical debt, validation tooling. |
| [`API_REFERENCE.md`](./API_REFERENCE.md) | Engineers | REST endpoint definitions, request/response schemas. |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Engineers, Designers | UI components, spacing, accessibility rules. |
| [`UX_GUIDE.md`](./UX_GUIDE.md) | Product, Design | UX flows, layout templates, page-to-API mapping. |
| [`planning/ROADMAP.md`](./planning/ROADMAP.md) | PMs, Leads | Near-term delivery plan and phase overview. |
| [`planning/BACKLOG.md`](./planning/BACKLOG.md) | Engineers, PMs | Active backlog items carried over from the old implementation checklist. |
| [`reference/data-points-hints.md`](./reference/data-points-hints.md) | Engineers, Analysts | Narrative hints for key dataset fields (legacy CamelCase identifiers). |
| [`TECHNICAL_DEBT.md`](./TECHNICAL_DEBT.md) | Everyone | Pointer to the consolidated development guide. |

---

## 🔍 Navigation Tips

**New to the project?**
1. Skim [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the system overview.
2. Read [`UX_GUIDE.md`](./UX_GUIDE.md) to understand the product experience.
3. Check [`DEVELOPMENT.md`](./DEVELOPMENT.md) for active engineering focus areas.

**Working on datasets or templates?**
- Canonical definitions: `prisma/seed-data/dataset-fields.ts`
- Validation tooling: `npm run templates:check`
- Field guidance: [`reference/data-points-hints.md`](./reference/data-points-hints.md)

**Implementing backend changes?**
- API specs: [`API_REFERENCE.md`](./API_REFERENCE.md)
- Technical debt / priorities: [`DEVELOPMENT.md`](./DEVELOPMENT.md#active-technical-debt)
- Backlog tasks: [`planning/BACKLOG.md`](./planning/BACKLOG.md)

**Building frontend features?**
- UX flows & layouts: [`UX_GUIDE.md`](./UX_GUIDE.md)
- Components: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)
- Data contracts: [`API_REFERENCE.md`](./API_REFERENCE.md)

---

## 🗂️ Archives & Historical Specs

The previous long-form documents are preserved for reference:

- `docs/archive/Requirements v0.0.1.md`
- `docs/archive/REPORT_TEMPLATES_ARCHITECTURE.md`
- `docs/archive/IMPLEMENTATION_CHECKLIST.md`
- `docs/archive/REFERENCE_data_points_hints.json`
- Additional planning artefacts inside `docs/archive/`

Refer to these when you need the original detail that fed into the current summaries.

---

## ✍️ Contributing to Docs

1. Update "Last updated" timestamps when making significant edits.
2. Cross-link related sections to avoid duplication.
3. For major restructures, move superseded files to `docs/archive/` instead of deleting outright.
4. Keep `ARCHITECTURE.md` and `DEVELOPMENT.md` high-level; push granular task lists to `planning/`.

Questions or suggestions? Reach out in the project channel or open an issue.
