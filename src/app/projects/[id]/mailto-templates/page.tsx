import { notFound } from 'next/navigation';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { MailtoTemplatesClient } from './mailto-templates-client';
import { getBaseUrl } from '@/lib/server-utils';

type ProjectResponse = {
  id: string;
  name: string;
  status?: string | null;
  updatedAt: string;
  mailtoTemplate?: unknown | null;
  user?: {
    name: string | null;
  } | null;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(projectId: string): Promise<ProjectResponse | null> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/projects/${projectId}`, {
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

function extractMailtoValues(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    const subject = typeof (value as any).subject === 'string' ? (value as any).subject : '';
    const body = typeof (value as any).body === 'string' ? (value as any).body : '';
    
    if (!body) {
      return null;
    }

    return { subject, body };
  }

  return null;
}

export default async function MailtoTemplatesPage({ params }: PageProps) {
  const { id: projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const template = extractMailtoValues(project.mailtoTemplate);
  const ownerName = (project.user?.name ?? 'Carbon Report Team').trim() || 'Carbon Report Team';

  const projectForLayout = {
    id: project.id,
    name: project.name,
    status: (project.status ?? 'ACTIVE').toString().toLowerCase(),
    updatedAt: project.updatedAt,
  };

  return (
    <ProjectLayout project={projectForLayout}>
      <MailtoTemplatesClient
        projectId={project.id}
        projectName={project.name}
        projectOwnerName={ownerName}
        template={template}
      />
    </ProjectLayout>
  );
}
