import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24 lg:py-32 relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </section>
  );
}
