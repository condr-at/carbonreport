"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChartIllustration,
  CardsIllustration,
  CodeEditorIllustration,
  GlobeIllustration,
  InfrastructureIllustration,
  LineChartIllustration,
  MockupBrowserIllustration,
  NetworkIllustration,
  RadarIllustration,
  RippleIllustration,
  TilesIllustration,
  WavesIllustration,
} from "@/components/website-illustrations";

export type IllustrationCard = {
  name: string;
  description: string;
  file: string;
  html: string;
  index: number;
  slug: string;
  layout: "card" | "wide";
};

const componentIllustrations: Array<{
  name: string;
  description: string;
  component: ReactNode;
  code: string;
  slug: string;
}> = [
  {
    name: "Globe",
    description: "Animated rotating globe with connection points",
    component: <GlobeIllustration />,
    code: `<GlobeIllustration />`,
    slug: "globe",
  },
  {
    name: "Cards",
    description: "Floating card deck with hover effects",
    component: <CardsIllustration />,
    code: `<CardsIllustration />`,
    slug: "cards",
  },
  {
    name: "Ripple",
    description: "Expanding ripple circles animation",
    component: <RippleIllustration />,
    code: `<RippleIllustration />`,
    slug: "ripple",
  },
  {
    name: "Tiles",
    description: "Grid of interactive tiles",
    component: <TilesIllustration />,
    code: `<TilesIllustration />`,
    slug: "tiles",
  },
  {
    name: "Waves",
    description: "Smooth animated wave patterns",
    component: <WavesIllustration />,
    code: `<WavesIllustration />`,
    slug: "waves",
  },
  {
    name: "Network",
    description: "Connected nodes network visualization",
    component: <NetworkIllustration />,
    code: `<NetworkIllustration />`,
    slug: "network",
  },
  {
    name: "Line Chart",
    description: "Animated line chart with data points",
    component: <LineChartIllustration />,
    code: `<LineChartIllustration />`,
    slug: "line-chart",
  },
  {
    name: "Bar Chart",
    description: "Growing bar chart animation",
    component: <BarChartIllustration />,
    code: `<BarChartIllustration />`,
    slug: "bar-chart",
  },
  {
    name: "Radar",
    description: "Pentagon radar chart visualization",
    component: <RadarIllustration />,
    code: `<RadarIllustration />`,
    slug: "radar",
  },
  {
    name: "Browser Mockup",
    description: "Browser window with animated content",
    component: <MockupBrowserIllustration />,
    code: `<MockupBrowserIllustration />`,
    slug: "browser",
  },
  {
    name: "Code Editor",
    description: "Code editor with syntax highlighting",
    component: <CodeEditorIllustration />,
    code: `<CodeEditorIllustration />`,
    slug: "code-editor",
  },
  {
    name: "Infrastructure",
    description: "Server infrastructure visualization",
    component: <InfrastructureIllustration />,
    code: `<InfrastructureIllustration />`,
    slug: "infrastructure",
  },
];

export function Gallery({ cards }: { cards: IllustrationCard[] }) {
  const total = cards.length + componentIllustrations.length;

  return (
    <div className="min-h-screen bg-background">
      <Header total={total} />
      <Hero />

      <ComponentLibrary illustrations={componentIllustrations} />

      <OfflineSnippets cards={cards} />

      <UsageSection />
    </div>
  );
}

