"use client";

import { cn } from "@/lib/utils";

interface InfrastructureIllustrationProps {
  className?: string;
}

export function InfrastructureIllustration({ className }: InfrastructureIllustrationProps) {
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <svg className="h-full w-full" viewBox="0 0 400 200">
        {/* Server racks */}
        <g>
          {/* Left server */}
          <g style={{ animation: 'fadeIn 0.5s ease-out 0s both' }}>
            <rect x="40" y="60" width="80" height="100" rx="4" className="fill-muted stroke-border stroke-2" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect
                  x="50"
                  y={70 + i * 22}
                  width="60"
                  height="16"
                  rx="2"
                  className="fill-primary/20 stroke-primary/50"
                />
                <circle
                  cx="60"
                  cy={78 + i * 22}
                  r="2"
                  className="fill-green-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              </g>
            ))}
          </g>
          
          {/* Middle server */}
          <g style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}>
            <rect x="160" y="60" width="80" height="100" rx="4" className="fill-muted stroke-border stroke-2" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect
                  x="170"
                  y={70 + i * 22}
                  width="60"
                  height="16"
                  rx="2"
                  className="fill-primary/20 stroke-primary/50"
                />
                <circle
                  cx="180"
                  cy={78 + i * 22}
                  r="2"
                  className="fill-green-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
                />
              </g>
            ))}
          </g>
          
          {/* Right server */}
          <g style={{ animation: 'fadeIn 0.5s ease-out 0.4s both' }}>
            <rect x="280" y="60" width="80" height="100" rx="4" className="fill-muted stroke-border stroke-2" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect
                  x="290"
                  y={70 + i * 22}
                  width="60"
                  height="16"
                  rx="2"
                  className="fill-primary/20 stroke-primary/50"
                />
                <circle
                  cx="300"
                  cy={78 + i * 22}
                  r="2"
                  className="fill-green-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.2 + 0.2}s` }}
                />
              </g>
            ))}
          </g>
        </g>
        
        {/* Connection lines */}
        <g className="stroke-primary/50 stroke-2" strokeDasharray="5,5">
          <line
            x1="120"
            y1="110"
            x2="160"
            y2="110"
            style={{ animation: 'dash 2s linear infinite' }}
          />
          <line
            x1="240"
            y1="110"
            x2="280"
            y2="110"
            style={{ animation: 'dash 2s linear infinite 0.5s' }}
          />
        </g>
        
        {/* Top label */}
        <text
          x="200"
          y="30"
          className="fill-muted-foreground text-xs font-medium"
          textAnchor="middle"
          style={{ animation: 'fadeIn 0.5s ease-out 0.6s both' }}
        >
          AI-POWERED STACK
        </text>
        
        {/* Bottom label */}
        <text
          x="200"
          y="185"
          className="fill-primary text-xs font-semibold"
          textAnchor="middle"
          style={{ animation: 'fadeIn 0.5s ease-out 0.8s both' }}
        >
          21,000 ACTIVE USERS
        </text>
      </svg>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </div>
  );
}
