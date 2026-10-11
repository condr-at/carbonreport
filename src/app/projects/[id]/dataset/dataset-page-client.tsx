"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import { projectKeys } from '@/lib/data-client/keys';
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
import { Button } from '@/components/ui/button';
import { useBatchSync } from '@/lib/sync/sync-manager';

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
    fields: Array<{
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

    // Data is already migrated in DB
    const dataset = initialDataset ?? ({ data_points: [] } as Dataset);

    return {
      projectId,
      projectName,
      dataset,
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
  const queryClient = useQueryClient();
  const [reviewSnapshot, setReviewSnapshot] = useState<ProjectDataset | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const { queue, isReady, isSyncing, storageError, legacyDraft, retryFailed, resolveConflict, syncNow } = useBatchSync();
  const projectChanges = queue.filter((operation) => operation.payload.projectId === projectId);
  const failedChanges = projectChanges.filter((operation) => operation.status === 'failed');
  const hasConflict = failedChanges.some(op => op.code === 'VERSION_CONFLICT' || op.code === 'LEGACY_DRAFT');
  const needsSignIn = failedChanges.some(op => op.code === 'UNAUTHORIZED');
  const isSavingProject = projectChanges.some((operation) => operation.status === 'processing');
  const saveStatus = !isReady
    ? 'Restoring unsaved changes…'
    : failedChanges.length
      ? `${failedChanges.length} change${failedChanges.length === 1 ? '' : 's'} not saved. ${storageError ? 'Keep this page open.' : 'Your edits are kept in this tab.'}`
      : isSavingProject
        ? 'Saving changes…'
        : projectChanges.length
          ? `${projectChanges.length} change${projectChanges.length === 1 ? '' : 's'} waiting to save…`
          : 'All changes saved';

  const reviewLatest = async () => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      // Read a separate server snapshot; the visible draft remains overlaid until
      // the author explicitly chooses which values to retain.
      setReviewSnapshot(await request<ProjectDataset>(`/api/projects/${projectId}/dataset`));
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Could not load the latest values. Your draft is kept.');
    } finally { setReviewLoading(false); }
  };
  const finishReview = (keepDraft: boolean) => {
    if (!reviewSnapshot) return;
    queryClient.setQueryData(projectKeys.dataset(projectId), reviewSnapshot);
    resolveConflict(projectId, reviewSnapshot.datasetVersion, keepDraft);
    setReviewSnapshot(null);
  };

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
    const dataPoints = (datasetQuery.data?.dataset?.data_points || []) as DataPoint[];

    // 2. No migration needed (DB is migrated)
    if (datasetQuery.data?.dataset) {
      // dataPoints = datasetQuery.data.dataset.data_points; // Already assigned above
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
    ({ fieldId, itemId, fieldLabel, fieldHint }: {
      fieldId: string;
      itemId: string | null;
      fieldLabel: string;
      fieldHint: string | null;
    }) => {
      const template = resolveMailtoTemplate();

      setRequestDataModal({
        fields: [{
          fieldId,
          fieldLabel,
          itemId,
          fieldHint,
        }],
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


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Version: {datasetVersion}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <p role="status" aria-live="polite" className={failedChanges.length ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
                {saveStatus}
              </p>
              {needsSignIn ? (
                <Button asChild variant="outline" size="sm">
                  <a href={`/login?redirect=${encodeURIComponent(`/projects/${projectId}/dataset`)}`}>Sign in again</a>
                </Button>
              ) : hasConflict ? (
                <Button variant="outline" size="sm" disabled={isSyncing || reviewLoading} onClick={() => void reviewLatest()}>
                  {reviewLoading ? 'Loading latest values…' : 'Review latest values'}
                </Button>
              ) : failedChanges.length > 0 ? (
                <Button variant="outline" size="sm" disabled={isSyncing} onClick={() => retryFailed(projectId)}>
                  Retry saving
                </Button>
              ) : projectChanges.length > 0 && !isSavingProject ? (
                <Button variant="outline" size="sm" disabled={isSyncing} onClick={() => void syncNow()}>
                  Save now
                </Button>
              ) : null}
            </div>
            {failedChanges[0]?.error && <p className="text-sm text-destructive">{failedChanges[0].error}</p>}
            {reviewError && <p role="alert" className="text-sm text-destructive">{reviewError}</p>}
            {reviewSnapshot && hasConflict && (
              <div className="space-y-3 rounded-md border p-4" aria-label="Review conflicting changes">
                <p className="text-sm">Compare your draft with server version {reviewSnapshot.datasetVersion}. Save your changes to apply them to this version, or use the server values to discard this tab’s draft for this dataset.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead><tr><th className="p-2">Field</th><th className="p-2">Your draft</th><th className="p-2">Latest server value</th></tr></thead>
                    <tbody>{projectChanges.map(op => {
                      const fieldId = String(op.payload.fieldId ?? '');
                      const row = rows.find(row => row.fieldId === fieldId && (row.itemId ?? null) === (op.payload.itemId ?? null));
                      const latest = reviewSnapshot.dataset?.data_points?.find(point => point.field_id === fieldId && (point.item_id ?? null) === (op.payload.itemId ?? null));
                      return <tr key={op.id} className="border-t">
                        <td className="p-2">{row?.fieldLabel ?? op.type.replace('dataset/', '')}{op.payload.itemId ? ` (${String(op.payload.itemId)})` : ''}</td>
                        <td className="p-2 break-words">{op.type === 'dataset/update-field' ? String(op.payload.value ?? '') || 'Empty' : JSON.stringify(op.payload)}</td>
                        <td className="p-2 break-words">{op.type === 'dataset/update-field' ? latest?.value || 'Empty' : 'Review the current dataset before applying this structural change.'}</td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" disabled={isSyncing} onClick={() => finishReview(true)}>Save my changes</Button>
                  <Button variant="outline" size="sm" disabled={isSyncing} onClick={() => finishReview(false)}>Use server values</Button>
                </div>
              </div>
            )}
            {legacyDraft && (
              <div className="space-y-2 rounded-md border p-3 text-sm">
                <p>An older draft is stored in this browser. Download it and check its account and project before entering any values. It will not be saved automatically.</p>
                <Button size="sm" variant="outline" onClick={() => {
                  const url = URL.createObjectURL(new Blob([legacyDraft], { type: 'application/json' }));
                  const link = document.createElement('a');
                  link.href = url; link.download = 'carbon-report-older-draft.json'; link.click();
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}>Download older draft</Button>
              </div>
            )}
            {storageError && <p role="alert" className="text-sm text-destructive">{storageError}</p>}
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
          fields={requestDataModal.fields || []}
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
