"use client";
// The handoff. The conversation never collects sensitive data; this card is where that starts.
import Link from "next/link";
import { useEffect } from "react";
import type { ApplicationPrefill } from "@/lib/types";
import { savePrefill } from "@/lib/apply/prefill";
import { useT } from "@/lib/i18n";
import { productById } from "@/lib/products";

export function ContinueCard({ prefill }: { prefill: ApplicationPrefill }) {
  const t = useT();

  // Hand the prefill to the Secure Zone through localStorage. If storage is blocked the
  // application simply starts empty, which is a safe fallback, so there is nothing to report.
  useEffect(() => {
    savePrefill(prefill);
  }, [prefill]);

  const names = prefill.products.map((id) => productById(id)?.name ?? id);

  return (
    <article className="flex flex-col gap-3 rounded-xl border-2 border-ufcu-secondary-darker bg-ufcu-secondary-subtle p-4 text-ufcu-primary">
      <div className="space-y-1">
        <h3 className="font-heading text-lg leading-tight">{t("desk.continue")}</h3>
        <p className="text-sm">{t("desk.continue.sub")}</p>
      </div>

      {names.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {names.map((name) => (
            <li key={name} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium">
              {name}
            </li>
          ))}
        </ul>
      )}

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
