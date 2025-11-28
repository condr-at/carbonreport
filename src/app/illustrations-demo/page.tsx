import fs from "fs/promises";
import path from "path";
import { Gallery } from "./gallery";

type SnippetLayout = "card" | "wide";

const ILLUSTRATION_SNIPPETS: Array<{
  name: string;
  description: string;
  file: string;
  layout?: SnippetLayout;
}> = [
  {
    name: "Globe",
    description: "Animated rotating globe with connection points",
    file: "01_GlobeIllustration.html",
  },
  {
    name: "Cards",
    description: "Floating card deck with hover effects",
    file: "02_CardsIllustration.html",
  },
  {
    name: "Scores",
    description: "Triple score widget with gauges and stats",
    file: "03_ScoresIllustration.html",
  },
  {
    name: "Line Chart",
    description: "Animated line chart with data points",
    file: "04_LineChartIllustration.html",
  },
  {
    name: "Bar Chart",
    description: "Growing stacked bar chart",
    file: "05_BarChartIllustration.html",
  },
  {
    name: "Radar Small",
    description: "Compact radar chart visualization",
    file: "06_RadarSmallIllustration.html",
  },
  {
    name: "Ripple",
    description: "Expanding ripple circles animation",
    file: "07_RippleIllustration.html",
  },
  {
    name: "Tiles",
    description: "Grid of interactive tiles",
    file: "08_TilesIllustration.html",
  },
  {
    name: "Mockup Mobile",
    description: "Futuristic mobile mockup with glow",
    file: "09_MockupMobileIllustration.html",
  },
  {
    name: "Pipeline",
    description: "Data transfer beam between nodes",
    file: "10_PipelineIllustration.html",
  },
  {
    name: "Chat",
    description: "Conversation bubbles with AI hints",
    file: "11_ChatIllustration.html",
  },
  {
    name: "Waves",
    description: "Layered gradient waves",
    file: "12_WavesIllustration.html",
  },
  {
    name: "Mockup Mobile Top",
    description: "Phone mockup with cards",
    file: "13_MockupMobileTopIllustration.html",
  },
  {
    name: "Carousel",
    description: "Sliding testimonial carousel",
    file: "14_CarouselIllustration.html",
  },
  {
    name: "Rising Small",
    description: "Animated column sparkline",
    file: "15_RisingSmall.html",
  },
  {
    name: "Network",
    description: "Connected nodes network visualization",
    file: "16_NetworkIllustration.html",
  },
  {
    name: "Code Editor",
    description: "Code editor with syntax highlighting",
    file: "17_CodeEditorIllustration.html",
  },
  {
    name: "Infrastructure",
    description: "Server infrastructure visualization",
    file: "18_InfrastructureIllustration.html",
  },
  {
    name: "Mockup Browser",
    description: "Browser window with animated content",
    file: "19_MockupBrowserIllustration.html",
    layout: "wide",
  },
  {
    name: "Responsive Bottom",
    description: "Responsive mockups row (bottom)",
    file: "20_MockupResponsiveBottomIllustration.html",
    layout: "wide",
  },
  {
    name: "Responsive Top",
    description: "Responsive mockups row (top)",
    file: "21_MockupResponsiveTopIllustration.html",
    layout: "wide",
  },
  {
    name: "Radar Large",
    description: "Full radar chart",
    file: "22_Radar.html",
    layout: "wide",
  },
  {
    name: "Rising Large",
    description: "Tall bar/line growth chart",
    file: "23_RisingLarge.html",
    layout: "wide",
  },
];

async function loadSnippets() {
  const snippetsDir = path.join(process.cwd(), "public", "illustrations", "snippets");
  const cards = await Promise.all(
    ILLUSTRATION_SNIPPETS.map(async (item, index) => {
      const filePath = path.join(snippetsDir, item.file);
      const html = await fs.readFile(filePath, "utf8");
      return {
        ...item,
        html,
        index,
        slug: item.file.replace(/\.html$/, ""),
        layout: item.layout ?? "card",
      };
    })
  );

  return cards;
}

export default async function IllustrationsDemo() {
  const cards = await loadSnippets();

  return <Gallery cards={cards} />;
}
