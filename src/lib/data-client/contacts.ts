'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ContactSummary } from '@/lib/contacts/types';
import { request } from '@/lib/api-client';
import { projectKeys } from './keys';

interface ContactsResponse {
  contacts: ContactSummary[];
}

export function useProjectContacts(projectId: string, initialData?: ContactSummary[]) {
  return useQuery<ContactSummary[]>({
    queryKey: projectKeys.contacts(projectId),
    queryFn: () => fetchContacts(projectId),
    initialData,
  });
}

export function useInvalidateContacts(projectId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: projectKeys.contacts(projectId) });
}

async function fetchContacts(projectId: string): Promise<ContactSummary[]> {
  const response = await request<ContactsResponse>(`/api/projects/${projectId}/contacts`);
  return Array.isArray(response.contacts) ? response.contacts : [];
}
