import { randomUUID } from 'crypto'
import { ApiError } from '@/lib/api-error'
import { createAccessToken, createRefreshToken, createEmailVerificationToken, createPasswordResetToken } from './jwt'
import { hashContext } from './hash'
import { meetsPasswordPolicy } from './password'

type UserRecord = {
  id: string
  email: string
  name: string
  emailVerified: boolean
  passwordHash: string
}

export function serializeUser(user: Pick<UserRecord, 'id' | 'email' | 'name' | 'emailVerified'>) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    email_verified: user.emailVerified,
  }
}

export async function issueSessionTokens(user: Pick<UserRecord, 'id' | 'email' | 'emailVerified'>) {
  const sessionId = randomUUID()
  const basePayload = {
    sub: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    sessionId,
  }

  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken(basePayload),
    createRefreshToken(basePayload),
  ])

  return { accessToken, refreshToken }
}

export function assertPasswordMeetsPolicy(password: string) {
  if (!meetsPasswordPolicy(password)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Password does not meet requirements', {
      requirements: 'At least 8 characters, include uppercase, lowercase, and number',
    })
  }
}

export async function buildEmailVerificationToken(user: Pick<UserRecord, 'id' | 'email' | 'emailVerified'>) {
  const verificationHash = hashContext(`${user.id}:${user.email}:${user.emailVerified}`)
  return createEmailVerificationToken({
    sub: user.id,
    email: user.email,
    verificationHash,
  })
}

export async function buildPasswordResetToken(user: Pick<UserRecord, 'id' | 'passwordHash'>) {
  const resetContext = hashContext(`${user.id}:${user.passwordHash}`)
  return createPasswordResetToken({
    sub: user.id,
    resetContextHash: resetContext,
  })
}

export function validateVerificationContext(user: Pick<UserRecord, 'id' | 'email' | 'emailVerified'>, ctx: string) {
  const expected = hashContext(`${user.id}:${user.email}:${user.emailVerified}`)
  if (expected !== ctx) {
    throw new ApiError(400, 'INVALID_TOKEN', 'Verification token is no longer valid')
  }
}

export function validatePasswordResetContext(user: Pick<UserRecord, 'id' | 'passwordHash'>, ctx: string) {
  const expected = hashContext(`${user.id}:${user.passwordHash}`)
  if (expected !== ctx) {
    throw new ApiError(400, 'INVALID_TOKEN', 'Reset token is no longer valid')
  }
}
