import { ProjectLayout } from '@/components/layouts/project-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  const res = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch project');
  }

  return res.json();
}

export default async function FilesPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout project={project}>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Folder className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Project Files</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Coming soon - Document uploads and attachments
          </p>
        </CardContent>
      </Card>
    </ProjectLayout>
  );
}
