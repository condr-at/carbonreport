import { cookies, headers } from 'next/headers'
import prisma from '@/lib/db'
import { ApiError, ensureApiError } from '@/lib/api-error'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { verifyAccessToken } from '@/lib/auth/jwt'

type UserRecord = NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>

type CurrentUserResolver = () => Promise<UserRecord>

let overrideResolver: CurrentUserResolver | null = null

function resetOverride() {
  overrideResolver = null
}

async function resolveUserIdFromContext() {
  try {
    const hdrs = await headers()
    const headerUserId = hdrs.get('x-user-id')
    if (headerUserId) {
      return headerUserId
    }
  } catch {
    // headers() throws during static generation when no request context exists
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_CONFIG.accessTokenCookie)?.value
    if (!token) {
      return null
    }

    const claims = await verifyAccessToken(token)
    return claims.sub
  } catch {
    return null
  }
}

async function defaultResolver(): Promise<UserRecord> {
  try {
    const userId = await resolveUserIdFromContext()

    if (!userId) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || user.deletedAt) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated')
    }

    return user
  } catch (error) {
    throw ensureApiError(error, 'Failed to resolve current user')
  }
}

export async function getCurrentUser() {
  if (overrideResolver) {
    return overrideResolver()
  }

  return defaultResolver()
}

export function __setCurrentUserResolver(resolver: CurrentUserResolver | null) {
  overrideResolver = resolver
}

export function __resetCurrentUserResolver() {
  resetOverride()
}