function ComponentLibrary({
  illustrations,
}: {
  illustrations: typeof componentIllustrations;
}) {
  return (
    <section className="border-b border-border bg-muted/10">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-10 text-center">
          <Badge className="mb-3" variant="outline">
            React components
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Interactive illustration components
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            The original React components from `@/components/website-illustrations` remain available.
            Drop them into your app, tweak props, and keep Tailwind theming intact.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {illustrations.map((item) => (
            <article
              key={item.slug}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative bg-gradient-to-b from-muted/40 to-background p-4">
                <div className="rounded-xl border border-border/40 bg-background/80 p-4">
                  {item.component}
                </div>
              </div>
              <div className="border-t border-border p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-2 text-xs font-mono text-muted-foreground">{item.code}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfflineSnippets({ cards }: { cards: IllustrationCard[] }) {
  const specialRange = {
    startSlug: "16_NetworkIllustration",
    endSlug: "21_MockupResponsiveTopIllustration",
  } as const;

  const startIndex = cards.findIndex((card) => card.slug === specialRange.startSlug);
  const endIndex = cards.findIndex((card) => card.slug === specialRange.endSlug);
  const hasSpecialRange = startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex;

  const beforeCards = hasSpecialRange ? cards.slice(0, startIndex) : cards;
  const twoColumnCards = hasSpecialRange ? cards.slice(startIndex, endIndex + 1) : [];
  const afterCards = hasSpecialRange ? cards.slice(endIndex + 1) : [];

  const sections = hasSpecialRange
    ? [
        { cards: beforeCards, columns: "default" as const },
        { cards: twoColumnCards, columns: "two" as const },
        { cards: afterCards, columns: "default" as const },
      ]
    : [{ cards, columns: "default" as const }];

  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-10 text-center">
          <Badge className="mb-3" variant="secondary">
            Offline snippets
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            HTML exports from Launch UI
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
            Each card below is the exact markup captured from the Launch UI illustrations page.
            Combine them with the mirrored CSS files to recreate the showcase without network calls.
          </p>
        </header>

        <div className="space-y-12">
          {sections
            .filter((section) => section.cards.length > 0)
            .map((section, index) => (
              <SnippetGrid key={`${section.columns}-${index}`} cards={section.cards} columns={section.columns} />
            ))}
        </div>
      </div>
    </section>
  );
}

function SnippetGrid({
  cards,
  columns = "default",
}: {
  cards: IllustrationCard[];
  columns?: "default" | "two";
}) {
  if (cards.length === 0) {
    return null;
  }

  const className =
    columns === "two" ? "grid gap-8 md:grid-cols-2" : "grid gap-8 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={className}>
      {cards.map((card) => {
        const shouldForceCardLayout = columns === "two";

        if (!shouldForceCardLayout && card.layout === "wide") {
          return <WideSnippetCard key={card.slug} card={card} />;
        }

        return <SnippetCard key={card.slug} card={card} />;
      })}
    </div>
  );
}

function SnippetCard({
  card,
}: {
  card: IllustrationCard;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative bg-gradient-to-b from-muted/40 to-background p-4">
        <div className="rounded-xl border border-border/40 bg-background/80 p-2">
          <div className="launch-ui-card" dangerouslySetInnerHTML={{ __html: card.html }} />
        </div>
      </div>
      <SnippetMeta card={card} />
    </article>
  );
}

function WideSnippetCard({
  card,
}: {
  card: IllustrationCard;
}) {
  return (
    <article className="col-span-full">
      <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-background/80 p-2 sm:p-4">
        <div className="launch-ui-card" dangerouslySetInnerHTML={{ __html: card.html }} />
      </div>
      <div className="mt-4 rounded-3xl border border-border/50 bg-card/60 p-4">
        <SnippetMeta card={card} withDivider={false} />
      </div>
    </article>
  );
}

function SnippetMeta({ card, withDivider = true }: { card: IllustrationCard; withDivider?: boolean }) {
  return (
    <div className={cn("p-4", withDivider && "border-t border-border")}>
      <p className="text-xs font-mono text-muted-foreground">{card.file}</p>
      <h3 className="mt-1 text-lg font-semibold">{card.name}</h3>
      <p className="text-sm text-muted-foreground">{card.description}</p>
    </div>
  );
}

function Header({ total }: { total: number }) {
  return (
    <div className="border-b border-border bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <Badge variant="outline">{total} Illustrations</Badge>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4" variant="secondary">
          React + Offline Illustrations
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Launch UI Illustration Playground
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Preview the live React components and their pure HTML counterparts on a single page.
          Copy JSX for your app, or grab the exported markup that works 100% offline with the bundled CSS.
        </p>
      </div>
    </div>
  );
}

function UsageSection() {
  return (
    <div className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Use it your way</h2>

          <div className="space-y-10">
            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">React component workflow</h3>
              <div className="space-y-6">
                <UsageStep
                  title="1. Import the component"
                  code={`import { GlobeIllustration } from "@/components/website-illustrations";`}
                  description="Grab any illustration directly from the shared website-illustrations barrel file."
                />
                <UsageStep
                  title="2. Use it like any JSX"
                  code={`export default function MyComponent() {
  return (
    <div>
      <GlobeIllustration className="my-custom-class" />
    </div>
  );
}`}
                  description="They render as regular React components, so you can wrap them with your own markup or animation controls."
                />
                <UsageStep
                  title="3. Tweak with Tailwind"
                  code={`<GlobeIllustration className="h-96 w-full" />
<CardsIllustration className="rounded-2xl shadow-xl" />`}
                  description="Pass custom classNames, use CSS variables, or duplicate them to craft your own layouts."
                />
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">Offline snippet workflow</h3>
              <div className="space-y-6">
                <UsageStep
                  title="1. Use global CSS variables"
                  code={`/* In your globals.css */
:root {
  --brand: var(--primary);
  --brand-foreground: var(--primary-foreground);
  --light: color-mix(in oklab, var(--primary) 60%, white);
  --light-foreground: color-mix(in oklab, var(--primary) 75%, black);
}`}
                  description="The illustrations use CSS variables that automatically adapt to your theme."
                />
                <UsageStep
                  title="2. Paste the snippet markup"
                  code={`<div class="glass-1 ...">
  <!-- full snippet content -->
</div>`}
                  description="Copy a card's HTML and drop it into any HTML/MDX page or CMS block."
                />
                <UsageStep
                  title="3. Customize tokens"
                  code={`:root {
  --brand: oklch(0.8348 0.1302 160.9080); /* Supabase green */
}`}
                  description="Override CSS variables to match your brand colors and theme."
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <FeatureCard title="Theme aware" description="All illustrations use global CSS variables and adapt to your theme automatically." emoji="🎨" />
            <FeatureCard title="Pure HTML" description="Snippets rely only on CSS variables — no React components required." emoji="🧩" />
            <FeatureCard title="Dark-mode aware" description="The stylesheets still respond to the dark theme variables." emoji="🌙" />
            <FeatureCard title="Copy friendly" description="Markup and JSX live directly in this repo, ready to paste wherever you need." emoji="📋" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageStep({
  title,
  code,
  description,
}: {
  title: string;
  code: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="relative overflow-hidden rounded-lg border border-border bg-slate-950">
        <pre className="overflow-x-auto p-4">
          <code className="text-sm text-slate-100">{code}</code>
        </pre>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  emoji,
}: {
  title: string;
  description: string;
  emoji: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-left">
      <span className="text-2xl" role="img" aria-hidden>
        {emoji}
      </span>
      <h4 className="mt-2 font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
