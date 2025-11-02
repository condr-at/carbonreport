# Optimistic UX: System-Wide Implementation Plan

_Last updated: 2025-11-02_

## 1. Goal & Scope
- Provide consistent optimistic interactions across the app (requests, dataset edits, project management, contacts) while keeping the UI responsive even under slow network or database load.
- Ensure every optimistic action has a deterministic rollback path, shared notification contract, and observability hooks.
- Align frontend (Next.js/React) and backend (Prisma/Next API routes) on a single data contract that exposes enough metadata for confirmation/reconciliation.

## 2. Key Principles
1. **Single Source of Truth**: All client components must read/write data through a shared data access layer that knows how to cache, mutate, and reconcile. Direct `fetch` calls should be refactored away.
2. **Optimistic First**: Mutations apply locally before a server response. They must:
   - update UI state immediately,
   - enqueue refresh/revalidation once the server responds,
   - revert gracefully when the backend rejects.
3. **Predictable Feedback**: Use `notifications` (Sonner) for surfaced messages, plus inline affordances (spinners, disabled states) that clear on success or revert with context on failure.
4. **Observable**: Every optimistic mutation emits logs/metrics so we can trace success vs rollback rates.

## 3. Architecture Overview
```
┌───────────┐       ┌────────────────────────┐       ┌─────────────┐
│ Components├──────▶│ Data Hooks / Services  │──────▶│ API Routes  │
│ (UI layer)│       │ (React Query adapters) │       │ (Next.js)   │
└───────────┘◀──────┴────────────────────────┘◀──────┴─────────────┘
      ▲                    │                           │
      │                    │         Prisma + DB       │
      │                    ▼                           ▼
┌───────────────┐    ┌────────────────┐         ┌──────────────┐
│ notifications │    │ optimistic logs│         │ cache layer  │
└───────────────┘    └────────────────┘         └──────────────┘
```

**Expected Artifacts After Setup:**
- `src/lib/data-client/queryClient.ts` - Configured React Query client instance
- `src/lib/api-client.ts` - Centralized fetch wrapper with error handling
- `src/app/layout.tsx` - Updated with `<QueryClientProvider>` and `<Hydrate>`
- `src/lib/data-client/hooks.ts` - Base hook factories (or per-domain subdirectories)
- `src/lib/data-client/keys.ts` - Query key factory functions for consistent cache invalidation

### 3.1 Client Data Layer (React Query)
- Introduce a `src/lib/data-client` package that wraps `@tanstack/react-query`.
- Provide:
  - `queryClient` singleton (`src/lib/data-client/queryClient.ts`).
  - Hook factories (`src/lib/data-client/hooks.ts`) for entities (projects, data-requests, contacts, dataset rows).
  - Mutation helpers with built-in optimistic update logic and error rollback.
- Reference implementation example (pseudo-code):

**⚠️ Next.js App Router Constraint:**
- React Query hooks (and all client-side state) **must** be used only in `'use client'` components.
- Server Components should fetch data directly via Prisma and optionally pass it as `initialData` to client components.
- Example pattern:
  ```tsx
  // src/app/projects/[id]/data-requests/page.tsx (Server Component)
  export default async function DataRequestsPage({ params }) {
    const initialRequests = await fetchDataRequests(params.id); // Direct Prisma call
    return <DataRequestsClient projectId={params.id} initialRequests={initialRequests} />;
  }

  // src/app/projects/[id]/data-requests/data-requests-client.tsx ('use client')
  'use client';
  export function DataRequestsClient({ projectId, initialRequests }) {
    const { data } = useDataRequests(projectId, { initialData: initialRequests });
    // ... optimistic mutations
  }
  ```
- This avoids hydration mismatches and ensures SSR benefits while enabling client-side optimistic updates.

