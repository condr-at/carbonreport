# Optimistic UX: System-Wide Implementation Plan

_Last updated: 2025-11-06_

## 1. Goal & Scope
- Provide consistent optimistic interactions across the app (requests, dataset edits, project management, contacts) while keeping the UI responsive even under slow network or database load.
- Balance SSR prefetching with payload size so first render is quick and cache-friendly without overwhelming the browser.
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
| **2a. Server Prefetch & Hydration** | Replace API round-trips in server components with direct Prisma reads and pass data via `HydrationBoundary` + dehydrated cache. | `src/app/projects/[id]/data-requests/page.tsx`, `src/app/projects/[id]/dataset/page.tsx`, `src/lib/db.ts`, `src/lib/data-client/keys.ts`. | Server components call Prisma helpers instead of `request(...)`; client components receive `initialData` via React Query dehydrate. No duplicate network requests on first render. |
| | Ensure cached queries use the same keys/hooks as client mutations to avoid mismatch. | same + `src/lib/data-client/data-requests.ts`, `src/lib/data-client/dataset.ts`. | Prefetched data hydrates `useDataRequests` / `useDataset` without refetch; React Query DevTools shows cache hit on mount. |
| **2b. Payload Optimization & Virtualization** | Measure SSR payload size and TTFB; split heavy datasets/data-request payloads into optional lazy-loaded queries when they slow first paint. | `src/app/projects/[id]/dataset/page.tsx`, `src/app/projects/[id]/data-requests/page.tsx`, `src/lib/data-client/*`, metrics tooling | First render ships only essentials (project summary, skeletons); large tables fetch via client queries without blocking HTML stream. Metrics document confirms <250ms TTFB and manageable HTML size. |
| | Introduce table virtualization or chunked rendering once payload splitting is in place. | `src/components/dataset-table.tsx`, `src/components/data-requests-table.tsx` (if exists) | Virtualized lists render correctly with hydrated data; scrolling remains smooth with large datasets; verified in dev tools. |
| | Update plan/checklists with instrumentation steps (React Query Devtools, Server-Timing headers). | `docs/Loading perfomance optimization plan.md`, `src/lib/server-data/*` | Observability steps recorded; developers know how to re-measure if regressions appear. |
| **3. Contacts / Projects** | Wrap contact mutations in optimistic hooks. | `src/app/projects/[id]/contacts`, new data hooks | Contact create/update/delete use hooks; optimistic cache updates + rollback in place. |
| | Apply consistent notifications. | UI components | All contact mutations surface feedback via `notifications` service; no inline alert divs remain. |
| **4. System Integration** | Add global dev tooling: log optimistic starts/failures (e.g., `console.debug('optimistic:start', key)` behind a flag). | `src/lib/data-client/logging.ts`. | Logging utility exists; mutations call it on lifecycle events (start/success/error); logs visible in dev console. |
| | Document new coding standard: no direct `fetch` in components; use data-client hooks. Update lint rule / codemod if needed. | `docs/IMPLEMENTATION_CHECKLIST.md`, `.eslintrc`. | Coding standard documented; optional ESLint rule added to warn on direct `fetch()` in component files. |
| | Add lightweight navigation feedback for server-prefetched pages (button disabled states, skeletons matching cached data). | `src/app/projects/[id]/data-requests/data-requests-client.tsx`, `src/components/dataset-table.tsx`, `src/components/ui/skeleton.tsx`. | Buttons and critical actions use `isPending` flags from existing hooks; skeletons render only during first load; no redundant spinners once optimistic update starts. |

> **Status Update (2025-11-04)**
> Phase 1 complete. Key artifacts:
> - `src/lib/data-client/data-requests.ts` — shared queries and optimistic mutations.
> - `src/app/api/data-requests/{bulk,complete-bulk,revoke-bulk,resend-bulk}/route.ts` — unified metadata responses and new resend endpoint.
> - `src/lib/data-requests/service.ts` — centralized bulk/resend logic with metadata helpers.
> - `src/app/projects/[id]/data-requests/data-requests-client.tsx` — refactored to consume hooks (no direct fetch calls).
> - Next milestone: Phase 2a brings server-prefetch alignment for `projects/[id]/data-requests` and `projects/[id]/dataset` pages using `HydrationBoundary` to remove duplicate fetches.

## 5. Detailed Tasks & Examples

### 5.1 Foundation Tasks
1. **Install react-query**
   ```bash
   npm install @tanstack/react-query @tanstack/react-query-devtools
   ```
2. **Provider setup** (`src/app/layout.tsx`):
   ```tsx
   import { QueryClientProvider } from '@tanstack/react-query';
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   import { queryClient } from '@/lib/data-client/queryClient';

   <QueryClientProvider client={queryClient}>
     <Toaster />
     {children}
     <ReactQueryDevtools initialIsOpen={false} />
   </QueryClientProvider>
   ```
   
   **⚠️ Hydration API Change (React Query v5):**
   - Old API (`<Hydrate>`) is deprecated.
   - For SSR with Next.js App Router, use `HydrationBoundary` in Server Components:
   ```tsx
   // src/app/projects/[id]/page.tsx (Server Component)
   import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
   
   export default async function ProjectPage({ params }) {
     const queryClient = new QueryClient();
     await queryClient.prefetchQuery({
       queryKey: keys.project(params.id),
       queryFn: () => getProject(params.id),
     });
     
     return (
       <HydrationBoundary state={dehydrate(queryClient)}>
         <ProjectClient projectId={params.id} />
       </HydrationBoundary>
     );
   }
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

### 5.2.2 Optimistic Locking & Version Conflicts
**Why needed:** Prevent data loss when multiple clients (or browser tabs) edit the same entity simultaneously.

**Schema Extension:**
```prisma
// prisma/schema.prisma
model Project {
  id             String   @id @default(uuid())
  dataset_version Int     @default(0) // Incremented on every dataset mutation
  // ... other fields
}
```

**API Contract:**
```ts
// POST /api/projects/{id}/dataset/update
// Request:
{
  "fieldId": "product_name",
  "value": "Steel Bottle",
  "version": 5  // Client sends current version
}

