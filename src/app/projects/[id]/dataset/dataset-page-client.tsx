"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatasetTable, type DataRequestSummary } from '@/components/dataset-table';
import { RequestDataModal } from '@/components/request-data-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import {
  TableRow,
  type FieldDefinition,
  type DataPoint,
  enrichDataPoints,
  flattenToTableRows,
} from '@/lib/dataset-utils-v2';
import { initializeFullDataset } from '@/lib/dataset-init';
import type { Dataset } from '@/lib/dataset-validation';
import type { ContactSummary } from '@/lib/contacts/types';
import { useProjectDataset, type ProjectDataset } from '@/lib/data-client/dataset';
import { useDataRequests } from '@/lib/data-client/data-requests';
import { useProjectContacts } from '@/lib/data-client/contacts';
import { Skeleton } from '@/components/ui/skeleton';

interface DatasetPageClientProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  initialDataset?: Dataset | null;
  initialDatasetVersion?: number;
  fieldDefinitions: FieldDefinition[];
  mailtoTemplate: { subject?: string; body?: string } | null;
  initialDataRequests: DataRequestSummary[];
  initialContacts: ContactSummary[];
  isInitialLazyLoad?: boolean;
}

export function DatasetPageClient({
  projectId,
  projectName,
  projectOwnerName,
  initialDataset,
  initialDatasetVersion,
  fieldDefinitions,
  mailtoTemplate,
  initialDataRequests,
  initialContacts,
  isInitialLazyLoad = false,
}: DatasetPageClientProps) {
  const [requestDataModal, setRequestDataModal] = useState<{
    fieldLabel?: string;
    fieldHint?: string | null;
    fieldId?: string;
    itemId?: string | null;
    repeatableKey?: string | null;
    fields?: Array<{
      fieldId: string;
      fieldLabel: string;
      itemId: string | null;
      fieldHint: string | null;
    }>;
    mailtoTemplate?: { subject: string; body: string } | null;
  } | null>(null);

  const initialDatasetPayload = useMemo<ProjectDataset | undefined>(() => {
    if (initialDataset === undefined || initialDatasetVersion === undefined) {
      return undefined;
    }

    return {
      projectId,
      projectName,
      dataset: initialDataset ?? ({ data_points: [] } as Dataset),
      datasetVersion: initialDatasetVersion,
      version: initialDatasetVersion,
      updatedAt: new Date().toISOString(),
    };
  }, [projectId, projectName, initialDataset, initialDatasetVersion]);

  const datasetQuery = useProjectDataset(projectId, { initialData: initialDatasetPayload });
  const datasetVersion = datasetQuery.data?.datasetVersion ?? initialDatasetVersion ?? 0;

  const [hasLoadedInitialDataset, setHasLoadedInitialDataset] = useState(!isInitialLazyLoad);

  useEffect(() => {
    if (!isInitialLazyLoad || hasLoadedInitialDataset) {
      return;
    }

    if (datasetQuery.status !== 'pending') {
      setHasLoadedInitialDataset(true);
    }
  }, [datasetQuery.status, hasLoadedInitialDataset, isInitialLazyLoad]);

  const isLoadingInitialDataset = isInitialLazyLoad && !hasLoadedInitialDataset;

  const rows = useMemo<TableRow[]>(() => {
    const dataPoints = (datasetQuery.data?.dataset?.data_points ?? []) as DataPoint[];
    const complete = initializeFullDataset(fieldDefinitions, dataPoints);
    const enriched = enrichDataPoints(complete, fieldDefinitions);
    return flattenToTableRows(enriched);
  }, [datasetQuery.data?.dataset, fieldDefinitions]);

  const resolveMailtoTemplate = useCallback(
    (): { subject: string; body: string } | null => {
      if (!mailtoTemplate) {
        return null;
      }

      const candidateSubject = typeof mailtoTemplate.subject === 'string' ? mailtoTemplate.subject.trim() : '';
      const candidateBody = typeof mailtoTemplate.body === 'string' ? mailtoTemplate.body.trim() : '';

      if (!candidateBody) {
        return null;
      }

      return {
        subject: candidateSubject || `Data Request for ${projectName}`,
        body: candidateBody,
      };
    },
    [mailtoTemplate, projectName]
  );

  const handleRequestData = useCallback(
    ({ fieldId, itemId, repeatableKey, fieldLabel, fieldHint }: {
      fieldId: string;
      itemId: string | null;
      repeatableKey: string | null;
      fieldLabel: string;
      fieldHint: string | null;
    }) => {
      const template = resolveMailtoTemplate();

      setRequestDataModal({
        fieldLabel,
        fieldHint,
        fieldId,
        itemId,
        repeatableKey,
        mailtoTemplate: template,
      });
    },
    [resolveMailtoTemplate]
  );

  const handleRequestMultiple = useCallback(
    (fields: Array<{
      fieldId: string;
      fieldLabel: string;
      itemId: string | null;
      fieldHint: string | null;
    }>) => {
      const template = resolveMailtoTemplate();

      setRequestDataModal({
        fields,
        fieldLabel: undefined,
        fieldHint: undefined,
        fieldId: undefined,
        itemId: undefined,
        repeatableKey: undefined,
        mailtoTemplate: template,
      });
    },
    [resolveMailtoTemplate]
  );

  const dataRequestsQuery = useDataRequests(projectId, {
    status: 'all',
    initialData: initialDataRequests,
  });
  const dataRequests = dataRequestsQuery.data ?? [];

  const { data: contactsData = [] } = useProjectContacts(projectId, initialContacts);
  const normalizedContacts = useMemo(
    () =>
      contactsData.map((contact) => ({
        id: contact.id,
        name: (contact.name ?? '').trim() || contact.email,
        email: contact.email,
        position: contact.position ?? null,
      })),
    [contactsData]
  );

  if (isLoadingInitialDataset) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`dataset-skeleton-${index}`} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Database className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No Data Yet</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Your dataset is empty. Add fields from report templates or create
            custom fields.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dataset Editor
          </CardTitle>
          <p className="text-xs text-muted-foreground">Version: {datasetVersion}</p>
        </CardHeader>
        <CardContent>
          <DatasetTable
            projectId={projectId}
            rows={rows}
            dataRequests={dataRequests}
            onRequestData={handleRequestData}
            onRequestMultiple={handleRequestMultiple}
          />
        </CardContent>
      </Card>

      {requestDataModal && (
        <RequestDataModal
          projectId={projectId}
          projectName={projectName}
          projectOwnerName={projectOwnerName}
          fieldLabel={requestDataModal.fieldLabel}
          fieldHint={requestDataModal.fieldHint}
          fieldId={requestDataModal.fieldId}
          itemId={requestDataModal.itemId}
          group={requestDataModal.repeatableKey || undefined}
          fields={requestDataModal.fields}
          isGroup={false}
          mailtoTemplate={requestDataModal.mailtoTemplate || undefined}
          contacts={normalizedContacts}
          onClose={() => setRequestDataModal(null)}
          onLogged={async () => {
            await dataRequestsQuery.refetch();
          }}
        />
      )}
    </>
  );
}
