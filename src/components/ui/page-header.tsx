import * as React from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement>

function PageHeader({ className, ...props }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
      {...props}
    />
  )
}

function PageHeaderHeading({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight", className)} {...props} />
  )
}

function PageHeaderDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props} />
  )
}

function PageHeaderActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} {...props} />
  )
}

PageHeader.displayName = "PageHeader"
PageHeaderHeading.displayName = "PageHeaderHeading"
PageHeaderDescription.displayName = "PageHeaderDescription"
PageHeaderActions.displayName = "PageHeaderActions"

const PageHeaderNamespace = Object.assign(PageHeader, {
  Heading: PageHeaderHeading,
  Description: PageHeaderDescription,
  Actions: PageHeaderActions,
})

export { PageHeaderNamespace as PageHeader }
