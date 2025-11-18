'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        description: 'Request a new verification email below.',
        variant: 'error' as const,
      }
    case 'sent':
      return {
        title: 'Check your inbox',
        description: 'We sent you a link to verify your email address.',
        variant: 'info' as const,
      }
    default:
      return {
        title: 'Verify your email',
        description: 'We use email verification to keep your account secure.',
        variant: 'info' as const,
      }
  }
}

function VerifyEmailFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Checking verification status…</CardTitle>
          <CardDescription>This will just take a second.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const status = getStatusCopy(searchParams.get('status'))
  const [isLoading, setIsLoading] = useState(false)

  async function handleResend() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to resend verification email')
      }

      toast.success('Verification email sent')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend verification email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{status.title}</CardTitle>
          <CardDescription>{status.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm text-muted-foreground">
          <p>
            Open the email from <span className="text-foreground font-medium">Carbon Report</span> and click the
            verification link. This confirms you own the address you used to register.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleResend} disabled={isLoading}>
              {isLoading ? 'Sending…' : 'Resend email'}
            </Button>
            <Link href="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
