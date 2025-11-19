"use client";

import { motion } from "framer-motion";

export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-50">
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/30 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl"
        animate={{
          scale: [1.3, 1, 1.3],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function GridPattern() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

export function DotsPattern() {
  return (
    <div className="absolute inset-0 opacity-30">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.4) 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />
    </div>
  );
}

export function WavesPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z"
          fill="hsl(var(--primary) / 0.1)"
          animate={{
            d: [
              "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
              "M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z",
              "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z"
          fill="hsl(var(--primary) / 0.15)"
          animate={{
            d: [
              "M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z",
              "M0,60 Q25,80 50,60 T100,60 L100,100 L0,100 Z",
              "M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </svg>
    </div>
  );
}

export function CodeBlocks() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 font-mono text-xs">
      <div className="absolute top-4 left-4 space-y-1">
        <div className="flex gap-2">
          <div className="w-16 h-2 bg-primary/40 rounded" />
          <div className="w-24 h-2 bg-muted rounded" />
        </div>
        <div className="flex gap-2 pl-4">
          <div className="w-20 h-2 bg-primary/30 rounded" />
          <div className="w-16 h-2 bg-muted/80 rounded" />
        </div>
        <div className="flex gap-2 pl-4">
          <div className="w-12 h-2 bg-primary/20 rounded" />
          <div className="w-28 h-2 bg-muted/60 rounded" />
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 space-y-1">
        <div className="flex gap-2 justify-end">
          <div className="w-20 h-2 bg-primary/30 rounded" />
          <div className="w-12 h-2 bg-muted/80 rounded" />
        </div>
        <div className="flex gap-2 justify-end pl-4">
          <div className="w-16 h-2 bg-primary/40 rounded" />
          <div className="w-24 h-2 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function ColorBars() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-40">
      <motion.div
        className="w-8 h-full bg-primary/60 rounded"
        animate={{ scaleY: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="w-8 h-full bg-primary/40 rounded"
        animate={{ scaleY: [0.6, 0.9, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="w-8 h-full bg-primary/50 rounded"
        animate={{ scaleY: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.div
        className="w-8 h-full bg-primary/30 rounded"
        animate={{ scaleY: [0.7, 0.85, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </div>
  );
}

export function getIllustration(type: string) {
  switch (type) {
    case "gradient-orbs":
      return <GradientOrbs />;
    case "grid-pattern":
      return <GridPattern />;
    case "dots":
      return <DotsPattern />;
    case "waves":
      return <WavesPattern />;
    case "code-blocks":
      return <CodeBlocks />;
    case "color-bars":
      return <ColorBars />;
    default:
      return null;
  }
}
