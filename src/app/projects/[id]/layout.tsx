import { Suspense, type ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { ProjectTabSkeleton } from '@/components/layouts/project-tab-skeleton';
import { getProjectSummaryCached } from '@/lib/server-data/projects';
import { createServerTimingTracker } from '@/lib/server-data/metrics';

interface ProjectLayoutSegmentProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjectLayoutSegment({ children, params }: ProjectLayoutSegmentProps) {
  const { id } = await params;
  const tracker = createServerTimingTracker(`project-layout:${id}`);
  const project = await getProjectSummaryCached(id, tracker);

  if (!project) {
    notFound();
  }

  await tracker.commit();
  tracker.logTimings('project-layout');

  return (
    <ProjectLayout project={{ id: project.id, name: project.name, status: project.status, updatedAt: project.updatedAt }}>
      <Suspense fallback={<ProjectTabSkeleton />}>{children}</Suspense>
    </ProjectLayout>
  );
}
