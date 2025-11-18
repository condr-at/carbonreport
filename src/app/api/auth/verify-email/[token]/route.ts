import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { verifyEmailVerificationToken } from '@/lib/auth/jwt'
import { validateVerificationContext } from '@/lib/auth/service'

function wantsJson(request: Request) {
  const accept = request.headers.get('accept') ?? ''
  return accept.includes('application/json')
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params
    const claims = await verifyEmailVerificationToken(token)
    const user = await prisma.user.findUnique({ where: { id: claims.sub } })

    if (!user || user.deletedAt) {
      throw new ApiError(400, 'INVALID_TOKEN', 'Verification token is invalid')
    }

    if (!claims.ctx) {
      throw new ApiError(400, 'INVALID_TOKEN', 'Verification token is invalid')
    }

    validateVerificationContext(user, claims.ctx)

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      })
    }

    if (wantsJson(request)) {
      return NextResponse.json({ status: 'verified' })
    }

    const url = new URL(request.url)
    url.pathname = '/verify-email'
    url.searchParams.set('status', 'verified')
    return NextResponse.redirect(url)
  } catch (error) {
    if (wantsJson(request)) {
      return errorResponse(ensureApiError(error, 'Failed to verify email'))
    }

    const url = new URL(request.url)
    url.pathname = '/verify-email'
    url.searchParams.set('status', 'error')
    return NextResponse.redirect(url)
  }
}
