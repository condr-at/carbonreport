import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { verifyPasswordResetToken } from '@/lib/auth/jwt'
import { hashPassword, meetsPasswordPolicy } from '@/lib/auth/password'
import { validatePasswordResetContext } from '@/lib/auth/service'

const ResetSchema = z.object({
  password: z.string().min(8),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const payload = await request.json().catch(() => ({}))
    const parsed = ResetSchema.safeParse(payload)

    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Password is required', {
        issues: parsed.error.flatten(),
      })
    }

    if (!meetsPasswordPolicy(parsed.data.password)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Password does not meet requirements', {
        requirements: 'At least 8 characters, include uppercase, lowercase, and number',
      })
    }

    const { token } = await params
    const claims = await verifyPasswordResetToken(token)
    const user = await prisma.user.findUnique({ where: { id: claims.sub } })

    if (!user || user.deletedAt) {
      throw new ApiError(400, 'INVALID_TOKEN', 'Reset token is invalid')
    }

    if (!claims.ctx) {
      throw new ApiError(400, 'INVALID_TOKEN', 'Reset token is invalid')
    }

    validatePasswordResetContext(user, claims.ctx)

    const passwordHash = await hashPassword(parsed.data.password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
      },
    })

    return NextResponse.json({ message: 'Password has been reset' })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to reset password'))
  }
}