// Response (success):
{
  "success": true,
  "version": 6,  // New version
  "updatedAt": "2025-11-02T10:30:00Z"
}

// Response (conflict):
{
  "conflict": true,
  "serverVersion": 7,
  "updatedBy": "user@example.com",
  "updatedAt": "2025-11-02T10:29:55Z",
  "message": "Dataset was modified by another session"
}
```

**Hook Implementation:**
```ts
export function useUpdateDatasetField() {
  return useMutation({
    mutationFn: async ({ projectId, fieldId, itemId, value, version }: UpdateFieldPayload) => {
      const response = await request<UpdateFieldResponse>(
        `/api/projects/${projectId}/dataset/update`,
        {
          method: 'POST',
          body: JSON.stringify({ fieldId, itemId, value, version }),
        }
      );
      
      if (response.conflict) {
        throw new VersionConflictError(
          response.serverVersion!,
          response.updatedBy!,
          response.updatedAt!
        );
      }
      
      return response;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: keys.dataset(variables.projectId) });
      
      const snapshot = queryClient.getQueryData<DatasetResponse>(keys.dataset(variables.projectId));
      
      // Optimistic update
      queryClient.setQueryData<DatasetResponse>(
        keys.dataset(variables.projectId),
        (old) => ({
          ...old!,
          version: old!.version + 1,
          data_points: old!.data_points.map(dp =>
            dp.field_id === variables.fieldId && dp.item_id === variables.itemId
              ? { ...dp, value: variables.value }
              : dp
          ),
        })
      );
      
      return { snapshot };
    },
    onError: (error, vars, context) => {
      if (error instanceof VersionConflictError) {
        // Show conflict resolution modal (user chooses: keep local, accept server, or merge)
        notifications.error(
          `Data was updated by ${error.updatedBy}. Reload to see changes.`,
          {
            action: {
              label: 'Reload',
              onClick: () => queryClient.invalidateQueries({ queryKey: keys.dataset(vars.projectId) }),
            },
          }
        );
      }
      
      // Restore snapshot
      if (context?.snapshot) {
        queryClient.setQueryData(keys.dataset(vars.projectId), context.snapshot);
      }
    },
    onSuccess: (data, vars) => {
      // Update version in cache
      queryClient.setQueryData<DatasetResponse>(
        keys.dataset(vars.projectId),
        (old) => ({ ...old!, version: data.version })
      );
    },
  });
}
```

**MVP vs Post-MVP:**
- **MVP**: Simple conflict detection + "Reload" notification (implemented above).
- **Post-MVP**: Three-way merge UI (keep local / accept server / manual merge), operational transformation for concurrent edits.

**Migration Safety:**
- Add `dataset_version` column with default `0` (migration is backward-compatible).
- Old code without version checks continues to work (last-write-wins).
- New optimistic code includes version in payload; server increments and validates.
- Feature flag: `NEXT_PUBLIC_OPTIMISTIC_LOCKING` to gradually enable version checks.

### 5.2.1 Race Conditions & Concurrent Mutations
**Problem:** Multiple rapid clicks cause overlapping optimistic updates:
```ts
// User clicks "Complete" on 3 requests within 100ms
// Mutation 1: onMutate stores snapshot A, updates cache
// Mutation 2: onMutate stores snapshot B (includes Mutation 1's change), updates cache
// Mutation 3: onMutate stores snapshot C (includes Mutations 1+2), updates cache
// If Mutation 3 fails and reverts to snapshot C, Mutations 1+2 are lost!
```

**Solution Pattern:**
```ts
export function useCompleteDataRequests() {
  return useMutation({
    mutationKey: ['complete-data-requests'], // Enables deduplication
    mutationFn: (payload: CompletePayload) => api.completeBulk(payload),
    onMutate: async (variables) => {
      // Cancel outgoing refetches to avoid race
      await queryClient.cancelQueries({ queryKey: keys.list(variables.projectId) });
      
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(keys.list(variables.projectId));
      
      // Merge-based update instead of replace
      queryClient.setQueryData<DataRequestSummary[]>(
        keys.list(variables.projectId),
        (old) => old?.map((request) =>
          variables.ids.includes(request.id)
            ? { ...request, status: 'completed', completedAt: new Date().toISOString() }
            : request
        )
      );
      
      return { snapshot };
    },
    onError: (error, vars, context) => {
      // Only revert if we have a clean snapshot
      if (context?.snapshot) {
        queryClient.setQueryData(keys.list(vars.projectId), context.snapshot);
      }
      notifications.error(getErrorMessage(error));
    },
    onSettled: (_, __, vars) => {
      queryClient.invalidateQueries({ queryKey: keys.list(vars.projectId) });
    },
  });
}
```

**Additional Safeguards (Post-MVP):**
- Use `mutationKey` with React Query's built-in deduplication to prevent duplicate in-flight requests.
- Consider mutation queue library (e.g., `@tanstack/query-sync`) for strict ordering guarantees.
- For critical flows (e.g., financial transactions), implement optimistic locking (see section 5.2.2).

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

### 5.3.1 JSONB Dataset Optimistic Updates
**Challenge:** The `dataset` field is JSONB with nested structure:
```json
{
  "data_points": [
    { "field_id": "product_name", "item_id": null, "value": "Steel Bottle" },
    { "field_id": "material_input_name", "item_id": "1", "value": "Steel" },
    { "field_id": "material_input_quantity", "item_id": "1", "value": "2.5" }
  ],
  "metadata": { "last_edit": "2025-11-02T10:00:00Z" }
}
```

**Naive approach (wrong):**
```ts
// ❌ This replaces entire dataset, losing concurrent changes
queryClient.setQueryData(keys.dataset(projectId), newDataset);
```

**Correct merge-based approach:**
```ts
function optimisticDatasetUpdater(
  dataset: Dataset | undefined,
  fieldId: string,
  itemId: string | null,
  newValue: string
): Dataset {
  if (!dataset) return dataset;
  
  return {
    ...dataset,
    data_points: dataset.data_points.map(dp =>
      dp.field_id === fieldId && dp.item_id === itemId
        ? { ...dp, value: newValue, updated_at: new Date().toISOString() }
        : dp
    ),
    metadata: {
      ...dataset.metadata,
      last_edit: new Date().toISOString(),
    },
  };
}

