"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "20.9k",
    label: "designers and developers",
  },
  {
    value: "6.1k",
    label: "designers on Figma Community",
  },
  {
    value: "1553",
    label: "clones and forks on Github",
  },
  {
    value: "13.2k",
    label: "installations with shadcn/ui CLI",
  },
];

export function StatsSection() {
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
            A proven solution for good design
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thousands of designers and developers have already used Launch UI to create beautiful and functional websites.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
