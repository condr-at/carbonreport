'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@/components/ui/notifications';
import { request, ApiError } from '@/lib/api-client';
import type { Dataset, DataPoint } from '@/lib/dataset-validation';
import { projectKeys } from './keys';
import { logOptimistic } from './logging';

type DatasetQueryKey = ReturnType<typeof projectKeys.dataset>;

export interface ProjectDataset {
  projectId?: string;
  projectName?: string;
  dataset: Dataset | null;
  datasetVersion: number;
  version?: number;
  updatedAt?: string;
  warning?: string;
}

interface DatasetResponse extends ProjectDataset {
  success?: boolean;
  message?: string;
  updatedDataPoint?: DataPoint;
  createdDataPoints?: DataPoint[];
  itemId?: string;
  deletedCount?: number;
}

interface UpdateFieldVariables {
  fieldId: string;
  itemId: string | null;
  value: string;
}

interface AddItemVariables {
  repeatableKey: string;
}

interface DeleteItemVariables {
  repeatableKey: string;
  itemId: string;
}

function ensureDataset(dataset: Dataset | null | undefined): Dataset {
  if (!dataset) {
    return { data_points: [] } as Dataset;
  }
  if (!Array.isArray(dataset.data_points)) {
    return { ...dataset, data_points: [] } as Dataset;
  }
  return dataset;
}

function applyDataPointUpdate(dataset: Dataset | null | undefined, variable: UpdateFieldVariables): Dataset {
  const base = ensureDataset(dataset);
  const points = base.data_points ?? [];
  const index = points.findIndex(
    (point) =>
      point.field_id === variable.fieldId &&
      (variable.itemId === null ? point.item_id === null : point.item_id === variable.itemId)
  );

  if (index >= 0) {
    const nextPoints = points.map((point, idx) =>
      idx === index ? { ...point, value: variable.value } : point
    );
    return { ...base, data_points: nextPoints } as Dataset;
  }

  const nextPoint: DataPoint = {
    field_id: variable.fieldId,
    item_id: variable.itemId,
    value: variable.value,
  };

  return {
    ...base,
    data_points: [...points, nextPoint],
  } as Dataset;
}

function appendDataPoints(dataset: Dataset | null | undefined, newPoints: DataPoint[]): Dataset {
  if (!newPoints.length) {
    return ensureDataset(dataset);
  }
  const base = ensureDataset(dataset);
  return {
    ...base,
    data_points: [...(base.data_points ?? []), ...newPoints],
  } as Dataset;
}

function removeItemFromDataset(dataset: Dataset | null | undefined, itemId: string): Dataset {
  const base = ensureDataset(dataset);
  const filtered = (base.data_points ?? []).filter((point) => point.item_id !== itemId);
  return {
    ...base,
    data_points: filtered,
  } as Dataset;
}

async function fetchProjectDataset(projectId: string): Promise<ProjectDataset> {
  const response = await request<DatasetResponse>(`/api/projects/${projectId}/dataset`);
  return {
    projectId: response.projectId,
    projectName: response.projectName,
    dataset: ensureDataset(response.dataset),
    datasetVersion: response.datasetVersion ?? 0,
    version: response.version,
    updatedAt: response.updatedAt,
    warning: response.warning,
  };
}

export function useProjectDataset(
  projectId: string,
  options?: { initialData?: ProjectDataset }
) {
  return useQuery<ProjectDataset>({
    queryKey: projectKeys.dataset(projectId),
    queryFn: () => fetchProjectDataset(projectId),
    initialData: options?.initialData,
  });
}

function getLatestDataset(queryClient: ReturnType<typeof useQueryClient>, key: DatasetQueryKey) {
  return queryClient.getQueryData<ProjectDataset>(key);
}

function handleDatasetMutationError(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: DatasetQueryKey,
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof ApiError) {
    if (error.code === 'VERSION_CONFLICT') {
      notifications.error('Dataset changed in another session. Reloaded the latest values, please try again.');
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.refetchQueries({ queryKey, type: 'active' });
      return;
    }

    notifications.error(error.message);
    return;
  }

  notifications.error(fallbackMessage);
}

