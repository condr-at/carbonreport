import { notFound } from 'next/navigation';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { DataRequestsPageClient } from './data-requests-client';
import { dataRequestKeys, projectKeys } from '@/lib/data-client/keys';
import { queryClientOptions } from '@/lib/data-client/queryClient';
import {
  getProjectSummary,
  getProjectDataRequests,
  getProjectContacts,
} from '@/lib/server-data/projects';
import { createServerTimingTracker } from '@/lib/server-data/metrics';
import { resolveLazyHydration } from '@/lib/server-data/lazy-hydration';
import { featureFlags } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DataRequestsPage({ params }: PageProps) {
  const { id } = await params;
  const tracker = createServerTimingTracker(`data-requests-page:${id}`);
  const project = await getProjectSummary(id, tracker);

  if (!project) {
    notFound();
  }

  const queryClient = new QueryClient(queryClientOptions);

  const contactsPromise = getProjectContacts(project.id, tracker);

  const { data: resolvedRequests, isLazy: isLazyRequests } = await resolveLazyHydration({
    flagEnabled: featureFlags.lazyDataRequests,
    fetcher: () => getProjectDataRequests(project.id, tracker),
    queryClient,
    queryKey: dataRequestKeys.list(project.id, 'all'),
    tracker,
    payloadLabel: 'hydrate:data-requests',
    lazyPayloadMetadata: { lazy: true, count: 0 },
  });

  const initialContacts = await contactsPromise;
  queryClient.setQueryData(projectKeys.contacts(project.id), initialContacts);
  tracker.recordPayload('hydrate:contacts', initialContacts);

  await tracker.commit();
  tracker.logTimings('data-requests-page');
  tracker.logPayloads('data-requests-page');

  const ownerName = project.ownerName?.trim() ? project.ownerName.trim() : 'Carbon Report Team';
  const layoutProject = {
    id: project.id,
    name: project.name,
    status: project.status,
    updatedAt: project.updatedAt,
  };

  return (
    <ProjectLayout project={layoutProject}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DataRequestsPageClient
          projectId={project.id}
          projectName={project.name}
          projectOwnerName={ownerName}
          initialRequests={isLazyRequests ? undefined : resolvedRequests ?? []}
          initialContacts={initialContacts}
          mailtoTemplate={project.mailtoTemplate as { subject?: string; body?: string } | null}
          isInitialLazyLoad={isLazyRequests}
        />
      </HydrationBoundary>
    </ProjectLayout>
  );
}