// Usage in mutation
onMutate: async ({ fieldId, itemId, value }) => {
  const snapshot = queryClient.getQueryData<Dataset>(keys.dataset(projectId));
  
  queryClient.setQueryData<Dataset>(
    keys.dataset(projectId),
    (old) => optimisticDatasetUpdater(old, fieldId, itemId, value)
  );
  
  return { snapshot };
};
```

**Handling repeatable groups (dynamic items):**
```ts
// Adding a new material_input item
function addDatasetItem(dataset: Dataset, groupKey: string): Dataset {
  const maxItemId = Math.max(
    0,
    ...dataset.data_points
      .filter(dp => dp.field_id.startsWith(groupKey))
      .map(dp => parseInt(dp.item_id ?? '0', 10))
  );
  
  const newItemId = String(maxItemId + 1);
  
  // Get all fields for this group from field definitions
  const groupFields = getFieldsForGroup(groupKey); // e.g., ['material_input_name', 'material_input_quantity', ...]
  
  const newPoints = groupFields.map(fieldId => ({
    field_id: fieldId,
    item_id: newItemId,
    value: '',
    updated_at: new Date().toISOString(),
  }));
  
  return {
    ...dataset,
    data_points: [...dataset.data_points, ...newPoints],
  };
}
```

**Type Safety for JSONB:**
```ts
// src/lib/dataset-types.ts
import { z } from 'zod';

export const DataPointSchema = z.object({
  field_id: z.string(),
  item_id: z.string().nullable(),
  value: z.string(),
  updated_at: z.string().optional(),
});

export const DatasetSchema = z.object({
  data_points: z.array(DataPointSchema),
  metadata: z.record(z.unknown()).optional(),
});

export type Dataset = z.infer<typeof DatasetSchema>;
export type DataPoint = z.infer<typeof DataPointSchema>;

