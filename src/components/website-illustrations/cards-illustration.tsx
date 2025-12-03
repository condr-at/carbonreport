"use client";

import { cn } from "@/lib/utils";

interface CardsIllustrationProps {
  className?: string;
}

export function CardsIllustration({ className }: CardsIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="relative flex h-full items-center justify-center gap-4">
        {/* Card 1 */}
        <div className="group relative h-40 w-32 animate-[float_6s_ease-in-out_infinite]">
          <div className="h-full w-full rounded-lg border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
            <div className="flex h-full flex-col justify-between p-4">
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-2 w-1/2 rounded bg-muted-foreground/10" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20" />
                <div className="h-2 w-16 rounded bg-muted-foreground/10" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 2 (center, larger) */}
        <div className="group relative h-48 w-36 animate-[float_6s_ease-in-out_0.5s_infinite]">
          <div className="h-full w-full rounded-lg border border-border bg-card shadow-xl transition-transform duration-300 group-hover:-translate-y-2">
            <div className="flex h-full flex-col justify-between p-4">
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-primary/30" />
                <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-2 w-1/2 rounded bg-muted-foreground/10" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-muted-foreground/10" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/30" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full rounded bg-muted-foreground/10" />
                    <div className="h-2 w-2/3 rounded bg-muted-foreground/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="group relative h-40 w-32 animate-[float_6s_ease-in-out_1s_infinite]">
          <div className="h-full w-full rounded-lg border border-border bg-card shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
            <div className="flex h-full flex-col justify-between p-4">
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-2 w-1/2 rounded bg-muted-foreground/10" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20" />
                <div className="h-2 w-16 rounded bg-muted-foreground/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
