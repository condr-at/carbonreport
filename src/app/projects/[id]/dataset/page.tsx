import { notFound } from 'next/navigation';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { DatasetPageClient } from './dataset-page-client';
import type { Dataset } from '@/lib/dataset-validation';
import { dataRequestKeys, projectKeys } from '@/lib/data-client/keys';
import { queryClientOptions } from '@/lib/data-client/queryClient';
import {
  getProjectSummary,
  getProjectDataset,
  getProjectDataRequests,
  getProjectContacts,
  getDatasetFieldDefinitions,
} from '@/lib/server-data/projects';
import { createServerTimingTracker } from '@/lib/server-data/metrics';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DatasetPage({ params }: PageProps) {
  const { id } = await params;
  const tracker = createServerTimingTracker(`dataset-page:${id}`);
  const project = await getProjectSummary(id, tracker);

  if (!project) {
    notFound();
  }

  const [fieldDefinitions, datasetPayload, initialDataRequests, initialContacts] = await Promise.all([
    getDatasetFieldDefinitions(tracker),
    getProjectDataset(project.id, tracker),
    getProjectDataRequests(project.id, tracker),
    getProjectContacts(project.id, tracker),
  ]);

  const resolvedDataset = datasetPayload?.dataset ?? ({ data_points: [] } as Dataset);
  const resolvedDatasetVersion = datasetPayload?.datasetVersion ?? project.datasetVersion;

  const queryClient = new QueryClient(queryClientOptions);
  queryClient.setQueryData(projectKeys.dataset(project.id), {
    projectId: project.id,
    projectName: project.name,
    dataset: resolvedDataset,
    datasetVersion: resolvedDatasetVersion,
    version: resolvedDatasetVersion,
    updatedAt: new Date().toISOString(),
  });
  queryClient.setQueryData(dataRequestKeys.list(project.id, 'all'), initialDataRequests);
  queryClient.setQueryData(projectKeys.contacts(project.id), initialContacts);

  tracker.recordPayload('hydrate:dataset', {
    dataset: resolvedDataset,
    datasetVersion: resolvedDatasetVersion,
  });
  tracker.recordPayload('hydrate:data-requests', initialDataRequests);
  tracker.recordPayload('hydrate:contacts', initialContacts);
  tracker.recordPayload('hydrate:field-definitions', fieldDefinitions);

  await tracker.commit();
  tracker.logTimings('dataset-page');
  tracker.logPayloads('dataset-page');

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
        <DatasetPageClient
          projectId={project.id}
          projectName={project.name}
          projectOwnerName={ownerName}
          initialDataset={resolvedDataset}
          initialDatasetVersion={resolvedDatasetVersion}
          fieldDefinitions={fieldDefinitions}
          mailtoTemplate={project.mailtoTemplate as { subject?: string; body?: string } | null}
          initialDataRequests={initialDataRequests}
          initialContacts={initialContacts}
        />
      </HydrationBoundary>
    </ProjectLayout>
  );
}