```ts
// src/lib/data-client/dataRequests.ts
export function useCompleteDataRequests() {
  return useMutation({
    mutationFn: (payload: CompletePayload) => api.completeBulk(payload),
    onMutate: async (variables) => {
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(keys.list(variables.projectId));
      const optimistic = snapshot?.map((request) =>
        variables.ids.includes(request.id)
          ? { ...request, status: 'completed', completedAt: new Date().toISOString(), revokedAt: null }
          : request
      );
      queryClient.setQueryData(keys.list(variables.projectId), optimistic);
      return { snapshot };
    },
    onError: (error, vars, context) => {
      queryClient.setQueryData(keys.list(vars.projectId), context?.snapshot);
      notifications.error(getErrorMessage(error));
    },
    onSuccess: (_, vars) => {
      notifications.success(`Marked ${vars.ids.length} requests as completed.`);
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries(keys.list(vars.projectId));
    },
  });
}
```

### 3.2 API Contract Updates
- Every mutation endpoint must return:
  - `updatedAt` / `version` field for the entity or batch,
  - array of mutated entities so the client can reconcile,
  - conflict metadata (e.g., `code: 'CONFLICT'`, `updatedBy`, `updatedAt`).
- Endpoints should be idempotent and tolerate repeated calls (important for retries after optimistic failures).

### 3.3 Notification Contract
- Centralized in `src/components/ui/notifications.ts` (already present).
- Extend with domain-specific helpers where needed (e.g., `notifyDataRequestComplete(projectId, count)`), ensuring consistent copy.
- All optimistic flows use `notifications.promise` or `notifications.success/error` directly; inline alert divs are deprecated.

## 4. Migration Plan (High-Level)

| Phase | Work Items | Files / Modules | Definition of Done |
|-------|------------|-----------------|-------------------|
| **0. Foundation** | Install `@tanstack/react-query`, configure provider in `src/app/layout.tsx`, add `QueryClientProvider` + `Hydrate`. | `package.json`, `src/app/layout.tsx`, `src/lib/data-client/queryClient.ts`. | `@tanstack/react-query` appears in `package.json` dependencies; `layout.tsx` wraps children with provider; `queryClient.ts` exports configured instance. `npm run lint` passes. |
| | Create shared API client (wraps `fetch`). Handles auth headers, error parsing. | `src/lib/api-client.ts`. | `api-client.ts` exports `request<T>()` function with typed error handling; throws `ApiError` with `code`, `status`, `message`. |
| | Instrument `notifications` with domain helpers. | `src/components/ui/notifications.ts`. | Optional domain-specific helpers added (e.g., `notifyDataRequestComplete`) or confirmed existing helpers sufficient. |
| **1. Data Requests** | Replace local state in `src/app/projects/[id]/data-requests/data-requests-client.tsx` with React Query hooks (`useDataRequests`, `useCompleteDataRequests`, `useRevokeDataRequests`, `useResendDataRequests`). | New files under `src/lib/data-client/data-requests/`. | All `fetch` calls removed from `data-requests-client.tsx`; component consumes only hooks; `useState` for requests/contacts replaced by query data. Component logic limited to UI and event handlers. |
| | Move optimistic logic from component to hooks (mutations update cache). | same as above | Mutations define `onMutate` (snapshot), `onError` (rollback), `onSettled` (invalidate). Local snapshot variables removed from component. |
| | Remove direct `fetch` calls; rely on hook-provided functions. | `data-requests-client.tsx` | Zero direct `fetch()` calls in component; grep confirms no residual manual network logic. |
| | Align API routes (`src/app/api/data-requests/*.ts`) to return `version` metadata. | existing API files | All mutation endpoints return `{ success, updated, requests: [...], version?: string }`. Version field present or documented as optional. |
| **2. Dataset Table** | Convert inline optimistic update (currently manual in `src/components/dataset-table.tsx`) to hook-based pattern. | `src/components/dataset-table.tsx`, `src/lib/data-client/dataset.ts`. | `dataset-table.tsx` uses `useUpdateCell` mutation hook; manual `setRows` optimistic logic removed; rollback handled in hook `onError`. |
| | Ensure rollback for validation errors by restoring previous value from mutation context. | same | Validation error causes revert; user sees notification; cell value returns to pre-edit state. |
| **3. Contacts / Projects** | Wrap contact mutations in optimistic hooks. | `src/app/projects/[id]/contacts`, new data hooks | Contact create/update/delete use hooks; optimistic cache updates + rollback in place. |
| | Apply consistent notifications. | UI components | All contact mutations surface feedback via `notifications` service; no inline alert divs remain. |
| **4. System Integration** | Add global dev tooling: log optimistic starts/failures (e.g., `console.debug('optimistic:start', key)` behind a flag). | `src/lib/data-client/logging.ts`. | Logging utility exists; mutations call it on lifecycle events (start/success/error); logs visible in dev console. |
| | Document new coding standard: no direct `fetch` in components; use data-client hooks. Update lint rule / codemod if needed. | `docs/IMPLEMENTATION_CHECKLIST.md`, `.eslintrc`. | Coding standard documented; optional ESLint rule added to warn on direct `fetch()` in component files. |

