import { NextRequest, NextResponse } from 'next/server'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import { restoreOrganization } from '@/lib/organizations/restore'
import { scheduleUsageRecompute } from '@/lib/organizations/usage-scheduler'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    const result = await restoreOrganization({
      organizationId,
      userId: user.id,
    })

    await scheduleUsageRecompute(organizationId, { reason: 'organization_restored' })

    return NextResponse.json(result)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to restore organization'))
  }
}