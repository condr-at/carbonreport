import { HeroSection } from "@/components/landing/hero-section";
import { BentoGridSection } from "@/components/landing/bento-grid-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { StatsSection } from "@/components/landing/stats-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <BentoGridSection />
      <FeatureSection />
      <SocialProofSection />
      <StatsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
