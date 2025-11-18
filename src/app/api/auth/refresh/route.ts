import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { verifyRefreshToken } from '@/lib/auth/jwt'
import { issueSessionTokens, serializeUser } from '@/lib/auth/service'
import { setAuthCookies } from '@/lib/auth/cookies'

export async function POST() {
  try {
    const cookieJar = await cookies()
    const refreshToken = cookieJar.get(AUTH_CONFIG.refreshTokenCookie)?.value

    if (!refreshToken) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Refresh token missing')
    }

    const payload = await verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || user.deletedAt) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User no longer exists')
    }

    const tokens = await issueSessionTokens(user)
    const response = NextResponse.json({
      user: serializeUser(user),
    })

    return setAuthCookies(response, tokens)
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to refresh session'))
  }
}
