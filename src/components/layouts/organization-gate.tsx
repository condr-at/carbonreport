"use client"

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useOrganizationContext } from '@/lib/organizations/context'
import { ApiError } from '@/lib/api-client'
import Link from 'next/link'

interface OrganizationGateProps {
  children: ReactNode
}

export function OrganizationGate({ children }: OrganizationGateProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    acceptedOrganizations,
    activeOrganizationId,
    isLoading,
    isBootstrapping,
    isError,
    error,
  } = useOrganizationContext()

  const hasOrganizations = acceptedOrganizations.length > 0
  const isPending = isLoading || isBootstrapping
  const isCreatingOrganization = pathname === '/settings/profile' && searchParams.get('mode') === 'create'
  const shouldRedirectToOnboarding = !isPending && !hasOrganizations && !isError && !isCreatingOrganization
  const isAwaitingSelection = hasOrganizations && !activeOrganizationId
  const showOverlay = isPending || shouldRedirectToOnboarding || isAwaitingSelection

  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      router.replace('/no-organization')
    }
  }, [router, shouldRedirectToOnboarding])

  if (isError) {
    const sessionExpired = error instanceof ApiError && error.status === 401
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{sessionExpired ? 'Your session has expired' : 'Failed to load organizations'}</h3>
          <p className="text-sm text-muted-foreground">
            {sessionExpired ? 'Sign in again to continue to your workspace.' : error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
        {sessionExpired ? <Button asChild><Link href={`/login?${new URLSearchParams({ redirect: `${pathname}?${searchParams}`, reason: 'session_expired' })}`}>Sign in</Link></Button> : <Button onClick={() => window.location.reload()}>Retry</Button>}
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col">
      {children}
      {showOverlay && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background">
          <Spinner className="h-6 w-6" />
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      )}
    </div>
  )
}
