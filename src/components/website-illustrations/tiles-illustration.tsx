"use client";

import { cn } from "@/lib/utils";

interface TilesIllustrationProps {
  className?: string;
}

export function TilesIllustration({ className }: TilesIllustrationProps) {
  const tiles = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="grid h-full grid-cols-6 gap-2">
        {tiles.map((i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded border border-border bg-card transition-all duration-500 hover:scale-110 hover:border-primary hover:bg-primary/10"
            style={{
              animation: `fadeIn 0.5s ease-out ${i * 0.05}s both`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
