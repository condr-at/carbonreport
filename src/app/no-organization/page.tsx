"use client"
import Link from 'next/link'
import { UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOrganizationContext } from '@/lib/organizations/context'
import { Suspense, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PendingInvitations } from '@/components/organizations/pending-invitations'

function NoOrganizationFallback() {
  return (
    <main className="flex h-full min-h-[40vh] items-center justify-center">
      <div className="animate-pulse text-sm text-muted-foreground">Preparing organization context…</div>
    </main>
  )
}

function NoOrganizationContent() {
  const { currentOrganization, isLoading, isBootstrapping, isUnauthorized } = useOrganizationContext()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isCheckingOrganization = isLoading || isBootstrapping

  // If organization detected after load, redirect away
  useEffect(() => {
    if (!isCheckingOrganization && currentOrganization?.id) {
      router.replace('/projects')
    }
  }, [isCheckingOrganization, currentOrganization?.id, router])

  useEffect(() => {
    if (!isUnauthorized) {
      return
    }

    const redirectTarget = (() => {
      const search = searchParams?.toString()
      return search ? `${pathname}?${search}` : pathname
    })()

    router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`)
  }, [isUnauthorized, pathname, router, searchParams])

  // While loading org context, show minimal spinner skeleton
  if (isCheckingOrganization) {
    return (
      <main className="flex h-full min-h-[40vh] items-center justify-center">
        <div className="animate-pulse text-sm text-muted-foreground">Checking organization access…</div>
      </main>
    )
  }

  return (
    <main className="flex h-full min-h-[60vh] flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UsersRound className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Join your organization to get started</h1>
          <p className="text-sm text-muted-foreground">
            If your company already set up Carbon Report, ask a teammate to invite you from Organization → Members.
            You will gain access to projects and settings as soon as the invite is accepted.
          </p>
          <p className="text-sm text-muted-foreground">
            Only create a new organization if you are the first person from your company trying Carbon Report.
            This keeps workspaces tidy and avoids duplicate billing accounts.
          </p>
        </div>
        <PendingInvitations />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <a href="mailto:support@carbonreport.app?subject=Organization%20invite%20help">Contact support</a>
          </Button>
          <Button asChild>
            <Link href="/settings/profile?mode=create">Create organization</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function NoOrganizationPage() {
  return (
    <Suspense fallback={<NoOrganizationFallback />}>
      <NoOrganizationContent />
    </Suspense>
  )
}
