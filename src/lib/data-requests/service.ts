import { randomUUID } from 'crypto';
import type { Contact, Prisma, PrismaClient } from '@prisma/client';
import prismaClient from '@/lib/db';
import { invalidateByPrefix } from '@/lib/cache';

export type DataRequestStatus = 'pending' | 'completed' | 'revoked';

export interface BulkFieldInput {
  dataPointId: string;
  fieldLabel?: string | null;
  itemId?: string | null;
  group?: string | null;
}

export interface BulkContactInput {
  id?: string | null;
  email: string;
  name?: string | null;
}

export interface BulkRequestInput {
  projectId: string;
  userId: string;
  contact: BulkContactInput;
  deadline: Date | null;
  fields: BulkFieldInput[];
  now?: Date;
}

export interface BulkWorkPlan {
  projectId: string;
  userId: string;
  contact: Contact;
  deadline: Date | null;
  now: Date;
  revocationIds: string[];
  insertRows: Array<Prisma.DataRequestCreateManyInput & { id: string }>;
}

export interface BulkExecutionResult {
  createdCount: number;
  revokedCount: number;
  createdIds: string[];
}

export interface SerializedRequest {
  id: string;
  status: DataRequestStatus;
  requestedAt: string;
  completedAt: string | null;
  revokedAt: string | null;
  deadline: string | null;
  contact: {
    id: string;
    name: string;
    email: string;
    position: string | null;
  } | null;
  dataPoint: {
    id: string;
    itemId: string | null;
    label: string | null;
    hint: string | null;
  };
}

const DATA_REQUEST_CACHE_PREFIX = 'project:data-requests:';
const CONTACT_CACHE_PREFIX = 'project:contacts:';

class DataRequestServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'DataRequestServiceError';
    this.status = status;
    this.code = code;
  }
}

function getClient(client?: PrismaClient): PrismaClient {
  return client ?? prismaClient;
}

export function computeStatus(request: { revokedAt: Date | null; completedAt: Date | null }): DataRequestStatus {
  if (request.revokedAt) {
    return 'revoked';
  }

  if (request.completedAt) {
    return 'completed';
  }

  return 'pending';
}

function fieldKey(fieldId: string, itemId: string | null): string {
  return `${fieldId}::${itemId ?? 'null'}`;
}

async function resolveContact(
  client: PrismaClient,
  userId: string,
  contactInput: BulkContactInput
) {
  if (contactInput.id) {
    const existing = await client.contact.findUnique({ where: { id: contactInput.id } });

    if (!existing || existing.userId !== userId) {
      throw new DataRequestServiceError('Contact not found for current project', 404, 'CONTACT_NOT_FOUND');
    }

    return existing;
  }

  const normalizedEmail = contactInput.email.trim();

  const byEmail = await client.contact.findFirst({
    where: {
      userId,
      email: normalizedEmail,
    },
  });

  if (byEmail) {
    return byEmail;
  }

  const name = (contactInput.name ?? '').trim();

  return client.contact.create({
    data: {
      userId,
      email: normalizedEmail,
      name: name.length > 0 ? name : normalizedEmail,
      position: null,
    },
  });
}

export async function prepareBulk(
  input: BulkRequestInput,
  client?: PrismaClient
): Promise<BulkWorkPlan> {
  const prisma = getClient(client);
  const now = input.now ?? new Date();

  if (!input.fields.length) {
    throw new DataRequestServiceError('fields array must include at least one entry', 400, 'VALIDATION_FAILED');
  }

  const uniqueFields = new Map<string, { dataPointId: string; itemId: string | null; fieldLabel: string | null; group: string | null }>();

  for (const field of input.fields) {
    const key = fieldKey(field.dataPointId, field.itemId ?? null);

    if (!uniqueFields.has(key)) {
      uniqueFields.set(key, {
        dataPointId: field.dataPointId,
        itemId: field.itemId ?? null,
        fieldLabel: field.fieldLabel ?? null,
        group: field.group ?? null,
      });
    }
  }

  const contact = await resolveContact(prisma, input.userId, input.contact);

  const activeRequests = uniqueFields.size
    ? await prisma.dataRequest.findMany({
        where: {
          projectId: input.projectId,
          revokedAt: null,
          completedAt: null,
          OR: Array.from(uniqueFields.values()).map((field) => ({
            dataPointId: field.dataPointId,
            itemId: field.itemId,
          })),
        },
        select: {
          id: true,
          dataPointId: true,
          itemId: true,
          contactId: true,
        },
      })
    : [];

  const revocationIds: string[] = [];

  for (const request of activeRequests) {
    if (request.contactId !== contact.id) {
      revocationIds.push(request.id);
    }
  }

  const insertRows: Array<Prisma.DataRequestCreateManyInput & { id: string }> = [];

  for (const field of uniqueFields.values()) {
    insertRows.push({
      id: randomUUID(),
      projectId: input.projectId,
      userId: input.userId,
      contactId: contact.id,
      dataPointId: field.dataPointId,
      itemId: field.itemId,
      fieldLabel: field.fieldLabel,
      deadline: input.deadline,
    });
  }

  return {
    projectId: input.projectId,
    userId: input.userId,
    contact,
    deadline: input.deadline,
    now,
    revocationIds,
    insertRows,
  };
}

