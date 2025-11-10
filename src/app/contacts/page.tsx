import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { queryClientOptions } from '@/lib/data-client/queryClient';
import { contactsKeys } from '@/lib/data-client/keys';
import { getContactsOverview } from '@/lib/server-data/contacts';
import { ContactsPageClient } from './contacts-client';

export default async function ContactsPage() {
  const contacts = await getContactsOverview();
  const queryClient = new QueryClient(queryClientOptions);
  queryClient.setQueryData(contactsKeys.list(), contacts);

  return (
    <DashboardLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactsPageClient initialContacts={contacts} />
      </HydrationBoundary>
    </DashboardLayout>
  );
}
