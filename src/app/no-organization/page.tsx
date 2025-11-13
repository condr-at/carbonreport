import Link from 'next/link'
import { UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NoOrganizationPage() {
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
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <a href="mailto:support@carbonreport.app?subject=Organization%20invite%20help">Contact support</a>
          </Button>
          <Button asChild>
            <Link href="/settings/organization?mode=create">Create organization</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
