"use client";
// Flat key/value dictionaries in messages/*.json. Missing keys fall back to English, then to the key.
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ko from "@/messages/ko.json";
import pt from "@/messages/pt.json";
import fr from "@/messages/fr.json";
import { usePersona } from "@/lib/context";
import type { Lang } from "@/lib/types";

type Dict = Record<string, string>;
const DICTS: Record<Lang, Dict> = { en, es, ko, pt, fr };

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" }, { code: "es", label: "Español" }, { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" }, { code: "fr", label: "Français" },
];

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let s = DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

export function useT() {
  const { context } = usePersona();
  return (key: string, vars?: Record<string, string | number>) => t(context.lang, key, vars);
}
