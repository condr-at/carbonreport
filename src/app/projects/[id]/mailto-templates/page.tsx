import { MailtoTemplatesClient } from './mailto-templates-client';
import { notFound } from 'next/navigation';
import { getProjectSummaryCached } from '@/lib/server-data/projects';

interface PageProps {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  const project = await getProjectSummaryCached(id);

  if (!project) {
    notFound();
  }

  const template = extractMailtoValues(project.mailtoTemplate);
  const ownerName = project.ownerName?.trim() ? project.ownerName.trim() : 'Carbon Report Team';

  return (
    <MailtoTemplatesClient
      projectId={project.id}
      projectName={project.name}
      projectOwnerName={ownerName}
      template={template}
    />
  );
}
