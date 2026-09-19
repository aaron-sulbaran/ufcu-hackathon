"use client";
// "Your visit so far": the left panel that fills in as the conversation goes. It is the
// persistent place to continue, so the conversation itself never has to repeat the offer.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard } from "@/lib/types";
import { pathLabel } from "@/lib/ai/eligibility";
import { savePrefill } from "@/lib/apply/prefill";
import { productById } from "@/lib/products";
import { useDeskT } from "@/components/desk/strings";

export interface Visit {
  products: ProductCard[] | null;
  eligibility: EligibilityResult | null;
  prefill: ApplicationPrefill | null;
}

export function VisitPanel({ context, visit }: { context: PersonaContext; visit: Visit }) {
  const t = useDeskT();
  const [open, setOpen] = useState(false);
  const { products, eligibility, prefill } = visit;

  // The panel is where the handoff lives, so it is also where the prefill is written.
  useEffect(() => {
    if (prefill) savePrefill(prefill);
  }, [prefill]);

  const who =
    context.goal === "unsure"
      ? t("desk.sentence.unsure", { audience: t(`audience.${context.audience}`) })
      : t("desk.sentence", { audience: t(`audience.${context.audience}`), goal: t(`goal.${context.goal}`) });
  const names = (prefill?.products ?? []).map((id) => productById(id)?.name ?? id);
  const empty = !products && !eligibility && !prefill;

  return (
    <aside className="md:sticky md:top-4 md:w-80 md:shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-ufcu-primary-subtle bg-white px-4 py-3 text-left text-ufcu-primary md:hidden"
      >
        <span className="font-heading text-base">{t("desk.visit")}</span>
        <span className="text-sm font-medium text-ufcu-secondary-darker">
          {prefill ? t("desk.visit.ready") : open ? t("desk.visit.hide") : t("desk.visit.show")}
        </span>
      </button>

      <div
        className={`${open ? "mt-3 block" : "hidden"} space-y-5 rounded-xl border border-ufcu-primary-subtle bg-white p-4 text-ufcu-primary md:mt-0 md:block`}
      >
        <h2 className="hidden font-heading text-lg leading-tight md:block">{t("desk.visit")}</h2>

        <section className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ufcu-accent-darker">{t("desk.visit.who")}</p>
          <p className="text-sm leading-snug">{who}</p>
          {prefill?.firstName && <p className="text-sm font-semibold">{prefill.firstName}</p>}
        </section>

        {empty && <p className="text-sm text-muted-foreground">{t("desk.visit.empty")}</p>}

        {products && products.length > 0 && (
          <section className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ufcu-accent-darker">{t("desk.visit.bundle")}</p>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.id} className="text-sm leading-snug">
                  <span className="font-semibold">{p.name}</span>
                  {p.reason && <span className="block text-muted-foreground">{p.reason}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {eligibility && (
          <section className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ufcu-accent-darker">{t("desk.visit.bring")}</p>
            <p className="text-sm font-semibold leading-snug">{pathLabel(eligibility.path)}</p>
            <ul className="space-y-1 text-sm leading-snug">
              {eligibility.documents.map((doc) => (
                <li key={doc} className="flex gap-2">
                  <span aria-hidden="true" className="text-ufcu-primary-lighter">
                    -
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {prefill && (
          <section className="space-y-2 rounded-lg bg-ufcu-secondary-subtle p-3">
            <Link
              href="/apply"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-ufcu-secondary-darker px-4 py-3 text-center font-semibold text-white hover:bg-ufcu-secondary-darkest"
            >
              <LockIcon />
              {t("desk.continue")}
            </Link>
            <p className="text-xs leading-snug">{t("desk.secure.note")}</p>
            <dl className="space-y-0.5 text-xs">
              {prefill.firstName && (
                <Row label={t("desk.receipt.name")} value={prefill.firstName} />
              )}
              <Row label={t("desk.receipt.path")} value={pathLabel(prefill.path)} />
              <Row label={t("desk.receipt.products")} value={names.join(", ")} />
            </dl>
          </section>
        )}
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="shrink-0 font-semibold">{label}:</dt>
      <dd className="min-w-0">{value}</dd>
    </div>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
      <path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3Zm1.5 5h-3V4a1.5 1.5 0 0 1 3 0v2Z" />
    </svg>
  );
}
