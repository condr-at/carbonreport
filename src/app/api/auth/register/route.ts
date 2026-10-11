import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { hashPassword } from '@/lib/auth/password'
import {
  assertPasswordMeetsPolicy,
  issueSessionTokens,
  serializeUser,
  buildEmailVerificationToken,
} from '@/lib/auth/service'
import { setAuthCookies } from '@/lib/auth/cookies'
import { getBaseUrl } from '@/lib/server-utils'
import { sendVerificationEmail } from '@/lib/auth/email'

const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))
    const parsed = RegisterSchema.safeParse(payload)

    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid registration payload', {
        issues: parsed.error.flatten(),
      })
    }

    assertPasswordMeetsPolicy(parsed.data.password)

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    })

    if (existingUser) {
      throw new ApiError(409, 'CONFLICT', 'User with this email already exists')
    }

    const passwordHash = await hashPassword(parsed.data.password)
    const name = parsed.data.name.trim()
    const [firstName, ...rest] = name.split(' ')
    const lastName = rest.join(' ') || null

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        name,
        firstName,
        lastName,
        passwordHash,
      },
    })

    const tokens = await issueSessionTokens(user)
    let verificationEmailStatus: 'sent' | 'not_sent' = 'not_sent'
    try {
      const verificationToken = await buildEmailVerificationToken(user)
      const baseUrl = await getBaseUrl()
      const verifyLink = `${baseUrl.replace(/\/$/, '')}/api/auth/verify-email/${verificationToken}`
      const delivery = await sendVerificationEmail({ to: user.email, name: user.name, link: verifyLink })
      verificationEmailStatus = delivery.status
    } catch {
      // Account creation succeeded. A mail-preparation failure must not turn it
      // into a failed registration that traps the user behind a duplicate email.
      console.warn('Verification email could not be prepared after registration')
    }

    const response = NextResponse.json(
      {
        user: serializeUser(user),
        verification_email: { status: verificationEmailStatus },
      },
      { status: 201 },
    )

    return setAuthCookies(response, tokens)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to register user'))
  }
}
