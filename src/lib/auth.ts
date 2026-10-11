import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { ApiError, ensureApiError } from '@/lib/api-error'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { InvalidAuthTokenError, verifyAccessToken } from '@/lib/auth/jwt'
import { validateSessionContext } from '@/lib/auth/service'

type UserRecord = NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>

type CurrentUserResolver = () => Promise<UserRecord>

let overrideResolver: CurrentUserResolver | null = null

function resetOverride() {
  overrideResolver = null
}

async function resolveAccessTokenFromContext() {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(AUTH_CONFIG.accessTokenCookie)?.value
  } catch {
    // cookies() throws during static generation without a request context.
    return null
  }
}

export async function getUserForAccessToken(token: string | null | undefined): Promise<UserRecord> {
  try {
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated')
    }

    const claims = await verifyAccessToken(token)
    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
    })

    if (!user || user.deletedAt) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated')
    }

    validateSessionContext(user, claims.ctx)
    return user
  } catch (error) {
    if (error instanceof InvalidAuthTokenError) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Session is invalid or expired')
    }
    throw ensureApiError(error, 'Failed to resolve current user')
  }
}

export async function getCurrentUser() {
  if (overrideResolver) {
    return overrideResolver()
  }

  return getUserForAccessToken(await resolveAccessTokenFromContext())
}

export async function requirePageUser() {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/login')
    throw error
  }
}

export function __setCurrentUserResolver(resolver: CurrentUserResolver | null) {
  overrideResolver = resolver
}

export function __resetCurrentUserResolver() {
  resetOverride()
}
