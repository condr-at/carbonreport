import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { buildEmailVerificationToken } from '@/lib/auth/service'
import { getBaseUrl } from '@/lib/server-utils'
import { sendVerificationEmail } from '@/lib/auth/email'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'

export async function POST() {
  try {
    const user = await getCurrentUser()

    if (user.emailVerified) {
      return NextResponse.json({ status: 'already_verified' })
    }

    const token = await buildEmailVerificationToken(user)
    const baseUrl = await getBaseUrl()
    const link = `${baseUrl.replace(/\/$/, '')}/api/auth/verify-email/${token}`
    const delivery = await sendVerificationEmail({ to: user.email, name: user.name, link })
    if (delivery.status !== 'sent') {
      throw new ApiError(503, 'SERVICE_UNAVAILABLE', 'We could not send the verification email. Please try again later.')
    }

    return NextResponse.json({ status: 'sent' })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to resend verification email'))
  }
}
