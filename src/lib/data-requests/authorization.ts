import { OrganizationMembershipRole } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import { assertOrgMembership } from '@/lib/server-utils';
import { isApiError } from '@/lib/api-error';
import { DataRequestServiceError } from '@/lib/data-requests/service';

export async function assertCanMutateDataRequests(
  ids: string[],
  userId: string,
  client: PrismaClient,
) {
  if (ids.length === 0) {
    return;
  }

  const requests = await client.dataRequest.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      project: {
        select: {
          organizationId: true,
        },
      },
    },
  });

  if (requests.length !== ids.length) {
    const foundIds = new Set(requests.map((request) => request.id));
    const missing = ids.filter((id) => !foundIds.has(id));
    throw new DataRequestServiceError(
      `Data request(s) not found: ${missing.join(', ')}`,
      404,
      'NOT_FOUND',
    );
  }

  const organizationIds = Array.from(new Set(requests.map((request) => request.project.organizationId)));

  for (const organizationId of organizationIds) {
    try {
      await assertOrgMembership(userId, organizationId, OrganizationMembershipRole.EDITOR);
    } catch (error) {
      if (isApiError(error)) {
        throw new DataRequestServiceError(error.message, error.status, error.code);
      }

      throw error;
    }
  }
}

