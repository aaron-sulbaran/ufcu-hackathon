"use client";
// A quiet trust strip below the fold. No SSN yet, every answer sourced, application kept separate.
import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";

const LINES: { key: string; icon: ReactNode }[] = [
  {
    key: "trust.noSsn",
    icon: (
      <path d="M8 1.2 2.6 3.6v4.2c0 3.2 2.2 6.1 5.4 6.9 3.2-.8 5.4-3.7 5.4-6.9V3.6L8 1.2Zm2.8 5-3.5 3.6a.7.7 0 0 1-1 0L5.2 8.7l1-1L7.8 9.3l3-3.1 1 1Z" />
    ),
  },
  {
    key: "trust.sourced",
    icon: (
      <path d="M6.4 9.6a2.6 2.6 0 0 1 0-3.7l2.1-2.1a2.6 2.6 0 1 1 3.7 3.7l-.9.9-1.1-1.1.9-.9a1 1 0 0 0-1.5-1.5L7.5 7a1 1 0 0 0 0 1.5l-1.1 1.1Zm3.2-3.2a2.6 2.6 0 0 1 0 3.7l-2.1 2.1a2.6 2.6 0 1 1-3.7-3.7l.9-.9 1.1 1.1-.9.9a1 1 0 0 0 1.5 1.5L8.5 9a1 1 0 0 0 0-1.5l1.1-1.1Z" />
    ),
  },
  {
    key: "trust.secure",
    icon: (
      <path d="M8 1a3 3 0 0 0-3 3v2h-.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3Zm1.5 5h-3V4a1.5 1.5 0 0 1 3 0v2Z" />
    ),
  },
];

export function TrustStrip() {
  const t = useT();
  return (
    <ul className="grid gap-4 border-t border-ufcu-gray-line pt-6 sm:grid-cols-3">
      {LINES.map(({ key, icon }) => (
        <li key={key} className="flex items-start gap-2.5">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-ufcu-navy">
            {icon}
          </svg>
          <span className="text-sm font-semibold leading-snug text-ufcu-navy">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
