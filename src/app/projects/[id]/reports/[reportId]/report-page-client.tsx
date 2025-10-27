"use client";

import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatasetTable } from '@/components/dataset-table';
import { RequestDataModal } from '@/components/request-data-modal';
import {
  type DataPoint,
  type FieldDefinition,
  type TableRow,
  enrichDataPoints,
  flattenToTableRows,
} from '@/lib/dataset-utils-v2';
import { initializeFullDataset } from '@/lib/dataset-init';
import { Database, RefreshCcw, FileText } from 'lucide-react';

interface ReportSectionSummary {
  key: string;
  title: string;
  description?: string;
  fieldCount: number;
  requiredCount: number;
}

interface ReportPageClientProps {
  projectId: string;
  projectName: string;
  reportId: string;
  reportName: string;
  templateCode: string;
  sections: Array<{
    key: string;
    title: string;
    description?: string;
    fields: Array<{ fieldId: string; isRequired?: boolean }>;
  }>;
  initialRows: TableRow[];
  fieldDefinitions: FieldDefinition[];
  datasetVersion: number;
  completion: { filled: number; required: number; percentage: number };
  mailtoTemplate: { subject?: string; body?: string } | null;
}

type RequestModalState = {
  fieldLabel?: string;
  fieldHint?: string | null;
  fieldId?: string;
  itemId?: string | null;
  repeatableKey?: string | null;
  mailtoTemplate?: { subject: string; body: string } | null;
} | null;

export function ReportPageClient({
  projectId,
  projectName,
  reportId,
  reportName,
  templateCode,
  sections,
  initialRows,
  fieldDefinitions,
  datasetVersion: initialVersion,
  completion,
  mailtoTemplate,
}: ReportPageClientProps) {
  const [rows, setRows] = useState<TableRow[]>(initialRows);
  const [datasetVersion, setDatasetVersion] = useState(initialVersion);
  const [requestModal, setRequestModal] = useState<RequestModalState>(null);

  const fieldIdSet = useMemo(
    () => new Set(fieldDefinitions.map((def) => def.field_id)),
    [fieldDefinitions]
  );

  const sectionSummaries: ReportSectionSummary[] = useMemo(() => {
    return sections.map((section) => {
      const fieldCount = section.fields.length;
      const requiredCount = section.fields.filter((f) => f.isRequired).length;
      return {
        key: section.key,
        title: section.title,
        description: section.description,
        fieldCount,
        requiredCount,
      };
    });
  }, [sections]);

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

  const buildRows = useCallback(
    (dataPoints: DataPoint[]): TableRow[] => {
      const filtered = dataPoints.filter((dp) => fieldIdSet.has(dp.field_id));
      const complete = initializeFullDataset(fieldDefinitions, filtered);
      const enriched = enrichDataPoints(complete, fieldDefinitions);
      return flattenToTableRows(enriched);
    },
    [fieldDefinitions, fieldIdSet]
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
      const refreshedRows = buildRows(dataPoints);
      setRows(refreshedRows);
      setDatasetVersion(payload.datasetVersion ?? 0);
    } catch (error) {
      console.error('Error refreshing dataset:', error);
    }
  }, [projectId, buildRows]);

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

          try {
            const parsed = await response.json();
            if (parsed?.error) {
              message = parsed.error;
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }

          if (response.status === 409) {
            await refreshRows();
            throw new Error(message || 'Dataset version conflict. Refreshed data.');
          }

          throw new Error(message);
        }

        const data = await response.json();
        setDatasetVersion(data.datasetVersion);
        setRows((prev) =>
          prev.map((row) => {
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
    ({
      fieldId,
      itemId,
      repeatableKey,
      fieldLabel,
      fieldHint,
    }: {
      fieldId: string;
      itemId: string | null;
      repeatableKey: string | null;
      fieldLabel: string;
      fieldHint: string | null;
    }) => {
      const template = resolveMailtoTemplate();
      setRequestModal({
        fieldId,
        itemId,
        repeatableKey,
        fieldLabel,
        fieldHint,
        mailtoTemplate: template,
      });
    },
    [resolveMailtoTemplate]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{reportName}</CardTitle>
              <CardDescription className="mt-1">
                Template code: {templateCode}
              </CardDescription>
            </div>
            <Badge variant="secondary">{Math.round(completion.percentage)}% complete</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4" />
            <span>{sections.length} sections • {completion.filled}/{completion.required} required fields filled</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Dataset version: {datasetVersion}</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Updates here instantly sync with the main dataset.</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Sections</CardTitle>
          <CardDescription>
            Reference for the data this report expects.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {sectionSummaries.map((section) => (
            <div key={section.key} className="rounded-md border border-dashed p-4">
              <div className="font-medium">{section.title}</div>
              {section.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {section.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{section.fieldCount} fields</span>
                <span>•</span>
                <span>{section.requiredCount} required</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Dataset</CardTitle>
          <CardDescription>
            Edit the data points used by this report. Changes affect the shared project dataset.
          </CardDescription>
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

      {requestModal && (
        <RequestDataModal
          projectName={projectName}
          fieldLabel={requestModal.fieldLabel}
          fieldHint={requestModal.fieldHint}
          fieldId={requestModal.fieldId}
          itemId={requestModal.itemId}
          group={requestModal.repeatableKey || undefined}
          isGroup={false}
          mailtoTemplate={requestModal.mailtoTemplate || undefined}
          onClose={() => setRequestModal(null)}
        />
      )}
    </div>
  );
}
