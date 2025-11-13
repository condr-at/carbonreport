import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, getOrganizationUsage, getPlan } from '@/lib/server-utils'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    await assertOrgMembership(user.id, organizationId)

    const [plan, usage] = await Promise.all([
      getPlan(organizationId),
      getOrganizationUsage(organizationId),
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
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to load organization usage'))
  }
}
