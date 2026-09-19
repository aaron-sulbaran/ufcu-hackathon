"use client";
// Shared header. Mirrors ufcu.org: white bar, the UFCU oval top left, utilities on the right.
// The Secure Zone flips to the darkest navy so the change of context is unmistakable.
import Image from "next/image";
import Link from "next/link";
import { usePersona } from "@/lib/context";
import { LANGS, useT } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { AccessibilityToggle } from "@/components/home/accessibility-toggle";

export function Header({ secure = false }: { secure?: boolean }) {
  const { context, setLang } = usePersona();
  const t = useT();
  const onDark = secure;
  return (
    <header className={onDark ? "bg-ufcu-primary-darkest text-white" : "border-b-4 border-ufcu-secondary bg-white text-ufcu-primary"}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/ufcu-logo.svg" alt="UFCU" width={72} height={37} priority className="h-9 w-auto" />
          <span className={`hidden font-heading text-lg sm:inline ${onDark ? "text-white" : "text-ufcu-primary"}`}>{t("app.name")}</span>
          {secure && (
            <span className="rounded bg-white/15 px-2 py-0.5 font-mono text-xs uppercase tracking-wide">{t("apply.title")}</span>
          )}
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {!secure && <AccessibilityToggle />}
          <label className="flex items-center gap-2">
            <span className="sr-only">{t("nav.lang")}</span>
            <select
              className={`rounded border px-2 py-1 ${onDark ? "border-white/30 bg-white/10 text-white" : "border-ufcu-primary-subtle bg-white text-ufcu-primary"}`}
              value={context.lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code} className="text-ufcu-primary">{l.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
