import { randomUUID } from 'crypto';
import { Prisma, PrismaClient } from '@prisma/client';
import type { Contact } from '@prisma/client';
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
  organizationId: string;
  requestedByUserId: string;
  contact: BulkContactInput;
  deadline: Date | null;
  fields: BulkFieldInput[];
  now?: Date;
}

export interface BulkWorkPlan {
  projectId: string;
  organizationId: string;
  requestedByUserId: string;
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
  updatedAt: string;
  version: number;
}

export interface BulkStatusResult {
  updated: number;
  requests: SerializedRequest[];
  updatedAt: string;
  version: number;
}

export interface SerializedRequest {
  id: string;
  status: DataRequestStatus;
  requestedAt: string;
  completedAt: string | null;
  revokedAt: string | null;
  deadline: string | null;
  project: {
    id: string;
    name: string | null;
    ownerName: string | null;
  } | null;
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

const REQUEST_SERIALIZATION_SELECT = Prisma.validator<Prisma.DataRequestSelect>()({
  id: true,
  projectId: true,
  requestedAt: true,
  completedAt: true,
  revokedAt: true,
  deadline: true,
  dataPointId: true,
  itemId: true,
  fieldLabel: true,
  contact: {
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
    },
  },
  project: {
    select: {
      id: true,
      name: true,
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  },
});

type RequestForSerialization = Prisma.DataRequestGetPayload<{ select: typeof REQUEST_SERIALIZATION_SELECT }>;

const DATA_REQUEST_CACHE_PREFIX = 'project:data-requests:';
const CONTACT_CACHE_PREFIX = 'project:contacts:';
const ENABLE_TIMING = process.env.NODE_ENV !== 'production';

type Timer = { label: string; start: bigint } | null;

function startTimer(label: string): Timer {
  if (!ENABLE_TIMING) {
    return null;
  }

  return {
    label,
    start: process.hrtime.bigint(),
  };
}

function endTimer(timer: Timer): void {
  if (!timer) {
    return;
  }

  const duration = Number(process.hrtime.bigint() - timer.start) / 1_000_000;
  console.info(`[data-requests] ${timer.label} took ${duration.toFixed(2)}ms`);
}

function buildMutationMetadata(reference?: Date): { updatedAt: string; version: number } {
  const timestamp = reference?.getTime() ?? Date.now();
  const updatedAt = new Date(timestamp).toISOString();
  return { updatedAt, version: timestamp };
}

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
  organizationId: string,
  createdByUserId: string,
  contactInput: BulkContactInput
): Promise<Contact> {
  if (contactInput.id) {
    const existing = await client.contact.findUnique({ where: { id: contactInput.id } });

    if (!existing || existing.organizationId !== organizationId) {
      throw new DataRequestServiceError('Contact not found for current project', 404, 'CONTACT_NOT_FOUND');
    }

    return existing;
  }

  const normalizedEmail = contactInput.email.trim();

  const byEmail = await client.contact.findFirst({
    where: {
      organizationId,
      email: normalizedEmail,
    },
  });

  if (byEmail) {
    return byEmail;
  }

  const name = (contactInput.name ?? '').trim();

  return client.contact.create({
    data: {
      organizationId,
      createdByUserId,
      email: normalizedEmail,
      name: name.length > 0 ? name : normalizedEmail,
      position: null,
      archived: false,
    },
  });
}

export async function prepareBulk(
  input: BulkRequestInput,
  client?: PrismaClient
): Promise<BulkWorkPlan> {
  const timer = startTimer(`prepareBulk project=${input.projectId}`);
  const prisma = getClient(client);
  const now = input.now ?? new Date();

  if (!input.fields.length) {
    throw new DataRequestServiceError('fields array must include at least one entry', 400, 'VALIDATION_FAILED');
  }

  try {
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

    const contact = await resolveContact(
      prisma,
      input.organizationId,
      input.requestedByUserId,
      input.contact
    );

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

    const revocationIds = Array.from(new Set(activeRequests.map((request) => request.id)));

    const insertRows: Array<Prisma.DataRequestCreateManyInput & { id: string }> = [];

    for (const field of uniqueFields.values()) {
      insertRows.push({
        id: randomUUID(),
        projectId: input.projectId,
  userId: input.requestedByUserId,
        contactId: contact.id,
        dataPointId: field.dataPointId,
        itemId: field.itemId,
        fieldLabel: field.fieldLabel,
        deadline: input.deadline,
      });
    }

    return {
      projectId: input.projectId,
      organizationId: input.organizationId,
      requestedByUserId: input.requestedByUserId,
      contact,
      deadline: input.deadline,
      now,
      revocationIds,
      insertRows,
    };
  } finally {
    endTimer(timer);
  }
}

