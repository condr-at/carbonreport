import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, getOrganizationUsage, getPlan } from '@/lib/server-utils'
import { ensureUsageSnapshotFresh } from '@/lib/organizations/usage-scheduler'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    await assertOrgMembership(user.id, organizationId)

    await ensureUsageSnapshotFresh(organizationId)

    const [plan, usage, snapshots] = await Promise.all([
      getPlan(organizationId),
      getOrganizationUsage(organizationId),
      prisma.organizationUsageSnapshot
        .findMany({
          where: { organizationId },
          orderBy: { computedAt: 'desc' },
          take: 7,
          select: {
            computedAt: true,
            activeProjects: true,
            activeEditors: true,
            activeVerifiers: true,
            activeViewers: true,
          },
        })
        .then((rows) => rows.reverse()),
    ])

    return NextResponse.json({
      organization_id: plan.organizationId,
      usage,
      limits: {
        max_active_projects: plan.maxActiveProjects,
        max_editors: plan.maxEditors,
        max_verifiers: plan.maxVerifiers,
        max_viewers: plan.maxViewers,
      },
      plan_valid_until: plan.validUntil,
      snapshots: snapshots.map((snapshot) => ({
        computed_at: snapshot.computedAt.toISOString(),
        active_projects: snapshot.activeProjects,
        active_editors: snapshot.activeEditors,
        active_verifiers: snapshot.activeVerifiers,
        active_viewers: snapshot.activeViewers,
      })),
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to load organization usage'))
  }
}
