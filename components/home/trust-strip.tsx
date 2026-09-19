"use client";
// A quiet trust strip below the fold. No SSN yet, every answer sourced, application kept separate.
import { useT } from "@/lib/i18n";

const LINES = ["trust.noSsn", "trust.sourced", "trust.secure"];

export function TrustStrip() {
  const t = useT();
  return (
    <ul className="grid gap-3 border-t border-ufcu-primary-subtle pt-6 text-sm text-ufcu-primary sm:grid-cols-3">
      {LINES.map((key) => (
        <li key={key} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ufcu-accent" aria-hidden />
          <span>{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
