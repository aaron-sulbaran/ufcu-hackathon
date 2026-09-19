// A scripted turn arrives in the language selected when it was sent. Its data-mode marker says where
// it came from, so the page redraws it in the current language: a persona turn from the script,
// a generic line from its dictionary key. Live model turns stay as written.
import { getPersona, isScriptedLine, localizePersona, scriptedLine } from "@/lib/ai/personas";
import { t } from "@/lib/i18n-core";
import type { Lang } from "@/lib/types";

interface LoosePart {
  type: string;
  text?: string;
  output?: unknown;
  data?: unknown;
}

interface Source {
  mode?: string;
  personaId?: string;
  turn?: number;
  textKey?: string;
}

function sourceOf(parts: LoosePart[]): Source | null {
  const marker = parts.find((p) => p.type === "data-mode");
  const data = marker?.data as Source | undefined;
  return data?.mode === "scripted" ? data : null;
}

export function localizeParts<P extends { type: string }>(parts: P[], lang: Lang): P[] {
  const source = sourceOf(parts as LoosePart[]);
  if (!source) return parts;

  if (source.textKey) {
    const text = t(lang, source.textKey);
    return parts.map((p) => (p.type === "text" ? { ...p, text } : p));
  }

  const persona = getPersona(source.personaId);
  const turn = persona && typeof source.turn === "number" ? localizePersona(persona, lang).turns[source.turn] : undefined;
  if (!turn) return parts;
  return parts.map((p) => {
    if (p.type === "text") return { ...p, text: turn.assistant.text };
    const call = turn.assistant.tools?.find((c) => p.type === `tool-${c.name}`);
    return call && (p as LoosePart).output != null ? { ...p, output: call.result } : p;
  });
}

// A person's message that was a persona's scripted line reads in the current language too.
export function localizeUserText(text: string, personaId: string | undefined, userIndex: number, lang: Lang): string {
  if (!isScriptedLine(personaId, userIndex, text)) return text;
  return scriptedLine(personaId, userIndex, lang) ?? text;
}