## 5. Detailed Tasks & Examples

### 5.1 Foundation Tasks
1. **Install react-query**
   ```bash
   npm install @tanstack/react-query
   ```
2. **Provider setup** (`src/app/layout.tsx`):
   ```tsx
   import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
   import { queryClient } from '@/lib/data-client/queryClient';

   <QueryClientProvider client={queryClient}>
     <Hydrate>
       <Toaster />
       {children}
     </Hydrate>
   </QueryClientProvider>
   ```
3. **API client** (`src/lib/api-client.ts`): centralize error handling, e.g.
   ```ts
   export async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
     const response = await fetch(input, {
       ...init,
       headers: {
         'Content-Type': 'application/json',
         ...(init?.headers ?? {}),
       },
     });

     if (!response.ok) {
       const payload = await response.json().catch(() => ({}));
       throw new ApiError(payload.error ?? response.statusText, payload.code, response.status);
     }

     return response.json() as Promise<T>;
   }
   ```

### 5.2 Data Requests Example
- **Query Hook** (`src/lib/data-client/data-requests.ts`):
  ```ts
  export function useDataRequests(projectId: string) {
    return useQuery({
      queryKey: keys.list(projectId),
      queryFn: () => request<DataRequestsResponse>(`/api/projects/${projectId}/data-requests?status=all`),
      staleTime: 30_000,
    });
  }
  ```
- **Component Integration** (`data-requests-client.tsx`): Replace `useState` + manual fetch with:
  ```ts
  const { data, isLoading } = useDataRequests(projectId);
  const completeMutation = useCompleteDataRequests();

  const handleBulkComplete = () => {
    completeMutation.mutate({ projectId, ids: pendingIds });
  };
  ```
- **Optimistic Pattern**: ensure `onMutate` stores snapshot, `onError` restores, `onSettled` invalidates.

**Pitfalls / Checks:**
- ✅ **Rollback Guard**: `onError` must restore the snapshot from `context`, not rely on re-fetch alone (prevents flicker).
- ✅ **Query Key Consistency**: Invalidate the correct key (`keys.list(projectId)`); mismatched keys leave stale data.
- ✅ **Type Safety**: Ensure mutation payload and API response types match; add `ApiError` handling for structured errors.
- ⚠️ **Concurrency**: If user triggers multiple mutations in quick succession, last-write-wins. Consider optimistic merge logic or mutation queue if needed.

### 5.3 Dataset Table Example
- Current manual optimistic update (lines ~140-200 of `src/components/dataset-table.tsx`) should be replaced by hook-provided `updateCell` mutation.
- Mutation config ensures rollback on `onError`:
  ```ts
  onMutate: ({ fieldId, itemId, value }) => {
    const previous = queryClient.getQueryData(keys.dataset(projectId));
    queryClient.setQueryData(keys.dataset(projectId), optimisticUpdater(previous, fieldId, itemId, value));
    return { previous };
  };
  ```

