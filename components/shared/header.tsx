"use client";
// Shared header: brand mark, language switch. Lane C may polish; keep the props stable.
import Link from "next/link";
import { usePersona } from "@/lib/context";
import { LANGS, useT } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export function Header({ secure = false }: { secure?: boolean }) {
  const { context, setLang } = usePersona();
  const t = useT();
  return (
    <header className={`${secure ? "bg-ufcu-primary-darkest" : "bg-ufcu-primary"} text-white`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl">
          <span className="rounded-full bg-white px-2 py-0.5 text-sm font-bold text-ufcu-primary">ufcu</span>
          <span>{t("app.name")}</span>
          {secure && <span className="ml-2 rounded bg-white/15 px-2 py-0.5 font-mono text-xs">{t("apply.title")}</span>}
        </Link>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">{t("nav.lang")}</span>
          <select
            className="rounded bg-white/10 px-2 py-1 text-white"
            value={context.lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            {LANGS.map((l) => <option key={l.code} value={l.code} className="text-ufcu-primary">{l.label}</option>)}
          </select>
        </label>
      </div>
    </header>
  );
}
