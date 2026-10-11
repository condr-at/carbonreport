import { OrganizationMembershipInviteStatus, OrganizationStatus } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'

/** Resolve scope on the server for both page hydration and API reads. */
export async function getAccessibleOrganizationIds(): Promise<string[]> {
  const user = await getCurrentUser()
  const memberships = await prisma.organizationMembership.findMany({
    where: {
      userId: user.id,
      inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
      organization: { status: { not: OrganizationStatus.DELETED } },
    },
    select: { organizationId: true },
  })
  return memberships.map((membership) => membership.organizationId)
}
