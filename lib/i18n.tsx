"use client";
// The dictionaries and t() live in lib/i18n-core.ts so the server can use them too.
import { usePersona } from "@/lib/context";
import { t } from "@/lib/i18n-core";

export { LANGS, t } from "@/lib/i18n-core";

export function useT() {
  const { context } = usePersona();
  return (key: string, vars?: Record<string, string | number>) => t(context.lang, key, vars);
}
