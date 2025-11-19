"use client";

import { cn } from "@/lib/utils";

interface LineChartIllustrationProps {
  className?: string;
}

export function LineChartIllustration({ className }: LineChartIllustrationProps) {
  const dataPoints = [
    { x: 20, y: 150 },
    { x: 80, y: 120 },
    { x: 140, y: 80 },
    { x: 200, y: 100 },
    { x: 260, y: 60 },
    { x: 320, y: 40 },
    { x: 380, y: 30 },
  ];
  
  const pathD = dataPoints
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
    
  const areaD = `${pathD} L 380 180 L 20 180 Z`;
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <svg className="h-full w-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        <g className="stroke-muted-foreground/10" strokeWidth="1">
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h-${i}`}
              x1="20"
              y1={20 + i * 40}
              x2="380"
              y2={20 + i * 40}
            />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line
              key={`v-${i}`}
              x1={20 + i * 60}
              y1="20"
              x2={20 + i * 60}
              y2="180"
            />
          ))}
        </g>
        
        {/* Area fill */}
        <path
          d={areaD}
          className="fill-primary/10"
          style={{
            animation: 'fadeIn 1.5s ease-out',
          }}
        />
        
        {/* Line */}
        <path
          d={pathD}
          className="fill-none stroke-primary stroke-2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
            animation: 'drawPath 2s ease-out forwards',
          }}
        />
        
        {/* Data points */}
        {dataPoints.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              className="fill-background stroke-primary stroke-2"
              style={{
                animation: `appear 0.5s ease-out ${0.3 + i * 0.1}s both`,
              }}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              className="fill-primary"
              style={{
                animation: `appear 0.5s ease-out ${0.3 + i * 0.1}s both`,
              }}
            />
          </g>
        ))}
      </svg>
      
      <style jsx>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes appear {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
