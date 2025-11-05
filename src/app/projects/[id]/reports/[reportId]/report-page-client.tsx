"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatasetTable, type DataRequestSummary } from '@/components/dataset-table';
import { RequestDataModal } from '@/components/request-data-modal';
import {
  type DataPoint,
  type FieldDefinition,
  type TableRow,
  enrichDataPoints,
  flattenToTableRows,
} from '@/lib/dataset-utils-v2';
import { initializeFullDataset } from '@/lib/dataset-init';
import type { Dataset } from '@/lib/dataset-validation';
import { useProjectDataset, type ProjectDataset } from '@/lib/data-client/dataset';
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
  projectOwnerName: string;
  reportId: string;
  reportName: string;
  templateCode: string;
  sections: Array<{
    key: string;
    title: string;
    description?: string;
    fields: Array<{ fieldId: string; isRequired?: boolean }>;
  }>;
  fieldDefinitions: FieldDefinition[];
  initialDataset: Dataset | null;
  initialDatasetVersion: number;
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
  projectOwnerName,
  reportName,
  templateCode,
  sections,
  initialDataset,
  fieldDefinitions,
  initialDatasetVersion,
  completion,
  mailtoTemplate,
}: ReportPageClientProps) {
  const [dataRequests, setDataRequests] = useState<DataRequestSummary[]>([]);
  const [contacts, setContacts] = useState<{
    id: string;
    name: string;
    email: string;
    position?: string | null;
  }[]>([]);
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

  const initialDatasetPayload = useMemo<ProjectDataset>(
    () => ({
      projectId,
      projectName,
      dataset: initialDataset ?? ({ data_points: [] } as Dataset),
      datasetVersion: initialDatasetVersion,
      version: initialDatasetVersion,
      updatedAt: new Date().toISOString(),
    }),
    [projectId, projectName, initialDataset, initialDatasetVersion]
  );

  const datasetQuery = useProjectDataset(projectId, {
    initialData: initialDatasetPayload,
  });
  const datasetVersion = datasetQuery.data?.datasetVersion ?? initialDatasetVersion;

  const rows = useMemo<TableRow[]>(() => {
    const dataPoints = (datasetQuery.data?.dataset?.data_points ?? []) as DataPoint[];
    const filtered = dataPoints.filter((point) => fieldIdSet.has(point.field_id));
    const complete = initializeFullDataset(fieldDefinitions, filtered);
    const enriched = enrichDataPoints(complete, fieldDefinitions);
    return flattenToTableRows(enriched);
  }, [datasetQuery.data?.dataset, fieldDefinitions, fieldIdSet]);

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

  const refreshDataRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/data-requests`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to load data requests for project ${projectId}`);
      }

      const payload = await response.json();
      if (Array.isArray(payload?.requests)) {
        setDataRequests(payload.requests as DataRequestSummary[]);
      } else {
        setDataRequests([]);
      }
    } catch (error) {
      console.error('Failed to fetch project data requests', error);
    }
  }, [projectId]);

  useEffect(() => {
    refreshDataRequests();
  }, [refreshDataRequests]);

  const refreshContacts = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/contacts`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to load contacts for project ${projectId}`);
      }

      const payload = await response.json();
      if (Array.isArray(payload?.contacts)) {
        setContacts(payload.contacts);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error('Failed to fetch project contacts', error);
    }
  }, [projectId]);

  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

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
            projectId={projectId}
            rows={rows}
            dataRequests={dataRequests}
            onRequestData={handleRequestData}
          />
        </CardContent>
      </Card>

      {requestModal && (
        <RequestDataModal
          projectId={projectId}
          projectName={projectName}
          projectOwnerName={projectOwnerName}
          fieldLabel={requestModal.fieldLabel}
          fieldHint={requestModal.fieldHint}
          fieldId={requestModal.fieldId}
          itemId={requestModal.itemId}
          group={requestModal.repeatableKey || undefined}
          isGroup={false}
          mailtoTemplate={requestModal.mailtoTemplate || undefined}
          contacts={contacts}
          onLogged={refreshDataRequests}
          onClose={() => setRequestModal(null)}
        />
      )}
    </div>
  );
}
