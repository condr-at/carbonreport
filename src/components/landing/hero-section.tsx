"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "../global/max-width-wrapper";
import AnimationContainer from "../global/animation-container";
import MagicBadge from "../ui/magic-badge";

export function HeroSection() {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-br from-background via-background to-[#727a17]/5 relative py-32 md:py-40">
        <AnimationContainer delay={0.1} className="flex flex-col items-center justify-center w-full text-center">
          <MagicBadge title="🌱 Track Your Carbon Impact" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl !leading-[1.15] font-bold font-heading text-foreground mt-6 max-w-4xl">
            Measure, Monitor, and{" "}
            <span className="bg-gradient-to-br from-[#414d0b] to-[#727a17] bg-clip-text text-transparent">
              Reduce
            </span>{" "}
            Your Carbon Footprint
          </h1>
          <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance mt-6 max-w-2xl">
            Effortlessly track your carbon emissions with Carbon Report.
            <br className="hidden md:block" />
            <span className="hidden md:block">
              Make data-driven decisions to reduce your environmental impact.
            </span>
          </p>
          <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
            <Button asChild size="lg">
              <Link href="/register" className="flex items-center">
                Start tracking for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#features">Learn more</Link>
            </Button>
          </div>
        </AnimationContainer>

        <AnimationContainer
          delay={0.2}
          className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
        >
          <div className="relative w-full max-w-5xl mx-auto rounded-xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#727a17]/10 via-transparent to-[#414d0b]/5" />
            <div className="aspect-video w-full bg-muted/50 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Dashboard Preview</p>
            </div>
            <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
          </div>
        </AnimationContainer>
      </div>
    </MaxWidthWrapper>
  );
}
