import { ProjectLayout } from '@/components/layouts/project-layout';
import { notFound } from 'next/navigation';
import { getReportTemplate } from '@/lib/report-templates';
import {
  enrichDataPoints,
  groupDataPoints,
  flattenToTableRows,
  DataPoint,
} from '@/lib/dataset-utils';
import { initializeFullDataset } from '@/lib/dataset-init';
import { DatasetPageClient } from './dataset-page-client';

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

export default async function DatasetPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Get all templates for this project (for metadata/labels)
  const templates = project.reports
    .map((r: any) => getReportTemplate(r.templateCode))
    .filter(Boolean);

  // Initialize FULL dataset structure (162 fields from master schema)
  // This is independent of which report templates are selected
  const existingDataPoints = (project.dataset?.data_points || []) as DataPoint[];
  const completeDataPoints = initializeFullDataset(existingDataPoints);
  
  // Transform dataset for display
  const enrichedDataPoints = enrichDataPoints(completeDataPoints, templates);
  const groupedData = groupDataPoints(enrichedDataPoints);
  const tableRows = flattenToTableRows(groupedData);

  return (
    <ProjectLayout project={project}>
      <DatasetPageClient
        projectId={project.id}
        projectName={project.name}
        initialRows={tableRows}
        datasetVersion={project.datasetVersion || 0}
        templates={templates}
        groupedData={groupedData}
      />
    </ProjectLayout>
  );
}
