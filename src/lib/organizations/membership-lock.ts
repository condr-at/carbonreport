import { Prisma } from '@prisma/client'
import prisma from '@/lib/db'

/** Serialize seat-changing mutations per organization, including mixed accept/role changes. */
export function withOrganizationMembershipLock<T>(
  organizationId: string,
  mutate: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM organizations WHERE id = ${organizationId} FOR UPDATE`
    return mutate(tx)
  }, {
    // The count after acquiring a contended lock must see the previous writer's commit.
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  })
}
