import Link from "next/link"
import { AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import { isApiError } from "@/lib/api-error"

const sidebarNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects" },
  { label: "Requests", href: "/requests" },
  { label: "Contacts", href: "/contacts" },
  { label: "Settings", href: "/settings" },
]

async function resolveAuthState() {
  try {
    await getCurrentUser()
    return true
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      return false
    }
    throw error
  }
}

export default async function NotFoundPage() {
  const isAuthenticated = await resolveAuthState()
  const primaryCta = isAuthenticated
    ? { href: "/dashboard", label: "Back to dashboard" }
    : { href: "/login", label: "Go to sign in" }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-r bg-sidebar/90 backdrop-blur md:flex">
        <div className="flex h-16 items-center border-b px-6 text-lg font-semibold">Carbon Report</div>
        <nav className={cn("flex flex-1 flex-col gap-1 px-4 py-6", !isAuthenticated && "opacity-60")}
          aria-label="Primary"
        >
          {sidebarNav.map((item) => (
            isAuthenticated ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.href}
                aria-disabled="true"
                className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
              >
                {item.label}
              </div>
            )
          ))}
        </nav>
        <div className="px-6 pb-6 text-xs text-muted-foreground">
          {isAuthenticated ? (
            <p>You are signed in. Navigation is available.</p>
          ) : (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Sign in to unlock navigation
            </p>
          )}
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background/90 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Error 404</p>
            <h1 className="text-lg font-semibold">Page not found</h1>
          </div>
          <ModeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="max-w-xl space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">We couldn’t find that page</h2>
              <p className="text-sm text-muted-foreground">
                The link might be broken or the page may have been moved. {isAuthenticated ? "Head back to your workspace" : "Sign in again"} to continue.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
