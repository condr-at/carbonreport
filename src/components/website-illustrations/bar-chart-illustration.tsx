"use client";

import { cn } from "@/lib/utils";

interface BarChartIllustrationProps {
  className?: string;
}

export function BarChartIllustration({ className }: BarChartIllustrationProps) {
  const bars = [
    { height: 120, delay: 0 },
    { height: 80, delay: 0.1 },
    { height: 140, delay: 0.2 },
    { height: 100, delay: 0.3 },
    { height: 160, delay: 0.4 },
    { height: 90, delay: 0.5 },
    { height: 130, delay: 0.6 },
  ];
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="flex h-full items-end justify-center gap-2">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="group relative w-12 overflow-hidden rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all duration-300 hover:from-primary hover:to-primary/80"
            style={{
              height: `${bar.height}px`,
              animation: `growUp 0.8s ease-out ${bar.delay}s both`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes growUp {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
