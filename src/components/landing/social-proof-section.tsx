"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Fabrizio Fernandez",
    handle: "@fab3304",
    text: "Playing around with @launchui suddenly made me feeling inspired to launch that side project.",
    avatar: "F",
  },
  {
    name: "Darius Flynn",
    handle: "@flynnn",
    text: "Exploring @launchui's sleek UI. It's like a dark mode enthusiast's playground.",
    avatar: "D",
  },
  {
    name: "Felix B.",
    handle: "@felixbs",
    text: "Digging into @launchui. Those shadows are giving me serious design envy.",
    avatar: "F",
  },
  {
    name: "Olivia Blackwood",
    handle: "@olivia1992",
    text: "@launchui is not messing around with its component library game.",
    avatar: "O",
  },
  {
    name: "Esme Rothschild",
    handle: "@EmeRothArt",
    text: "@launchui is slick. That globe graphic though. Making me feel like I'm building websites for a sci-fi movie.",
    avatar: "E",
  },
  {
    name: "Kai Nakamura",
    handle: "@KaiNakWaves",
    text: "Just made my first website with @launchui. Its flexibility is speaking my language.",
    avatar: "K",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Loved by designers and developers
          </h2>
          <p className="text-xl text-muted-foreground">
            across the planet
          </p>
        </motion.div>
      </div>

      {/* Scrolling testimonials */}
      <div className="relative">
        <div className="flex gap-4 animate-scroll">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{testimonial.handle}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