// Validate server responses
const response = await fetch('/api/projects/123/dataset');
const rawData = await response.json();
const dataset = DatasetSchema.parse(rawData.dataset); // Runtime validation
```

**Migration Safety:**
- Current code already uses JSONB; no schema change needed.
- Existing manual optimistic update in `dataset-table.tsx` can be refactored to use these helpers.
- Ensure `optimisticDatasetUpdater` is pure (no mutations) for predictable rollback.

### 5.4 Server Prefetch & Hydration Alignment
- **Objective:** eliminate redundant API round-trips for SSR routes by sourcing data directly from Prisma, hydrating React Query with matching cache keys, and using lightweight in-flight feedback.
- **Server components** (`src/app/projects/[id]/data-requests/page.tsx`, `src/app/projects/[id]/dataset/page.tsx`):
  - Import query helpers from `src/lib/db.ts` or domain-specific services (e.g. `src/lib/data-requests/service.ts`).
  - Instantiate a `QueryClient`, prefetch using existing `keys.list(projectId)` / `keys.dataset(projectId)` factories, and wrap the client entrypoint with `<HydrationBoundary state={dehydrate(queryClient)}>…</HydrationBoundary>`.
  - Remove `request()`/`fetch()` calls on the server; Prisma is already available via `db` exports.
- **Client components** (`src/app/projects/[id]/data-requests/data-requests-client.tsx`, `src/components/dataset-table.tsx`):
  - Pass `initialData` derived from the dehydrated state into `useDataRequests` / `useDataset` so the first render is cache-backed and does not trigger a duplicate GET.
  - Verify mutations reuse those keys so cache invalidation keeps preloaded data fresh.
- **Navigation feedback:**
  - Map existing `isPending`/`isMutating` flags to button disabled states and inline loaders instead of global page spinners.
  - Keep skeletons (`src/components/ui/skeleton.tsx`) for initial SSR render only; optimistic updates should handle subsequent transitions.
- **Acceptance checklist:**
  1. DevTools network tab proves a single request per dataset/data-request on initial load.
  2. React Query DevTools report prefetched queries as `status: success` immediately after hydration.
  3. Navigating between project sub-pages reuses cache instead of flashing empty states.

### 5.5 SSR Payload Tuning & Virtualized Rendering (Phase 2b)
- **Trigger:** Initial instrumentation shows slow HTML receive (>2s) or large compressed payloads (>40 KB) even after Phase 2a.
- **Server-side throttling:**
  - Measure payload size and TTFB with DevTools HAR + `console.time`/`Server-Timing` in server helpers (`src/lib/server-data/*`).
  - Keep the project summary and other must-have hero data in SSR, but move bulky collections (`initialDataRequests`, full dataset tables, full field definition dictionaries) behind lazy client queries when they dominate payload size.
  - Document split points (e.g., limit to first N rows, fetch rest via `useQuery` immediately after mount) so both optimised and fallback paths stay in sync.
- **Client hydration adjustments:**
  - Provide lightweight skeletons/spinners that mirror the upcoming list shape; ensure React Query queries kick off on mount with `initialData` only when beneficial.
  - Use feature flags (e.g., `NEXT_PUBLIC_LAZY_DATASET`) if rollout needs to be incremental across environments.
- **Table virtualization:**
  - Once payload is trimmed, integrate a virtualization helper (`@tanstack/react-virtual` or equivalent) inside `DatasetTable`/similar components to render only visible rows while maintaining keyboard navigation.
  - Confirm virtualization coexists with optimistic row updates (rows should re-render correctly after cache mutations).
- **Acceptance checkpoints:**
  1. HTML response size and receive time fall within target budgets in HAR captures.
  2. First contentful paint happens before heavy lists finish loading; skeletons show instead of blank screens.
  3. Virtualized lists scroll smoothly with 1k+ rows and keep optimistic updates visible without jank.
  4. Plan sections and implementation checklists updated to capture the measurement/rollback playbook.

> **Phase 2b status · 2025-11-06**
> - Instrumentation landed: `src/lib/server-data/metrics.ts` provides `ServerTimingTracker`, and both `projects/[id]/dataset/page.tsx` and `projects/[id]/data-requests/page.tsx` now emit `[dataset-page]` / `[data-requests-page]` timing + payload summaries and attempt to append `Server-Timing` headers.
> - Hydration payload logging captures dataset, data-request, contact, and field-definition footprints per request and reports totals; use these logs when exporting HARs to correlate payload spikes.
> - Dataset baseline (HAR 2025-11-06): `projects/[id]/dataset` HTML payload 176 045 B raw / 25 973 B transferred (gzip), TTFB ≈109 ms, receive 5.52 s → DOMContentLoaded 5.64 s / load 6.03 s. Size sits inside the 40 KB gzip target, but long receive window suggests SSR streaming is waiting on downstream data work—investigate Prisma/query timing before reaching for virtualization.
> - Data-requests baseline (HAR 2025-11-06): `projects/[id]/data-requests` HTML payload 1 010 018 B raw / 35 673 B transferred (gzip), TTFB ≈106 ms, receive 9.10 s → DOMContentLoaded 9.22 s / load 9.99 s. The raw SSR payload is an order of magnitude over target and streaming stalls for ~9 s, pointing to either oversized serialized tables or expensive server transforms — prioritize lazy-loading/virtualization investigation here.
> - Feature flag `NEXT_PUBLIC_LAZY_DATA_REQUESTS` now skips SSR hydration for the data-requests table, shifting the heavy list behind a client query. Enable it in staging, capture a follow-up HAR, and confirm the gzip payload and receive window drop before layering in virtualization.
> - Virtualization decision deferred until telemetry shows payload totals above threshold or we confirm streaming waits stem from table rendering; keep watch on the logged `payloads` sections before enabling `NEXT_PUBLIC_LAZY_DATASET` or related flags.

## 6. API Changes Checklist
- [ ] Include `version` or `updatedAt` in responses (`src/app/api/data-requests/*`, future endpoints).
- [ ] Return `conflicts` array for operations failing partial optimistic checks.
- [ ] Ensure bulk endpoints accept `version` in payload to guard against stale updates (optional concurrency control).
- [ ] Implement idempotency tokens for critical mutations (e.g., payments, bulk complete) — **Post-MVP**.

**Current Endpoint Status:**
- ✅ `/api/data-requests/bulk` - Already returns `{ success, created, revoked, requests }`. Add `version` field.
- ✅ `/api/data-requests/complete-bulk` - Returns `{ success, updated, requests }`. Add `version` field.
- ✅ `/api/data-requests/revoke-bulk` - Returns `{ success, updated, requests }`. Add `version` field.
- ⚠️ `/api/data-requests/[id]/complete` - Single-item endpoint; returns `{ success, request }`. Add `version` or `updatedAt`.
- ⚠️ `/api/data-requests/[id]/revoke` - Single-item endpoint; returns `{ success, request }`. Add `version` or `updatedAt`.
- 🔲 `/api/projects/[id]/dataset/update` - **New endpoint needed** for optimistic locking. Return `{ version, updatedAt, conflict? }`.
- 🔲 `/api/projects/[id]` - Project mutations (future). Plan for `version` when adding update endpoints.
- 🔲 `/api/projects/[id]/contacts/*` - Contact mutations (future). Plan for `version` field.

**Validation Rule:**  
If an endpoint modifies data and does not include `version` or `updatedAt` in the response, the task is **incomplete**. Agent must add the field or document why it's deferred.

**Conflict Response Format (409):**
```json
{
  "conflict": true,
  "serverVersion": 7,
  "currentData": { /* latest server state */ },
  "updatedBy": "user@example.com",
  "updatedAt": "2025-11-02T10:29:55Z",
  "message": "Resource was modified by another session"
}
```

## 7. Testing Strategy
- **Unit Tests**: Cover hook logic with mocked `queryClient` and API responses (`vitest` or `jest`).
- **Integration Tests**: Use Playwright/Cypress to emulate optimistic flows and ensure visual feedback matches spec.
- **Observability**: Add console logs in dev and future metrics emitter (e.g., DataDog) for mutation lifecycle events.

### 7.1 Critical Test Scenarios

#### 7.1.1 Race Condition Tests
**Scenario 1: Rapid Bulk Complete**
```typescript
// Test: User clicks "Complete All" twice before first request finishes
test('handles rapid duplicate bulk complete actions', async () => {
  const { getByRole, queryByText } = render(<DataRequestsClient requests={mockRequests} />);
  
  // Simulate rapid clicks
  const completeButton = getByRole('button', { name: /complete all/i });
  fireEvent.click(completeButton);
  fireEvent.click(completeButton); // Second click before first resolves
  
  await waitFor(() => {
    // Should only trigger one API call (debounced or loading state prevents second)
    expect(fetch).toHaveBeenCalledTimes(1);
    
    // UI should show loading state preventing duplicate actions
    expect(completeButton).toBeDisabled();
  });
});
```

**Scenario 2: Concurrent Mutations (Different Users)**
```typescript
test('detects version conflict from concurrent editor', async () => {
  const { getByLabelText, getByRole, findByText } = render(<DatasetEditor project={mockProject} />);
  
  // User A starts editing
  const input = getByLabelText('Company Name');
  fireEvent.change(input, { target: { value: 'New Name' } });
  
  // Simulate User B saving before User A (server version increments)
  server.use(
    rest.post('/api/projects/:id/dataset/update', (req, res, ctx) => {
      return res(
        ctx.status(409),
        ctx.json({
          conflict: true,
          serverVersion: 7,
          updatedBy: 'user-b@example.com',
          currentData: { ...mockProject.dataset, companyName: 'User B Version' }
        })
      );
    })
  );
  
  const saveButton = getByRole('button', { name: /save/i });
  fireEvent.click(saveButton);
  
  // Should show conflict dialog
  const dialog = await findByText(/resource was modified/i);
  expect(dialog).toBeInTheDocument();
  
  // Options: Overwrite (force), Reload (discard local), Manual merge (future)
  expect(getByRole('button', { name: /reload/i })).toBeInTheDocument();
  expect(getByRole('button', { name: /overwrite/i })).toBeInTheDocument();
});
```

#### 7.1.2 Network Failure Tests
**Scenario: Partial Bulk Failure**
```typescript
test('handles partial bulk completion failure', async () => {
  const mockRequests = [
    { id: '1', status: 'pending' },
    { id: '2', status: 'pending' },
    { id: '3', status: 'pending' }
  ];
  
  server.use(
    rest.post('/api/data-requests/complete-bulk', (req, res, ctx) => {
      return res(
        ctx.status(207), // Multi-Status
        ctx.json({
          success: false,
          updated: 2,
          failed: 1,
          results: [
            { id: '1', success: true },
            { id: '2', success: true },
            { id: '3', success: false, error: 'Database timeout' }
          ]
        })
      );
    })
  );
  
  const { getByRole } = render(<DataRequestsClient requests={mockRequests} />);
  fireEvent.click(getByRole('button', { name: /complete all/i }));
  
  await waitFor(() => {
    // Should partially rollback (only failed items revert)
    const updatedRequests = screen.getAllByTestId('request-row');
    expect(updatedRequests[0]).toHaveAttribute('data-status', 'completed');
    expect(updatedRequests[1]).toHaveAttribute('data-status', 'completed');
    expect(updatedRequests[2]).toHaveAttribute('data-status', 'pending'); // Rolled back
    
    // Should show error toast with retry option
    expect(screen.getByText(/1 request failed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
```

#### 7.1.3 JSONB Merge Tests
**Scenario: Concurrent Dataset Updates**
```typescript
test('merges JSONB dataset updates without data loss', async () => {
  const initialDataset = {
    companyName: 'Acme Corp',
    data_points: [
      { id: 'scope1', value: 100, timestamp: '2025-01-01' }
    ]
  };
  
  const { getByLabelText, getByRole } = render(<DatasetEditor dataset={initialDataset} />);
  
  // User starts editing companyName
  fireEvent.change(getByLabelText('Company Name'), { target: { value: 'New Acme' } });
  
  // Simulate concurrent server update to data_points (other user added scope2)
  const serverDataset = {
    companyName: 'Acme Corp', // Unchanged
    data_points: [
      { id: 'scope1', value: 100, timestamp: '2025-01-01' },
      { id: 'scope2', value: 50, timestamp: '2025-01-02' } // New item
    ]
  };
  
  // When user saves, merge should preserve both changes
  server.use(
    rest.post('/api/projects/:id/dataset/update', async (req, res, ctx) => {
      const { dataset } = await req.json();
      
      // Validate merge logic preserved server's data_points addition
      expect(dataset.data_points).toHaveLength(2);
      expect(dataset.data_points.find(dp => dp.id === 'scope2')).toBeDefined();
      
      // Validate user's companyName change is applied
      expect(dataset.companyName).toBe('New Acme');
      
      return res(ctx.status(200), ctx.json({ success: true, version: 8 }));
    })
  );
  
  fireEvent.click(getByRole('button', { name: /save/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
  });
});
```

#### 7.1.4 Error Recovery Tests
**Scenario: Network Timeout with Retry**
```typescript
test('retries failed mutations with exponential backoff', async () => {
  let attemptCount = 0;
  
  server.use(
    rest.post('/api/data-requests/complete-bulk', (req, res, ctx) => {
      attemptCount++;
      if (attemptCount < 3) {
        return res(ctx.status(504), ctx.json({ error: 'Gateway timeout' }));
      }
      return res(ctx.status(200), ctx.json({ success: true, updated: 5 }));
    })
  );
  
  const { getByRole } = render(<DataRequestsClient requests={mockRequests} />);
  fireEvent.click(getByRole('button', { name: /complete all/i }));
  
  // Should show retry toast after first failure
  await waitFor(() => {
    expect(screen.getByText(/retrying/i)).toBeInTheDocument();
  });
  
  // Should eventually succeed after retries
  await waitFor(() => {
    expect(screen.getByText(/completed successfully/i)).toBeInTheDocument();
    expect(attemptCount).toBe(3);
  }, { timeout: 5000 });
});
```

### 7.2 Test Coverage Requirements
- **Optimistic updates:** 100% coverage (snapshot creation, apply, rollback).
- **Race conditions:** All scenarios in Section 5.2.1 (debounce, loading gates, idempotency).
- **Version conflicts:** Detection, user prompts, force/reload flows (Section 5.2.2).
- **JSONB merges:** Deep merge validation, type safety, array preservation (Section 5.3.1).
- **Partial failures:** Multi-status responses, selective rollback, retry UI.
- **Error boundaries:** Graceful degradation, fallback UI rendering.

### 7.3 Testing Tools & Configuration
```json
// package.json additions
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "msw": "^2.0.0",
    "vitest": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**MSW Setup for API Mocking:**
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/data-requests/complete-bulk', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true, updated: 3, requests: [...] })
    );
  }),
  
  rest.post('/api/projects/:id/dataset/update', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ version: 1, updatedAt: new Date().toISOString() })
    );
  })
];

// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

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
- Maintain a registry of optimistic mutations in `docs/Loading perfomance optimization plan.md` (this document), expanding sections per module.

## 9. Error Recovery & Graceful Degradation

### 9.1 Error Boundaries for Optimistic UI

**Component-Level Error Boundary:**
```tsx
// src/components/error-boundaries/optimistic-error-boundary.tsx
'use client';

import React from 'react';
import { notifications } from '@/components/ui/notifications';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class OptimisticErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Optimistic UI Error:', error, errorInfo);
    
    // Log to monitoring service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: { react: { componentStack: errorInfo.componentStack } }
      });
    }
    
    // Show user-friendly notification
    notifications.error({
      title: 'Something went wrong',
      description: 'We encountered an error. Please refresh the page.',
      action: {
        label: 'Refresh',
        onClick: () => window.location.reload()
      }
    });
    
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-destructive/50 rounded-lg">
          <h3 className="font-semibold text-destructive">Error Loading Data</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage in Layouts:**
```tsx
// src/app/projects/[id]/layout.tsx
import { OptimisticErrorBoundary } from '@/components/error-boundaries/optimistic-error-boundary';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <OptimisticErrorBoundary>
      {children}
    </OptimisticErrorBoundary>
  );
}
```

### 9.2 Retry Strategies

**Exponential Backoff for Failed Mutations:**
```tsx
// src/lib/react-query/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

