// Narrow an AI SDK UI message part to a finished tool result. The transport types tool parts
// as `tool-${name}` with a state machine; we only render the finished state.
import type { ToolName } from "@/lib/types";

interface LoosePart {
  type: string;
  state?: string;
  output?: unknown;
  data?: unknown;
}

export function toolOutput<T>(part: { type: string }, name: ToolName): T | null {
  const p = part as LoosePart;
  if (p.type !== `tool-${name}`) return null;
  if (p.state !== "output-available" || p.output == null) return null;
  return p.output as T;
}

export function isScriptedMarker(part: { type: string }): boolean {
  const p = part as LoosePart;
  if (p.type !== "data-mode") return false;
  const data = p.data as { mode?: string } | undefined;
  return data?.mode === "scripted";
}

export function partText(part: { type: string }): string | null {
  const p = part as LoosePart & { text?: string };
  return p.type === "text" && typeof p.text === "string" ? p.text : null;
}

// Every product the desk has shown this visit, latest card per id. The person can click "Open"
// on a card from an earlier turn, so the reason lines have to outlive the turn that produced them.
export function collectRecommended<P extends { id: string }>(messages: { parts: { type: string }[] }[]): P[] {
  const byId = new Map<string, P>();
  for (const message of messages) {
    for (const part of message.parts) {
      const list = toolOutput<P[]>(part, "recommendProducts");
      if (list) for (const product of list) byId.set(product.id, product);
    }
  }
  return [...byId.values()];
}

// The left panel reads the latest result of each tool, so "Your visit so far" always shows
// the current bundle and checklist rather than whatever scrolled past.
export function collectVisit<P, E, A>(messages: { parts: { type: string }[] }[]) {
  let products: P | null = null;
  let eligibility: E | null = null;
  let prefill: A | null = null;
  for (const message of messages) {
    for (const part of message.parts) {
      products = toolOutput<P>(part, "recommendProducts") ?? products;
      eligibility = toolOutput<E>(part, "checkEligibility") ?? eligibility;
      prefill = toolOutput<A>(part, "startApplication") ?? prefill;
    }
  }
  return { products, eligibility, prefill };
}