export async function executeBulk(
  plan: BulkWorkPlan,
  client?: PrismaClient
): Promise<BulkExecutionResult> {
  const timer = startTimer(`executeBulk project=${plan.projectId} inserts=${plan.insertRows.length} revokes=${plan.revocationIds.length}`);
  const prisma = getClient(client);

  try {
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

    const metadata = buildMutationMetadata(plan.now);

    return {
      createdCount: result.createdCount,
      revokedCount: result.revokedCount,
      createdIds: plan.insertRows.map((row) => row.id),
      ...metadata,
    };
  } finally {
    endTimer(timer);
  }
}

export async function serializeRequests(
  ids: string[],
  client?: PrismaClient
): Promise<SerializedRequest[]> {
  if (ids.length === 0) {
    return [];
  }

  const timer = startTimer(`serializeRequests count=${ids.length}`);
  const prisma = getClient(client);
  const order = new Map<string, number>();
  ids.forEach((id, index) => order.set(id, index));

  try {
    const requests = await prisma.dataRequest.findMany({
      where: { id: { in: ids } },
      select: REQUEST_SERIALIZATION_SELECT,
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
  } finally {
    endTimer(timer);
  }
}

export async function completeRequest(
  id: string,
  completedAt: Date,
  client?: PrismaClient
): Promise<SerializedRequest> {
  const timer = startTimer(`completeRequest id=${id}`);
  const prisma = getClient(client);

  try {
    const existing = await prisma.dataRequest.findUnique({
      where: { id },
      select: REQUEST_SERIALIZATION_SELECT,
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
          select: REQUEST_SERIALIZATION_SELECT,
        });

    invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${updated.projectId}`);

    const definition = updated.dataPointId
      ? await prisma.datasetFieldDefinition.findUnique({
          where: { fieldId: updated.dataPointId },
          select: { label: true, hint: true },
        })
      : null;

    return serializeRequestRecord(updated, definition);
  } finally {
    endTimer(timer);
  }
}

export async function revokeRequest(
  id: string,
  revokedAt: Date,
  client?: PrismaClient
): Promise<SerializedRequest> {
  const timer = startTimer(`revokeRequest id=${id}`);
  const prisma = getClient(client);

  try {
    const existing = await prisma.dataRequest.findUnique({
      where: { id },
      select: REQUEST_SERIALIZATION_SELECT,
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
          select: REQUEST_SERIALIZATION_SELECT,
        });

    invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${updated.projectId}`);

    const definition = updated.dataPointId
      ? await prisma.datasetFieldDefinition.findUnique({
          where: { fieldId: updated.dataPointId },
          select: { label: true, hint: true },
        })
      : null;

    return serializeRequestRecord(updated, definition);
  } finally {
    endTimer(timer);
  }
}

export async function completeRequestsBulk(
  ids: string[],
  completedAt: Date,
  client?: PrismaClient
): Promise<BulkStatusResult> {
  if (ids.length === 0) {
    const metadata = buildMutationMetadata(completedAt);
    return { updated: 0, requests: [], ...metadata };
  }

  const timer = startTimer(`completeRequestsBulk count=${ids.length}`);
  const prisma = getClient(client);

  try {
    const existing = await prisma.dataRequest.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        projectId: true,
        revokedAt: true,
        completedAt: true,
      },
    });

    if (existing.length !== ids.length) {
      const foundIds = new Set(existing.map((request) => request.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      throw new DataRequestServiceError(
        `Data request(s) not found: ${missing.join(', ')}`,
        404,
        'NOT_FOUND'
      );
    }

    const revoked = existing.filter((request) => request.revokedAt);
    if (revoked.length > 0) {
      throw new DataRequestServiceError(
        'Cannot complete revoked request(s)',
        409,
        'CONFLICT'
      );
    }

    const toUpdate = existing.filter((request) => !request.completedAt);

    if (toUpdate.length > 0) {
      await prisma.dataRequest.updateMany({
        where: {
          id: { in: toUpdate.map((request) => request.id) },
          revokedAt: null,
          completedAt: null,
        },
        data: { completedAt, revokedAt: null },
      });
    }

    const projectIds = new Set(existing.map((request) => request.projectId));
    projectIds.forEach((projectId) => {
      invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${projectId}`);
    });

    const serialized = await serializeRequests(ids, prisma);

    const metadata = buildMutationMetadata(completedAt);

    return {
      updated: toUpdate.length,
      requests: serialized,
      ...metadata,
    };
  } finally {
    endTimer(timer);
  }
}

export async function revokeRequestsBulk(
  ids: string[],
  revokedAt: Date,
  client?: PrismaClient
): Promise<BulkStatusResult> {
  if (ids.length === 0) {
    const metadata = buildMutationMetadata(revokedAt);
    return { updated: 0, requests: [], ...metadata };
  }

  const timer = startTimer(`revokeRequestsBulk count=${ids.length}`);
  const prisma = getClient(client);

  try {
    const existing = await prisma.dataRequest.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        projectId: true,
        completedAt: true,
        revokedAt: true,
      },
    });

    if (existing.length !== ids.length) {
      const foundIds = new Set(existing.map((request) => request.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      throw new DataRequestServiceError(
        `Data request(s) not found: ${missing.join(', ')}`,
        404,
        'NOT_FOUND'
      );
    }

    const completed = existing.filter((request) => request.completedAt);
    if (completed.length > 0) {
      throw new DataRequestServiceError(
        'Cannot revoke completed request(s)',
        409,
        'CONFLICT'
      );
    }

    const toUpdate = existing.filter((request) => !request.revokedAt);

    if (toUpdate.length > 0) {
      await prisma.dataRequest.updateMany({
        where: {
          id: { in: toUpdate.map((request) => request.id) },
          completedAt: null,
          revokedAt: null,
        },
        data: { revokedAt, completedAt: null },
      });
    }

    const projectIds = new Set(existing.map((request) => request.projectId));
    projectIds.forEach((projectId) => {
      invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${projectId}`);
    });

    const serialized = await serializeRequests(ids, prisma);

    const metadata = buildMutationMetadata(revokedAt);

    return {
      updated: toUpdate.length,
      requests: serialized,
      ...metadata,
    };
  } finally {
    endTimer(timer);
  }
}