export function useUpdateFullDataset(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = projectKeys.dataset(projectId);

  return useMutation({
    mutationFn: async (variables: { dataset: Dataset }) => {
      const latest = getLatestDataset(queryClient, queryKey);
      const datasetVersion = latest?.datasetVersion ?? 0;

      return request<DatasetResponse>(`/api/projects/${projectId}/dataset`, {
        method: 'PUT',
        body: JSON.stringify({
          dataset: variables.dataset,
          datasetVersion,
        }),
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = getLatestDataset(queryClient, queryKey);

      if (snapshot) {
        const optimistic = {
          ...snapshot,
          dataset: variables.dataset,
          version: Date.now(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData(queryKey, optimistic);
      }
      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }
      handleDatasetMutationError(queryClient, queryKey, error, 'Failed to update dataset.');
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProjectDataset>(queryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          datasetVersion: data.datasetVersion,
          version: data.version,
          updatedAt: data.updatedAt,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUpdateDatasetField(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = projectKeys.dataset(projectId);

  return useMutation({
    mutationKey: ['dataset', 'update-field', projectId],
    mutationFn: async (variables: UpdateFieldVariables) => {
      const latest = getLatestDataset(queryClient, queryKey);
      const datasetVersion = latest?.datasetVersion ?? 0;

      return request<DatasetResponse>(`/api/projects/${projectId}/dataset`, {
        method: 'PATCH',
        body: JSON.stringify({
          field_id: variables.fieldId,
          item_id: variables.itemId,
          value: variables.value,
          datasetVersion,
        }),
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = getLatestDataset(queryClient, queryKey);

      if (!snapshot) {
        logOptimistic('mutate:start', { action: 'dataset.update', projectId, fieldId: variables.fieldId });
        return { snapshot: undefined };
      }

      // Optimistically update dataset content but DO NOT bump datasetVersion.
      // Bumping caused PATCH to send incremented version and triggered false VERSION_CONFLICT.
      const nextDataset = applyDataPointUpdate(snapshot.dataset, variables);
      const optimistic = {
        ...snapshot,
        dataset: nextDataset,
        // keep datasetVersion unchanged until server increments
        version: Date.now(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(queryKey, optimistic);
      logOptimistic('mutate:start', { action: 'dataset.update', projectId, fieldId: variables.fieldId });

      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      handleDatasetMutationError(queryClient, queryKey, error, 'Failed to update dataset field.');
      const errorMessage = error instanceof ApiError ? error.message : 'unknown error';
      logOptimistic('mutate:error', { action: 'dataset.update', projectId, fieldId: variables.fieldId, error: errorMessage });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<ProjectDataset>(queryKey, (current) => {
        if (!current) {
          return current;
        }

        const dataset = applyDataPointUpdate(current.dataset, variables);
        return {
          ...current,
          dataset,
          datasetVersion: data?.datasetVersion ?? current.datasetVersion,
          version: data?.version ?? current.version,
          updatedAt: data?.updatedAt ?? current.updatedAt,
        };
      });
      logOptimistic('mutate:success', { action: 'dataset.update', projectId, fieldId: variables.fieldId });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      logOptimistic('mutate:settled', { action: 'dataset.update', projectId });
    },
  });
}

export function useAddDatasetItem(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = projectKeys.dataset(projectId);

  return useMutation({
    mutationKey: ['dataset', 'add-item', projectId],
    mutationFn: async (variables: AddItemVariables) => {
      const latest = getLatestDataset(queryClient, queryKey);
      const datasetVersion = latest?.datasetVersion ?? 0;

      return request<DatasetResponse>(`/api/projects/${projectId}/dataset/items`, {
        method: 'POST',
        body: JSON.stringify({
          repeatableKey: variables.repeatableKey,
          datasetVersion,
        }),
      });
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = getLatestDataset(queryClient, queryKey);
      logOptimistic('mutate:start', { action: 'dataset.add-item', projectId, repeatableKey: variables.repeatableKey });
      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      handleDatasetMutationError(queryClient, queryKey, error, 'Failed to add item.');
      const errorMessage = error instanceof ApiError ? error.message : 'unknown error';
      logOptimistic('mutate:error', {
        action: 'dataset.add-item',
        projectId,
        repeatableKey: variables.repeatableKey,
        error: errorMessage,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<ProjectDataset>(queryKey, (current) => {
        if (!current) {
          return current;
        }

        const dataset = appendDataPoints(current.dataset, data?.createdDataPoints ?? []);
        return {
          ...current,
          dataset,
          datasetVersion: data?.datasetVersion ?? current.datasetVersion,
          version: data?.version ?? current.version,
          updatedAt: data?.updatedAt ?? current.updatedAt,
        };
      });
      logOptimistic('mutate:success', { action: 'dataset.add-item', projectId, repeatableKey: variables.repeatableKey });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      logOptimistic('mutate:settled', { action: 'dataset.add-item', projectId });
    },
  });
}

export function useDeleteDatasetItem(projectId: string) {
  const queryClient = useQueryClient();
  const queryKey = projectKeys.dataset(projectId);

  return useMutation({
    mutationKey: ['dataset', 'delete-item', projectId],
    mutationFn: async (variables: DeleteItemVariables) => {
      const latest = getLatestDataset(queryClient, queryKey);
      const datasetVersion = latest?.datasetVersion ?? 0;

      return request<DatasetResponse>(
        `/api/projects/${projectId}/dataset/items/${variables.itemId}?datasetVersion=${datasetVersion}`,
        {
          method: 'DELETE',
        }
      );
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const snapshot = getLatestDataset(queryClient, queryKey);

      if (snapshot) {
        const dataset = removeItemFromDataset(snapshot.dataset, variables.itemId);
        const optimistic = {
          ...snapshot,
          dataset,
          // keep datasetVersion unchanged to avoid premature conflict
          version: Date.now(),
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData(queryKey, optimistic);
      }

      logOptimistic('mutate:start', { action: 'dataset.delete-item', projectId, itemId: variables.itemId });
      return { snapshot };
    },
    onError: (error, variables, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }

      handleDatasetMutationError(queryClient, queryKey, error, 'Failed to delete item.');
      const errorMessage = error instanceof ApiError ? error.message : 'unknown error';
      logOptimistic('mutate:error', {
        action: 'dataset.delete-item',
        projectId,
        itemId: variables.itemId,
        error: errorMessage,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData<ProjectDataset>(queryKey, (current) => {
        if (!current) {
          return current;
        }

        const dataset = removeItemFromDataset(current.dataset, variables.itemId);
        return {
          ...current,
          dataset,
          datasetVersion: data?.datasetVersion ?? current.datasetVersion,
          version: data?.version ?? current.version,
          updatedAt: data?.updatedAt ?? current.updatedAt,
        };
      });
      logOptimistic('mutate:success', { action: 'dataset.delete-item', projectId, itemId: variables.itemId });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      logOptimistic('mutate:settled', { action: 'dataset.delete-item', projectId });
    },
  });
}
