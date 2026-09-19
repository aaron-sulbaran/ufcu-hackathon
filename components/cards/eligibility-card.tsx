"use client";
// The identity path, in plain words, with the checklist that goes with it.
// Nothing here asks for a number; it says what to bring to the secure application.
import type { EligibilityResult } from "@/lib/types";
import { pathLabel } from "@/lib/ai/eligibility";
import { SourceLink } from "@/components/cards/source-link";

export function EligibilityCard({ result }: { result: EligibilityResult }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-ufcu-primary-subtle bg-white p-4 text-ufcu-primary shadow-sm">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ufcu-accent-darker">Your path</p>
        <h3 className="font-heading text-lg leading-tight">{pathLabel(result.path)}</h3>
      </header>

      <div>
        <p className="mb-1.5 text-sm font-semibold">What to bring</p>
        <ul className="space-y-1.5">
          {result.documents.map((doc) => (
            <li key={doc} className="flex items-start gap-2 text-sm">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block size-3 shrink-0 rounded-[3px] border-2 border-ufcu-primary-lighter"
              />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {result.notes.length > 0 && (
        <ul className="space-y-1 rounded-lg bg-ufcu-secondary-subtle px-3 py-2 text-sm leading-snug">
          {result.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {result.sourceUrls.map((url) => (
          <SourceLink key={url} href={url} />
        ))}
      </div>
    </article>
  );
}
