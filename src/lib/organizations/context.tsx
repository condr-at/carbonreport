'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useOrganizations, useCurrentOrganization } from '@/lib/data-client/organizations'
import type { OrganizationSummary, CurrentOrganizationResponse } from '@/lib/data-client/organizations'
import { ApiError } from '@/lib/api-client'

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
  isBootstrapping: boolean
  isUnauthorized: boolean
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

function clearStoredOrganizationId() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(LOCAL_STORAGE_KEY)
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error, refetch } = useOrganizations(true)
  const organizations = useMemo(() => data?.organizations ?? [], [data])
  const acceptedOrganizations = useMemo(
    () => organizations.filter((org) => !org.invite_status || org.invite_status === 'accepted'),
    [organizations],
  )
  const pendingInvites = useMemo(
    () => organizations.filter((org) => org.invite_status === 'pending'),
    [organizations],
  )

  const [activeOrganizationId, setActiveOrganizationIdState] = useState<string | null>(() => getStoredOrganizationId())
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isUnauthorized, setIsUnauthorized] = useState(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    const unauthorized = isError && error instanceof ApiError && error.status === 401
    setIsUnauthorized(unauthorized)

    if (unauthorized && activeOrganizationId !== null) {
      setActiveOrganizationIdState(null)
      clearStoredOrganizationId()
    }
  }, [activeOrganizationId, error, isError, isLoading])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (isUnauthorized) {
      setIsBootstrapping(false)
      return
    }

    if (!acceptedOrganizations.length) {
      if (activeOrganizationId !== null) {
        setActiveOrganizationIdState(null)
        clearStoredOrganizationId()
      }
      setIsBootstrapping(false)
      return
    }

    const stored = getStoredOrganizationId()
    if (stored && acceptedOrganizations.some((org) => org.id === stored)) {
      if (stored !== activeOrganizationId) {
        setActiveOrganizationIdState(stored)
      }
      setIsBootstrapping(false)
      return
    }

    const firstAccepted = acceptedOrganizations[0]
    if (firstAccepted && firstAccepted.id !== activeOrganizationId) {
      setActiveOrganizationIdState(firstAccepted.id)
      storeOrganizationId(firstAccepted.id)
    }

    setIsBootstrapping(false)
  }, [acceptedOrganizations, activeOrganizationId, isLoading, isUnauthorized])

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
    isBootstrapping,
    isUnauthorized,
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
    isBootstrapping,
    isUnauthorized,
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
