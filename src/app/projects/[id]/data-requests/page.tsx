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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DataRequestsPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectSummary(id);

  if (!project) {
    notFound();
  }

  const [initialRequests, initialContacts] = await Promise.all([
    getProjectDataRequests(project.id),
    getProjectContacts(project.id),
  ]);

  const queryClient = new QueryClient(queryClientOptions);
  queryClient.setQueryData(dataRequestKeys.list(project.id, 'all'), initialRequests);
  queryClient.setQueryData(projectKeys.contacts(project.id), initialContacts);

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
          initialRequests={initialRequests}
          initialContacts={initialContacts}
          mailtoTemplate={project.mailtoTemplate as { subject?: string; body?: string } | null}
        />
      </HydrationBoundary>
    </ProjectLayout>
  );
}
