import { notFound } from 'next/navigation';
import { ProjectLayout } from '@/components/layouts/project-layout';
import { ReportPageClient } from './report-page-client';
import {
  type DataPoint,
  type FieldDefinition,
} from '@/lib/dataset-utils-v2';
import { initializeFullDataset } from '@/lib/dataset-init';
import type { Dataset } from '@/lib/dataset-validation';
import { getBaseUrl } from '@/lib/server-utils';

interface PageProps {
  params: Promise<{ id: string; reportId: string }>;
}

async function getProject(projectId: string) {
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

async function getReport(projectId: string, reportId: string) {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/projects/${projectId}/reports/${reportId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch report');
  }

  return res.json();
}

async function getFieldDefinitions(): Promise<FieldDefinition[]> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/dataset-fields`, {
      cache: 'force-cache',
      next: { revalidate: 300 },
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

export default async function ReportPage({ params }: PageProps) {
  const { id: projectId, reportId } = await params;

  const [project, reportResponse, fieldDefinitions] = await Promise.all([
    getProject(projectId),
    getReport(projectId, reportId),
    getFieldDefinitions(),
  ]);

  if (!project || !reportResponse) {
    notFound();
  }

  const templateFieldIds = new Set<string>();
  for (const section of reportResponse.template.sections || []) {
    for (const field of section.fields || []) {
      templateFieldIds.add(field.fieldId);
    }
  }

  const filteredFieldDefinitions = fieldDefinitions.filter((def) =>
    templateFieldIds.has(def.field_id)
  );

  const existingDataPoints = (reportResponse.dataset?.data_points || []) as DataPoint[];
  const completeDataPoints = initializeFullDataset(filteredFieldDefinitions, existingDataPoints);

  const requiredFields = reportResponse.template.sections
    .flatMap((section: any) => section.fields)
    .filter((field: any) => field.isRequired)
    .map((field: any) => field.fieldId);

  const filledCount = completeDataPoints.filter((dp) =>
    requiredFields.includes(dp.field_id) && dp.value.trim() !== ''
  ).length;
  const requiredCount = requiredFields.length;
  const completionPercentage = requiredCount === 0
    ? 100
    : Math.round((filledCount / requiredCount) * 100);

  const projectForLayout = {
    id: project.id,
    name: project.name,
    status: project.status ?? 'active',
    updatedAt: project.updatedAt,
  };

  const ownerName = (project.user?.name ?? 'Carbon Report Team').trim() || 'Carbon Report Team';

  return (
    <ProjectLayout project={projectForLayout}>
      <ReportPageClient
        projectId={project.id}
        projectName={project.name}
        projectOwnerName={ownerName}
        reportId={reportResponse.reportInfo.id}
        reportName={reportResponse.template.name}
        templateCode={reportResponse.template.code}
        sections={reportResponse.template.sections.map((section: any) => ({
          key: section.key,
          title: section.title,
          description: section.description,
          fields: section.fields.map((field: any) => ({
            fieldId: field.fieldId,
            isRequired: Boolean(field.isRequired),
          })),
        }))}
        fieldDefinitions={filteredFieldDefinitions}
          initialDataset={reportResponse.dataset as Dataset}
          initialDatasetVersion={reportResponse.datasetVersion ?? 0}
        completion={{
          filled: filledCount,
          required: requiredCount,
          percentage: completionPercentage,
        }}
        mailtoTemplate={project.mailtoTemplate || null}
      />
    </ProjectLayout>
  );
}
