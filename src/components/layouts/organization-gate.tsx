"use client"

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
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
  } = useOrganizationContext()

  const hasOrganizations = acceptedOrganizations.length > 0
  const isPending = isLoading || isBootstrapping
  const shouldRedirectToOnboarding = !isPending && !hasOrganizations
  const isAwaitingSelection = hasOrganizations && !activeOrganizationId
  const showOverlay = isPending || shouldRedirectToOnboarding || isAwaitingSelection

  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      router.replace('/no-organization')
    }
  }, [router, shouldRedirectToOnboarding])

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
