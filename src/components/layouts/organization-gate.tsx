"use client"

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useOrganizationContext } from '@/lib/organizations/context'

interface OrganizationGateProps {
  children: ReactNode
}

export function OrganizationGate({ children }: OrganizationGateProps) {
  const router = useRouter()
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
  const shouldRedirectToOnboarding = !isPending && !hasOrganizations && !isError
  const isAwaitingSelection = hasOrganizations && !activeOrganizationId
  const showOverlay = isPending || shouldRedirectToOnboarding || isAwaitingSelection

  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      router.replace('/no-organization')
    }
  }, [router, shouldRedirectToOnboarding])

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load organizations</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
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
