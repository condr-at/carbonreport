import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";

const SNIPPET_URL = "https://www.launchuicomponents.com/illustrations";
const OUTPUT_DIR = path.resolve("temp/launch-snippets/latest");

const FILE_MAP: Record<string, string> = {
  GlobeIllustration: "01_GlobeIllustration.html",
  CardsIllustration: "02_CardsIllustration.html",
  ScoresIllustration: "03_ScoresIllustration.html",
  LineChartIllustration: "04_LineChartIllustration.html",
  BarChartIllustration: "05_BarChartIllustration.html",
  RadarSmallIllustration: "06_RadarSmallIllustration.html",
  RippleIllustration: "07_RippleIllustration.html",
  TilesIllustration: "08_TilesIllustration.html",
  MockupMobileIllustration: "09_MockupMobileIllustration.html",
  PipelineIllustration: "10_PipelineIllustration.html",
  ChatIllustration: "11_ChatIllustration.html",
  WavesIllustration: "12_WavesIllustration.html",
  MockupMobileTopIllustration: "13_MockupMobileTopIllustration.html",
  CarouselIllustration: "14_CarouselIllustration.html",
  RisingSmall: "15_RisingSmall.html",
  NetworkIllustration: "16_NetworkIllustration.html",
  CodeEditorIllustration: "17_CodeEditorIllustration.html",
  InfrastructureIllustration: "18_InfrastructureIllustration.html",
  MockupBrowserIllustration: "19_MockupBrowserIllustration.html",
  MockupResponsiveBottomIllustration: "20_MockupResponsiveBottomIllustration.html",
  MockupResponsiveTopIllustration: "21_MockupResponsiveTopIllustration.html",
  Radar: "22_Radar.html",
  RisingLarge: "23_RisingLarge.html",
};

type RawSnapshot = {
  name: string | null;
  html: string;
};

const normaliseTitle = (raw: string | null): string | null => {
  if (!raw) return null;
  return raw.replace(/[<>/\s]/g, "").trim();
};

async function collectSnapshots() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(SNIPPET_URL, { waitUntil: "networkidle0", timeout: 120_000 });
  await page.waitForSelector('[data-slot="card"]', { timeout: 120_000 });

  const snapshots: RawSnapshot[] = await page.evaluate(() => {
    const cards = Array.from(
      document.querySelectorAll('[data-slot="card"]')
    ) as HTMLElement[];

    return cards.map((card) => {
      const titleEl = card.querySelector('[data-slot="card-title"]');
      const text = titleEl?.textContent ?? null;
      const html = card.outerHTML;
      return { name: text, html };
    });
  });

  await browser.close();
  return snapshots;
}

async function writeSnapshots(snapshots: RawSnapshot[]) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const written = new Map<string, string>();

  for (const snapshot of snapshots) {
    const normalised = normaliseTitle(snapshot.name);
    if (!normalised) continue;
    const targetFile = FILE_MAP[normalised];

    if (!targetFile) continue;
    if (written.has(normalised)) continue;

    await fs.writeFile(
      path.join(OUTPUT_DIR, targetFile),
      snapshot.html,
      "utf8"
    );
    written.set(normalised, targetFile);
  }

  const missing = Object.keys(FILE_MAP).filter((key) => !written.has(key));

  return { count: written.size, missing };
}

async function main() {
  console.log(`Fetching snippets from ${SNIPPET_URL}...`);
  const snapshots = await collectSnapshots();
  console.log(`Captured ${snapshots.length} raw cards.`);

  const { count, missing } = await writeSnapshots(snapshots);

  console.log(`Stored ${count} snippets in ${OUTPUT_DIR}.`);
  if (missing.length) {
    console.warn("Missing snippets:", missing.join(", "));
  }
}

main().catch((error) => {
  console.error("Failed to capture snippets", error);
  process.exitCode = 1;
});
