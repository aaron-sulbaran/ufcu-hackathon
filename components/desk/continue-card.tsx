"use client";
// The offer, made once. The persistent place to continue is the "Your visit so far" panel,
// which also writes the prefill, so this card never has to nag or repeat itself.
import Link from "next/link";
import type { ApplicationPrefill } from "@/lib/types";
import { useDeskT } from "@/components/desk/strings";

export function ContinueCard({ prefill }: { prefill: ApplicationPrefill }) {
  const t = useDeskT();

  return (
    <article className="flex flex-col gap-3 rounded-xl border-2 border-ufcu-secondary-darker bg-ufcu-secondary-subtle p-4 text-ufcu-primary">
      <div className="space-y-1">
        <h3 className="font-heading text-lg leading-tight">{t("desk.continue")}</h3>
        <p className="text-sm">{t("desk.continue.sub")}</p>
      </div>

      {prefill.notes.length > 0 && (
        <ul className="space-y-0.5 text-sm">
          {prefill.notes.map((note) => (
            <li key={note}>- {note}</li>
          ))}
        </ul>
      )}

      <Link
        href="/apply"
        className="inline-flex w-fit items-center rounded-lg bg-ufcu-secondary-darker px-4 py-2 font-semibold text-white hover:bg-ufcu-secondary-darkest"
      >
        {t("desk.continue")}
      </Link>
    </article>
  );
}
