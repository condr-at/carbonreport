'use client';

/**
 * Dataset Page Client Component
 * 
 * Handles client-side state and interactions for the dataset table
 * Now works with field definitions from database instead of templates
 */

import { useState, useCallback } from 'react';
import { DatasetTable } from '@/components/dataset-table';
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

interface DatasetPageClientProps {
  projectId: string;
  projectName: string;
  projectOwnerName: string;
  initialRows: TableRow[];
  datasetVersion: number;
  fieldDefinitions: FieldDefinition[];
  mailtoTemplate: { subject?: string; body?: string } | null;
}

export function DatasetPageClient({
  projectId,
  projectName,
  projectOwnerName,
  initialRows,
  datasetVersion: initialVersion,
  fieldDefinitions,
  mailtoTemplate,
}: DatasetPageClientProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [datasetVersion, setDatasetVersion] = useState(initialVersion);
  const [requestDataModal, setRequestDataModal] = useState<{
    fieldLabel?: string;
    fieldHint?: string | null;
    fieldId?: string;
    itemId?: string | null;
    repeatableKey?: string | null;
    mailtoTemplate?: { subject: string; body: string } | null;
  } | null>(null);

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

  const refreshRows = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/dataset`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh dataset');
      }

      const payload = await response.json();
      const dataPoints = (payload.dataset?.data_points || []) as DataPoint[];
      const enriched = enrichDataPoints(dataPoints, fieldDefinitions);
      const rebuiltRows = flattenToTableRows(enriched);

      setRows(rebuiltRows);
      setDatasetVersion(payload.datasetVersion ?? 0);
    } catch (error) {
      console.error(error);
    }
  }, [projectId, fieldDefinitions]);

  // Update single field
  const handleUpdate = useCallback(
    async (fieldId: string, itemId: string | null, value: string) => {
      try {
        const response = await fetch(`/api/projects/${projectId}/dataset`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_id: fieldId,
            item_id: itemId,
            value,
            datasetVersion,
          }),
        });

        if (!response.ok) {
          let message = 'Failed to update field';
          let parsed: any = null;

          try {
            parsed = await response.json();
            if (parsed?.error) {
              message = parsed.error;
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }

          if (response.status === 409) {
            await refreshRows();
            throw new Error(message || 'Dataset version conflict. Please refresh.');
          }

          throw new Error(message);
        }

        const data = await response.json();
        setDatasetVersion(data.datasetVersion);

        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.fieldId === fieldId && row.itemId === itemId) {
              return { ...row, value };
            }
            return row;
          })
        );
      } catch (error) {
        console.error('Error updating data point:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to update field');
      }
    },
    [projectId, datasetVersion, refreshRows]
  );

  const handleDeleteItem = useCallback(
    async (repeatableKey: string, itemId: string) => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/dataset/items/${itemId}?datasetVersion=${datasetVersion}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          let message = 'Failed to delete item';

          try {
            const errorPayload = await response.json();
            if (errorPayload?.error) {
              message = errorPayload.error;
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }

        if (response.status === 409) {
          await refreshRows();
        }

          alert(message);
          return;
        }

        const data = await response.json();
        setDatasetVersion(data.datasetVersion);

        setRows((prevRows) =>
          prevRows.filter(
            (row) => !(
              row.repeatableKey === repeatableKey &&
              row.itemId === itemId
            )
          )
        );
      } catch (error) {
        console.error('Error deleting dataset item:', error);
        alert('Failed to delete item');
      }
    },
    [projectId, datasetVersion, refreshRows]
  );

  const handleAddItem = useCallback(
    async (repeatableKey: string) => {
      try {
        const response = await fetch(`/api/projects/${projectId}/dataset/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            repeatableKey,
            datasetVersion,
          }),
        });

        if (!response.ok) {
          let message = 'Failed to add item';

          try {
            const errorPayload = await response.json();
            if (errorPayload?.error) {
              message = errorPayload.error;
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }

          if (response.status === 409) {
            await refreshRows();
          }

          alert(message);
          return;
        }

        const data = await response.json();
        setDatasetVersion(data.datasetVersion);

        await refreshRows();
      } catch (error) {
        console.error('Error adding dataset item:', error);
        alert('Failed to add item');
      }
    },
    [projectId, datasetVersion, refreshRows]
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
            rows={rows}
            onUpdate={handleUpdate}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
            onRequestData={handleRequestData}
          />
        </CardContent>
      </Card>

      {requestDataModal && (
        <RequestDataModal
          projectName={projectName}
          projectOwnerName={projectOwnerName}
            fieldLabel={requestDataModal.fieldLabel}
            fieldId={requestDataModal.fieldId}
            itemId={requestDataModal.itemId}
          fieldHint={requestDataModal.fieldHint}
            group={requestDataModal.repeatableKey || undefined}
            isGroup={false}
          mailtoTemplate={requestDataModal.mailtoTemplate || undefined}
          onClose={() => setRequestDataModal(null)}
        />
      )}
    </>
  );
}
