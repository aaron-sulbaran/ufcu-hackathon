// Scripted persona turns. These render through the same cards as live turns, so the demo
// looks identical whether or not the model answers.
// data/personas.json holds each script in its native language; the text for every language lives
// in messages/content/*.json under persona.<id>.*, so a script plays in whatever language is selected.
import personas from "@/data/personas.json";
import { LANG_CODES, lookup } from "@/lib/i18n-core";
import type { ApplicationPrefill, EligibilityResult, Lang, PersonaScript, ProductCard, ScriptedTurn } from "@/lib/types";

export const PERSONAS = personas as unknown as PersonaScript[];

export function getPersona(id: string | undefined | null): PersonaScript | undefined {
  if (!id) return undefined;
  return PERSONAS.find((p) => p.id === id);
}

function reasons(tr: (key: string, native: string) => string, from?: Record<string, string>) {
  if (!from) return undefined;
  return Object.fromEntries(Object.entries(from).map(([id, s]) => [id, tr(`reason.${id}`, s)]));
}

export function localizePersona(p: PersonaScript, lang: Lang): PersonaScript {
  const tr = (key: string, native: string) => lookup(lang, `persona.${p.id}.${key}`) ?? native;
  const prefill: ApplicationPrefill = {
    ...p.prefill,
    context: { ...p.prefill.context, lang },
    notes: p.prefill.notes.map((n, j) => tr(`note${j}`, n)),
    productReasons: reasons(tr, p.prefill.productReasons),
  };
  const tool = (call: NonNullable<ScriptedTurn["assistant"]["tools"]>[number]) => {
    if (call.name === "recommendProducts") {
      const cards = (call.result as ProductCard[]).map((c) => ({ ...c, reason: c.reason && tr(`reason.${c.id}`, c.reason) }));
      return { ...call, result: cards };
    }
    if (call.name === "checkEligibility") {
      const r = call.result as EligibilityResult;
      const result: EligibilityResult = {
        ...r,
        documents: r.documents.map((d, j) => tr(`doc${j}`, d)),
        notes: r.notes.map((n, j) => tr(`eligNote${j}`, n)),
      };
      return { ...call, result };
    }
    if (call.name === "startApplication") return { ...call, result: prefill };
    return call;
  };
  const decision =
    p.decision.kind === "needs_item"
      ? { ...p.decision, item: tr("decision.item", p.decision.item), how: p.decision.how.map((h, j) => tr(`decision.how${j}`, h)) }
      : p.decision;
  return {
    ...p,
    context: { ...p.context, lang },
    prefill,
    turns: p.turns.map((turn, i) => ({
      user: tr(`turn${i}.user`, turn.user),
      assistant: { text: tr(`turn${i}.text`, turn.assistant.text), tools: turn.assistant.tools?.map(tool) },
    })),
    trust: { ...p.trust, checks: p.trust.checks.map((c) => ({ ...c, detail: tr(`trust.${c.id}`, c.detail) })) },
    decision,
    nextSteps: p.nextSteps.map((s, j) => ({ ...s, title: tr(`next${j}.title`, s.title), detail: tr(`next${j}.detail`, s.detail) })),
  };
}

// The Secure Zone stores the readout, decision, and next steps, then renders them through t().
// Handing it keys instead of text lets a language switch redraw them.
export function keyedPersona(p: PersonaScript): PersonaScript {
  const key = (k: string) => `persona.${p.id}.${k}`;
  const decision =
    p.decision.kind === "needs_item"
      ? { ...p.decision, item: key("decision.item"), how: p.decision.how.map((_, j) => key(`decision.how${j}`)) }
      : p.decision;
  return {
    ...p,
    trust: { ...p.trust, checks: p.trust.checks.map((c) => ({ ...c, detail: key(`trust.${c.id}`) })) },
    decision,
    nextSteps: p.nextSteps.map((s, j) => ({ ...s, title: key(`next${j}.title`), detail: key(`next${j}.detail`) })),
  };
}

export function sameQuestion(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").replace(/[.,!?¿¡]/g, "").trim();
  return norm(a) === norm(b);
}

// The persona's line for this turn, in the given language.
export function scriptedLine(personaId: string | undefined | null, turnIndex: number, lang: Lang): string | undefined {
  const persona = getPersona(personaId);
  if (!persona?.turns[turnIndex]) return undefined;
  return lookup(lang, `persona.${persona.id}.turn${turnIndex}.user`) ?? persona.turns[turnIndex].user;
}

// True when the text is this turn's scripted line in any language, so a line sent before a
// language switch still counts as on-script.
export function isScriptedLine(personaId: string | undefined | null, turnIndex: number, text: string): boolean {
  return LANG_CODES.some((lang) => {
    const line = scriptedLine(personaId, turnIndex, lang);
    return line !== undefined && sameQuestion(line, text);
  });
}

export function nextScriptedTurn(personaId: string | undefined | null, turnIndex: number, lang: Lang): ScriptedTurn | undefined {
  const persona = getPersona(personaId);
  if (!persona) return undefined;
  return localizePersona(persona, lang).turns[turnIndex];
}
