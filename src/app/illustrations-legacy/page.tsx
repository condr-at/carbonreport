import fs from "fs/promises";
import path from "path";
import { LegacyGallery } from "./legacy-gallery";
import { ILLUSTRATION_SNIPPETS } from "../illustrations-demo/page";

async function loadLegacySnippets() {
  const snippetsDir = path.join(
    process.cwd(),
    "src",
    "app",
    "illustrations-demo",
    "Launch UI",
    "card-snippets"
  );

  const cards = await Promise.all(
    ILLUSTRATION_SNIPPETS.map(async (item, index) => {
      const filePath = path.join(snippetsDir, item.file);
      const html = await fs.readFile(filePath, "utf8");
      return {
        ...item,
        html,
        index,
        slug: `${item.slug}-legacy`,
        layout: item.layout ?? "card",
      };
    })
  );

  return cards;
}

export const dynamic = "force-static";

export default async function LegacyIllustrationsPage() {
  const cards = await loadLegacySnippets();
  return <LegacyGallery cards={cards} />;
}