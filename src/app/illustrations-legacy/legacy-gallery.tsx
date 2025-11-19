"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IllustrationCard } from "@/app/illustrations-demo/gallery";

export function LegacyGallery({ cards }: { cards: IllustrationCard[] }) {
  return (
    <div className="legacy-illustrations min-h-screen bg-background text-foreground">
      <Header total={cards.length} />
      <Hero />
      <PaletteCallout />
      <LegacySnippets cards={cards} />
      <FooterNote />
    </div>
  );
}

function Header({ total }: { total: number }) {
  return (
    <div className="border-b border-border bg-card/70 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-5">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <Badge variant="outline">{total} Ember blocks</Badge>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-card via-card/80 to-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4" variant="secondary">
          2024 archive
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Launch UI · Ember offline wall
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Before the emerald redesign we hard-themed every illustration to a burnt orange palette.
          This page renders the original HTML exports directly, so everything works without network
          calls or React hydration.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/illustrations-demo">View current playground</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/AGENT_PROMPT">Read design history</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PaletteCallout() {
  return (
    <section className="border-b border-border bg-card/60">
      <div className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Tokens</p>
          <h2 className="mt-3 text-2xl font-semibold">Ember preset</h2>
          <p className="mt-2 text-muted-foreground">
            We pin the key CSS variables inside the `.legacy-illustrations` wrapper so the snippets
            pick up the old gradient + glass values.
          </p>
          <div className="mt-4 grid gap-3 text-sm">
            <Swatch name="--brand" value="oklch(66.5% 0.1804 47.04)" />
            <Swatch name="--brand-foreground" value="oklch(75.77% 0.159 55.91)" />
            <Swatch name="--light" value="brand × 0.65 + white" />
          </div>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Usage</p>
          <h2 className="mt-3 text-2xl font-semibold">How to reuse offline</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Copy a snippet&apos;s HTML.</li>
            <li>2. Wrap your section with `.legacy-illustrations`.</li>
            <li>3. Paste the markup into any static page.</li>
            <li>4. Optionally tweak CSS variables for brand accents.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{name}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
      <span className="h-9 w-9 rounded-full border border-border/80" style={{ background: "var(--brand)" }} />
    </div>
  );
}

function LegacySnippets({ cards }: { cards: IllustrationCard[] }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-10 text-center">
          <Badge className="mb-3" variant="outline">
            Offline snippets
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Direct HTML exports (ember skin)
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
            Every block below renders straight from the raw Launch UI capture. No React components,
            only markup + CSS variables so it keeps working offline.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) =>
            card.layout === "wide" ? (
              <WideSnippetCard key={card.slug} card={card} />
            ) : (
              <SnippetCard key={card.slug} card={card} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function SnippetCard({ card }: { card: IllustrationCard }) {
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

function WideSnippetCard({ card }: { card: IllustrationCard }) {
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

function SnippetMeta({
  card,
  withDivider = true,
}: {
  card: IllustrationCard;
  withDivider?: boolean;
}) {
  return (
    <div className={cn("p-4", withDivider && "border-t border-border")}>
      <p className="text-xs font-mono text-muted-foreground">{card.file}</p>
      <h3 className="mt-1 text-lg font-semibold">{card.name}</h3>
      <p className="text-sm text-muted-foreground">{card.description}</p>
    </div>
  );
}

function FooterNote() {
  return (
    <section className="bg-card/70">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Need more?</p>
        <h3 className="text-2xl font-semibold">Use the raw crawl in `temp/illustrations-ref`</h3>
        <p className="max-w-2xl text-muted-foreground">
          The full Launch UI export (HTML + JS + CSS) still lives in the repo under `temp`. Keep it
          around for reference or re-run the scrape if we ever change palettes again.
        </p>
      </div>
    </section>
  );
}
