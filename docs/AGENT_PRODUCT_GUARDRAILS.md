# Agent Product Guardrails

_Last updated: 2026-06-16_

## Purpose

Этот документ предназначен для AI-агента или инженера, работающего как агент внутри репозитория.

Его задача:
- задать строгие рамки для продуктовых и UX-изменений;
- уменьшить риск regressions в positioning и user flow;
- зафиксировать source-of-truth hierarchy;
- определить, какие допущения агент может делать сам, а какие нет;
- описать acceptance criteria для product-facing изменений.

## Audience

- AI coding agents
- Engineers doing autonomous implementation
- Future contributors who need explicit execution guardrails

## Non-Goals

Этот документ не заменяет:
- `docs/ARCHITECTURE.md`
- `docs/API_REFERENCE.md`
- `docs/UX_GUIDE.md`
- `docs/planning/BACKLOG.md`

Он задает не архитектуру и не API-контракты, а правила изменения продукта.

## Source of Truth Hierarchy

Когда агент находит конфликт между документами, приоритет такой:

1. `prisma/schema.prisma` and actual code paths
2. `docs/ARCHITECTURE.md`
3. `docs/API_REFERENCE.md`
4. `docs/UX_GUIDE.md`
5. `docs/PRODUCT_READINESS_REVIEW.md`
6. `README.md`
7. historical or planning docs

### Hard rule

Если документ противоречит коду, агент не должен молча считать документ истинным.

Он должен:
- зафиксировать расхождение;
- использовать код и higher-priority docs как baseline;
- по возможности предложить doc cleanup;
- не переписывать продукт под устаревший doc без явного подтверждения.

## Product Thesis

Агент должен считать базовой продуктовой формулировкой:

`Carbon Report is a product-level carbon reporting workspace that helps teams collect the right data from the right people before the deadline, then reuse one dataset across multiple reporting outputs.`

### Implications

По умолчанию агент должен поддерживать:
- product-level first;
- deadline-driven data collection;
- shared dataset reuse;
- actionable progress visibility;
- external/internal request workflows.

Агент не должен по умолчанию оптимизировать продукт под:
- broad enterprise ESG breadth first;
- executive dashboard aesthetics over operational clarity;
- legal/compliance claims stronger than the product can support.

## Beachhead Rule

### Default stance

Primary path must favor:
- product projects;
- CBAM;
- ISO 14067 / PCF;
- adjacent product-level outputs like EPD or client templates.

### Corporate path rule

Corporate capability may exist, but:
- must not dominate the first-run flow;
- must not create ambiguity for the beachhead user;
- should be progressively disclosed when possible.

### Do

- keep corporate available if it already exists;
- demote it to advanced/expanded path when touching onboarding UX;
- use copy that distinguishes primary vs advanced paths.

### Do not

- remove corporate capability unless explicitly requested;
- elevate corporate mode to equal prominence in the default first decision screen unless there is an explicit product decision to do so.

## UX Guardrails

### 0. Landing freeze

Until explicitly reopened by the user, landing is a frozen surface.

Agent must treat:
- `/`
- `src/app/page.tsx`
- `src/components/sections/*`
- landing-specific copy/spec files

as out of scope for active iteration.

#### Allowed during freeze

- reading landing files for context
- documenting that landing is deferred
- touching landing only if a change is strictly required to unblock another critical path and the user has approved it

#### Not allowed during freeze

- routine messaging rewrites
- visual iteration on landing sections
- CTA, pricing, navbar, hero, FAQ, or section-level landing optimization
- using landing work as a substitute for fixing in-product UX

### 1. Product-first onboarding

When editing:
- `/projects/new`
- `/projects/new/questionnaire`
- `/projects/new/select-reports`

the agent must preserve or improve:
- fast comprehension;
- clear recommendation of the default path;
- low cognitive load for first-time users.

The agent should prefer:
- one obvious primary path;
- advanced options behind disclosure;
- explanation of why something is recommended or mandatory.

### 2. Workspace must prove value

When editing:
- project overview
- dataset experience
- next steps widgets
- data request surfaces
- report progress indicators

the agent should optimize for these user questions:
- What is missing?
- What matters most now?
- Who owes data?
- Which report is blocked?
- What should I do next?

If a UI improvement looks nice but does not improve one of those answers, it should be deprioritized.

### 3. Avoid breadth overload

If a view exposes many frameworks, templates, standards or options:
- surface the most relevant set first;
- group or hide advanced items;
- avoid making the user parse the full catalog on first contact.

### 4. Avoid fake operational confidence

The agent must not add or preserve placeholder UI that appears authoritative if it is not backed by real logic in a core-value surface.

Examples:
- mock readiness metrics on project overview;
- fake pending request counts;
- checklist percentages not derived from actual project state.

If placeholders must remain temporarily:
- they should be visibly marked as incomplete in code comments;
- they should not be presented as the core proof of product value;
- the agent should prefer replacing them with real derivation when feasible.

