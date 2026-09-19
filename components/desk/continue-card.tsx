"use client";
// The offer, made once. The persistent place to continue is the "Your Visit So Far" panel,
// which also writes the prefill, so this card never has to nag or repeat itself.
// Same teal promo shape as the panel, one size down.
import Link from "next/link";
import type { ApplicationPrefill } from "@/lib/types";
import { useDeskT } from "@/components/desk/strings";

export function ContinueCard({ prefill }: { prefill: ApplicationPrefill }) {
  const t = useDeskT();

  return (
    <article className="promo-teal flex flex-col gap-3" style={{ padding: "1.5rem", borderRadius: "12px" }}>
      <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700, color: "#fff" }}>
        {t("desk.promo.title")}
      </h3>
      <p className="text-sm leading-snug text-white">{t("desk.continue.sub")}</p>

      {prefill.notes.length > 0 && (
        <ul className="space-y-0.5 text-sm text-white">
          {prefill.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <Link href="/apply" className="btn btn-white w-fit" style={{ color: "var(--ufcu-cta)" }}>
        {t("desk.continue")}
      </Link>
    </article>
  );
}
