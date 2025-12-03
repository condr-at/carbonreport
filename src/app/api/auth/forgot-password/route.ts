import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { buildPasswordResetToken } from '@/lib/auth/service'
import { sendPasswordResetEmail } from '@/lib/auth/email'
import { getBaseUrl } from '@/lib/server-utils'

const ForgotSchema = z.object({
  email: z.string().trim().email(),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))
    const parsed = ForgotSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json({ message: 'If the email exists, you will receive a reset link shortly.' })
    }

    const user = await prisma.user.findFirst({
      where: {
        email: parsed.data.email.toLowerCase(),
        deletedAt: null,
      },
    })

    if (user) {
      const token = await buildPasswordResetToken(user)
      const baseUrl = await getBaseUrl()
      const resetLink = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`
      await sendPasswordResetEmail({ to: user.email, link: resetLink })
    }

    return NextResponse.json({ message: 'If the email exists, you will receive a reset link shortly.' })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to process reset request'))
  }
}
