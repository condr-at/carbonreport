"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Pro",
    description: "For early-stage founders, solopreneurs and indie devs",
    price: "$99",
    period: "one-time payment",
    features: [
      "5 website templates",
      "2 app templates",
      "72 blocks and sections",
      "23 illustrations",
      "15 custom animations",
    ],
    cta: "Get all-access",
    popular: false,
  },
  {
    name: "Pro Team",
    description: "For teams and agencies working on cool products together",
    price: "$499",
    period: "one-time payment",
    features: [
      "All the templates, components and sections",
      "Available for your entire team",
      "Priority support",
      "Custom license options",
    ],
    cta: "Get all-access for your team",
    popular: true,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Build your dream landing page, today
          </h2>
          <p className="text-xl text-muted-foreground">
            Get lifetime access to all the components. No recurring fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-card shadow-lg shadow-primary/20"
                  : "border-border bg-card"
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                  Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">plus local taxes</p>
              </div>

              <Button className="w-full mb-6" size="lg" variant={plan.popular ? "default" : "outline"}>
                {plan.cta}
              </Button>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Lifetime access. Free updates. No recurring fees.
                </p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
