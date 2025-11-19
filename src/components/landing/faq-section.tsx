"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Why good design is critical for your business?",
    answer: "Good design builds trust, improves user experience, and directly impacts conversion rates. In competitive markets, professional design is what sets successful products apart.",
  },
  {
    question: "Why use Launch UI instead of a no-code tool?",
    answer: "Launch UI gives you full control over your code, no vendor lock-in, better performance, and unlimited customization. You own the code forever with a one-time payment.",
  },
  {
    question: "How Launch UI is different from other component libraries?",
    answer: "Unlike generic templates, Launch UI components are carefully hand-crafted with unique designs. They're built on industry-standard tools (React, Tailwind, shadcn/ui) you already know.",
  },
  {
    question: "What does it mean that 'The code is yours'?",
    answer: "You get the full source code with a one-time purchase. No subscriptions, no recurring fees, no limitations. Use it in unlimited projects forever.",
  },
  {
    question: "Are Figma files included?",
    answer: "Yes! All components come with professionally designed Figma files, making it easy to customize designs before implementation.",
  },
  {
    question: "Can I get a discount?",
    answer: "We occasionally offer discounts for students, non-profits, and during special promotions. Follow us on Twitter for announcements.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Questions and Answers
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
