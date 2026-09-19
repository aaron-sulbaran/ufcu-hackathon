// Tag plus keyword scoring over the corpus. No embeddings: 17 pages does not need a vector store.
import { CORPUS, type CorpusDoc } from "@/lib/ai/corpus";
import type { Audience } from "@/lib/types";

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "for", "with", "my", "me", "i",
  "is", "are", "do", "does", "can", "what", "how", "do", "you", "your", "it", "at", "be", "have",
  "get", "need", "want", "about", "from", "this", "that", "there", "was", "were", "will", "would",
]);

export interface Scored {
  doc: CorpusDoc;
  score: number;
}

function terms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function scoreDoc(doc: CorpusDoc, words: string[], audience?: Audience): number {
  const title = doc.title.toLowerCase();
  const tags = doc.tags.join(" ").toLowerCase();
  const body = doc.body.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (tags.includes(w)) score += 6;
    if (title.includes(w)) score += 4;
    if (body.includes(w)) score += 1;
  }
  if (audience && doc.audience.includes(audience)) score += 3;
  return score;
}

export function retrieve(query: string, audience?: Audience, limit = 6): Scored[] {
  const words = terms(query);
  const scored = CORPUS.map((doc) => ({ doc, score: scoreDoc(doc, words, audience) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length === 0) {
    // Nothing matched: fall back to the pages every new member needs.
    const fallback = ["open-account-requirements", "membership-eligibility", "savings-overview"];
    return CORPUS.filter((d) => fallback.includes(d.slug)).map((doc) => ({ doc, score: 0 }));
  }
  return scored.slice(0, limit);
}

// One-line summary for a resource card: the first sentence of the body, trimmed.
export function firstSentence(body: string, max = 180): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const dot = flat.indexOf(". ");
  const sentence = dot === -1 ? flat : flat.slice(0, dot + 1);
  return sentence.length > max ? `${sentence.slice(0, max - 1).trimEnd()}...` : sentence;
}
