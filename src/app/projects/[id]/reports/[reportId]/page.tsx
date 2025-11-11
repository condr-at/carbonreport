import { notFound } from 'next/navigation';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ReportPageClient } from './report-page-client';
import {
  type DataPoint,
  type FieldDefinition,
} from '@/lib/dataset-utils-v2';
import { initializeFullDataset } from '@/lib/dataset-init';
import type { Dataset } from '@/lib/dataset-validation';
import { getBaseUrl } from '@/lib/server-utils';
import { dataRequestKeys, projectKeys } from '@/lib/data-client/keys';
import { queryClientOptions } from '@/lib/data-client/queryClient';
import { getProjectDataset, getProjectDataRequests, getProjectContacts, getDatasetFieldDefinitions, getProjectSummaryCached } from '@/lib/server-data/projects';
import { createServerTimingTracker } from '@/lib/server-data/metrics';

interface PageProps {
  params: Promise<{ id: string; reportId: string }>;
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
export default async function ReportPage({ params }: PageProps) {
  const { id: projectId, reportId } = await params;

  const tracker = createServerTimingTracker(`report-page:${projectId}:${reportId}`);
  const project = await getProjectSummaryCached(projectId, tracker);

  if (!project) {
    notFound();
  }

  const [reportResponse, datasetPayload, fieldDefinitions, initialRequests, initialContacts] = await Promise.all([
    getReport(projectId, reportId),
    getProjectDataset(projectId, tracker),
    getDatasetFieldDefinitions(tracker),
    getProjectDataRequests(projectId, tracker),
    getProjectContacts(projectId, tracker),
  ]);

  if (!reportResponse) {
    notFound();
  }

  const templateFieldIds = new Set<string>();
  for (const section of reportResponse.template.sections ?? []) {
    for (const field of section.fields ?? []) {
      templateFieldIds.add(field.fieldId);
    }
  }

  const resolvedDataset = (datasetPayload?.dataset as Dataset | null) ?? ({ data_points: [] } as Dataset);
  const filteredFieldDefinitions = fieldDefinitions.filter((definition: FieldDefinition) =>
    templateFieldIds.has(definition.field_id)
  );

  const existingDataPoints = (resolvedDataset.data_points ?? []) as DataPoint[];
  const completeDataPoints = initializeFullDataset(filteredFieldDefinitions, existingDataPoints);

  const requiredFields = reportResponse.template.sections
    .flatMap((section: any) => section.fields)
    .filter((field: any) => field.isRequired)
    .map((field: any) => field.fieldId);

  const filledCount = completeDataPoints.filter((dataPoint) =>
    requiredFields.includes(dataPoint.field_id) && dataPoint.value.trim() !== ''
  ).length;
  const requiredCount = requiredFields.length;
  const completionPercentage =
    requiredCount === 0 ? 100 : Math.round((filledCount / requiredCount) * 100);

  const datasetVersion = datasetPayload?.datasetVersion ?? project.datasetVersion;
  const datasetHydration = {
    projectId: project.id,
    projectName: project.name,
    dataset: resolvedDataset,
    datasetVersion,
    version: datasetVersion,
    updatedAt: new Date().toISOString(),
    warning: datasetPayload?.warning,
  };

  const queryClient = new QueryClient(queryClientOptions);
  queryClient.setQueryData(projectKeys.dataset(project.id), datasetHydration);
  queryClient.setQueryData(dataRequestKeys.list(project.id, 'all'), initialRequests);
  queryClient.setQueryData(projectKeys.contacts(project.id), initialContacts);

  tracker.recordPayload('hydrate:dataset', datasetHydration);
  tracker.recordPayload('hydrate:data-requests', initialRequests);
  tracker.recordPayload('hydrate:contacts', initialContacts);

  await tracker.commit();
  tracker.logTimings('report-page');
  tracker.logPayloads('report-page');

  const ownerName = project.ownerName?.trim() ? project.ownerName.trim() : 'Carbon Report Team';

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
        initialDataset={resolvedDataset as Dataset}
        initialDatasetVersion={datasetVersion}
        completion={{
          filled: filledCount,
          required: requiredCount,
          percentage: completionPercentage,
        }}
        mailtoTemplate={(project.mailtoTemplate as { subject?: string; body?: string } | null) ?? null}
        initialRequests={initialRequests}
        initialContacts={initialContacts}
      />
    </HydrationBoundary>
  );
}
