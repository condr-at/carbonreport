"use client";

import { cn } from "@/lib/utils";

interface NetworkIllustrationProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  delay: number;
}

export function NetworkIllustration({ className }: NetworkIllustrationProps) {
  const nodes: Node[] = [
    { x: 50, y: 50, delay: 0 },
    { x: 150, y: 30, delay: 0.2 },
    { x: 250, y: 60, delay: 0.4 },
    { x: 350, y: 40, delay: 0.6 },
    { x: 80, y: 130, delay: 0.8 },
    { x: 180, y: 120, delay: 1 },
    { x: 280, y: 140, delay: 1.2 },
    { x: 320, y: 130, delay: 1.4 },
  ];
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <svg className="h-full w-full" viewBox="0 0 400 200">
        {/* Connection lines */}
        <g className="stroke-primary/30" strokeWidth="1">
          <line x1="50" y1="50" x2="150" y2="30" className="animate-[drawLine_2s_ease-in-out_infinite]" />
          <line x1="150" y1="30" x2="250" y2="60" className="animate-[drawLine_2s_0.2s_ease-in-out_infinite]" />
          <line x1="250" y1="60" x2="350" y2="40" className="animate-[drawLine_2s_0.4s_ease-in-out_infinite]" />
          <line x1="50" y1="50" x2="80" y2="130" className="animate-[drawLine_2s_0.6s_ease-in-out_infinite]" />
          <line x1="80" y1="130" x2="180" y2="120" className="animate-[drawLine_2s_0.8s_ease-in-out_infinite]" />
          <line x1="180" y1="120" x2="280" y2="140" className="animate-[drawLine_2s_1s_ease-in-out_infinite]" />
          <line x1="280" y1="140" x2="320" y2="130" className="animate-[drawLine_2s_1.2s_ease-in-out_infinite]" />
          <line x1="150" y1="30" x2="180" y2="120" className="animate-[drawLine_2s_0.3s_ease-in-out_infinite]" />
          <line x1="250" y1="60" x2="280" y2="140" className="animate-[drawLine_2s_0.5s_ease-in-out_infinite]" />
        </g>
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={node.y}
              r="8"
              className="fill-primary/20 stroke-primary stroke-2"
              style={{
                animation: `pulse 2s ease-in-out ${node.delay}s infinite`,
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              className="fill-primary"
            />
          </g>
        ))}
      </svg>
      
      <style jsx>{`
        @keyframes drawLine {
          0%, 100% { stroke-dasharray: 0 1000; }
          50% { stroke-dasharray: 1000 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
