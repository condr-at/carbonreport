'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { PublicPageFrame } from '@/components/layouts/public-page-frame'
import { safeAuthRedirect } from '@/lib/auth-redirect'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeAuthRedirect(searchParams.get('redirect'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = (() => {
    if (!email) return 'Email is required'
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) return 'Enter a valid email address'
    return ''
  })()

  const passwordError = (() => {
    if (!password) return 'Password is required'
    return ''
  })()

  const canSubmit = !emailError && !passwordError

  function markTouched(field: keyof typeof touched) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    markTouched('email')
    markTouched('password')

    if (!canSubmit) {
      toast.error('Please fix the highlighted fields')
      return
    }
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to sign in')
      }

      toast.success('Welcome back!')
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PublicPageFrame>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your Carbon Report workspace</CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams.get('reason') === 'session_expired' && <p className="mb-5 text-sm text-muted-foreground" role="status">Your session has expired. Sign in again to continue.</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  markTouched('email')
                }}
                onBlur={() => markTouched('email')}
                placeholder="you@example.com"
                aria-invalid={touched.email && Boolean(emailError)}
                aria-describedby={touched.email && emailError ? 'login-email-error' : undefined}
              />
              {touched.email && emailError ? (
                <p id="login-email-error" className="text-sm text-destructive" role="alert">
                  {emailError}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  markTouched('password')
                }}
                onBlur={() => markTouched('password')}
                placeholder="••••••••"
                aria-invalid={touched.password && Boolean(passwordError)}
                aria-describedby={touched.password && passwordError ? 'login-password-error' : undefined}
              />
              {touched.password && passwordError ? (
                <p id="login-password-error" className="text-sm text-destructive" role="alert">
                  {passwordError}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !canSubmit} aria-busy={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </PublicPageFrame>
  )
}
