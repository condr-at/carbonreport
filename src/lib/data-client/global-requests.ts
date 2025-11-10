'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { notifications } from '@/components/ui/notifications';
import { request, ApiError } from '@/lib/api-client';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { GlobalRequestFilters } from '@/lib/data-requests/filters';
import { globalRequestsKeys, dataRequestKeys } from './keys';

interface GlobalRequestsResponse {
  requests: DataRequestSummary[];
}

interface BulkMutationPayload {
  ids: string[];
  completedAt?: string | null;
  requestedAt?: string | null;
}

interface BulkMutationResult {
  success: boolean;
  updated?: number;
  requests: DataRequestSummary[];
  updatedAt?: string;
  version?: number;
}

function filtersToQuery(filters: GlobalRequestFilters): string {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set('status', filters.status);
  }

  if (filters.projectId) {
    params.set('projectId', filters.projectId);
  }

  if (filters.contactId) {
    params.set('contactId', filters.contactId);
  }

  if (filters.deadline) {
    params.set('deadline', filters.deadline);
  }

  return params.toString();
}

async function fetchGlobalRequests(filters: GlobalRequestFilters): Promise<DataRequestSummary[]> {
  const query = filtersToQuery(filters);
  const url = query.length ? `/api/data-requests?${query}` : '/api/data-requests';
  const response = await request<GlobalRequestsResponse>(url);
  return Array.isArray(response.requests) ? response.requests : [];
}

function invalidateProjectCaches(queryClient: QueryClient, requests?: DataRequestSummary[]) {
  if (!requests?.length) {
    return;
  }

  const projectIds = new Set(
    requests
      .map((request) => request.project?.id)
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
  );

  projectIds.forEach((projectId) => {
    queryClient.invalidateQueries({ queryKey: dataRequestKeys.list(projectId, 'all') });
  });
}

export function useGlobalRequests(filters: GlobalRequestFilters, initialData?: DataRequestSummary[]) {
  return useQuery<DataRequestSummary[]>({
    queryKey: globalRequestsKeys.list(filters),
    queryFn: () => fetchGlobalRequests(filters),
    initialData,
  });
}

export function useGlobalCompleteRequests(filters: GlobalRequestFilters) {
  const queryClient = useQueryClient();
  const queryKey = globalRequestsKeys.list(filters);

  return useMutation({
    mutationKey: ['global-data-requests', 'complete'],
    mutationFn: (payload: BulkMutationPayload) =>
      request<BulkMutationResult>('/api/data-requests/complete-bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(queryKey);

      if (!snapshot) {
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

      queryClient.setQueryData(queryKey, optimistic);
      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      const message = error instanceof ApiError ? error.message : 'Failed to mark requests complete.';
      notifications.error(message);
    },
    onSuccess: (data, variables) => {
      if (data?.requests?.length) {
        queryClient.setQueryData<DataRequestSummary[]>(queryKey, (current) => {
          if (!current) {
            return data.requests;
          }

          const updates = new Map(data.requests.map((request) => [request.id, request]));
          return current.map((request) => updates.get(request.id) ?? request);
        });
      }

      const updatedCount = typeof data?.updated === 'number' ? data.updated : variables.ids.length;
      notifications.success(`Marked ${updatedCount} request${updatedCount === 1 ? '' : 's'} as completed.`);
      invalidateProjectCaches(queryClient, data?.requests);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: globalRequestsKeys.base });
    },
  });
}

export function useGlobalRevokeRequests(filters: GlobalRequestFilters) {
  const queryClient = useQueryClient();
  const queryKey = globalRequestsKeys.list(filters);

  return useMutation({
    mutationKey: ['global-data-requests', 'revoke'],
    mutationFn: (payload: BulkMutationPayload) =>
      request<BulkMutationResult>('/api/data-requests/revoke-bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(queryKey);

      if (!snapshot) {
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

      queryClient.setQueryData(queryKey, optimistic);
      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      const message = error instanceof ApiError ? error.message : 'Failed to revoke requests.';
      notifications.error(message);
    },
    onSuccess: (data, variables) => {
      if (data?.requests?.length) {
        queryClient.setQueryData<DataRequestSummary[]>(queryKey, (current) => {
          if (!current) {
            return data.requests;
          }

          const updates = new Map(data.requests.map((request) => [request.id, request]));
          return current.map((request) => updates.get(request.id) ?? request);
        });
      }

      const updatedCount = typeof data?.updated === 'number' ? data.updated : variables.ids.length;
      notifications.success(`Revoked ${updatedCount} request${updatedCount === 1 ? '' : 's'}.`);
      invalidateProjectCaches(queryClient, data?.requests);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: globalRequestsKeys.base });
    },
  });
}

export function useGlobalResendRequests(filters: GlobalRequestFilters) {
  const queryClient = useQueryClient();
  const queryKey = globalRequestsKeys.list(filters);

  return useMutation({
    mutationKey: ['global-data-requests', 'resend'],
    mutationFn: (payload: BulkMutationPayload) =>
      request<BulkMutationResult>('/api/data-requests/resend-bulk', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = queryClient.getQueryData<DataRequestSummary[]>(queryKey);
      const requestedAt = variables.requestedAt ?? new Date().toISOString();

      if (!snapshot) {
        return { snapshot: undefined, requestedAt };
      }

      const optimistic = snapshot.map((request) =>
        variables.ids.includes(request.id)
          ? {
              ...request,
              status: 'pending',
              requestedAt,
              completedAt: null,
              revokedAt: null,
            }
          : request
      );

      queryClient.setQueryData(queryKey, optimistic);
      return { snapshot, requestedAt };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      const message = error instanceof ApiError ? error.message : 'Failed to resend requests.';
      notifications.error(message);
    },
    onSuccess: (data, variables, context) => {
      if (data?.requests?.length) {
        queryClient.setQueryData<DataRequestSummary[]>(queryKey, (current) => {
          if (!current) {
            return data.requests;
          }

          const updates = new Map(data.requests.map((request) => [request.id, request]));
          return current.map((request) => updates.get(request.id) ?? request);
        });
      } else if (context?.requestedAt) {
        queryClient.setQueryData<DataRequestSummary[]>(queryKey, (current) => {
          if (!current) {
            return current;
          }

          return current.map((request) =>
            variables.ids.includes(request.id)
              ? {
                  ...request,
                  status: 'pending',
                  requestedAt: context.requestedAt!,
                  completedAt: null,
                  revokedAt: null,
                }
              : request
          );
        });
      }

      const updatedCount = typeof data?.updated === 'number' ? data.updated : variables.ids.length;
      notifications.success(`Resent ${updatedCount} request${updatedCount === 1 ? '' : 's'}.`);
      invalidateProjectCaches(queryClient, data?.requests);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: globalRequestsKeys.base });
    },
  });
}
