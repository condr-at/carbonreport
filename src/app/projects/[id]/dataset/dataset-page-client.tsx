"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatasetTable, type DataRequestSummary } from '@/components/dataset-table';
import { RequestDataModal } from '@/components/request-data-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle } from 'lucide-react';
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
import { migrateLegacyData } from '@/lib/migrations/migrate-legacy-data';
import { SYSTEM_FIELD_DEFINITIONS } from '@/lib/system-definitions';

interface DatasetPageClientProps {
  projectId: string;
  projectName: string;
  projectType: string;
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
  projectType,
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

  // Memoize initial payload to prevent re-creation
  const initialDatasetPayload = useMemo<ProjectDataset | undefined>(() => {
    if (initialDataset === undefined || initialDatasetVersion === undefined) {
      return undefined;
    }

    // Perform on-the-fly migration for initial data
    const migratedDataset = initialDataset ? migrateLegacyData(initialDataset) : ({ data_points: [] } as Dataset);

    return {
      projectId,
      projectName,
      dataset: migratedDataset,
      datasetVersion: initialDatasetVersion,
      version: initialDatasetVersion,
      updatedAt: new Date().toISOString(),
    };
  }, [projectId, projectName, initialDataset, initialDatasetVersion]);

  const datasetQuery = useProjectDataset(projectId, {
    initialData: initialDatasetPayload,
    staleTime: Infinity, // Prevent refetching on navigation to preserve optimistic updates
  });
  const datasetVersion = datasetQuery.data?.datasetVersion ?? initialDatasetVersion ?? 0;

  // Handle lazy loading state
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

  // Merge system definitions with DB definitions
  const combinedDefinitions = useMemo(() => {
    const dbFieldIds = new Set(fieldDefinitions.map(f => f.field_id));
    const missingSystemFields = SYSTEM_FIELD_DEFINITIONS.filter(f => !dbFieldIds.has(f.field_id));
    return [...fieldDefinitions, ...missingSystemFields];
  }, [fieldDefinitions]);

  // Unified Row Generation
  const rows = useMemo<TableRow[]>(() => {
    // 1. Get raw data points (migrated)
    let dataPoints = (datasetQuery.data?.dataset?.data_points ?? []) as DataPoint[];

    // 2. Ensure migration runs on live updates too (if backend sends legacy format)
    if (datasetQuery.data?.dataset) {
      const migrated = migrateLegacyData(datasetQuery.data.dataset);
      dataPoints = migrated.data_points;
    }

    // 3. Initialize full dataset (creates rows for ALL definitions)
    // Note: In a real app, we might want to filter 'fieldDefinitions' to only show relevant fields.
    // For now, we show ALL fields as requested ("Master View").
    const complete = initializeFullDataset(combinedDefinitions, dataPoints);

    // 4. Enrich with metadata (labels, types)
    const enriched = enrichDataPoints(complete, combinedDefinitions);

    // 5. Flatten to table rows
    return flattenToTableRows(enriched);
  }, [datasetQuery.data?.dataset, combinedDefinitions]);

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

  return (
    <>
      <div className="space-y-6">
        {/* Migration Notice (Temporary) */}
        {(datasetQuery.data?.dataset?.facilities?.length ?? 0) > 0 && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-200">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4" />
              Data Migration Active
            </div>
            <div className="mt-1 pl-6">
              Your legacy data (Facilities/BOMs) is being automatically migrated to the new unified format.
              Please verify your data below.
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Version: {datasetVersion}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Database className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Data Yet</h3>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  Your dataset is empty. Add fields from report templates or create
                  custom fields.
                </p>
              </div>
            ) : (
              <DatasetTable
                projectId={projectId}
                rows={rows}
                dataRequests={dataRequests}
                onRequestData={handleRequestData}
                onRequestMultiple={handleRequestMultiple}
              />
            )}
          </CardContent>
        </Card>
      </div>

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
