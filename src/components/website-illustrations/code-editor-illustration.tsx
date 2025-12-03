"use client";

import { cn } from "@/lib/utils";

interface CodeEditorIllustrationProps {
  className?: string;
}

export function CodeEditorIllustration({ className }: CodeEditorIllustrationProps) {
  const codeLines = [
    { indent: 0, width: "40%", color: "text-purple-400" },
    { indent: 1, width: "60%", color: "text-blue-400" },
    { indent: 2, width: "50%", color: "text-success" },
    { indent: 2, width: "55%", color: "text-yellow-400" },
    { indent: 1, width: "35%", color: "text-blue-400" },
    { indent: 0, width: "30%", color: "text-purple-400" },
  ];
  
  return (
    <div className={cn("relative h-64 w-full overflow-hidden rounded-xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8", className)}>
      <div className="flex h-full items-center justify-center">
        {/* Code editor mockup */}
        <div className="h-48 w-80 overflow-hidden rounded-lg border border-border bg-slate-950 shadow-2xl">
          {/* Editor header */}
          <div className="flex items-center justify-between border-b border-border/50 bg-slate-900 px-4 py-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-success" />
            </div>
            <div className="text-xs text-slate-400">page.tsx</div>
          </div>
          
          {/* Editor content */}
          <div className="space-y-2 p-4 font-mono text-xs">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className="flex items-center gap-2"
                style={{
                  paddingLeft: `${line.indent * 16}px`,
                  animation: `slideIn 0.3s ease-out ${i * 0.1}s both`,
                }}
              >
                <div className="w-4 text-right text-slate-600">{i + 1}</div>
                <div
                  className={cn("h-2 rounded", line.color)}
                  style={{ width: line.width, opacity: 0.7 }}
                />
              </div>
            ))}
            
            {/* Cursor */}
            <div
              className="ml-8 h-3 w-[2px] animate-blink bg-slate-300"
              style={{
                animation: 'blink 1s step-end infinite',
              }}
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
