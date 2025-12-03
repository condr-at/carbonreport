"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import MagicBadge from "../ui/magic-badge";

type Tab = "monthly" | "yearly";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for individuals getting started",
    features: [
      "Track up to 10 activities",
      "Basic analytics",
      "Email support",
      "Community access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: { monthly: 29, yearly: 290 },
    description: "For professionals and small teams",
    features: [
      "Unlimited activity tracking",
      "Advanced analytics & reports",
      "Priority support",
      "Team collaboration (up to 5)",
      "API access",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 99, yearly: 990 },
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom reporting",
      "SLA guarantee",
      "Advanced security",
      "White-label options",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function PricingSection() {
  const MotionTabTrigger = motion(TabsTrigger);
  const [activeTab, setActiveTab] = useState<Tab>("monthly");

  return (
    <div id="pricing">
    <MaxWidthWrapper className="py-10">
      <AnimationContainer delay={0.1}>
        <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
          <MagicBadge title="Simple Pricing" />
          <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
            Choose a plan that works for you
          </h2>
          <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
            Get started with Carbon Report today and start tracking your environmental impact.
          </p>
        </div>
      </AnimationContainer>

      <AnimationContainer delay={0.2}>
        <Tabs
          defaultValue="monthly"
          className="w-full flex flex-col items-center justify-center"
        >
          <TabsList>
            <MotionTabTrigger
              value="monthly"
              onClick={() => setActiveTab("monthly")}
              className="relative"
            >
              Monthly
              {activeTab === "monthly" && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
            </MotionTabTrigger>
            <MotionTabTrigger
              value="yearly"
              onClick={() => setActiveTab("yearly")}
              className="relative"
            >
              Yearly
              <span className="ml-1.5 text-xs text-primary">(Save 20%)</span>
              {activeTab === "yearly" && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-md -z-10"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
            </MotionTabTrigger>
          </TabsList>

          <TabsContent value="monthly" className="w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "relative",
                    plan.highlighted &&
                      "border-primary shadow-lg shadow-primary/20"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "primary" : "outline"}
                    >
                      <Link href="/register">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "relative",
                    plan.highlighted &&
                      "border-primary shadow-lg shadow-primary/20"
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price.yearly}
                      </span>
                      <span className="text-muted-foreground">/year</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "primary" : "outline"}
                    >
                      <Link href="/register">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </AnimationContainer>
    </MaxWidthWrapper>
    </div>
  );
}
