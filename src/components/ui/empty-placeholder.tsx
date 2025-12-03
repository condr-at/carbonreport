import * as React from "react"

import { cn } from "@/lib/utils"

type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement>

function EmptyPlaceholder({ className, children, ...props }: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/60 bg-muted/40 px-10 py-12 text-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function EmptyPlaceholderIcon({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function EmptyPlaceholderTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold", className)} {...props} />
  )
}

function EmptyPlaceholderDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

function EmptyPlaceholderAction({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-2", className)} {...props} />
  )
}

EmptyPlaceholder.displayName = "EmptyPlaceholder"
EmptyPlaceholderIcon.displayName = "EmptyPlaceholderIcon"
EmptyPlaceholderTitle.displayName = "EmptyPlaceholderTitle"
EmptyPlaceholderDescription.displayName = "EmptyPlaceholderDescription"
EmptyPlaceholderAction.displayName = "EmptyPlaceholderAction"

const EmptyPlaceholderNamespace = Object.assign(EmptyPlaceholder, {
  Icon: EmptyPlaceholderIcon,
  Title: EmptyPlaceholderTitle,
  Description: EmptyPlaceholderDescription,
  Action: EmptyPlaceholderAction,
})

export { EmptyPlaceholderNamespace as EmptyPlaceholder }
