'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganizationContext } from '@/lib/organizations/context'
import { useRespondToOrganizationInvite } from '@/lib/data-client/organizations'
import { ApiError } from '@/lib/api-client'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin', EDITOR: 'Editor', VIEWER_READONLY: 'Viewer (read-only)', VIEWER_VERIFIER: 'Verifier',
}

export function PendingInvitations({ showEmpty = false }: { showEmpty?: boolean }) {
  const { pendingInvites, isLoading, isError, refetch, setActiveOrganizationId } = useOrganizationContext()
  const respond = useRespondToOrganizationInvite()
  const router = useRouter()

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading invitations…</p>
  if (isError) return <Button variant="outline" onClick={refetch}>Retry loading invitations</Button>
  if (!pendingInvites.length && !showEmpty) return null

  async function handleResponse(organizationId: string, membershipId: string, response: 'accept' | 'decline') {
    try {
      await respond.mutateAsync({ organizationId, membershipId, response })
      if (response === 'accept') {
        setActiveOrganizationId(organizationId)
        router.push('/dashboard')
      }
    } catch {
      // The mutation shows the server's actionable error; keep the invite here.
    }
  }

  return (
    <Card className="w-full text-left">
      <CardHeader>
        <CardTitle>Pending invitations</CardTitle>
        <CardDescription>Choose which workspaces to join.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {respond.error instanceof ApiError && respond.error.code === 'EMAIL_NOT_VERIFIED' && (
          <div role="alert" className="rounded-md border p-4 text-sm">
            Verify your email before joining this organization. Your invitation will stay here.
            <Button asChild variant="foreground" mode="link" className="px-0"><Link href="/verify-email">Verify email</Link></Button>
          </div>
        )}
        {!pendingInvites.length && <p className="text-sm text-muted-foreground">You have no pending invitations.</p>}
        {pendingInvites.map(invite => (
          <div key={invite.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
            <div>
              <p className="font-medium">{invite.display_name}</p>
              <p className="text-sm text-muted-foreground">{ROLE_LABELS[invite.role] ?? invite.role}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={respond.isPending || !invite.membership_id}
                onClick={() => void handleResponse(invite.id, invite.membership_id!, 'decline')}
                aria-label={`Decline invitation to ${invite.display_name}`}
              >Decline</Button>
              <Button
                disabled={respond.isPending || !invite.membership_id}
                onClick={() => void handleResponse(invite.id, invite.membership_id!, 'accept')}
                aria-label={`Accept invitation to ${invite.display_name}`}
              >Accept invitation</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
