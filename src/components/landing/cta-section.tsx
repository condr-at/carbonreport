import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { LampContainer } from "../ui/lamp";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <MaxWidthWrapper className="pt-20">
      <AnimationContainer delay={0.1} className="w-full">
        <LampContainer className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center relative w-full text-center">
            <h2 className="bg-gradient-to-b from-foreground to-foreground/60 py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
              Start your sustainability journey today
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md mx-auto text-base md:text-lg">
              Join thousands of organizations using Carbon Report to measure
              and reduce their environmental impact.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/register" className="flex items-center">
                  Get started for free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </LampContainer>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
}
