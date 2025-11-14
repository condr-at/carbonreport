import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ProjectStatus } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { changeProjectStatus } from '@/lib/projects/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

const UpdateStatusSchema = z.object({
  status: z.enum(['active', 'archived', 'reported']),
})

const STATUS_LOOKUP: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  archived: ProjectStatus.ARCHIVED,
  reported: ProjectStatus.REPORTED,
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const parsed = UpdateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid status update payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const targetStatus = STATUS_LOOKUP[parsed.data.status]
    const result = await changeProjectStatus({
      projectId: id,
      userId: user.id,
      targetStatus,
    })

    return NextResponse.json(result)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to update project status'))
  }
}
