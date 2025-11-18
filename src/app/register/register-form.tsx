'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { id: 'upper', label: 'An uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lower', label: 'A lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', label: 'A number', test: (value: string) => /\d/.test(value) },
  { id: 'symbol', label: 'A special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  function markTouched(field: keyof typeof touched) {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
  }

  function updateField(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      markTouched(field)
    }
  }

  const errors = {
    name: (() => {
      if (!form.name.trim()) return 'Full name is required'
      if (form.name.trim().length < 2) return 'Enter your full name'
      return ''
    })(),
    email: (() => {
      if (!form.email) return 'Work email is required'
      if (!emailPattern.test(form.email)) return 'Enter a valid email address'
      return ''
    })(),
    password: (() => {
      if (!form.password) return 'Password is required'
      const allMet = passwordRequirements.every((requirement) => requirement.test(form.password))
      return allMet ? '' : 'Password does not meet all requirements'
    })(),
    confirmPassword: (() => {
      if (!form.confirmPassword) return 'Confirm your password'
      if (form.password && form.confirmPassword !== form.password) return 'Passwords do not match'
      return ''
    })(),
  }

  const isFormValid = Object.values(errors).every((error) => !error)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    Object.keys(touched).forEach((key) => markTouched(key as keyof typeof touched))

    if (!isFormValid) {
      toast.error('Please fix the highlighted fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error ?? 'Registration failed')
      }

      toast.success('Check your inbox to verify your email')
      router.push('/verify-email?status=sent')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start managing carbon reports with a few clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  onBlur={() => markTouched('name')}
                  placeholder="Jane Smith"
                  aria-invalid={touched.name && Boolean(errors.name)}
                  aria-describedby={touched.name && errors.name ? 'register-name-error' : undefined}
                />
                {touched.name && errors.name ? (
                  <p id="register-name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Work email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  onBlur={() => markTouched('email')}
                  placeholder="you@company.com"
                  aria-invalid={touched.email && Boolean(errors.email)}
                  aria-describedby={touched.email && errors.email ? 'register-email-error' : undefined}
                />
                {touched.email && errors.email ? (
                  <p id="register-email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="space-y-4 sm:col-span-1">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={updateField('password')}
                    onBlur={() => markTouched('password')}
                    placeholder="••••••••"
                    aria-invalid={touched.password && Boolean(errors.password)}
                    aria-describedby={['password-requirements', touched.password && errors.password ? 'register-password-error' : undefined]
                      .filter(Boolean)
                      .join(' ') || undefined}
                  />
                  {touched.password && errors.password ? (
                    <p id="register-password-error" className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <PasswordInput
                    id="confirmPassword"
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={updateField('confirmPassword')}
                    onBlur={() => markTouched('confirmPassword')}
                    placeholder="••••••••"
                    aria-invalid={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'register-confirm-password-error' : undefined}
                  />
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <p id="register-confirm-password-error" className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-3 sm:col-span-1">
                <div aria-hidden="true" className="h-2" />
                <ul id="password-requirements" className="space-y-1 text-sm text-muted-foreground">
                  {passwordRequirements.map((requirement) => {
                    const met = requirement.test(form.password)
                    return (
                      <li key={requirement.id} className="flex items-center gap-2">
                        {met ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                        <span className={met ? 'text-foreground' : undefined}>{requirement.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
              {isLoading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
