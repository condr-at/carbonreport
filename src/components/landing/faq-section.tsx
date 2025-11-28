import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const FAQ = [
  {
    id: "1",
    question: "How does Carbon Report calculate emissions?",
    answer:
      "We use industry-standard methodologies and emission factors to calculate your carbon footprint based on your activities and data inputs.",
  },
  {
    id: "2",
    question: "Can I integrate Carbon Report with other tools?",
    answer:
      "Yes! Professional and Enterprise plans include API access and custom integrations with popular business tools.",
  },
  {
    id: "3",
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption and security measures to protect your data. We're also compliant with major data protection regulations.",
  },
  {
    id: "4",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. No questions asked, no hidden fees.",
  },
  {
    id: "5",
    question: "Do you offer support?",
    answer:
      "Yes! All plans include email support. Professional and Enterprise plans also get priority support and dedicated account managers respectively.",
  },
];

export function FaqSection() {
  return (
    <div id="faq">
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
        <div className="flex flex-col items-center justify-center w-full pt-12">
          <h2 className="mt-6 text-2xl font-semibold text-center lg:text-3xl xl:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-lg mt-6 text-center text-muted-foreground">
            Here are some of the most common questions we get asked. If you have
            a question that isn&apos;t answered here, feel free to reach out to
            us.
          </p>
        </div>
        <div className="max-w-3xl mx-auto w-full mt-12">
          <Accordion type="single" collapsible>
            {FAQ.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
}
