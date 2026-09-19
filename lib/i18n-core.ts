// Flat key/value dictionaries: messages/*.json for the interface, messages/content/*.json for the
// persona scripts and resource cards. No "use client" here, so the chat route resolves scripted
// turns from the same tables the page renders with. Missing keys fall back to English, then to the key.
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ko from "@/messages/ko.json";
import pt from "@/messages/pt.json";
import fr from "@/messages/fr.json";
import contentEn from "@/messages/content/en.json";
import contentEs from "@/messages/content/es.json";
import contentKo from "@/messages/content/ko.json";
import contentPt from "@/messages/content/pt.json";
import contentFr from "@/messages/content/fr.json";
import type { Lang } from "@/lib/types";

type Dict = Record<string, string>;
const DICTS: Record<Lang, Dict> = {
  en: { ...en, ...contentEn },
  es: { ...es, ...contentEs },
  ko: { ...ko, ...contentKo },
  pt: { ...pt, ...contentPt },
  fr: { ...fr, ...contentFr },
};

export const LANG_CODES: Lang[] = ["en", "es", "ko", "pt", "fr"];

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" }, { code: "es", label: "Español" }, { code: "ko", label: "한국어" },
  { code: "pt", label: "Português" }, { code: "fr", label: "Français" },
];

// The entry for this language, or the English one, or nothing.
export function lookup(lang: Lang, key: string): string | undefined {
  return DICTS[lang]?.[key] ?? DICTS.en[key];
}

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let s = lookup(lang, key) ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
