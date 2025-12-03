import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { isApiError } from '@/lib/api-error'
import { LoginForm } from './login-form'

function LoginFormFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="animate-pulse text-sm text-muted-foreground">Loading sign-in form…</div>
    </div>
  )
}

export default async function LoginPage() {
  try {
    await getCurrentUser()
    redirect('/dashboard')
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) {
      throw error
    }
  }

  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  )
}
