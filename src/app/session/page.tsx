'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PublicPageFrame } from '@/components/layouts/public-page-frame'
import { safeAuthRedirect } from '@/lib/auth-redirect'
import { refreshSession } from '@/lib/session-client'

function RestoreSession() {
  const router = useRouter()
  const params = useSearchParams()
  const destination = safeAuthRedirect(params.get('redirect'))
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    setFailed(false)
    refreshSession().then(response => {
      if (!active) return
      if (response.ok) {
        router.replace(destination)
        router.refresh()
      } else if (response.status === 401) {
        router.replace(`/login?${new URLSearchParams({ redirect: destination, reason: 'session_expired' })}`)
      } else {
        setFailed(true)
      }
    }).catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [attempt, destination, router])

  return <PublicPageFrame><Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>{failed ? 'Could not restore your session' : 'Restoring your session…'}</CardTitle>
      <CardDescription>{failed ? 'The service could not be reached. Try again to return to your work.' : 'You will return to the page you were using.'}</CardDescription>
    </CardHeader>
    {failed && <CardContent><Button onClick={() => setAttempt(value => value + 1)}>Try again</Button></CardContent>}
  </Card></PublicPageFrame>
}

export default function SessionPage() {
  return <Suspense fallback={<PublicPageFrame><p>Restoring your session…</p></PublicPageFrame>}><RestoreSession /></Suspense>
}
