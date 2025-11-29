import { cache } from 'react';
import prisma from '@/lib/db';
import { computeStatus } from '@/lib/data-requests/service';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { ContactSummary } from '@/lib/contacts/types';
import type { FieldDefinition } from '@/lib/dataset-utils-v2';
import { validateDataset, type Dataset } from '@/lib/dataset-validation';
import type { ServerTimingTracker } from '@/lib/server-data/metrics';

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  projectType: string;
  updatedAt: string;
  datasetVersion: number;
  mailtoTemplate: Record<string, unknown> | null;
  ownerName: string | null;
}

export interface ProjectDatasetPayload {
  dataset: Dataset | null;
  datasetVersion: number;
  warning?: string;
}

export async function getProjectSummary(
  projectId: string,
  tracker?: ServerTimingTracker
): Promise<ProjectSummary | null> {
  const stopQuery = tracker?.start('db:project-summary');
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      status: true,
      projectType: true,
      createdAt: true,
      datasetVersion: true,
      mailtoTemplate: true,
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
  stopQuery?.();

  if (!project) {
    return null;
  }

  const stopTransform = tracker?.start('transform:project-summary');
  const result = {
    id: project.id,
    name: project.name,
    status: project.status,
    projectType: project.projectType,
    updatedAt: project.createdAt.toISOString(),
    datasetVersion: project.datasetVersion,
    mailtoTemplate: (project.mailtoTemplate as Record<string, unknown> | null) ?? null,
    ownerName: project.createdBy?.name ?? null,
  };
  stopTransform?.();

  return result;
}

const getProjectSummaryCache = cache((projectId: string) => getProjectSummary(projectId));

export async function getProjectSummaryCached(
  projectId: string,
  tracker?: ServerTimingTracker
): Promise<ProjectSummary | null> {
  const stop = tracker?.start('cache:project-summary');
  try {
    const summary = await getProjectSummaryCache(projectId);
    stop?.();
    return summary;
  } catch (error) {
    stop?.();
    throw error;
  }
}

export async function getProjectContacts(
  projectId: string,
  tracker?: ServerTimingTracker
): Promise<ContactSummary[]> {
  const stopProjectQuery = tracker?.start('db:project-for-contacts');
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      organizationId: true,
    },
  });
  stopProjectQuery?.();

  if (!project) {
    return [];
  }

  const stopContactsQuery = tracker?.start('db:contacts');
  const contacts = await prisma.contact.findMany({
    where: {
      organizationId: project.organizationId,
      archived: false,
    },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
    },
  });
  stopContactsQuery?.();

  const stopTransform = tracker?.start('transform:contacts');
  const summaries = contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    position: contact.position ?? null,
  }));
  stopTransform?.();

  return summaries;
}

export async function getProjectDataRequests(
  projectId: string,
  tracker?: ServerTimingTracker
): Promise<DataRequestSummary[]> {
  const stopRequestsQuery = tracker?.start('db:data-requests');
  const requests = await prisma.dataRequest.findMany({
    where: { projectId },
    include: {
      contact: true,
    },
    orderBy: [{ requestedAt: 'desc' }],
  });
  stopRequestsQuery?.();

  if (requests.length === 0) {
    return [];
  }

  const fieldIds = Array.from(
    new Set(requests.map((request) => request.dataPointId).filter((value): value is string => Boolean(value)))
  );

  const definitions = fieldIds.length
    ? await (async () => {
        const stopDefinitionsQuery = tracker?.start('db:data-request-field-definitions');
        const result = await prisma.datasetFieldDefinition.findMany({
          where: { fieldId: { in: fieldIds } },
          select: { fieldId: true, label: true, hint: true },
        });
        stopDefinitionsQuery?.();
        return result;
      })()
    : [];

  const fieldMeta = new Map(definitions.map((definition) => [definition.fieldId, definition]));

  const stopTransform = tracker?.start('transform:data-requests');
  const summaries = requests.map((request) => {
    const fieldDefinition = request.dataPointId ? fieldMeta.get(request.dataPointId) : null;

    const summary: DataRequestSummary = {
      id: request.id,
      status: computeStatus(request),
      requestedAt: request.requestedAt.toISOString(),
      completedAt: request.completedAt?.toISOString() ?? null,
      revokedAt: request.revokedAt?.toISOString() ?? null,
      deadline: request.deadline?.toISOString() ?? null,
      contact: request.contact
        ? {
            id: request.contact.id,
            name: request.contact.name,
            email: request.contact.email,
          }
        : null,
      dataPoint: {
        id: request.dataPointId ?? null,
        itemId: request.itemId ?? null,
        label: request.fieldLabel ?? fieldDefinition?.label ?? null,
        hint: fieldDefinition?.hint ?? null,
      },
    };

    return summary;
  });

  stopTransform?.();

  return summaries;
}

export async function getDatasetFieldDefinitions(tracker?: ServerTimingTracker): Promise<FieldDefinition[]> {
  const stopDefinitionsQuery = tracker?.start('db:dataset-field-definitions');
  const definitions = await prisma.datasetFieldDefinition.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });
  stopDefinitionsQuery?.();

  const stopTransform = tracker?.start('transform:dataset-field-definitions');
  const result = definitions.map((definition) => ({
    field_id: definition.fieldId,
    label: definition.label,
    hint: definition.hint ?? null,
    type: definition.type,
    options: definition.options ?? null,
    validation: definition.validation ?? null,
    is_repeatable: definition.isRepeatable,
    repeatable_key: definition.repeatableKey ?? null,
    sort_order: definition.sortOrder ?? null,
  }));

  stopTransform?.();

  return result;
}

export async function getProjectDataset(
  projectId: string,
  tracker?: ServerTimingTracker
): Promise<ProjectDatasetPayload | null> {
  const stopDatasetQuery = tracker?.start('db:project-dataset');
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      dataset: true,
      datasetVersion: true,
    },
  });
  stopDatasetQuery?.();

  if (!project) {
    return null;
  }

  if (!project.dataset) {
    return {
      dataset: { data_points: [] } as Dataset,
      datasetVersion: project.datasetVersion,
    };
  }

  try {
    const stopValidation = tracker?.start('validate:dataset');
    const dataset = validateDataset(project.dataset);
    stopValidation?.();
    const stopTransform = tracker?.start('transform:dataset');
    const payload = {
      dataset,
      datasetVersion: project.datasetVersion,
    };
    stopTransform?.();
    return {
      ...payload,
    };
  } catch (error) {
    console.warn('Dataset validation failed, returning raw dataset', error);
    return {
      dataset: project.dataset as Dataset,
      datasetVersion: project.datasetVersion,
      warning: 'Dataset validation failed',
    };
  }
}
