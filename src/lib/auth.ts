import prisma from '@/lib/db'
import { ApiError, ensureApiError } from '@/lib/api-error'

type UserRecord = NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>

type CurrentUserResolver = () => Promise<UserRecord>

let overrideResolver: CurrentUserResolver | null = null

function resetOverride() {
  overrideResolver = null
}

async function defaultResolver(): Promise<UserRecord> {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
    })

    if (!user) {
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
