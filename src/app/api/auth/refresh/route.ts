import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { InvalidAuthTokenError, verifyRefreshToken } from '@/lib/auth/jwt'
import { issueSessionTokens, serializeUser, validateSessionContext } from '@/lib/auth/service'
import { clearAuthCookies, setAuthCookies } from '@/lib/auth/cookies'

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

    validateSessionContext(user, payload.ctx)
    const tokens = await issueSessionTokens(user)
    const response = NextResponse.json({
      user: serializeUser(user),
    })

    return setAuthCookies(response, tokens)
  } catch (error) {
    const apiError = error instanceof InvalidAuthTokenError
      ? new ApiError(401, 'UNAUTHORIZED', 'Refresh token is invalid or expired')
      : ensureApiError(error, 'Failed to refresh session')
    const response = errorResponse(apiError)
    return apiError.status === 401 ? clearAuthCookies(response) : response
  }
}
