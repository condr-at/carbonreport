"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/mode-toggle"

interface PublicPageFrameProps {
  children: ReactNode
  className?: string
  align?: "center" | "start"
}

const alignClassMap: Record<NonNullable<PublicPageFrameProps["align"]>, string> = {
  center: "items-center",
  start: "items-start",
}

export function PublicPageFrame({ children, className, align = "center" }: PublicPageFrameProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen justify-center bg-muted/30 px-4 pb-8 pt-16",
        alignClassMap[align],
        className,
      )}
    >
      <div className="pointer-events-auto absolute right-4 top-4">
        <ModeToggle />
      </div>
      {children}
    </div>
  )
}
