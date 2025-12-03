import { cn } from "@/lib/utils";
import React from "react";

export function Navbar({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center justify-between py-4", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export function NavbarLeft({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
}

export function NavbarRight({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      {children}
    </div>
  );
}
