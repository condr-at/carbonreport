import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import MagicBadge from "../ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { CheckCircle } from "lucide-react";

const PROCESS = [
  {
    title: "Connect Your Data",
    description:
      "Link your accounts and import your activity data to start tracking emissions.",
    icon: "1",
  },
  {
    title: "Monitor & Analyze",
    description:
      "View real-time insights and analytics on your carbon footprint across all activities.",
    icon: "2",
  },
  {
    title: "Take Action",
    description:
      "Implement reduction strategies and track your progress towards sustainability goals.",
    icon: "3",
  },
];

export function ProcessSection() {
  return (
    <MaxWidthWrapper className="py-10">
      <AnimationContainer delay={0.1}>
        <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
          <MagicBadge title="The Process" />
          <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
            Start tracking in 3 simple steps
          </h2>
          <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
            Follow these simple steps to start measuring and reducing your carbon footprint.
          </p>
        </div>
      </AnimationContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {PROCESS.map((step, idx) => (
          <AnimationContainer key={idx} delay={0.2 + idx * 0.1}>
            <MagicCard className="h-full p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-xl font-bold mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground flex-grow">{step.description}</p>
                <CheckCircle className="w-5 h-5 text-primary mt-4" />
              </div>
            </MagicCard>
          </AnimationContainer>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
