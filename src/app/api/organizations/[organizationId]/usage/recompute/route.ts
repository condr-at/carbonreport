import { NextRequest, NextResponse } from 'next/server'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import { recomputeUsageSnapshot } from '@/lib/organizations/restore'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    const result = await recomputeUsageSnapshot({
      organizationId,
      userId: user.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to recompute organization usage'))
  }
}