import { Check } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

export interface PricingColumnProps {
  name: string;
  price: number;
  priceNote?: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    href: string;
    variant?: VariantProps<typeof buttonVariants>["variant"];
  };
  icon?: ReactNode;
  variant?: "default" | "glow" | "glow-brand";
  className?: string;
}

export function PricingColumn({
  name,
  price,
  priceNote,
  description,
  features,
  cta,
  icon,
  variant = "default",
  className,
}: PricingColumnProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 rounded-2xl border bg-card p-8 shadow-sm",
        variant === "glow" && "border-primary/50 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)]",
        variant === "glow-brand" && "border-brand/50 shadow-[0_0_40px_-10px_rgba(var(--brand),0.3)]",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-xl font-semibold">{name}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">€{price}</span>
        <span className="text-muted-foreground">/mo</span>
      </div>
      {priceNote && <p className="text-sm text-muted-foreground">{priceNote}</p>}
      <Button variant={cta.variant || "primary"} asChild className="w-full">
        <a href={cta.href}>{cta.label}</a>
      </Button>
      <ul className="flex flex-col gap-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
