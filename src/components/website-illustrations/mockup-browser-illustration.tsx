"use client";

import { cn } from "@/lib/utils";

interface MockupBrowserIllustrationProps {
  className?: string;
}

export function MockupBrowserIllustration({ className }: MockupBrowserIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="flex h-full items-center justify-center">
        {/* Browser mockup */}
        <div className="h-48 w-80 overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
          {/* Browser header */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-success" />
            </div>
            
            {/* Address bar */}
            <div className="ml-2 flex-1 rounded bg-muted px-3 py-1 text-xs text-muted-foreground">
              127.0.0.1:8000
            </div>
          </div>
          
          {/* Browser content */}
          <div className="space-y-3 p-4">
            {/* Header */}
            <div className="h-3 w-32 animate-pulse rounded bg-primary/30" />
            
            {/* Content blocks */}
            <div className="space-y-2">
              <div className="h-2 w-full animate-pulse rounded bg-muted-foreground/10" style={{ animationDelay: '0.1s' }} />
              <div className="h-2 w-5/6 animate-pulse rounded bg-muted-foreground/10" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-4/6 animate-pulse rounded bg-muted-foreground/10" style={{ animationDelay: '0.3s' }} />
            </div>
            
            {/* Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="h-16 animate-pulse rounded border border-border bg-muted/30" style={{ animationDelay: '0.4s' }} />
              <div className="h-16 animate-pulse rounded border border-border bg-muted/30" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
