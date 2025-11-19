"use client";

import { cn } from "@/lib/utils";

interface RippleIllustrationProps {
  className?: string;
}

export function RippleIllustration({ className }: RippleIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central dot */}
        <div className="absolute z-10 h-4 w-4 rounded-full bg-primary" />
        
        {/* Ripple circles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute h-20 w-20 animate-[ripple_3s_ease-out_infinite] rounded-full border-2 border-primary/30"
            style={{
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