**Pitfalls / Checks:**
- ✅ **Preserve Row Structure**: `optimisticUpdater` must maintain array shape and object references for rows not being edited.
- ✅ **Validation Errors**: Server rejects invalid value → `onError` restores `previous`; user sees error toast; cell shows original value.
- ⚠️ **Inline Editing UX**: Ensure cell doesn't lose focus or flicker during optimistic update; test with rapid edits.

## 6. API Changes Checklist
- [ ] Include `version` or `updatedAt` in responses (`src/app/api/data-requests/*`, future endpoints).
- [ ] Return `conflicts` array for operations failing partial optimistic checks.
- [ ] Ensure bulk endpoints accept `version` in payload to guard against stale updates (optional concurrency control).

**Current Endpoint Status:**
- ✅ `/api/data-requests/bulk` - Already returns `{ success, created, revoked, requests }`. Add `version` field.
- ✅ `/api/data-requests/complete-bulk` - Returns `{ success, updated, requests }`. Add `version` field.
- ✅ `/api/data-requests/revoke-bulk` - Returns `{ success, updated, requests }`. Add `version` field.
- ⚠️ `/api/data-requests/[id]/complete` - Single-item endpoint; returns `{ success, request }`. Add `version` or `updatedAt`.
- ⚠️ `/api/data-requests/[id]/revoke` - Single-item endpoint; returns `{ success, request }`. Add `version` or `updatedAt`.
- 🔲 `/api/projects/[id]` - Project mutations (future). Plan for `version` when adding update endpoints.
- 🔲 `/api/projects/[id]/contacts/*` - Contact mutations (future). Plan for `version` field.

**Validation Rule:**  
If an endpoint modifies data and does not include `version` or `updatedAt` in the response, the task is **incomplete**. Agent must add the field or document why it's deferred.

## 7. Testing Strategy
- **Unit Tests**: Cover hook logic with mocked `queryClient` and API responses (`vitest` or `jest`).
- **Integration Tests**: Use Playwright/Cypress to emulate optimistic flows and ensure visual feedback matches spec.
- **Observability**: Add console logs in dev and future metrics emitter (e.g., DataDog) for mutation lifecycle events.

**Minimum Test Commands & Expected Results:**

| Command | Expected Result | Notes |
|---------|----------------|-------|
| `npm run lint` | Exit code 0, no errors | Must pass after every phase. |
| `npm test` (if unit tests exist) | All tests green | Cover hook mutations, rollback scenarios. |
| Playwright: Optimistic complete scenario | 1. Click "Mark complete" → UI updates instantly. 2. Toast shows "Marked N requests as completed." 3. Network panel confirms POST after UI update. | Visual check: no spinner after click, immediate badge change. |
| Playwright: Optimistic error scenario | 1. Mock 500 response. 2. Click "Mark complete" → UI updates. 3. Toast shows error. 4. UI reverts to previous state. | Confirm rollback restores original status/selection. |
| Manual: Rapid clicks | Trigger 3 mutations quickly → all complete without race conditions or stale data. | Check query invalidation timing. |

**Coverage Goals:**
- Hook unit tests: `onMutate`, `onError`, `onSettled` branches.
- Integration: At least one E2E test per optimistic flow (complete, revoke, resend, dataset edit).
- Regression: Ensure existing features (non-optimistic paths) still work.

## 8. Documentation & Governance
- Update `docs/IMPLEMENTATION_CHECKLIST.md` with new rules: "All new data mutations must use the data-client layer and provide optimistic handlers."
- Add a rubric for code review: verify `onMutate`/`onError`/`onSettled` implemented, notifications copy consistent.
- Maintain a registry of optimistic mutations in `docs/OPTIMISTIC_UX_PLAN.md` (this document), expanding sections per module.