export function useOptimisticMutation<TData, TVariables>({
  mutationFn,
  onMutate,
  onError,
  onSettled,
  queryKey
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => Promise<{ snapshot: any }>;
  onError?: (error: Error, variables: TVariables, context?: { snapshot: any }) => void;
  onSettled?: () => void;
  queryKey: string[];
}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onMutate,
    onError: (error, variables, context) => {
      // Rollback logic
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }
      onError?.(error, variables, context);
    },
    onSettled,
    retry: (failureCount, error) => {
      // Retry only on network errors, not 4xx client errors
      if (error instanceof Response && error.status >= 400 && error.status < 500) {
        return false; // Don't retry client errors
      }
      
      return failureCount < MAX_RETRIES;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(INITIAL_DELAY * Math.pow(2, attemptIndex), 10000);
    }
  });
}
```

**User-Triggered Retry UI:**
```tsx
// src/components/blocks/retry-action.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { notifications } from '@/components/ui/notifications';

interface RetryActionProps {
  action: () => Promise<void>;
  label?: string;
}

export function RetryAction({ action, label = 'Retry' }: RetryActionProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      await action();
      notifications.success({ description: 'Action completed successfully' });
    } catch (error) {
      notifications.error({
        description: 'Action failed again. Please contact support.',
        action: {
          label: 'Try Again',
          onClick: handleRetry
        }
      });
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <Button onClick={handleRetry} disabled={isRetrying} variant="outline" size="sm">
      {isRetrying ? 'Retrying...' : label}
    </Button>
  );
}
```

### 9.3 Conflict Resolution UI

**Version Conflict Dialog:**
```tsx
// src/components/dialogs/version-conflict-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConflictData {
  serverVersion: number;
  currentData: any;
  updatedBy: string;
  updatedAt: string;
}

interface VersionConflictDialogProps {
  open: boolean;
  conflict: ConflictData | null;
  onReload: () => void; // Discard local changes, fetch fresh data
  onOverwrite: () => void; // Force save, ignore conflict
  onCancel: () => void;
}

export function VersionConflictDialog({
  open,
  conflict,
  onReload,
  onOverwrite,
  onCancel
}: VersionConflictDialogProps) {
  if (!conflict) return null;
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Data Was Modified</AlertDialogTitle>
          <AlertDialogDescription>
            This resource was modified by {conflict.updatedBy} at{' '}
            {new Date(conflict.updatedAt).toLocaleString()}.
            <br /><br />
            <strong>Server version:</strong> {conflict.serverVersion}
            <br />
            Your changes are based on an older version.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onReload} variant="outline">
            Reload (Discard My Changes)
          </AlertDialogAction>
          <AlertDialogAction onClick={onOverwrite} variant="destructive">
            Overwrite (Force Save)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Usage in Dataset Editor:**
```tsx
// src/app/projects/[id]/dataset/page.tsx
'use client';

import { useState } from 'react';
import { useOptimisticMutation } from '@/lib/react-query/mutations';
import { VersionConflictDialog } from '@/components/dialogs/version-conflict-dialog';

export default function DatasetEditorPage({ params }: { params: { id: string } }) {
  const [conflict, setConflict] = useState<ConflictData | null>(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  
  const saveDataset = useOptimisticMutation({
    mutationFn: async (dataset) => {
      const res = await fetch(`/api/projects/${params.id}/dataset/update`, {
        method: 'POST',
        body: JSON.stringify(dataset)
      });
      
      if (res.status === 409) {
        const conflictData = await res.json();
        setConflict(conflictData);
        setShowConflictDialog(true);
        throw new Error('Version conflict');
      }
      
      return res.json();
    },
    queryKey: ['projects', params.id, 'dataset']
  });
  
  const handleReload = () => {
    queryClient.invalidateQueries(['projects', params.id, 'dataset']);
    setShowConflictDialog(false);
  };
  
  const handleOverwrite = () => {
    saveDataset.mutate({ ...dataset, forceWrite: true });
    setShowConflictDialog(false);
  };
  
  return (
    <>
      {/* Dataset editor UI */}
      <VersionConflictDialog
        open={showConflictDialog}
        conflict={conflict}
        onReload={handleReload}
        onOverwrite={handleOverwrite}
        onCancel={() => setShowConflictDialog(false)}
      />
    </>
  );
}
```

### 9.4 Graceful Degradation Patterns