export async function resendRequestsBulk(
  ids: string[],
  requestedAt: Date,
  client?: PrismaClient
): Promise<BulkStatusResult> {
  if (ids.length === 0) {
    const metadata = buildMutationMetadata(requestedAt);
    return { updated: 0, requests: [], ...metadata };
  }

  const timer = startTimer(`resendRequestsBulk count=${ids.length}`);
  const prisma = getClient(client);

  try {
    const existing = await prisma.dataRequest.findMany({
      where: { id: { in: ids } },
      include: { contact: true },
    });

    if (existing.length !== ids.length) {
      const foundIds = new Set(existing.map((request) => request.id));
      const missing = ids.filter((id) => !foundIds.has(id));
      throw new DataRequestServiceError(
        `Data request(s) not found: ${missing.join(', ')}`,
        404,
        'NOT_FOUND'
      );
    }

    const { count } = await prisma.dataRequest.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        requestedAt,
        completedAt: null,
        revokedAt: null,
      },
    });

    const projectIds = new Set(existing.map((request) => request.projectId));
    projectIds.forEach((projectId) => {
      invalidateByPrefix(`${DATA_REQUEST_CACHE_PREFIX}${projectId}`);
    });

    const serialized = await serializeRequests(ids, prisma);
    const metadata = buildMutationMetadata(requestedAt);

    return {
      updated: count,
      requests: serialized,
      ...metadata,
    };
  } finally {
    endTimer(timer);
  }
}

export function serializeRequestRecord(
  request: RequestForSerialization,
  definition?: { label: string | null; hint: string | null } | null
): SerializedRequest {
  const projectMeta = request.project
    ? {
        id: request.projectId,
        name: request.project.name ?? null,
        ownerName: request.project.createdBy?.name ?? null,
      }
    : {
        id: request.projectId,
        name: null,
        ownerName: null,
      };

  return {
    id: request.id,
    status: computeStatus(request),
    requestedAt: request.requestedAt.toISOString(),
    completedAt: request.completedAt?.toISOString() ?? null,
    revokedAt: request.revokedAt?.toISOString() ?? null,
    deadline: request.deadline?.toISOString() ?? null,
    project: projectMeta,
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
