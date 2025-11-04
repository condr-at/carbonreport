export const projectKeys = {
  all: ['projects'] as const,
  detail: (projectId: string) => ['projects', projectId] as const,
  dataset: (projectId: string) => ['projects', projectId, 'dataset'] as const,
  contacts: (projectId: string) => ['projects', projectId, 'contacts'] as const,
};

export const dataRequestKeys = {
  list: (projectId: string, status: 'all' | 'pending' | 'completed' | 'revoked' = 'all') =>
    ['projects', projectId, 'data-requests', status] as const,
  summary: (projectId: string) => ['projects', projectId, 'data-requests', 'summary'] as const,
};

export const featureKeys = {
  flags: ['features'] as const,
};

export type QueryKeyFactory = typeof projectKeys & typeof dataRequestKeys & typeof featureKeys;
