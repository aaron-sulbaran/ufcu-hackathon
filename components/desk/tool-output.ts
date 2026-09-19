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
