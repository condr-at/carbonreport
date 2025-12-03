import {
  FileCheck,
  Users,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { ReactNode } from "react";

import { Item, ItemDescription, ItemIcon, ItemTitle } from "@/components/ui/item";
import { Section } from "@/components/ui/section";

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[];
  className?: string;
}

export default function Items({
  title = "Everything you need for compliance",
  items = [
    {
      title: "Faster Data Collection",
      description: "Automated workflows and supplier engagement to gather data in days.",
      icon: <Zap className="size-6" />,
    },
    {
      title: "Audit-Ready Reports",
      description: "Generate ISO 14067 and CBAM compliant reports automatically.",
      icon: <FileCheck className="size-6" />,
    },
    {
      title: "Team Collaboration",
      description: "Invite your team and suppliers to collaborate in one workspace.",
      icon: <Users className="size-6" />,
    },
    {
      title: "Global Standards",
      description: "Aligned with GHG Protocol, ISO 14067, and EU regulations.",
      icon: <Globe className="size-6" />,
    },
    {
      title: "Secure & Private",
      description: "Your data is secure and you control who sees what.",
      icon: <ShieldCheck className="size-6" />,
    },
    {
      title: "Actionable Insights",
      description: "Identify hotspots and reduce your product carbon footprint.",
      icon: <BarChart3 className="size-6" />,
    },
  ],
  className,
}: ItemsProps) {
  return (
    <Section className={className} id="features">
      <div className="max-w-container mx-auto flex flex-col items-center gap-12">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Item key={index}>
              <ItemIcon>{item.icon}</ItemIcon>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </Item>
          ))}
        </div>
      </div>
    </Section>
  );
}