## 9. Rollout Considerations
- Ship per module feature flags (e.g., `NEXT_PUBLIC_OPTIMISTIC_DATA_REQUESTS=true`) to allow gradual rollouts.
- Backward compatibility: keep legacy code paths until new hooks prove stable, then remove old fetch logic.
- Monitor metrics after rollout: compare success vs rollback counts, track average reconciliation time.

### 9.1 Migration Strategy: Avoiding Double Caching
During the transition period when both legacy `fetch` calls and new React Query hooks coexist:
- **Risk**: Same data fetched twice (once by legacy code, once by query hook) → wasted bandwidth, state desync.
- **Mitigation**:
  1. **Phase out legacy fetch immediately after hook integration**: Don't leave both active in the same component.
  2. **Use feature flags to isolate paths**: Either legacy OR optimistic, never both simultaneously.
  3. **Invalidate legacy cache manually**: If legacy code uses local `useState`, clear it when switching to hooks.
  4. **Monitor network tab**: After each migration step, verify no duplicate GETs for the same resource.
  
**Example Transition Pattern:**
```tsx
// BEFORE (legacy)
const [requests, setRequests] = useState([]);
useEffect(() => {
  fetch(`/api/projects/${projectId}/data-requests`).then(r => r.json()).then(setRequests);
}, [projectId]);

// AFTER (React Query)
const { data: requests } = useDataRequests(projectId);
// Remove useState, useEffect entirely
```

**Checklist:**
- [ ] Legacy fetch logic removed from component (no residual `useEffect` with `fetch`).
- [ ] No overlapping network requests in DevTools Network tab.
- [ ] Feature flag ensures only one path is active per deployment.

### 9.2 Feature Flag Configuration
- **Location**: `next.config.ts` (environment variables) or `src/lib/config.ts` (runtime config).
- **Example**:
  ```ts
  // src/lib/config.ts
  export const features = {
    optimisticDataRequests: process.env.NEXT_PUBLIC_OPTIMISTIC_DATA_REQUESTS === 'true',
    optimisticDataset: process.env.NEXT_PUBLIC_OPTIMISTIC_DATASET === 'true',
  };
  ```
- **Usage in Component**:
  ```tsx
  import { features } from '@/lib/config';

  const DataRequestsClient = ({ ... }) => {
    if (features.optimisticDataRequests) {
      return <OptimisticDataRequests {...props} />;
    }
    return <LegacyDataRequests {...props} />;
  };
  ```
- **Validation**: Check flag value in browser console (`console.log(features)`) or via DevTools; confirm toggling ENV var switches behavior.

**Rollout Checklist:**
- [ ] Feature flag defined in config.
- [ ] Flag tested locally (on/off states).
- [ ] Monitoring dashboard includes optimistic mutation metrics (success/failure/rollback counts).
- [ ] Legacy path removal scheduled after 1-2 weeks of stable rollout.

### 9.3 Type Safety: Prisma → API → React Query
To maintain end-to-end type safety and avoid runtime surprises:

**Pattern:**
1. **Prisma types** → Generate using `Prisma.validator` or `Prisma.<Model>GetPayload<...>` for complex queries.
2. **API schema validation** → Use `zod` schemas to validate request/response at API boundary.
3. **React Query types** → Infer from API client return types using TypeScript generics.

**Example Chain:**
```ts
// src/lib/api-client.ts
import { z } from 'zod';

const DataRequestSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'revoked']),
  requestedAt: z.string(),
  // ... other fields
});

export type DataRequestSummary = z.infer<typeof DataRequestSchema>;

export async function getDataRequests(projectId: string): Promise<DataRequestSummary[]> {
  const response = await request<{ requests: unknown[] }>(`/api/projects/${projectId}/data-requests`);
  return z.array(DataRequestSchema).parse(response.requests);
}

// src/lib/data-client/data-requests.ts
export function useDataRequests(projectId: string) {
  return useQuery({
    queryKey: keys.list(projectId),
    queryFn: () => getDataRequests(projectId), // Return type auto-inferred as DataRequestSummary[]
  });
}
```

