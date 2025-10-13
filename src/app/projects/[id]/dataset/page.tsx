import { ProjectLayout } from '@/components/layouts/project-layout';
import { notFound } from 'next/navigation';
import {
  enrichDataPoints,
  flattenToTableRows,
  type DataPoint,
  type FieldDefinition,
} from '@/lib/dataset-utils-v2';
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

async function getFieldDefinitions(): Promise<FieldDefinition[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
  
  try {
    const res = await fetch(`${baseUrl}/api/dataset-fields`, {
      cache: 'force-cache', // Cache field definitions
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch field definitions');
      return [];
    }

    const data = await res.json();
    return data.fields || [];
  } catch (error) {
    console.error('Error fetching field definitions:', error);
    return [];
  }
}

export default async function DatasetPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Fetch field definitions from database
  const fieldDefinitions = await getFieldDefinitions();

  // Initialize FULL dataset structure (162 fields from master schema)
  const existingDataPoints = (project.dataset?.data_points || []) as DataPoint[];
  const completeDataPoints = initializeFullDataset(existingDataPoints);
  
  // Transform dataset for display using DB-backed metadata
  const enrichedDataPoints = enrichDataPoints(completeDataPoints, fieldDefinitions);
  const tableRows = flattenToTableRows(enrichedDataPoints);

  return (
    <ProjectLayout project={project}>
      <DatasetPageClient
        projectId={project.id}
        projectName={project.name}
        initialRows={tableRows}
        datasetVersion={project.datasetVersion || 0}
        fieldDefinitions={fieldDefinitions}
      />
    </ProjectLayout>
  );
}
