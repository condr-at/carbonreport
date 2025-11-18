import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { verifyPassword } from '@/lib/auth/password'
import { issueSessionTokens, serializeUser } from '@/lib/auth/service'
import { setAuthCookies } from '@/lib/auth/cookies'

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))
    const parsed = LoginSchema.safeParse(payload)

    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid login payload', {
        issues: parsed.error.flatten(),
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        email: parsed.data.email.toLowerCase(),
        deletedAt: null,
      },
    })

    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password')
    }

    const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash)

    if (!passwordOk) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password')
    }

    const tokens = await issueSessionTokens(user)
    const response = NextResponse.json({
      user: serializeUser(user),
    })

    return setAuthCookies(response, tokens)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to login'))
  }
}
