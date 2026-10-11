import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { isApiError } from '@/lib/api-error'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicPageFrame } from '@/components/layouts/public-page-frame'
import { VerifyEmailContent } from './verify-email-content'

export const dynamic = 'force-dynamic'

export default async function VerifyEmailPage() {
  let hasSession = false
  let emailVerified = false
  try {
    const user = await getCurrentUser()
    hasSession = true
    emailVerified = user.emailVerified
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) throw error
  }

  return (
    <Suspense fallback={
      <PublicPageFrame>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Checking verification status…</CardTitle>
            <CardDescription>This will just take a second.</CardDescription>
          </CardHeader>
        </Card>
      </PublicPageFrame>
    }>
      <VerifyEmailContent hasSession={hasSession} emailVerified={emailVerified} />
    </Suspense>
  )
}
