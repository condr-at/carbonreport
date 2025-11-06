import type { QueryKey, QueryClient } from '@tanstack/react-query';
import type { ServerTimingTracker } from './metrics';

export interface LazyHydrationOptions<TData> {
  flagEnabled: boolean;
  fetcher: () => Promise<TData>;
  queryClient: QueryClient;
  queryKey?: QueryKey;
  tracker?: ServerTimingTracker;
  payloadLabel: string;
  lazyPayloadMetadata?: Record<string, unknown>;
  onData?: (data: TData) => void;
}

export interface LazyHydrationResult<TData> {
  data?: TData;
  isLazy: boolean;
}

/**
 * Centralises the "lazy SSR" pattern so pages can opt into deferred hydration
 * with a single helper: if the feature flag is on we skip the fetch and record
 * a placeholder payload, otherwise we execute the fetch and seed React Query.
 */
export async function resolveLazyHydration<TData>(
  options: LazyHydrationOptions<TData>
): Promise<LazyHydrationResult<TData>> {
  const {
    flagEnabled,
    fetcher,
    queryClient,
    queryKey,
    tracker,
    payloadLabel,
    lazyPayloadMetadata,
    onData,
  } = options;

  if (flagEnabled) {
    tracker?.recordPayload(payloadLabel, lazyPayloadMetadata ?? { lazy: true });
    return { isLazy: true };
  }

  const data = await fetcher();

  if (queryKey) {
    queryClient.setQueryData(queryKey, data);
  }

  onData?.(data);
  tracker?.recordPayload(payloadLabel, data);

  return { data, isLazy: false };
}
