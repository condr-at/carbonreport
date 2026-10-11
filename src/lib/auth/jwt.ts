import { SignJWT, jwtVerify, errors, type JWTPayload } from 'jose'
import { AUTH_CONFIG } from './config'

const encoder = new TextEncoder()

function generateRandomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function getSecretKey() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return encoder.encode(secret)
}

export type TokenPurpose = 'access' | 'refresh' | 'email_verification' | 'password_reset'

export type AccessTokenPayload = {
  sub: string
  email: string
  emailVerified: boolean
  sessionId: string
  sessionContext: string
}

export type RefreshTokenPayload = AccessTokenPayload

export type VerificationTokenPayload = {
  sub: string
  email: string
  verificationHash: string
}

export type PasswordResetTokenPayload = {
  sub: string
  resetContextHash: string
}

type BaseClaims = JWTPayload & {
  sub: string
  purpose: TokenPurpose
  ctx?: string
  email?: string
  email_verified?: boolean
  sid?: string
}

async function signToken(claims: BaseClaims, expiresInMs: number) {
  const secret = getSecretKey()
  const issuedAtSeconds = Math.floor(Date.now() / 1000)
  const expiresAtSeconds = Math.floor((Date.now() + expiresInMs) / 1000)

  return new SignJWT({
    ...claims,
    jti: claims.jti ?? generateRandomId(),
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(AUTH_CONFIG.issuer)
    .setSubject(claims.sub)
    .setIssuedAt(issuedAtSeconds)
    .setExpirationTime(expiresAtSeconds)
    .setAudience('carbon-report-users')
    .sign(secret)
}

export async function createAccessToken(payload: AccessTokenPayload) {
  return signToken(
    {
      sub: payload.sub,
      purpose: 'access',
      email: payload.email,
      email_verified: payload.emailVerified,
      sid: payload.sessionId,
      ctx: payload.sessionContext,
    },
    AUTH_CONFIG.accessTokenTtlMs,
  )
}

export async function createRefreshToken(payload: RefreshTokenPayload) {
  return signToken(
    {
      sub: payload.sub,
      purpose: 'refresh',
      email: payload.email,
      email_verified: payload.emailVerified,
      sid: payload.sessionId,
      ctx: payload.sessionContext,
    },
    AUTH_CONFIG.refreshTokenTtlMs,
  )
}

export async function createEmailVerificationToken(payload: VerificationTokenPayload) {
  return signToken(
    {
      sub: payload.sub,
      purpose: 'email_verification',
      email: payload.email,
      ctx: payload.verificationHash,
    },
    AUTH_CONFIG.accessTokenTtlMs,
  )
}

export async function createPasswordResetToken(payload: PasswordResetTokenPayload) {
  return signToken(
    {
      sub: payload.sub,
      purpose: 'password_reset',
      ctx: payload.resetContextHash,
    },
    AUTH_CONFIG.accessTokenTtlMs,
  )
}

export class InvalidAuthTokenError extends Error {
  constructor() {
    super('Token is invalid or expired')
    this.name = 'InvalidAuthTokenError'
  }
}

async function verifyToken(token: string, expectedPurpose: TokenPurpose) {
  const secret = getSecretKey()
  try {
    const { payload } = await jwtVerify<BaseClaims>(token, secret, {
      issuer: AUTH_CONFIG.issuer,
      audience: 'carbon-report-users',
      algorithms: ['HS256'],
      requiredClaims: ['sub', 'exp', 'iat'],
      clockTolerance: 15,
    })

    if (payload.purpose !== expectedPurpose || typeof payload.sub !== 'string' || !payload.sub ||
      typeof payload.ctx !== 'string' || !payload.ctx) {
      throw new InvalidAuthTokenError()
    }

    return payload
  } catch (error) {
    if (error instanceof errors.JOSEError) throw new InvalidAuthTokenError()
    throw error
  }
}

export async function verifyAccessToken(token: string) {
  return verifyToken(token, 'access')
}

export async function verifyRefreshToken(token: string) {
  return verifyToken(token, 'refresh')
}

export async function verifyEmailVerificationToken(token: string) {
  return verifyToken(token, 'email_verification')
}

export async function verifyPasswordResetToken(token: string) {
  return verifyToken(token, 'password_reset')
}

