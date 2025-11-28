import { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/ui/section";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = "Questions and Answers",
  items = [
    {
      question: "What is Carbon Report?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Carbon Report is a workspace for product carbon footprint (PCF) and compliance reporting. It helps you collect data from suppliers, calculate emissions, and generate reports for ISO 14067, EU CBAM, and other regulations.
        </p>
      ),
    },
    {
      question: "Who is it for?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          It is designed for SMEs in manufacturing (steel, aluminum, cement, etc.) who need to comply with EU CBAM, as well as sustainability consultants who help these companies.
        </p>
      ),
    },
    {
      question: "How does it help with CBAM?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Carbon Report provides templates and workflows specifically for EU CBAM compliance. You can import your product data, invite suppliers to provide their emissions data, and generate the XML report required by the CBAM registry.
        </p>
      ),
    },
    {
      question: "Is it compliant with ISO 14067?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Yes, the methodology and reports are aligned with ISO 14067 standards for product carbon footprinting.
        </p>
      ),
    },
    {
      question: "Can I invite my suppliers?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Yes, you can invite unlimited suppliers to collaborate on your projects. They can input their data directly into the platform, saving you from endless email chains.
        </p>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className} id="faq">
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
