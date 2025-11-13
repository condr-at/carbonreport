import type { GlobalRequestFilters } from '@/lib/data-requests/filters';

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

export const contactsKeys = {
  list: () => ['contacts', 'list'] as const,
  detail: (contactId: string) => ['contacts', contactId] as const,
};

export const globalRequestsKeys = {
  base: ['global-data-requests'] as const,
  list: (filters: GlobalRequestFilters) =>
    [
      'global-data-requests',
      filters.projectId ?? 'all',
      filters.status ?? 'all',
      filters.contactId ?? 'all',
      filters.deadline ?? 'all',
    ] as const,
};

export const featureKeys = {
  flags: ['features'] as const,
};

export const organizationKeys = {
  list: (includePending = false) => ['organizations', includePending ? 'with-pending' : 'accepted'] as const,
  current: (organizationId?: string) => ['organizations', 'current', organizationId ?? 'default'] as const,
  usage: (organizationId: string) => ['organizations', organizationId, 'usage'] as const,
  members: (organizationId: string) => ['organizations', organizationId, 'members'] as const,
  planUpgrade: (organizationId: string) => ['organizations', organizationId, 'plan-upgrade'] as const,
};

export type QueryKeyFactory =
  typeof projectKeys &
  typeof dataRequestKeys &
  typeof contactsKeys &
  typeof globalRequestsKeys &
  typeof featureKeys &
  typeof organizationKeys;
