const DURATION_PATTERN = /^(\d+)(ms|s|m|h|d)?$/i

function parseDurationMs(value: string | undefined, fallbackMs: number): number {
  if (!value) {
    return fallbackMs
  }

  const match = value.match(DURATION_PATTERN)
  if (!match) {
    return fallbackMs
  }

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) {
    return fallbackMs
  }

  const unit = (match[2] ?? 'ms').toLowerCase()

  switch (unit) {
    case 'ms':
      return amount
    case 's':
      return amount * 1_000
    case 'm':
      return amount * 60_000
    case 'h':
      return amount * 3_600_000
    case 'd':
      return amount * 86_400_000
    default:
      return fallbackMs
  }
}

export const AUTH_CONFIG = {
  issuer: 'carbon-report-platform',
  accessTokenTtlMs: parseDurationMs(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, 86_400_000), // 24h
  refreshTokenTtlMs: parseDurationMs(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN, 7_776_000_000), // 90d
  accessTokenCookie: 'cr_access_token',
  refreshTokenCookie: 'cr_refresh_token',
  cookieDomain: process.env.AUTH_COOKIE_DOMAIN,
}
