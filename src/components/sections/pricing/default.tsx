import { User } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { PricingColumn, PricingColumnProps } from "@/components/ui/pricing-column";
import { Section } from "@/components/ui/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

export default function Pricing({
  title = "Simple, transparent pricing",
  description = "Start with a free trial. No credit card required.",
  plans = [
    {
      name: "Starter",
      description: "For SMEs starting their compliance journey",
      price: 299,
      priceNote: "Billed annually",
      cta: {
        variant: "primary",
        label: "Get Started",
        href: siteConfig.getStartedUrl,
      },
      features: [
        "Up to 5 Active Projects",
        "Unlimited Users",
        "CBAM & ISO 14067 Exports",
        "Supplier Data Collection",
        "Email Support",
      ],
      variant: "default",
    },
    {
      name: "Professional",
      icon: <User className="size-4" />,
      description: "For growing companies with multiple product lines",
      price: 499,
      priceNote: "Billed annually",
      cta: {
        variant: "primary",
        label: "Start Free Trial",
        href: siteConfig.getStartedUrl,
      },
      features: [
        "Unlimited Active Projects",
        "Unlimited Users",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
        "API Access",
      ],
      variant: "glow",
    },
  ],
  className = "",
}: PricingProps) {
  return (
    <Section className={cn(className)} id="pricing">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            {title && (
              <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">
                {description}
              </p>
            )}
          </div>
        )}
        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 justify-center">
            {plans.map((plan) => (
              <PricingColumn
                key={plan.name}
                {...plan}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
