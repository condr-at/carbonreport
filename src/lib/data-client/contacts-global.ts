'use client';

import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import type { ContactOverview, ContactDetail } from '@/lib/contacts/types';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import { contactsKeys } from './keys';

interface ContactsListResponse {
  contacts: ContactOverview[];
}

interface ContactDetailResponse {
  contact: ContactDetail;
  requests: DataRequestSummary[];
}

async function fetchContactsList(): Promise<ContactOverview[]> {
  const response = await request<ContactsListResponse>('/api/contacts');
  return Array.isArray(response.contacts) ? response.contacts : [];
}

async function fetchContactDetail(contactId: string): Promise<ContactDetailResponse> {
  return request<ContactDetailResponse>(`/api/contacts/${contactId}`);
}

export function useContactsList(initialData?: ContactOverview[]) {
  return useQuery<ContactOverview[]>({
    queryKey: contactsKeys.list(),
    queryFn: fetchContactsList,
    initialData,
  });
}

export function useContactDetail(contactId: string, options?: { enabled?: boolean }) {
  return useQuery<ContactDetailResponse>({
    queryKey: contactsKeys.detail(contactId),
    queryFn: () => fetchContactDetail(contactId),
    enabled: options?.enabled ?? true,
  });
}
