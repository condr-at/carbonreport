/** Login/session destinations must remain inside the app and cannot loop through auth. */
export function safeAuthRedirect(value: string | null | undefined): string {
  const fallback = '/dashboard'
  if (!value?.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return fallback
  try {
    const url = new URL(value, 'https://carbonreport.invalid')
    const pathname = decodeURIComponent(url.pathname)
    if (url.origin !== 'https://carbonreport.invalid' || pathname.startsWith('//') || pathname.includes('\\') ||
        /^\/(?:api|session|login|register)(?:\/|$)/.test(pathname)) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
