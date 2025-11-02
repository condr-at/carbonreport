# Bulk Data Requests: Requirements & Implementation Plan

_Last updated: 2025-11-02_

## 1. Objectives
- Consolidate all data-request mutations (bulk resend, complete, revoke, future actions) behind a reusable service layer.
- Eliminate long-running interactive transactions and timeout errors by batching database writes.
- Provide a consistent UX contract (optimistic behaviour, error messaging, selection management) across bulk actions.
- Lay the groundwork for caching, metrics, and future action types (e.g. reminders) without accruing tech debt.

## 2. Scope
- `POST /api/data-requests/bulk`
- `POST /api/data-requests/[id]/complete`
- `POST /api/data-requests/[id]/revoke`
- Shared data-request fetching logic (`GET /api/projects/[id]/data-requests`, contacts) for cache invalidation hooks.
- Client-side consumers (`RequestDataModal`, project data-requests page) to align state handling with the new responses.

_Out of scope:_ reminder flows, pagination/virtualisation, report/dataset badge surfacing.

## 3. Functional Requirements
1. **Service Layer**
   - New module `src/lib/data-requests/service.ts` exposing:
     - `prepareBulk(payload)` → resolves contact, deduplicates fields, returns work plan.
     - `executeBulk(plan)` → performs revocations + creations via `prisma.$transaction` with batched queries.
     - `serializeRequests(ids)` → fetches newly created requests (with contact + field metadata).
     - `completeRequests(ids)` / `revokeRequests(ids)` helpers used by individual endpoints.
   - All operations must be deterministic and idempotent per request ID.

2. **Transaction Model**
   - For bulk resend:
     1. Resolve contact outside of transaction.
     2. Fetch existing active requests for affected fields.
     3. Build lists: `idsToRevoke`, `newRequests` (with pre-generated UUIDs).
     4. Execute `prisma.$transaction([ updateMany, createMany ])`.
   - For complete/revoke endpoints:
     - Use shared helper to ensure a single `updateMany` with guard clauses (only pending requests serviced).

3. **Caching & Invalidations**
   - Introduce lightweight cache utility (in-memory placeholder, pluggable later) in `src/lib/cache.ts`.
   - Wrap `data-requests` and `contacts` fetchers with cache reads (TTL configurable, default 30s in dev).
   - Service layer must call `cache.invalidate` for affected project keys after successful mutations.

4. **API Contracts**
   - Responses should include counts and array of mutated request summaries.
   - Errors must return actionable messages (validation, conflict, missing contact, timeout fallback).
   - Ensure consistent shape across endpoints (`{ success, updated, requests: [] }`).

5. **Client Updates**
   - Data Requests page: consume success counts from new API shape; maintain selection reset logic.
   - Modal: rely on response to decide when to refresh; remove duplicate contact refresh calls if service already invalidates cache.

6. **Observability**
   - Log timing for each service method (`console.time` wrapper for now) to identify slow steps.
   - Prepare hooks for future metrics (e.g. `emitMetric('bulk_resend.duration', ms)`).

## 4. Non-Functional Requirements
- No Prisma interactive transaction should exceed 500ms; all batching must complete within that window under typical load (<=100 fields).
- Service module must be unit testable without hitting DB (mock Prisma client).
- All new utilities documented and typed (TypeScript strict mode compliant).
- Errors must never leave sensitive DB details in responses.

## 5. Implementation Plan
1. **Scaffold service module**
   - Define interfaces for payloads, work plans, and serialized responses.
   - Accept Prisma client injection for testability.

2. **Refactor bulk endpoint**
   - Replace inline transaction with calls to the service.
   - Update response schema and error handling.
   - Add cache invalidation call.

3. **Refactor complete/revoke endpoints**
   - Migrate to service helpers with shared validations and responses.
   - Ensure both respect pending/completed guards.

4. **Introduce cache utility**
   - Start with simple Map-based store + TTL.
   - Wrap `fetchProjectDataRequests` and `fetchProjectContacts` (used server-side) to leverage cache.
   - Expose `invalidateProjectData(projectId)` for service to use.

5. **Client adjustments**
   - Align Data Requests page to read `success` + counts from new API.
   - Remove redundant contact refresh if cache ensures fresh data.
   - Update feedback messages (e.g. "Marked 3 requests as completed").

6. **Testing & Verification**
   - Write unit tests for service methods covering:
     - Deduplication by `(dataPointId, itemId)`.
     - Contact resolution (existing, new, mismatched user).
     - Revocation skip when contact unchanged.
     - Conflict handling for already completed/revoked items.
   - Manual QA scenarios:
     - Bulk resend same contact + new contact.
     - Mixed status selection errors.
     - Concurrency: two windows completing same requests.

7. **Documentation**
   - Update `docs/IMPLEMENTATION_CHECKLIST.md` and `docs/NEXT_STEPS.md` to reflect new architecture.
   - Add entry to `docs/TECHNICAL_DEBT.md` removing the "long-running transaction" concern once resolved.

## 6. Edge Cases & Safeguards
- Selection contains requests lacking active records (already revoked) → service returns 0 updated and descriptive error.
- Deadlines parse failure → validation error before transaction.
- Contact deletion between prepare and execute → transaction throws; respond 404 and prompt refresh.
- Large payload (>200 fields) → service should chunk `createMany` if necessary (placeholder TODO comment).

## 7. Future Extensions
- Add `bulkRemind` handler using same service contract.
- Plug Redis/Upstash for distributed cache without changing service API.
- Emit metrics to DataDog once infra ready (hooks already stubbed).
