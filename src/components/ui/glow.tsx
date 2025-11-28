import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute pointer-events-none", {
  variants: {
    variant: {
      top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full",
      bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full",
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

export default function Glow({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>) {
  return <div className={cn(glowVariants({ variant }), className)} {...props} />;
}
