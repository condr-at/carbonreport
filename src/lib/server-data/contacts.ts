import prisma from '@/lib/db';
import type { ServerTimingTracker } from '@/lib/server-data/metrics';
import type { ContactOverview, ContactDetail } from '@/lib/contacts/types';
import { getAccessibleOrganizationIds } from './access';

interface ContactRequestStat {
  total: number;
  active: number;
  lastRequestedAt: number | null;
}

function mergeRequestStat(current?: ContactRequestStat): ContactRequestStat {
  return {
    total: current?.total ?? 0,
    active: current?.active ?? 0,
    lastRequestedAt: current?.lastRequestedAt ?? null,
  };
}

export async function getContactsOverview(tracker?: ServerTimingTracker): Promise<ContactOverview[]> {
  const organizationIds = await getAccessibleOrganizationIds();
  if (!organizationIds.length) return [];
  const stopContactsQuery = tracker?.start('db:contacts');
  const contacts = await prisma.contact.findMany({
    where: { archived: false, organizationId: { in: organizationIds } },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  stopContactsQuery?.();

  if (!contacts.length) {
    return [];
  }

  const contactIds = contacts.map((contact) => contact.id);

  const stopRequestsQuery = tracker?.start('db:contact-request-stats');
  const requests = await prisma.dataRequest.findMany({
    where: {
      contactId: { in: contactIds },
      project: { organizationId: { in: organizationIds }, deletedAt: null },
    },
    select: {
      contactId: true,
      requestedAt: true,
      completedAt: true,
      revokedAt: true,
    },
  });
  stopRequestsQuery?.();

  const stats = new Map<string, ContactRequestStat>();

  for (const request of requests) {
    const current = mergeRequestStat(stats.get(request.contactId));
    current.total += 1;
    if (!request.completedAt && !request.revokedAt) {
      current.active += 1;
    }
    const requestedAtMs = request.requestedAt?.getTime() ?? null;
    if (requestedAtMs && (!current.lastRequestedAt || requestedAtMs > current.lastRequestedAt)) {
      current.lastRequestedAt = requestedAtMs;
    }
    stats.set(request.contactId, current);
  }

  const stopTransform = tracker?.start('transform:contacts-overview');
  const overview = contacts.map((contact) => {
    const stat = stats.get(contact.id) ?? mergeRequestStat();

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      position: contact.position ?? null,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      activeRequests: stat.active,
      totalRequests: stat.total,
      lastRequestedAt: stat.lastRequestedAt ? new Date(stat.lastRequestedAt).toISOString() : null,
    } satisfies ContactOverview;
  });
  stopTransform?.();

  return overview;
}

export async function getContactDetail(
  contactId: string,
  tracker?: ServerTimingTracker
): Promise<ContactDetail | null> {
  const organizationIds = await getAccessibleOrganizationIds();
  if (!organizationIds.length) return null;
  const stopContactQuery = tracker?.start('db:contact-detail');
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, organizationId: { in: organizationIds } },
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
      archived: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  stopContactQuery?.();

  if (!contact) {
    return null;
  }

  const stopRequestsQuery = tracker?.start('db:contact-detail-stats');
  const requests = await prisma.dataRequest.findMany({
    where: { contactId, project: { organizationId: { in: organizationIds }, deletedAt: null } },
    select: {
      requestedAt: true,
      completedAt: true,
      revokedAt: true,
    },
  });
  stopRequestsQuery?.();

  const stat = requests.reduce<ContactRequestStat>((acc, request) => {
    const next = mergeRequestStat(acc);
    next.total += 1;
    if (!request.completedAt && !request.revokedAt) {
      next.active += 1;
    }
    const requestedAtMs = request.requestedAt?.getTime() ?? null;
    if (requestedAtMs && (!next.lastRequestedAt || requestedAtMs > next.lastRequestedAt)) {
      next.lastRequestedAt = requestedAtMs;
    }
    return next;
  }, mergeRequestStat());

  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    position: contact.position ?? null,
    archived: contact.archived,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
    activeRequests: stat.active,
    totalRequests: stat.total,
    lastRequestedAt: stat.lastRequestedAt ? new Date(stat.lastRequestedAt).toISOString() : null,
  };
}
