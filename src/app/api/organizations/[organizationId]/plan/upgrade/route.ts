import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership } from '@/lib/server-utils'
import { OrganizationMembershipRole } from '@prisma/client'

const RequestSchema = z.object({
  target_plan_code: z.string().trim().min(1),
  contact_email: z.string().email().optional(),
  notes: z.string().trim().max(2000).optional(),
})

function formatTicketReference(organizationId: string) {
  const now = new Date()
  const isoDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  return `UPG-${isoDate}-${organizationId.slice(0, 6).toUpperCase()}`
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

  await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.ADMIN)

    const payload = await request.json().catch(() => ({}))
    const parsed = RequestSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid upgrade request payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const { target_plan_code: targetPlanCode, contact_email: contactEmail, notes } = parsed.data

    const plan = await prisma.planDefinition.findUnique({
      where: { planCode: targetPlanCode },
      select: { planCode: true },
    })

    if (!plan) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Unsupported target plan code', {
        target_plan_code: targetPlanCode,
      })
    }

    const ticketReference = formatTicketReference(organizationId)

    console.info('Plan upgrade requested', {
      organizationId,
      requestedByUserId: user.id,
      targetPlanCode,
      contactEmail,
      notes,
      ticketReference,
    })

    return NextResponse.json(
      {
        status: 'not_implemented',
        message: 'Upgrade flow is handled manually during beta.',
        ticket_reference: ticketReference,
      },
      { status: 501 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to submit upgrade request'))
  }
}
