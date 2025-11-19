"use client";

import { cn } from "@/lib/utils";

interface RadarIllustrationProps {
  className?: string;
}

export function RadarIllustration({ className }: RadarIllustrationProps) {
  const dataPoints = [85, 70, 90, 65, 80];
  const labels = ["Speed", "Quality", "Design", "Support", "Value"];
  const maxValue = 100;
  
  const createPolygonPoints = (values: number[]) => {
    const centerX = 100;
    const centerY = 100;
    const maxRadius = 80;
    
    return values
      .map((value, i) => {
        const angle = (i * 2 * Math.PI) / values.length - Math.PI / 2;
        const radius = (value / maxValue) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(" ");
  };
  
  const gridLevels = [20, 40, 60, 80, 100];
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <svg className="h-full w-full" viewBox="0 0 200 200">
        {/* Grid levels */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={createPolygonPoints(Array(5).fill(level))}
            className="fill-none stroke-muted-foreground/10"
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        <g className="stroke-muted-foreground/20" strokeWidth="1">
          {labels.map((_, i) => {
            const angle = (i * 2 * Math.PI) / labels.length - Math.PI / 2;
            const x = 100 + 80 * Math.cos(angle);
            const y = 100 + 80 * Math.sin(angle);
            return <line key={i} x1="100" y1="100" x2={x} y2={y} />;
          })}
        </g>
        
        {/* Data polygon */}
        <polygon
          points={createPolygonPoints(dataPoints)}
          className="fill-primary/20 stroke-primary stroke-2"
          style={{
            animation: 'scaleIn 1s ease-out',
          }}
        />
        
        {/* Data points */}
        {dataPoints.map((value, i) => {
          const angle = (i * 2 * Math.PI) / dataPoints.length - Math.PI / 2;
          const radius = (value / maxValue) * 80;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                className="fill-primary stroke-background stroke-2"
                style={{
                  animation: `appear 0.5s ease-out ${0.5 + i * 0.1}s both`,
                }}
              />
            </g>
          );
        })}
        
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (i * 2 * Math.PI) / labels.length - Math.PI / 2;
          const x = 100 + 95 * Math.cos(angle);
          const y = 100 + 95 * Math.sin(angle);
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              className="fill-muted-foreground text-[8px] font-medium"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                animation: `fadeIn 0.5s ease-out ${0.8 + i * 0.1}s both`,
              }}
            >
              {label}
            </text>
          );
        })}
      </svg>
      
      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
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
