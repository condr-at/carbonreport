import { ApiError, errorResponse } from '@/lib/api-error'

export async function POST() {
  return errorResponse(
    new ApiError(501, 'NOT_IMPLEMENTED', 'Password change flow is not yet available', {
      status: 'not_implemented',
    }),
  )
}
