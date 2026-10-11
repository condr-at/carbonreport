import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { InvalidAuthTokenError, verifyPasswordResetToken } from '@/lib/auth/jwt'
import { hashPassword, meetsPasswordPolicy } from '@/lib/auth/password'
import { issueSessionTokens, validatePasswordResetContext } from '@/lib/auth/service'
import { setAuthCookies } from '@/lib/auth/cookies'

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

    // Compare-and-swap consumes the password-bound token atomically. Two
    // concurrent requests may validate the same snapshot, but only one writes.
    const updated = await prisma.user.updateMany({
      where: { id: user.id, passwordHash: user.passwordHash, deletedAt: null },
      data: {
        passwordHash,
      },
    })

    if (updated.count !== 1) {
      throw new ApiError(400, 'INVALID_TOKEN', 'Reset token is no longer valid')
    }

    const tokens = await issueSessionTokens({ ...user, passwordHash })
    return setAuthCookies(NextResponse.json({ message: 'Password has been reset' }), tokens)
  } catch (error) {
    if (error instanceof InvalidAuthTokenError) {
      return errorResponse(new ApiError(400, 'INVALID_TOKEN', 'Reset token is invalid or expired'))
    }
    return errorResponse(ensureApiError(error, 'Failed to reset password'))
  }
}
