'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PublicPageFrame } from '@/components/layouts/public-page-frame'

function getStatusCopy(status: string | null) {
  switch (status) {
    case 'verified':
      return {
        title: 'Email verified',
        description: 'You can continue to your dashboard.',
        variant: 'success' as const,
      }
    case 'error':
      return {
        title: 'Link expired or invalid',
        description: 'Request a new verification email to confirm your address.',
        variant: 'error' as const,
      }
    case 'sent':
      return {
        title: 'Check your inbox',
        description: 'We sent you a link to verify your email address.',
        variant: 'info' as const,
      }
    case 'not_sent':
      return {
        title: 'Verification email not sent',
        description: 'We could not send your verification email. Please try again later.',
        variant: 'error' as const,
      }
    default:
      return {
        title: 'Verify your email',
        description: 'We use email verification to keep your account secure.',
        variant: 'info' as const,
      }
  }
}

export function VerifyEmailContent({ hasSession, emailVerified }: { hasSession: boolean; emailVerified: boolean }) {
  const searchParams = useSearchParams()
  const queryStatus = searchParams.get('status')
  const [statusOverride, setStatusOverride] = useState<string | null>(null)
  const statusParam = emailVerified ? 'verified' : statusOverride ?? (hasSession && queryStatus === 'verified' ? null : queryStatus)
  const status = getStatusCopy(statusParam)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isVerified = statusParam === 'verified'

  async function handleResend() {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(response.status === 401
          ? 'Please sign in again to request a verification email.'
          : 'We could not send the verification email. Please try again later.')
      }

      if (payload.status === 'already_verified') {
        setStatusOverride('verified')
        toast.success('Your email is already verified')
      } else if (payload.status === 'sent') {
        setStatusOverride('sent')
        toast.success('Verification email sent')
      } else {
        throw new Error('We could not confirm that the email was sent. Please try again later.')
      }
    } catch (error) {
      setStatusOverride('not_sent')
      setErrorMessage(error instanceof Error ? error.message : 'We could not send the verification email. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicPageFrame>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{status.title}</CardTitle>
          <CardDescription>{status.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-muted-foreground">
          {!isVerified && statusParam !== 'not_sent' && (
            <p>
              Open the email from <span className="text-foreground font-medium">Carbon Report</span> and click the
              verification link. This confirms you own the address you used to register.
            </p>
          )}
          {hasSession && !isVerified && <p>Your account is created and you are signed in. You can continue to your workspace and confirm your email when the message arrives.</p>}
          {!hasSession && !isVerified && <p>Sign in to request another verification email.</p>}
          {errorMessage && <p className="text-destructive" role="alert">{errorMessage}</p>}
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={hasSession ? '/dashboard' : '/login'}>{hasSession ? 'Continue to workspace' : 'Sign in'}</Link>
            </Button>
            {hasSession && !isVerified && <Button variant="outline" onClick={handleResend} disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? 'Sending…' : statusParam === 'not_sent' ? 'Try sending again' : 'Resend email'}
            </Button>}
          </div>
        </CardContent>
      </Card>
    </PublicPageFrame>
  )
}
