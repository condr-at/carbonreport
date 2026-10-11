let pendingRefresh: Promise<Response> | null = null
let pendingLogout: Promise<Response> | null = null
let sessionEpoch = 0
let renewalBlocked = false

/** Share a single renewal between simultaneous requests; never expose HttpOnly tokens. */
export function refreshSession(): Promise<Response> {
  if (renewalBlocked) return Promise.resolve(Response.json({ code: 'UNAUTHORIZED' }, { status: 401 }))
  if (!pendingRefresh) {
    pendingRefresh = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include', cache: 'no-store' })
      .finally(() => { pendingRefresh = null })
  }
  return pendingRefresh.then(response => response.clone())
}

/** Finish renewal before clearing cookies so a late refresh cannot undo logout. */
export function logoutSession(): Promise<Response> {
  if (!pendingLogout) {
    renewalBlocked = true
    sessionEpoch++
    const renewal = pendingRefresh
    pendingLogout = (async () => {
      // Network failure must not prevent a subsequent attempt to clear cookies.
      await renewal?.catch(() => undefined)
      return fetch('/api/auth/logout', { method: 'POST', credentials: 'include', cache: 'no-store' })
    })().then(response => {
      if (!response.ok) renewalBlocked = false
      return response
    }).catch(error => {
      renewalBlocked = false
      throw error
    }).finally(() => { pendingLogout = null })
  }
  // Successful logout stays blocked until the caller performs a full navigation.
  // That also drops in-memory query data before another account can sign in.
  return pendingLogout.then(response => response.clone())
}

/** Retry only an authentication rejection, once, and only for our own non-auth APIs. */
export async function fetchWithSession(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const requestEpoch = sessionEpoch
  const retryInput = input instanceof Request ? input.clone() : input
  const response = await fetch(input, init)
  if (response.status !== 401 || typeof window === 'undefined' || init?.signal?.aborted) return response
  if (renewalBlocked || requestEpoch !== sessionEpoch) return response
  const url = new URL(input instanceof Request ? input.url : String(input), window.location.origin)
  if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/') || url.pathname.startsWith('/api/auth/')) return response
  const renewed = await refreshSession()
  if (renewalBlocked || requestEpoch !== sessionEpoch) return response
  if (renewed.status === 401) return response
  if (!renewed.ok) return renewed
  return fetch(retryInput, init)
}
