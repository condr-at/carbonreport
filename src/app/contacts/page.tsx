import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
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
        <Suspense fallback={<div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <ContactsPageClient initialContacts={contacts} />
        </Suspense>
      </HydrationBoundary>
    </DashboardLayout>
  );
}
