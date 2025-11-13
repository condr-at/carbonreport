import prisma from '@/lib/db'
import { ApiError, ensureApiError } from '@/lib/api-error'

export async function getCurrentUser() {
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
