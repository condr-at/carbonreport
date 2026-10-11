'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PublicPageFrame } from '@/components/layouts/public-page-frame'

function ResetPasswordFallback() {
  return (
    <PublicPageFrame>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading reset form…</CardTitle>
          <CardDescription>Just a moment while we verify your reset link.</CardDescription>
        </CardHeader>
      </Card>
    </PublicPageFrame>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [invalidLink, setInvalidLink] = useState(false)

  if (!token) {
    return (
      <PublicPageFrame>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset link required</CardTitle>
            <CardDescription>Use the link in your email to choose a new password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>The reset link in your inbox includes a security token. Please open that link again.</p>
            <div className="text-center">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Request a new link
              </Link>
            </div>
          </CardContent>
        </Card>
      </PublicPageFrame>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setInvalidLink(false)

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/reset-password/${encodeURIComponent(token ?? '')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (payload.code === 'INVALID_TOKEN') setInvalidLink(true)
        throw new Error(payload.error ?? 'Unable to reset password')
      }

      toast.success('Password updated. You are now signed in.')
      router.replace('/dashboard')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reset password'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicPageFrame>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>Your new password must meet the security requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
            {invalidLink && <Link href="/forgot-password" className="block text-sm text-primary hover:underline">Request a new reset link</Link>}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">
                At least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PublicPageFrame>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
