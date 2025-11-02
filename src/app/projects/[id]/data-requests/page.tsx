import { notFound } from 'next/navigation';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { getBaseUrl } from '@/lib/server-utils';
import type { DataRequestSummary } from '@/components/dataset-table';
import { DataRequestsPageClient } from './data-requests-client';

type ContactSummary = {
  id: string;
  name: string | null;
  email: string;
  position: string | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch project');
  }

  return res.json();
}

async function getDataRequests(projectId: string): Promise<DataRequestSummary[]> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/projects/${projectId}/data-requests?status=all`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch data requests for project', projectId);
      return [];
    }

    const payload = await res.json();
    if (Array.isArray(payload?.requests)) {
      return payload.requests as DataRequestSummary[];
    }

    return [];
  } catch (error) {
    console.error('Unexpected error fetching data requests', error);
    return [];
  }
}

async function getContacts(projectId: string): Promise<ContactSummary[]> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/projects/${projectId}/contacts`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch contacts for project', projectId);
      return [];
    }

    const payload = await res.json();
    if (Array.isArray(payload?.contacts)) {
      return payload.contacts as ContactSummary[];
    }

    return [];
  } catch (error) {
    console.error('Unexpected error fetching contacts', error);
    return [];
  }
}

export default async function DataRequestsPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const [initialRequests, initialContacts] = await Promise.all([
    getDataRequests(project.id),
    getContacts(project.id),
  ]);

  const ownerName = (project.user?.name ?? 'Carbon Report Team').trim() || 'Carbon Report Team';

  return (
    <ProjectLayout project={project}>
      <DataRequestsPageClient
        projectId={project.id}
        projectName={project.name}
        projectOwnerName={ownerName}
        initialRequests={initialRequests}
        initialContacts={initialContacts}
        mailtoTemplate={project.mailtoTemplate ?? null}
      />
    </ProjectLayout>
  );
}
