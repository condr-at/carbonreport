import { cn } from "@/lib/utils";
import React from "react";

export function Footer({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background py-12", className)} {...props}>
      {children}
    </footer>
  );
}

export function FooterContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", className)} {...props}>
      {children}
    </div>
  );
}

export function FooterColumn({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export function FooterBottom({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row", className)} {...props}>
      {children}
    </div>
  );
}