**Fallback to Non-Optimistic Mode:**
```tsx
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  OPTIMISTIC_UI: process.env.NEXT_PUBLIC_OPTIMISTIC_UI === 'true',
  BULK_OPERATIONS: process.env.NEXT_PUBLIC_BULK_OPERATIONS === 'true',
};

// src/components/data-requests-client.tsx
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export function DataRequestsClient() {
  const handleComplete = async (ids: string[]) => {
    if (FEATURE_FLAGS.OPTIMISTIC_UI) {
      // Optimistic path with React Query
      await completeRequestsMutation.mutate(ids);
    } else {
      // Legacy blocking path with spinner
      setIsLoading(true);
      try {
        await fetch('/api/data-requests/complete-bulk', {
          method: 'POST',
          body: JSON.stringify({ ids })
        });
        await refetch();
        notifications.success({ description: 'Requests completed' });
      } catch (error) {
        notifications.error({ description: 'Failed to complete requests' });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <Button onClick={() => handleComplete(selectedIds)} disabled={isLoading}>
      {isLoading ? 'Completing...' : 'Complete All'}
    </Button>
  );
}
```

**Network-Aware Degradation:**
```tsx
// src/hooks/use-network-status.ts
import { useEffect, useState } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<'4g' | '3g' | '2g' | 'slow-2g' | 'unknown'>('unknown');
  
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    const updateConnectionType = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      setConnectionType(connection?.effectiveType || 'unknown');
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    updateConnectionType();
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);
  
  return { isOnline, connectionType, isSlow: ['2g', 'slow-2g'].includes(connectionType) };
}

// Usage
const { isOnline, isSlow } = useNetworkStatus();

if (!isOnline) {
  notifications.warning({ description: 'You are offline. Changes will sync when connection is restored.' });
}

if (isSlow) {
  // Disable optimistic UI on slow connections to reduce confusion
  return <NonOptimisticUI />;
}
```

## 10. Rollout Considerations
- Ship per module feature flags (e.g., `NEXT_PUBLIC_OPTIMISTIC_DATA_REQUESTS=true`) to allow gradual rollouts.
- Backward compatibility: keep legacy code paths until new hooks prove stable, then remove old fetch logic.
- Monitor metrics after rollout: compare success vs rollback counts, track average reconciliation time.

### 10.1 Migration Strategy: Avoiding Double Caching
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

## 11. MVP vs Post-MVP: Decision Matrix

This section explicitly captures what features are deferred to Post-MVP and the architectural guarantees ensuring forward compatibility.

### 11.1 MVP Scope (Current Implementation)

**Included in MVP:**
- ✅ Bulk endpoints with optimistic UI (complete/revoke data requests)
- ✅ Snapshot-based rollback on errors
- ✅ Centralized notifications via Sonner
- ✅ Loading states to prevent duplicate submissions
- ✅ Basic cache invalidation after mutations
- ✅ Version field in API responses (preparation for concurrency control)
- ✅ Client-side debouncing for rapid clicks

**MVP Limitations (Acceptable Trade-offs):**
- ⚠️ **No optimistic locking enforcement**: `version` field returned but not validated server-side. Reason: Simplifies MVP; most users work solo; conflicts are rare.
- ⚠️ **No conflict resolution UI**: Version conflicts (409 responses) not yet handled with user prompts. Reason: Low probability in single-user MVP; can add dialogs in Phase 2.
- ⚠️ **No JSONB deep merge logic**: Dataset updates replace entire JSONB field. Reason: Current UI doesn't support concurrent multi-user editing; avoiding over-engineering.
- ⚠️ **No retry UI with backoff**: Mutations fail silently with error toast. Reason: Network failures rare in production; retry logic adds complexity without proven need.
- ⚠️ **No offline-first support**: Requires network connection for all mutations. Reason: Carbon reporting is not a mobile-first offline use case; defer to Post-MVP based on user feedback.

**Justification for Deferred Items:**  
User research shows 90% of projects have a single active editor. Implementing full concurrency controls (operational transformation, three-way merge, mutation queues) would delay MVP by 4+ weeks for edge cases affecting <10% of users. We prioritize shipping quickly and validating demand before investing in advanced conflict resolution.

### 11.2 Post-MVP Enhancements (Deferred with Compatibility Plan)

**Deferred Features:**
1. **Optimistic Locking with Version Validation**
   - **What**: Server-side enforcement of `version` field; reject stale updates with 409 Conflict.
   - **Compatibility Guarantee**: Schema already includes `version INT DEFAULT 0`. Adding validation is backwards-compatible (opt-in per endpoint).
   - **Migration Path**: Add `WHERE version = $1` clause to `UPDATE` statements; increment version on success.

2. **Conflict Resolution UI (Three-Way Merge)**
   - **What**: Show diff between user's changes, server state, and common ancestor; let user choose resolution.
   - **Compatibility Guarantee**: VersionConflictDialog component structure already scaffolded (Section 9.3). Extend with diff viewer when needed.
   - **Migration Path**: Add `GET /api/projects/:id/history` to fetch previous versions; integrate `react-diff-viewer` library.

3. **JSONB Deep Merge for Concurrent Edits**
   - **What**: Merge `data_points` arrays at field level instead of replacing entire dataset.
   - **Compatibility Guarantee**: `optimisticDatasetUpdater` function (Section 5.3.1) designed as pure function with merge logic. Current code uses naive replace; swap implementation without changing API.
   - **Migration Path**:
     ```typescript
     // Current (MVP): Replace entire dataset
     const updatedDataset = { ...serverData, ...userChanges };
     
     // Post-MVP: Deep merge data_points array
     const updatedDataset = deepMergeDataset(serverData, userChanges, conflictResolver);
     ```
   - **No schema changes needed**: JSONB field already supports nested structures.

4. **Mutation Queue for Offline Persistence**
   - **What**: Store pending mutations in IndexedDB; replay when network restores.
   - **Compatibility Guarantee**: React Query's `persistQueryClient` plugin supports this. Enable by adding persistence layer without rewriting mutations.
   - **Migration Path**:
     ```typescript
     // Add to query client setup
     import { persistQueryClient } from '@tanstack/react-query-persist-client';
     import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
     
     const persister = createSyncStoragePersister({ storage: window.localStorage });
     persistQueryClient({ queryClient, persister });
     ```
   - **Feature flag**: `NEXT_PUBLIC_OFFLINE_MODE=true` to enable gradually.

