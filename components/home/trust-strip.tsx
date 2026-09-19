"use client";
// A quiet trust strip below the fold. No SSN yet, every answer sourced, application kept separate.
import { Link2, Lock, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n";

const LINES = [
  { key: "trust.noSsn", Icon: ShieldCheck },
  { key: "trust.sourced", Icon: Link2 },
  { key: "trust.secure", Icon: Lock },
];

export function TrustStrip() {
  const t = useT();
  return (
    <ul className="grid gap-6 border-t border-ufcu-gray-line pt-6 sm:grid-cols-3">
      {LINES.map(({ key, Icon }) => (
        <li key={key} className="flex items-start gap-3">
          <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-ufcu-navy" strokeWidth={2} />
          <span className="text-sm font-semibold leading-snug text-ufcu-navy">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
