'use client';

/**
 * Dataset Page Client Component
 * 
 * Handles client-side state and interactions for the dataset table
 */

import { useState, useCallback } from 'react';
import { DatasetTable } from '@/components/dataset-table';
import { RequestDataModal } from '@/components/request-data-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import {
  TableRow,
  GroupedData,
  getUniqueFieldsInGroup,
  getNextItemId,
} from '@/lib/dataset-utils';
import { ReportTemplate } from '@/lib/report-templates/types';

interface DatasetPageClientProps {
  projectId: string;
  projectName: string;
  initialRows: TableRow[];
  datasetVersion: number;
  templates: ReportTemplate[];
  groupedData: GroupedData[];
}

export function DatasetPageClient({
  projectId,
  projectName,
  initialRows,
  datasetVersion: initialVersion,
  templates,
  groupedData: initialGroupedData,
}: DatasetPageClientProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [datasetVersion, setDatasetVersion] = useState(initialVersion);
  const [groupedData, setGroupedData] = useState<GroupedData[]>(initialGroupedData);
  const [requestDataModal, setRequestDataModal] = useState<{
    fieldLabel?: string;
    fieldId?: string;
    itemId?: string | null;
    group?: string;
    isGroup?: boolean;
  } | null>(null);

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
    },
    [projectId, datasetVersion]
  );

  // Delete repeatable item
  const handleDeleteItem = useCallback(
    async (group: string, itemId: string) => {
      if (!confirm(`Delete all fields for Item #${itemId}?`)) {
        return;
      }

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

      // Remove from UI
      setRows((prev) => prev.filter((row) => row.itemId !== itemId));
    },
    [projectId, datasetVersion]
  );

  // Add new repeatable item
  const handleAddItem = useCallback(
    async (group: string) => {
      // Find all unique field IDs for this group
      const groupData = groupedData.find((g) => g.group === group);
      if (!groupData) return;

      // Get field IDs from existing repeatables or singletons
      const allGroupFields = [
        ...groupData.singletons,
        ...Array.from(groupData.repeatables.values()).flat(),
      ];
      const uniqueFields = getUniqueFieldsInGroup(allGroupFields);
      const fieldIds = uniqueFields.map((f) => f.field_id);

      if (fieldIds.length === 0) {
        alert('No fields found for this group');
        return;
      }

      const response = await fetch(`/api/projects/${projectId}/dataset/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group,
          fieldIds,
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

      // Reload page to show new item
      // TODO: Implement optimistic update instead
      window.location.reload();
    },
    [projectId, datasetVersion, groupedData]
  );

  // Request data
  const handleRequestData = useCallback(
    (fieldId: string, itemId: string | null, group?: string) => {
      const row = rows.find((r) => r.fieldId === fieldId && r.itemId === itemId);

      setRequestDataModal({
        fieldLabel: row?.fieldLabel,
        fieldId,
        itemId,
        group: group || row?.group,
        isGroup: false,
      });
    },
    [rows]
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
            projectId={projectId}
            rows={rows}
            datasetVersion={datasetVersion}
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
          {...requestDataModal}
          onClose={() => setRequestDataModal(null)}
        />
      )}
    </>
  );
}