export async function executeBulk(
  plan: BulkWorkPlan,
  client?: PrismaClient
): Promise<BulkExecutionResult> {
  const prisma = getClient(client);

  const result = await prisma.$transaction(async (tx) => {
    let revokedCount = 0;

    if (plan.revocationIds.length > 0) {
      const { count } = await tx.dataRequest.updateMany({
        where: { id: { in: plan.revocationIds } },
        data: { revokedAt: plan.now },
      });
      revokedCount = count;
    }

    if (plan.insertRows.length > 0) {
      await tx.dataRequest.createMany({ data: plan.insertRows });
    }

    return {
      revokedCount,
      createdCount: plan.insertRows.length,
    };
  });

  invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${plan.projectId}`);
  invalidateByPrefix(`${CONTACT_CACHE_PREFIX}${plan.projectId}`);

  return {
    createdCount: result.createdCount,
    revokedCount: result.revokedCount,
    createdIds: plan.insertRows.map((row) => row.id),
  };
}

export async function serializeRequests(
  ids: string[],
  client?: PrismaClient
): Promise<SerializedRequest[]> {
  if (ids.length === 0) {
    return [];
  }

  const prisma = getClient(client);
  const order = new Map<string, number>();
  ids.forEach((id, index) => order.set(id, index));

  const requests = await prisma.dataRequest.findMany({
    where: { id: { in: ids } },
    include: { contact: true },
  });

  if (requests.length === 0) {
    return [];
  }

  const fieldIds = Array.from(new Set(requests.map((request) => request.dataPointId))).filter(Boolean);

  const definitions = fieldIds.length
    ? await prisma.datasetFieldDefinition.findMany({
        where: { fieldId: { in: fieldIds } },
        select: { fieldId: true, label: true, hint: true },
      })
    : [];

  const fieldMap = new Map(definitions.map((definition) => [definition.fieldId, definition]));

  const sorted = [...requests].sort((a, b) => {
    const aIndex = order.get(a.id) ?? 0;
    const bIndex = order.get(b.id) ?? 0;
    return aIndex - bIndex;
  });

  return sorted.map((request) => {
    const definition = fieldMap.get(request.dataPointId ?? '') ?? null;
    return serializeRequestRecord(request, definition);
  });
}

export async function completeRequest(
  id: string,
  completedAt: Date,
  client?: PrismaClient
): Promise<SerializedRequest> {
  const prisma = getClient(client);

  const existing = await prisma.dataRequest.findUnique({
    where: { id },
    include: { contact: true },
  });

  if (!existing) {
    throw new DataRequestServiceError('Data request not found', 404, 'NOT_FOUND');
  }

  if (existing.revokedAt) {
    throw new DataRequestServiceError('Cannot complete a revoked request', 409, 'CONFLICT');
  }

  const updated = existing.completedAt
    ? existing
    : await prisma.dataRequest.update({
        where: { id },
        data: { completedAt, revokedAt: null },
        include: { contact: true },
      });

  invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${updated.projectId}`);

  const definition = updated.dataPointId
    ? await prisma.datasetFieldDefinition.findUnique({
        where: { fieldId: updated.dataPointId },
        select: { label: true, hint: true },
      })
    : null;

  return serializeRequestRecord(updated, definition);
}

export async function revokeRequest(
  id: string,
  revokedAt: Date,
  client?: PrismaClient
): Promise<SerializedRequest> {
  const prisma = getClient(client);

  const existing = await prisma.dataRequest.findUnique({
    where: { id },
    include: { contact: true },
  });

  if (!existing) {
    throw new DataRequestServiceError('Data request not found', 404, 'NOT_FOUND');
  }

  if (existing.completedAt) {
    throw new DataRequestServiceError('Cannot revoke a completed request', 409, 'CONFLICT');
  }

  const updated = existing.revokedAt
    ? existing
    : await prisma.dataRequest.update({
        where: { id },
        data: { revokedAt, completedAt: null },
        include: { contact: true },
      });

  invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${updated.projectId}`);

  const definition = updated.dataPointId
    ? await prisma.datasetFieldDefinition.findUnique({
        where: { fieldId: updated.dataPointId },
        select: { label: true, hint: true },
      })
    : null;

  return serializeRequestRecord(updated, definition);
}

export function serializeRequestRecord(
  request: Prisma.DataRequestGetPayload<{ include: { contact: true } }> ,
  definition?: { label: string | null; hint: string | null } | null
): SerializedRequest {
  return {
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
          position: request.contact.position ?? null,
        }
      : null,
    dataPoint: {
      id: request.dataPointId,
      itemId: request.itemId,
      label: request.fieldLabel ?? definition?.label ?? null,
      hint: definition?.hint ?? null,
    },
  };
}

export { DataRequestServiceError };
