'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@/components/ui/notifications';
import { request, ApiError } from '@/lib/api-client';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import { dataRequestKeys } from './keys';
import { logOptimistic } from './logging';

interface DataRequestsResponse {
  requests: DataRequestSummary[];
  version?: number;
  updatedAt?: string;
}

interface BulkMutationPayload {
  ids: string[];
  completedAt?: string | null;
}

interface BulkMutationResult {
  success: boolean;
  updated?: number;
  requests: DataRequestSummary[];
  version?: number;
  updatedAt?: string;
}

export function useDataRequests(
  projectId: string,
  options?: { status?: 'all' | 'pending' | 'completed' | 'revoked'; initialData?: DataRequestSummary[] }
) {
  const status = options?.status ?? 'all';

  return useQuery<DataRequestSummary[]>({
    queryKey: dataRequestKeys.list(projectId, status),
    queryFn: () => fetchDataRequests(projectId, status),
    initialData: options?.initialData,
  });
}

export function useCompleteDataRequests(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['data-requests', 'complete', projectId],
    mutationFn: (payload: BulkMutationPayload) =>
      request<BulkMutationResult>('/api/data-requests/complete-bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: dataRequestKeys.list(projectId, 'all') });
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(dataRequestKeys.list(projectId, 'all'));

      if (!snapshot) {
        logOptimistic('mutate:start', { action: 'complete', projectId, ids: variables.ids });
        return { snapshot: undefined };
      }

      const optimistic = snapshot.map((request) =>
        variables.ids.includes(request.id)
          ? {
              ...request,
              status: 'completed',
              completedAt: new Date().toISOString(),
              revokedAt: null,
            }
          : request
      );

      queryClient.setQueryData(dataRequestKeys.list(projectId, 'all'), optimistic);
      logOptimistic('mutate:start', { action: 'complete', projectId, ids: variables.ids });

      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(dataRequestKeys.list(projectId, 'all'), context.snapshot);
      }

      const message = error instanceof ApiError ? error.message : 'Failed to mark requests complete.';
      notifications.error(message);
      logOptimistic('mutate:error', { action: 'complete', projectId, ids: variables.ids, error: message });
    },
    onSuccess: (data, variables) => {
      if (data?.requests?.length) {
        queryClient.setQueryData<DataRequestSummary[]>(dataRequestKeys.list(projectId, 'all'), (current) => {
          if (!current) {
            return data.requests;
          }

          const updates = new Map(data.requests.map((request) => [request.id, request]));
          return current.map((request) => updates.get(request.id) ?? request);
        });
      }

      const updatedCount = typeof data.updated === 'number' ? data.updated : variables.ids.length;
      notifications.success(`Marked ${updatedCount} request${updatedCount === 1 ? '' : 's'} as completed.`);
      logOptimistic('mutate:success', { action: 'complete', projectId, ids: variables.ids });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dataRequestKeys.list(projectId, 'all') });
      logOptimistic('mutate:settled', { action: 'complete', projectId });
    },
  });
}

export function useRevokeDataRequests(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['data-requests', 'revoke', projectId],
    mutationFn: (payload: BulkMutationPayload) =>
      request<BulkMutationResult>('/api/data-requests/revoke-bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: dataRequestKeys.list(projectId, 'all') });
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(dataRequestKeys.list(projectId, 'all'));

      if (!snapshot) {
        logOptimistic('mutate:start', { action: 'revoke', projectId, ids: variables.ids });
        return { snapshot: undefined };
      }

      const optimistic = snapshot.map((request) =>
        variables.ids.includes(request.id)
          ? {
              ...request,
              status: 'revoked',
              revokedAt: new Date().toISOString(),
              completedAt: null,
            }
          : request
      );

      queryClient.setQueryData(dataRequestKeys.list(projectId, 'all'), optimistic);
      logOptimistic('mutate:start', { action: 'revoke', projectId, ids: variables.ids });

      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(dataRequestKeys.list(projectId, 'all'), context.snapshot);
      }

      const message = error instanceof ApiError ? error.message : 'Failed to revoke requests.';
      notifications.error(message);
      logOptimistic('mutate:error', { action: 'revoke', projectId, ids: variables.ids, error: message });
    },
    onSuccess: (data, variables) => {
      if (data?.requests?.length) {
        queryClient.setQueryData<DataRequestSummary[]>(dataRequestKeys.list(projectId, 'all'), (current) => {
          if (!current) {
            return data.requests;
          }

          const updates = new Map(data.requests.map((request) => [request.id, request]));
          return current.map((request) => updates.get(request.id) ?? request);
        });
      }

      const updatedCount = typeof data.updated === 'number' ? data.updated : variables.ids.length;
      notifications.success(`Revoked ${updatedCount} request${updatedCount === 1 ? '' : 's'}.`);
      logOptimistic('mutate:success', { action: 'revoke', projectId, ids: variables.ids });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dataRequestKeys.list(projectId, 'all') });
      logOptimistic('mutate:settled', { action: 'revoke', projectId });
    },
  });
}

async function fetchDataRequests(
  projectId: string,
  status: 'all' | 'pending' | 'completed' | 'revoked'
): Promise<DataRequestSummary[]> {
  const params = new URLSearchParams({ status });
  const response = await request<DataRequestsResponse>(`/api/projects/${projectId}/data-requests?${params.toString()}`);
  return Array.isArray(response.requests) ? response.requests : [];
}
