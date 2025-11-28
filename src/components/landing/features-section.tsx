import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import MagicBadge from "../ui/magic-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart3, Leaf, TrendingDown, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Leaf,
    title: "Real-time Tracking",
    description: "Monitor your carbon emissions in real-time across all your activities and operations.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights with powerful analytics and beautiful visualizations.",
  },
  {
    icon: TrendingDown,
    title: "Reduction Goals",
    description: "Set and track goals to reduce your carbon footprint over time.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team to achieve your sustainability targets.",
  },
];

export function FeaturesSection() {
  return (
    <MaxWidthWrapper className="pt-10">
      <AnimationContainer delay={0.1}>
        <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
          <MagicBadge title="Features" />
          <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
            Everything you need to track carbon
          </h2>
          <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
            Carbon Report provides all the tools you need to measure, monitor,
            and reduce your environmental impact.
          </p>
        </div>
      </AnimationContainer>
      <AnimationContainer delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
          {FEATURES.map((feature, idx) => (
            <Card key={idx} className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
}
