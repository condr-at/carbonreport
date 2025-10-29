import { headers } from 'next/headers'

/**
 * Resolve absolute base URL for server-side data fetching.
 * Prefers request headers to support non-default ports (e.g. Turbopack using 3001).
 */
export async function getBaseUrl(): Promise<string> {
  try {
    const hdrs = await headers()
    const forwardedProto = hdrs.get('x-forwarded-proto')
    const forwardedHost = hdrs.get('x-forwarded-host')
    const host = forwardedHost ?? hdrs.get('host')

    if (host) {
      const protocol = forwardedProto ?? (host.startsWith('localhost') ? 'http' : 'https')
      return `${protocol}://${host}`
    }
  } catch {
    // headers() throws when used outside a request context (e.g. during build-time evaluation).
    // Fall back to environment-driven heuristics in those situations.
  }

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const explicitAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || null

  if (explicitAppUrl) {
    return explicitAppUrl
  }

  if (vercelUrl) {
    return vercelUrl
  }

  const port = process.env.PORT || '3000'
  return `http://localhost:${port}`
}
