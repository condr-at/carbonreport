import { cn } from "@/lib/utils";
import React from "react";

export function Item({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function ItemIcon({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary", className)} {...props}>
      {children}
    </div>
  );
}

export function ItemTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xl font-semibold", className)} {...props}>
      {children}
    </h3>
  );
}

export function ItemDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
