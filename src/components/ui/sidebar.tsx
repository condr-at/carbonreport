"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleOpen: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  const toggleOpen = React.useCallback(() => {
    setOpen((previous) => !previous)
  }, [])

  const context = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleOpen,
    }),
    [open, toggleOpen],
  )

  return <SidebarContext.Provider value={context}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSidebar()

    return (
      <>
        <div
          data-slot="sidebar-backdrop"
          className={cn(
            "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 md:hidden",
            open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0",
          )}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        <aside
          ref={ref}
          data-slot="sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar shadow-sm transition-transform duration-200 md:static md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
            className,
          )}
          {...props}
        >
          {children}
        </aside>
      </>
    )
  },
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="sidebar-header" className={cn("border-b px-6 py-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="sidebar-content" className={cn("flex-1 overflow-y-auto px-4 py-4", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="sidebar-footer" className={cn("border-t px-4 py-4", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const { toggleOpen } = useSidebar()
  const Comp = asChild ? Slot : "button"

  const triggerChildren = asChild ? (
    children
  ) : (
    <>
      {children ?? <Menu className="h-4 w-4" />}
      <span className="sr-only">Toggle sidebar</span>
    </>
  )

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-slot="sidebar-trigger"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        toggleOpen()
      }}
      {...props}
    >
      {triggerChildren}
    </Comp>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="sidebar-inset" className={cn("flex-1 overflow-hidden", className)} {...props} />
  ),
)
SidebarInset.displayName = "SidebarInset"
