import prisma from '@/lib/db';
import { computeStatus } from '@/lib/data-requests/service';
import type { ServerTimingTracker } from '@/lib/server-data/metrics';
import type { GlobalRequestFilters } from '@/lib/data-requests/filters';
import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { Prisma } from '@prisma/client';

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function resolveStatusWhere(status: GlobalRequestFilters['status']) {
  if (!status || status === 'all') {
    return {};
  }

  if (status === 'pending') {
    return {
      completedAt: null,
      revokedAt: null,
    };
  }

  if (status === 'completed') {
    return {
      completedAt: {
        not: null,
      },
    };
  }

  return {
    revokedAt: {
      not: null,
    },
  };
}

function resolveDeadlineWhere(deadline: GlobalRequestFilters['deadline']) {
  if (!deadline || deadline === 'all') {
    return {};
  }

  const now = new Date();

  if (deadline === 'due-soon') {
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return {
      deadline: {
        gte: now,
        lte: soon,
      },
      completedAt: null,
      revokedAt: null,
    };
  }

  if (deadline === 'overdue') {
    return {
      deadline: {
        lt: now,
      },
      completedAt: null,
      revokedAt: null,
    };
  }

  return {
    deadline: null,
  };
}

export async function getGlobalDataRequests(
  filters: GlobalRequestFilters,
  tracker?: ServerTimingTracker
): Promise<DataRequestSummary[]> {
  const where: Prisma.DataRequestWhereInput = {
    ...(filters.projectId ? { projectId: filters.projectId } : {}),
    ...(filters.contactId ? { contactId: filters.contactId } : {}),
  };

  Object.assign(where, resolveStatusWhere(filters.status));
  Object.assign(where, resolveDeadlineWhere(filters.deadline));

  const stopRequestsQuery = tracker?.start('db:global-data-requests');
  const requests = await prisma.dataRequest.findMany({
    where,
    orderBy: [{ requestedAt: 'desc' }],
    select: {
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
          user: {
            select: { name: true },
          },
        },
      },
    },
  });
  stopRequestsQuery?.();

  if (!requests.length) {
    return [];
  }

  const fieldIds = Array.from(
    new Set(requests.map((request) => request.dataPointId).filter((value): value is string => Boolean(value)))
  );

  const stopDefinitionsQuery = tracker?.start('db:global-data-request-fields');
  const definitions = fieldIds.length
    ? await prisma.datasetFieldDefinition.findMany({
        where: { fieldId: { in: fieldIds } },
        select: { fieldId: true, label: true, hint: true },
      })
    : [];
  stopDefinitionsQuery?.();

  const fieldMeta = new Map(definitions.map((definition) => [definition.fieldId, definition]));

  const stopTransform = tracker?.start('transform:global-data-requests');
  const summaries: DataRequestSummary[] = requests.map((request) => {
    const definition = request.dataPointId ? fieldMeta.get(request.dataPointId) : null;

    return {
      id: request.id,
      status: computeStatus(request),
      requestedAt: request.requestedAt.toISOString(),
      completedAt: iso(request.completedAt),
      revokedAt: iso(request.revokedAt),
      deadline: iso(request.deadline),
      project: {
        id: request.project?.id ?? request.projectId,
        name: request.project?.name ?? null,
        ownerName: request.project?.user?.name ?? null,
      },
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
    } satisfies DataRequestSummary;
  });
  stopTransform?.();

  return summaries;
}

export async function getProjectsForRequests(tracker?: ServerTimingTracker): Promise<Array<{ id: string; name: string }>> {
  const stopProjectsQuery = tracker?.start('db:request-projects');
  const projects = await prisma.project.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
    },
  });
  stopProjectsQuery?.();

  return projects.map((project) => ({ id: project.id, name: project.name }));
}
