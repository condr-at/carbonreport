const base = "/legacy/launch-ui";

type Shot = {
  slug: string;
  name: string;
  file: string;
  src: string;
  hero?: boolean;
  category: string;
  description: string;
  palette: string;
  focus: string;
};

const screenshots: Shot[] = [
  {
    slug: "hero-cards",
    name: "Hero · Tilted cards",
    file: "hero-cards.png",
    src: `${base}/hero-cards.png`,
    hero: true,
    category: "Hero",
    description: "Stacked cards leaning into amber glass, paired with microcopy on the right side.",
    palette: "Ember 500 + ember glow",
    focus: "Depth via layered glass",
  },
  {
    slug: "scores",
    name: "Scores block",
    file: "scores.png",
    src: `${base}/scores.png`,
    category: "Stats",
    description: "Three up metrics with a vertical glow bar anchoring the card body.",
    palette: "Orange to peach gradient",
    focus: "Typography contrast",
  },
  {
    slug: "pipeline",
    name: "Pipeline",
    file: "pipeline.png",
    src: `${base}/pipeline.png`,
    category: "Motion",
    description: "Laser beam transport with ripple rings for the entry nodes.",
    palette: "Fire 600 + neon",
    focus: "Animated glow",
  },
  {
    slug: "network",
    name: "Network",
    file: "network.png",
    src: `${base}/network.png`,
    category: "Diagram",
    description: "Connected graph nodes with rotating halos and grainy background.",
    palette: "Marigold dots on charcoal",
    focus: "Wiggle interactions",
  },
  {
    slug: "rising",
    name: "Rising chart",
    file: "rising.png",
    src: `${base}/rising.png`,
    category: "Chart",
    description: "Tall growth graph with hacking-green guides for contrast.",
    palette: "Amber + acid grid",
    focus: "Gradient lighting",
  },
  {
    slug: "mobile",
    name: "Responsive mockups",
    file: "responsive.png",
    src: `${base}/responsive.png`,
    category: "Device",
    description: "Phone + desktop pairings with floating CTA badges in ember mode.",
    palette: "Burnt orange mix",
    focus: "Device reflections",
  },
];

export default screenshots;