**Benefits:**
- Compile-time errors if API shape changes.
- Runtime validation catches unexpected backend responses.
- Autocomplete and refactoring safety in components.

**Validation Rule:**
- All API client functions must return validated, typed data (via zod or similar).
- No `any` types in mutation payloads or query results.

## 10. Appendix

### 10.1 Additional Considerations (Optional/Post-MVP)

**Bundle Size Monitoring:**
- `@tanstack/react-query`: ~15KB gzipped
- `sonner`: ~5KB gzipped
- Total overhead acceptable for enterprise app; monitor via `@next/bundle-analyzer` if concerns arise.

**Memory Management:**
- Default `gcTime` (garbage collection time) is 5 minutes after query becomes inactive.
- For long-lived sessions (e.g., dataset editing pages open for hours), consider tuning `gcTime` or using `queryClient.clear()` on navigation.
- Watch for memory leaks in dev via Chrome DevTools → Memory snapshots; ensure unused queries are garbage collected.

**Offline & Retry Logic:**
- React Query retries failed queries 3 times by default (exponential backoff).
- For offline scenarios, consider `onlineManager` and `retryOnMount` settings (post-MVP feature).
- Current plan assumes stable network; offline-first UX is out of scope.

**React Query DevTools:**
- Automatically disabled in production builds (`process.env.NODE_ENV === 'production'`).
- Enable in dev via:
  ```tsx
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  ```
- Use to inspect cache state, query timings, and optimistic update flow during development.

### 10.2 Reference Components
  - `src/app/projects/[id]/data-requests/data-requests-client.tsx` (bulk complete/revoke with local snapshots).
  - `src/components/request-data-modal.tsx` (optimistic toast promise + modal close).
  - `src/components/dataset-table.tsx` (inline field edit optimistic update).
- These serve as starting points for refactoring into standardized hooks.

## 11. Guidance for Autonomous Agents
To support an AI assistant executing this plan, provide the following guardrails:

1. **Pre-flight Checklist**
  - Read (or re-read) `docs/OPTIMISTIC_UX_PLAN.md` and relevant source files before making changes.
  - Confirm dependency status (`package.json`, installed packages) before installing new modules.

2. **Step-by-Step Execution**
  - Follow the migration phases in order. After each numbered work item, record progress in a running log (e.g., `docs/OPTIMISTIC_UX_PROGRESS.md`).
  - For every file edit, cite the exact path and reason in the log so context can be recovered if memory is lost.

3. **Validation Requirements**
  - Run `npm run lint` (or `./node_modules/.bin/eslint .`) after each major milestone. Capture the output summary in the progress log.
  - If tests exist for the touched area, run them (`npm test`, feature-specific scripts) and note results.

4. **Hallucination Safeguards**
  - If a referenced file/function does not exist, stop and request clarification instead of creating speculative implementations.
  - Avoid inventing APIs or packages. Use only dependencies documented in `package.json` or explicitly approved in this plan.

5. **State Management**
  - Keep a concise to-do list at the top of the progress log, updating it as tasks are completed or added.
  - Summarize open questions or blockers in the log; escalate if answers cannot be inferred from existing documentation.

6. **Completion Criteria**
  - Ensure all relevant components have been migrated to the shared data-client hooks.
  - Verify documentation updates (`docs/IMPLEMENTATION_CHECKLIST.md`, `docs/NEXT_STEPS.md`, this document) reflect the final architecture.
  - Provide a final summary referencing the progress log, the commands run, and any deviations from the plan.

These instructions help mitigate context loss and hallucinations, keeping the agent aligned with the intended architecture.

---
This plan should be treated as a living document. Update as new modules adopt the shared data layer or as we discover additional edge cases.
