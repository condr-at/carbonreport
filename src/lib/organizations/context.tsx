'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useOrganizations, useCurrentOrganization } from '@/lib/data-client/organizations'
import type { OrganizationSummary, CurrentOrganizationResponse } from '@/lib/data-client/organizations'

const LOCAL_STORAGE_KEY = 'carbonreport.activeOrganizationId'

type OrganizationContextValue = {
  activeOrganizationId: string | null
  setActiveOrganizationId: (organizationId: string) => void
  organizations: OrganizationSummary[]
  pendingInvites: OrganizationSummary[]
  acceptedOrganizations: OrganizationSummary[]
  isLoading: boolean
  isError: boolean
  error: unknown
  currentOrganization: CurrentOrganizationResponse['organization'] | null
  refetch: () => void
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined)

function getStoredOrganizationId(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(LOCAL_STORAGE_KEY)
}

function storeOrganizationId(organizationId: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, organizationId)
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error, refetch } = useOrganizations(true)
  const organizations = useMemo(() => data?.organizations ?? [], [data])
  const acceptedOrganizations = useMemo(
    () => organizations.filter((org) => !org.invite_status || org.invite_status === 'accepted'),
    [organizations],
  )
  const pendingInvites = useMemo(
    () => organizations.filter((org) => org.invite_status && org.invite_status !== 'accepted'),
    [organizations],
  )

  const [activeOrganizationId, setActiveOrganizationIdState] = useState<string | null>(() => getStoredOrganizationId())

  useEffect(() => {
    if (!acceptedOrganizations.length) {
      return
    }

    const stored = getStoredOrganizationId()
    if (stored && acceptedOrganizations.some((org) => org.id === stored)) {
      setActiveOrganizationIdState(stored)
      return
    }

    const firstAccepted = acceptedOrganizations[0]
    if (firstAccepted && firstAccepted.id !== activeOrganizationId) {
      setActiveOrganizationIdState(firstAccepted.id)
      storeOrganizationId(firstAccepted.id)
    }
  }, [acceptedOrganizations, activeOrganizationId])

  const setActiveOrganizationId = useCallback((organizationId: string) => {
    setActiveOrganizationIdState(organizationId)
    storeOrganizationId(organizationId)
  }, [])

  const { data: currentOrganizationResponse } = useCurrentOrganization(activeOrganizationId ?? undefined)
  const currentOrganization = currentOrganizationResponse?.organization ?? null

  const value = useMemo<OrganizationContextValue>(() => ({
    activeOrganizationId,
    setActiveOrganizationId,
    organizations,
    pendingInvites,
    acceptedOrganizations,
    isLoading,
    isError,
    error,
    currentOrganization,
    refetch,
  }), [
    activeOrganizationId,
    setActiveOrganizationId,
    organizations,
    pendingInvites,
    acceptedOrganizations,
    isLoading,
    isError,
    error,
    currentOrganization,
    refetch,
  ])

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
}

export function useOrganizationContext(): OrganizationContextValue {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider')
  }
  return context
}
