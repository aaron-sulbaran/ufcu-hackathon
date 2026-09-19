"use client";
// The identity path, in plain words, with the checklist that goes with it.
// Nothing here asks for a number; it says what to bring to the secure application.
import type { EligibilityResult } from "@/lib/types";
import { pathLabel } from "@/lib/ai/eligibility";
import { CardCheck } from "@/components/cards/card-check";
import { SourceLink } from "@/components/cards/source-link";
import { useDeskT } from "@/components/desk/strings";
import { usePersona } from "@/lib/context";

export function EligibilityCard({ result }: { result: EligibilityResult }) {
  const t = useDeskT();
  const { context } = usePersona();
  return (
    <article className="card-ufcu flex flex-col gap-3 text-ufcu-ink" style={{ padding: "1.25rem" }}>
      <header className="space-y-1">
        <p className="text-sm font-semibold text-ufcu-navy">{t("card.path")}</p>
        <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700 }}>{pathLabel(result.path, context.lang)}</h3>
      </header>

      <div>
        <p className="mb-1.5 text-sm font-semibold text-ufcu-navy">{t("card.bring")}</p>
        <ul className="space-y-1.5">
          {result.documents.map((doc) => (
            <li key={doc} className="flex items-start gap-2 text-sm">
              <CardCheck />
              <span className="leading-snug">{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {result.notes.length > 0 && (
        <ul className="space-y-1 rounded-lg bg-ufcu-gray-panel px-3 py-2 text-sm leading-snug">
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
