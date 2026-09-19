"use client";
// Landing strings that are not in messages/ yet. useHomeT() asks the shared dictionary first and
// falls back to the table below, so the landing keeps working before and after the merge
// (same pattern as components/desk/strings.ts).
import { useT } from "@/lib/i18n";

export const HOME_STRINGS: Record<string, string> = {
  "landing.orAsk": "Or just ask",
  "landing.ask": "Ask",
  "landing.ask.placeholder": "Ask the front desk anything",
  "landing.samples": "See a sample visit",
};

function fill(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

export function useHomeT() {
  const t = useT();
  return (key: string, vars?: Record<string, string | number>) => {
    const shared = t(key, vars);
    if (shared !== key) return shared;
    const local = HOME_STRINGS[key];
    return local ? fill(local, vars) : fill(key, vars);
  };
}
