// Loads data/corpus/*.md once at module load. Frontmatter is parsed by hand so we add no dependency.
// Server only: this reads the filesystem.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Audience } from "@/lib/types";

export interface CorpusDoc {
  slug: string;
  url: string;
  title: string;
  tags: string[];
  audience: Audience[];
  body: string;
}

const DIR = join(process.cwd(), "data", "corpus");

function parseList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
  return inner
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function parseDoc(slug: string, file: string): CorpusDoc | null {
  if (!file.startsWith("---")) return null;
  const end = file.indexOf("\n---", 3);
  if (end === -1) return null;
  const head = file.slice(3, end);
  const body = file.slice(end + 4).trim();
  const fields: Record<string, string> = {};
  for (const line of head.split("\n")) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    fields[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  if (!fields.url || !fields.title) return null;
  return {
    slug,
    url: fields.url,
    title: fields.title,
    tags: fields.tags ? parseList(fields.tags) : [],
    audience: (fields.audience ? parseList(fields.audience) : []) as Audience[],
    body,
  };
}

function load(): CorpusDoc[] {
  const docs: CorpusDoc[] = [];
  for (const name of readdirSync(DIR)) {
    if (!name.endsWith(".md")) continue;
    const doc = parseDoc(name.replace(/\.md$/, ""), readFileSync(join(DIR, name), "utf8"));
    if (doc) docs.push(doc);
  }
  return docs.sort((a, b) => a.slug.localeCompare(b.slug));
}

export const CORPUS: CorpusDoc[] = load();

export const CORPUS_URLS: string[] = CORPUS.map((d) => d.url);

// One line per page for the system prompt. Cheap, cacheable, and it tells the model what exists.
export function corpusIndex(): string {
  return CORPUS.map((d) => `- ${d.title} | tags: ${d.tags.join(", ")} | ${d.url}`).join("\n");
}

export function docByUrl(url: string): CorpusDoc | undefined {
  return CORPUS.find((d) => d.url === url);
}
