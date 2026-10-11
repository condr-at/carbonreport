import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PendingInvitations } from '@/components/organizations/pending-invitations'

export default function InvitationsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Organization invitations</h1>
      <PendingInvitations showEmpty />
      <Button asChild variant="outline" className="self-start"><Link href="/dashboard">Back to workspace</Link></Button>
    </main>
  )
}
