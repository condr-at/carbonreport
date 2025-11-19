"use client";

import { cn } from "@/lib/utils";

interface WavesIllustrationProps {
  className?: string;
}

export function WavesIllustration({ className }: WavesIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted", className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wave 1 */}
        <path
          d="M0,200 C300,280 400,120 600,200 C800,280 900,120 1200,200 L1200,400 L0,400 Z"
          className="fill-primary/10"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,200 C300,280 400,120 600,200 C800,280 900,120 1200,200 L1200,400 L0,400 Z;
              M0,200 C300,120 400,280 600,200 C800,120 900,280 1200,200 L1200,400 L0,400 Z;
              M0,200 C300,280 400,120 600,200 C800,280 900,120 1200,200 L1200,400 L0,400 Z
            "
          />
        </path>
        
        {/* Wave 2 */}
        <path
          d="M0,240 C300,160 400,320 600,240 C800,160 900,320 1200,240 L1200,400 L0,400 Z"
          className="fill-primary/20"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,240 C300,160 400,320 600,240 C800,160 900,320 1200,240 L1200,400 L0,400 Z;
              M0,240 C300,320 400,160 600,240 C800,320 900,160 1200,240 L1200,400 L0,400 Z;
              M0,240 C300,160 400,320 600,240 C800,160 900,320 1200,240 L1200,400 L0,400 Z
            "
          />
        </path>
        
        {/* Wave 3 */}
        <path
          d="M0,280 C300,200 400,360 600,280 C800,200 900,360 1200,280 L1200,400 L0,400 Z"
          className="fill-primary/30"
        >
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,280 C300,200 400,360 600,280 C800,200 900,360 1200,280 L1200,400 L0,400 Z;
              M0,280 C300,360 400,200 600,280 C800,360 900,200 1200,280 L1200,400 L0,400 Z;
              M0,280 C300,200 400,360 600,280 C800,200 900,360 1200,280 L1200,400 L0,400 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}
