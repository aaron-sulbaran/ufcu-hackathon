// Lane A owns data/personas.json. The loader tolerates a missing, empty, or malformed file so the
// Secure Zone can always fall back to rule-based verification and decisions.
// The readout, decision, and next steps come back as i18n keys, so they render in the current language.
import personasJson from "@/data/personas.json";
import { keyedPersona } from "@/lib/ai/personas";
import type { IdentityPath, PersonaScript, Result } from "@/lib/types";

let cache: PersonaScript[] | null = null;

export async function loadPersonas(): Promise<Result<PersonaScript[]>> {
  if (cache) return { data: cache };
  try {
    const raw: unknown = personasJson;
    cache = Array.isArray(raw) ? (raw as unknown as PersonaScript[]).map(keyedPersona) : [];
    return { data: cache };
  } catch {
    cache = [];
    return { data: cache };
  }
}

export async function findPersona(id?: string): Promise<PersonaScript | null> {
  if (!id) return null;
  const { data } = await loadPersonas();
  return data?.find((p) => p?.id === id) ?? null;
}

// A scripted persona only speaks for the path it was written for. Step 1 is editable, so when the
// person picks a different path the rules take over and the readout matches what they chose.
export async function findPersonaForPath(id: string | undefined, path: IdentityPath): Promise<PersonaScript | null> {
  const persona = await findPersona(id);
  if (!persona) return null;
  return persona.prefill?.path === path ? persona : null;
}