5. **Advanced Retry Strategies (Exponential Backoff + Retry UI)**
   - **What**: Automatic retries for transient errors (504, 503) with user-visible retry count.
   - **Compatibility Guarantee**: `useOptimisticMutation` hook (Section 9.2) already includes `retry` and `retryDelay` logic. Extend with toast notifications showing retry progress.
   - **Migration Path**: Add `notifications.promise` wrapper with retry count display; no breaking changes to mutation logic.

6. **Error Boundaries with Graceful Fallbacks**
   - **What**: Component-level error boundaries to catch rendering errors in optimistic UI.
   - **Compatibility Guarantee**: `OptimisticErrorBoundary` component scaffolded (Section 9.1). Wrap components incrementally without affecting non-wrapped code.
   - **Migration Path**: Add `<OptimisticErrorBoundary>` around high-risk components (dataset editor, bulk actions) one at a time.

7. **Real-Time Collaboration (WebSockets/Server-Sent Events)**
   - **What**: Notify users when another session modifies the same resource; auto-refresh stale data.
   - **Compatibility Guarantee**: React Query's `refetchInterval` and `refetchOnWindowFocus` provide polling fallback. WebSocket integration is additive (doesn't replace REST APIs).
   - **Migration Path**:
     ```typescript
     // Polling fallback (works today)
     useQuery({ queryKey, refetchInterval: 30000 });
     
     // Post-MVP: Add WebSocket listener
     useEffect(() => {
       const ws = new WebSocket('wss://api.example.com/projects/:id');
       ws.onmessage = (event) => {
         if (event.data.type === 'dataset_updated') {
           queryClient.invalidateQueries(['projects', id, 'dataset']);
         }
       };
     }, []);
     ```
   - **No REST API changes needed**: WebSocket events trigger existing cache invalidation.

### 11.3 Architectural Compatibility Guarantees

**Database Schema:**
- ✅ `version INT DEFAULT 0` column already planned in schema (backward-compatible addition).
- ✅ JSONB `dataset` field supports nested structures; no migration needed for deep merge.
- ✅ Adding indexes on `version` or `updated_at` does not break existing queries.

**API Contracts:**
- ✅ All mutation endpoints return `version` and `updatedAt` (even if not validated server-side in MVP).
- ✅ 409 Conflict response format standardized (Section 6) — MVP can return 200 instead; Post-MVP enforces 409.
- ✅ Bulk endpoints use array-based payloads (`{ ids: string[] }`) — extensible to `{ ids: string[], options?: { version?: number } }` without breaking changes.

**Frontend Architecture:**
- ✅ React Query layer abstraction (`useDataRequests`, `useProjects`) isolates mutation logic — internals can evolve without changing component APIs.
- ✅ Pure functions for optimistic updates (`optimisticDatasetUpdater`) allow swapping merge strategies without refactoring call sites.
- ✅ Feature flags (`NEXT_PUBLIC_OPTIMISTIC_UI`) enable gradual rollout — can A/B test Post-MVP features without redeploying.

**Testing & Observability:**
- ✅ MSW (Mock Service Worker) setup (Section 7.3) supports mocking 409 responses — Post-MVP tests reuse existing infrastructure.
- ✅ Console timing logs (`console.time`) in service layer — extend to structured logging (DataDog, Sentry) without changing function signatures.

### 11.4 Migration Roadmap for Post-MVP Features

**Phase 1 (MVP — Current):**
- Focus: Ship optimistic UI for bulk actions; validate user satisfaction.
- Exit Criteria: 90% of bulk operations feel instant; <5% rollback rate; zero data loss incidents.

**Phase 2 (Post-MVP — Q2 2025):**
- Trigger: User complaints about "my changes were lost" or "someone else's edit overwrote mine."
- Implement:
  1. Server-side version validation (optimistic locking)
  2. Conflict resolution UI (force/reload dialogs)
  3. JSONB deep merge for dataset updates
- Exit Criteria: Zero conflict-related support tickets; <1% of saves require manual merge.

**Phase 3 (Future — TBD):**
- Trigger: 20+ concurrent users per project OR offline usage requests.
- Implement:
  1. Real-time collaboration (WebSockets)
  2. Offline persistence (IndexedDB mutation queue)
  3. Three-way merge UI with diff viewer
- Exit Criteria: Support 100+ concurrent editors; offline mode works for 95% of actions.

**Decision Framework:**  
Before implementing Post-MVP features, validate demand:
- Run analytics on conflict rate (how often do 409s occur?).
- Survey users on pain points (offline support vs real-time collab priority?).
- A/B test feature flags to measure impact on engagement metrics.

This ensures resources are spent on proven needs, not speculative features.

---

## 12. Guidance for Autonomous Agents
To support an AI assistant executing this plan, provide the following guardrails:

1. **Pre-flight Checklist**
  - Read (or re-read) `docs/Loading perfomance optimization plan.md` and relevant source files before making changes.
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

## Related Documentation
- `docs/NEXT_STEPS.md` – prioritized follow-up tasks after each phase exits (updated 2025-11-06 to align with this plan).
- `docs/IMPLEMENTATION_CHECKLIST.md` – release checklist ensuring new code aligns with shared data layer standards (refreshed 2025-11-06 with SSR payload tasks).
- `docs/TECHNICAL_DEBT.md` – backlog of structural issues that may influence sequencing or scope adjustments (includes new SSR payload watch item).
- `docs/UX_REQUIREMENTS.md` – UX flows and component expectations that inform optimistic interactions and loading states.
- `docs/BULK_DATA_REQUESTS_PLAN.md` – deep dive on request workflows powering data-requests mutations and SSR payload decisions.
- `docs/API_REFERENCE.md` – authoritative contract for endpoints touched by phases in this plan.
- `docs/Requirements v0.0.1.md` – baseline product requirements that must remain satisfied as we optimize loading behaviour.
