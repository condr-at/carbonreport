import prisma from '@/lib/db';
import { computeStatus } from '@/lib/data-requests/service';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { ContactSummary } from '@/lib/contacts/types';
import type { FieldDefinition } from '@/lib/dataset-utils-v2';
import { validateDataset, type Dataset } from '@/lib/dataset-validation';

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
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

export async function getProjectSummary(projectId: string): Promise<ProjectSummary | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      datasetVersion: true,
      mailtoTemplate: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    status: project.status,
    updatedAt: project.createdAt.toISOString(),
    datasetVersion: project.datasetVersion,
    mailtoTemplate: (project.mailtoTemplate as Record<string, unknown> | null) ?? null,
    ownerName: project.user?.name ?? null,
  };
}

export async function getProjectContacts(projectId: string): Promise<ContactSummary[]> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      userId: true,
    },
  });

  if (!project) {
    return [];
  }

  const contacts = await prisma.contact.findMany({
    where: {
      userId: project.userId,
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

  return contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    position: contact.position ?? null,
  }));
}

export async function getProjectDataRequests(projectId: string): Promise<DataRequestSummary[]> {
  const requests = await prisma.dataRequest.findMany({
    where: { projectId },
    include: {
      contact: true,
    },
    orderBy: [{ requestedAt: 'desc' }],
  });

  if (requests.length === 0) {
    return [];
  }

  const fieldIds = Array.from(
    new Set(requests.map((request) => request.dataPointId).filter((value): value is string => Boolean(value)))
  );

  const definitions = fieldIds.length
    ? await prisma.datasetFieldDefinition.findMany({
        where: { fieldId: { in: fieldIds } },
        select: { fieldId: true, label: true, hint: true },
      })
    : [];

  const fieldMeta = new Map(definitions.map((definition) => [definition.fieldId, definition]));

  return requests.map((request) => {
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
}

export async function getDatasetFieldDefinitions(): Promise<FieldDefinition[]> {
  const definitions = await prisma.datasetFieldDefinition.findMany({
    orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
  });

  return definitions.map((definition) => ({
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
}

export async function getProjectDataset(projectId: string): Promise<ProjectDatasetPayload | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      dataset: true,
      datasetVersion: true,
    },
  });

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
    const dataset = validateDataset(project.dataset);
    return {
      dataset,
      datasetVersion: project.datasetVersion,
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
