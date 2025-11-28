"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimationContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  reverse?: boolean;
}

const AnimationContainer = ({
  children,
  className,
  delay = 0.1,
  reverse = false,
}: AnimationContainerProps) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationContainer;
