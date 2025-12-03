import prisma from '@/lib/db'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const plans = await prisma.planDefinition.findMany({
      orderBy: { maxActiveProjects: 'asc' },
    })

    return NextResponse.json({
      plans: plans.map((plan) => ({
        code: plan.planCode,
        label: plan.label,
        description: plan.description,
        limits: {
          max_active_projects: plan.maxActiveProjects,
          max_editors: plan.maxEditors,
          max_verifiers: plan.maxVerifiers,
          max_viewers: plan.maxViewers,
        },
        created_at: plan.createdAt,
        updated_at: plan.updatedAt,
      })),
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to load plan definitions'))
  }
}
