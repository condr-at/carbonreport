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
import { featureFlags } from '@/lib/config';
import type { DataRequestSummary } from '@/lib/data-requests/types';

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

  const shouldLazyLoadRequests = featureFlags.lazyDataRequests;

  const requestsPromise: Promise<DataRequestSummary[] | null> = shouldLazyLoadRequests
    ? Promise.resolve(null)
    : getProjectDataRequests(project.id, tracker);

  const [initialRequests, initialContacts] = await Promise.all([
    requestsPromise,
    getProjectContacts(project.id, tracker),
  ]);

  const queryClient = new QueryClient(queryClientOptions);
  if (!shouldLazyLoadRequests && initialRequests) {
    queryClient.setQueryData(dataRequestKeys.list(project.id, 'all'), initialRequests);
  }
  queryClient.setQueryData(projectKeys.contacts(project.id), initialContacts);

  if (shouldLazyLoadRequests) {
    tracker.recordPayload('hydrate:data-requests', { lazy: true, count: 0 });
  } else {
    tracker.recordPayload('hydrate:data-requests', initialRequests ?? []);
  }
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
          initialRequests={shouldLazyLoadRequests ? undefined : initialRequests ?? []}
          initialContacts={initialContacts}
          mailtoTemplate={project.mailtoTemplate as { subject?: string; body?: string } | null}
          isInitialLazyLoad={shouldLazyLoadRequests}
        />
      </HydrationBoundary>
    </ProjectLayout>
  );
}
