import { NextResponse } from 'next/server'

export type ApiErrorCode =
  | 'PLAN_LIMIT_EXCEEDED'
  | 'SEAT_LIMIT_EXCEEDED'
  | 'RETENTION_EXPIRED'
  | 'VERSION_CONFLICT'
  | 'VALIDATION_ERROR'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'NOT_IMPLEMENTED'
  | 'UPGRADE_NOT_IMPLEMENTED'
  | 'CONFLICT'
  | 'INVALID_TOKEN'
  | 'UNAUTHORIZED'
  | 'PRECONDITION_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'UPLOAD_RELAY_FAILED'

export type ApiErrorDetails = Record<string, unknown> | undefined

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly details?: ApiErrorDetails

  constructor(status: number, code: ApiErrorCode, message: string, details?: ApiErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toErrorBody(error: ApiError) {
  const payload: Record<string, unknown> = {
    error: error.message,
    code: error.code,
  }

  if (error.details && Object.keys(error.details).length > 0) {
    payload.details = error.details
  }

  return payload
}

export function errorResponse(error: ApiError) {
  return NextResponse.json(toErrorBody(error), { status: error.status })
}

export function ensureApiError(error: unknown, fallbackMessage = 'Internal server error'): ApiError {
  if (isApiError(error)) {
    return error
  }

  return new ApiError(500, 'INTERNAL_ERROR', fallbackMessage)
}
