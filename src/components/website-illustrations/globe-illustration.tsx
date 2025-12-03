"use client";

import { cn } from "@/lib/utils";

interface GlobeIllustrationProps {
  className?: string;
}

export function GlobeIllustration({ className }: GlobeIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="relative flex h-full items-center justify-center">
        {/* Globe */}
        <div className="relative h-40 w-40">
          <svg
            className="h-full w-full animate-[spin_20s_linear_infinite]"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground/30"
            />
            
            {/* Latitude lines */}
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="20"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="40"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="60"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            
            {/* Longitude lines */}
            <ellipse
              cx="100"
              cy="100"
              rx="20"
              ry="80"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="40"
              ry="80"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="60"
              ry="80"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
            
            {/* Connection points */}
            <g className="animate-pulse">
              <circle cx="140" cy="80" r="3" className="fill-primary" />
              <circle cx="60" cy="120" r="3" className="fill-primary" />
              <circle cx="120" cy="140" r="3" className="fill-primary" />
              <circle cx="80" cy="60" r="3" className="fill-primary" />
            </g>
          </svg>
          
          {/* Orbiting particles */}
          <div className="absolute inset-0 animate-[spin_15s_linear_infinite]">
            <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/60 blur-sm" />
          </div>
          <div className="absolute inset-0 animate-[spin_25s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/40 blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
