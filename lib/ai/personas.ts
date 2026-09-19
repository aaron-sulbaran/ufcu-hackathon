// Scripted persona turns. These render through the same cards as live turns, so the demo
// looks identical whether or not the model answers.
import personas from "@/data/personas.json";
import type { PersonaScript, ScriptedTurn } from "@/lib/types";

export const PERSONAS = personas as unknown as PersonaScript[];

export function getPersona(id: string | undefined | null): PersonaScript | undefined {
  if (!id) return undefined;
  return PERSONAS.find((p) => p.id === id);
}

export function nextScriptedTurn(personaId: string | undefined | null, turnIndex: number): ScriptedTurn | undefined {
  const persona = getPersona(personaId);
  if (!persona) return undefined;
  return persona.turns[turnIndex];
}

export const PERSONA_CHIPS = PERSONAS.map((p) => ({ id: p.id, chipLabel: p.chipLabel, blurb: p.blurb }));
