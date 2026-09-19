"use client";
// Shared client state: who the person is, what they want, which language. Persisted to localStorage.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Audience, Goal, Lang, PersonaContext } from "@/lib/types";

const KEY = "frontdesk.context";
const DEFAULT: PersonaContext = { audience: "other", goal: "unsure", lang: "en" };

interface Ctx {
  context: PersonaContext;
  setContext: (next: Partial<PersonaContext>) => void;
  setLang: (lang: Lang) => void;
  setAudience: (audience: Audience) => void;
  setGoal: (goal: Goal) => void;
}
const PersonaCtx = createContext<Ctx | null>(null);

function readStored(): PersonaContext {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...DEFAULT, ...JSON.parse(raw) }; } catch {}
  return DEFAULT;
}

// `hydrated` rides in state so an update queued before hydration (a child effect runs before this
// provider's) merges onto the stored context instead of being overwritten by it, or overwriting it.
interface Stored { context: PersonaContext; hydrated: boolean }

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Stored>({ context: DEFAULT, hydrated: false });
  useEffect(() => {
    // Hydrate from localStorage once; the sync setState is intentional (external store, one-shot).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => (prev.hydrated ? prev : { context: readStored(), hydrated: true }));
  }, []);
  const setContext = (next: Partial<PersonaContext>) =>
    setState((prev) => {
      const merged = { ...(prev.hydrated ? prev.context : readStored()), ...next };
      try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {}
      return { context: merged, hydrated: true };
    });
  return (
    <PersonaCtx.Provider value={{
      context: state.context, setContext,
      setLang: (lang) => setContext({ lang }),
      setAudience: (audience) => setContext({ audience }),
      setGoal: (goal) => setContext({ goal }),
    }}>{children}</PersonaCtx.Provider>
  );
}

export function usePersona(): Ctx {
  const ctx = useContext(PersonaCtx);
  if (!ctx) throw new Error("usePersona must be used inside PersonaProvider");
  return ctx;
}
