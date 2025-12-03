import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { restoreProject } from '@/lib/projects/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id } = await params
    const result = await restoreProject({ projectId: id, userId: user.id })

    return NextResponse.json(result)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to restore project'))
  }
}