## Messaging Guardrails

### Agent should reinforce

- “one dataset, multiple outputs”
- “collect data from the right people before the deadline”
- “product-level carbon reporting”
- “operational clarity over spreadsheet chaos”

### Agent should avoid overclaiming

- “fully automated compliance”
- “legal-grade guarantee”
- “replaces verification/auditors”
- “all ESG use cases equally mature”

### Required legal caution

When changing product-facing copy around compliance or reporting, agent must preserve the idea that:
- the product is a data and workflow tool;
- it reduces operational burden;
- final responsibility and verification remain with the user or external verifier.

## Report Recommendation Guardrails

### Single mapping rule

There must be one canonical mapping layer between:
- decision engine report IDs
- user-visible template codes
- labels shown in selection UI

The agent must not duplicate this mapping logic across pages if avoidable.

### Mandatory/recommended rule

If a report is marked:
- mandatory by rule engine,
- or recommended by rule engine,

the selection UI must reflect that clearly and consistently.

### Do

- reuse shared mapping helpers;
- preserve a clear explanation label in UI;
- ensure recommendation state survives navigation between questionnaire and report selection.

### Do not

- assume report IDs and template codes are always identical;
- derive UI state separately in multiple places if a shared helper can be used.

## Documentation Guardrails

### When the agent discovers stale docs

The agent should:
- note the mismatch;
- decide whether the doc is safe to update directly;
- prefer small corrective edits over adding more contradictory docs;
- avoid writing a new status document that duplicates already stale material.

### Human-facing vs agent-facing docs

If creating new docs:
- human doc should explain reality, tradeoffs, readiness, decisions;
- agent doc should define execution constraints, acceptance criteria, and forbidden assumptions.

### Hard rule

An agent must not treat a planning doc or historical note as a source of truth over architecture or code.

## Implementation Guardrails

### Safe assumptions the agent may make

- Product-level beachhead is the default recommended product direction.
- Corporate breadth should be progressively disclosed, not necessarily removed.
- Core value lives in the workflow after project creation, not just in setup screens.
- Docs may be stale and need verification against code.

### Assumptions the agent must not make without checking

- that a status doc is current;
- that a template code equals a decision-engine report ID;
- that a UI metric is backed by real data;
- that a route described in docs exists in code;
- that auth/readiness claims in docs match implementation.

### Required verification before significant product edits

Before changing product behavior, the agent should inspect:
- the relevant route(s);
- any shared helper or mapping layer;
- adjacent docs in `docs/`;
- whether current behavior is real or placeholder.

## Acceptance Criteria for Agent Changes

For any product-facing change, the agent should aim to satisfy all relevant items below.

### UX acceptance

- The primary user can identify the default path quickly.
- Advanced options do not overshadow the default path.
- The interface explains recommended vs mandatory choices where relevant.
- The next action in a project is clearer after the change than before.

### Product acceptance

- The change reinforces the product thesis instead of broadening it ambiguously.
- The change does not make the product look more mature than it is.
- The change preserves corporate capability if not explicitly removing it.
- The change reduces confusion more than it increases option surface.

### Engineering acceptance

- Shared logic is centralized when practical.
- The change does not create a second source of truth for mappings or state.
- If docs were stale, related docs are updated or the mismatch is explicitly noted.
- Validation or tests are run when feasible; if blocked, the blocker is reported.

## Anti-Patterns

The agent should avoid these anti-patterns:

- “Fix” the UX by removing important capability without considering progressive disclosure.
- Add new docs that restate outdated claims from old docs.
- Make the landing promise broader than the first-run experience can support.
- Add report breadth to the default UI because the catalog exists.
- Leave critical operational widgets backed by mock data when touching that area.
- Solve a mapping problem with page-local ad hoc logic if the issue crosses multiple steps.

## Recommended Change Patterns

### Pattern: preserve breadth, reduce confusion

Use:
- collapsible advanced sections;
- “recommended for most teams” labels;
- segmented template groups;
- product-first defaults.

### Pattern: turn product promise into operational UI

Use:
- real missing-data summaries;
- real pending-request counts;
- real report readiness indicators;
- explicit next-step prioritization.

### Pattern: repair doc drift

Use:
- source-of-truth hierarchy;
- concise corrective edits;
- explicit “purpose” and “truth level” in new docs.

## When the Agent Should Escalate

The agent should ask for direction if:
- a requested change would remove important existing capability;
- code and architecture docs disagree in a way that changes data ownership or security assumptions;
- a product request would materially broaden the default promise beyond the beachhead;
- placeholder logic cannot be replaced without making a business decision.

## Short Operating Summary

If uncertain, the agent should optimize for:

- product-first clarity,
- operational truth,
- one shared dataset narrative,
- progressive disclosure for advanced breadth,
- and documentation that matches reality.
