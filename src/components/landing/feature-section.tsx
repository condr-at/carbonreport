"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layout, Smartphone, Globe, Lock, Accessibility } from "lucide-react";

const features = [
  {
    icon: Accessibility,
    title: "Accessibility first",
    description: "Fully WCAG 2.0 compliant, made with best a11y practices",
  },
  {
    icon: Smartphone,
    title: "Responsive design",
    description: "Looks and works great on any device and screen size",
  },
  {
    icon: Layout,
    title: "Light and dark mode",
    description: "Seamless switching between color schemes, 6 themes included",
  },
  {
    icon: CheckCircle2,
    title: "Easy to customize",
    description: "Flexible options to match your product or brand",
  },
  {
    icon: Globe,
    title: "Top-level performance",
    description: "Made for lightning-fast load times and smooth interactions",
  },
  {
    icon: Lock,
    title: "Production ready",
    description: "Thoroughly tested and launch-prepared",
  },
];

export function FeatureSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything you need. Nothing you don't.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
