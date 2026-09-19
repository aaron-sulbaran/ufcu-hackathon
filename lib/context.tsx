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

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [context, setRaw] = useState<PersonaContext>(DEFAULT);
  useEffect(() => {
    // Hydrate from localStorage once; the sync setState is intentional (external store, one-shot).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const raw = localStorage.getItem(KEY); if (raw) setRaw({ ...DEFAULT, ...JSON.parse(raw) }); } catch {}
  }, []);
  const setContext = (next: Partial<PersonaContext>) =>
    setRaw((prev) => { const merged = { ...prev, ...next }; try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch {} return merged; });
  return (
    <PersonaCtx.Provider value={{
      context, setContext,
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
