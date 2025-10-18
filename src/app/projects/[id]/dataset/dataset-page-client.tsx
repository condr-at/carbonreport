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
  initialRows: TableRow[];
  datasetVersion: number;
  fieldDefinitions: FieldDefinition[];
}

export function DatasetPageClient({
  projectId,
  projectName,
  initialRows,
  datasetVersion: initialVersion,
  fieldDefinitions,
}: DatasetPageClientProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [datasetVersion, setDatasetVersion] = useState(initialVersion);
  const [requestDataModal, setRequestDataModal] = useState<{
    fieldLabel?: string;
    fieldHint?: string | null;
    fieldId?: string;
    itemId?: string | null;
    repeatableKey?: string | null;
  } | null>(null);

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
        const error = await response.json();
        throw new Error(error.error || 'Failed to update field');
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
    },
    [projectId, datasetVersion]
  );

  const handleDeleteItem = useCallback(
    async (repeatableKey: string, itemId: string) => {
      const response = await fetch(
        `/api/projects/${projectId}/dataset/items/${itemId}?datasetVersion=${datasetVersion}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to delete item');
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
    },
    [projectId, datasetVersion]
  );

  const handleAddItem = useCallback(
    async (repeatableKey: string) => {
      const response = await fetch(`/api/projects/${projectId}/dataset/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repeatableKey,
          datasetVersion,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to add item');
        return;
      }

      const data = await response.json();
      setDatasetVersion(data.datasetVersion);

      // Refresh dataset to include the new rows in correct order
      await refreshRows();
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
      setRequestDataModal({
        fieldLabel,
        fieldHint,
        fieldId,
        itemId,
        repeatableKey,
      });
    },
    []
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
            fieldLabel={requestDataModal.fieldLabel}
            fieldId={requestDataModal.fieldId}
            itemId={requestDataModal.itemId}
            group={requestDataModal.repeatableKey || undefined}
            isGroup={false}
          onClose={() => setRequestDataModal(null)}
        />
      )}
    </>
  );
}
