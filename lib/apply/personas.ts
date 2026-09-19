// Lane A owns data/personas.json. The loader tolerates a missing, empty, or malformed file so the
// Secure Zone can always fall back to rule-based verification and decisions.
import personasJson from "@/data/personas.json";
import type { PersonaScript, Result } from "@/lib/types";

let cache: PersonaScript[] | null = null;

export async function loadPersonas(): Promise<Result<PersonaScript[]>> {
  if (cache) return { data: cache };
  try {
    const raw: unknown = personasJson;
    cache = Array.isArray(raw) ? (raw as unknown as PersonaScript[]) : [];
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
