"use client";
// "Your Visit So Far": the left panel that fills in as the conversation goes. It is the
// persistent place to continue, so the conversation itself never has to repeat the offer.
// Gray side panel per DESIGN.md, with the handoff as the site's teal promo card.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard } from "@/lib/types";
import { pathLabel } from "@/lib/ai/eligibility";
import { savePrefill } from "@/lib/apply/prefill";
import { localizeProduct, productById } from "@/lib/products";
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
  const lang = context.lang;
  const names = (prefill?.products ?? []).map((id) => {
    const product = productById(id);
    return product ? localizeProduct(product, lang).name : id;
  });
  const empty = !products && !eligibility && !prefill;

  return (
    <aside className="md:sticky md:top-4 md:w-80 md:shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="panel-gray flex w-full items-center justify-between gap-3 text-left md:hidden"
        style={{ padding: "0.75rem 1rem" }}
      >
        <span className="font-heading text-base font-bold text-ufcu-navy">{t("desk.visit.title")}</span>
        <span className="text-sm font-semibold text-ufcu-link">
          {prefill ? t("desk.visit.ready") : open ? t("desk.visit.hide") : t("desk.visit.show")}
        </span>
      </button>

      <div className={`${open ? "mt-3 block" : "hidden"} panel-gray space-y-5 text-ufcu-ink md:mt-0 md:block`}>
        <h3 className="hidden md:block" style={{ fontSize: "1.25rem", lineHeight: 1.4 }}>
          {t("desk.visit.title")}
        </h3>

        <section className="space-y-1">
          <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.who")}</p>
          <p className="text-sm leading-snug">{who}</p>
          {prefill?.firstName && <p className="text-sm font-semibold">{prefill.firstName}</p>}
        </section>

        {empty && <p className="text-sm text-ufcu-muted">{t("desk.visit.empty")}</p>}

        {products && products.length > 0 && (
          <section className="space-y-1.5">
            <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.bundle")}</p>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.id} className="text-sm leading-snug">
                  <span className="font-semibold">{localizeProduct(p, lang).name}</span>
                  {p.reason && <span className="block text-ufcu-muted">{t(p.reason)}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {eligibility && (
          <section className="space-y-1.5">
            <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.bring")}</p>
            <p className="text-sm font-semibold leading-snug">{pathLabel(eligibility.path, lang)}</p>
            <ul className="space-y-1 text-sm leading-snug">
              {eligibility.documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <CheckIcon />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {prefill && (
          <section className="promo-teal space-y-3" style={{ padding: "1.25rem" }}>
            <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700, color: "#fff" }}>
              {t("desk.promo.title")}
            </h3>
            <p className="text-sm leading-snug text-white">{t("desk.secure.note")}</p>
            <dl className="space-y-0.5 text-sm text-white">
              {prefill.firstName && <Row label={t("desk.receipt.name")} value={prefill.firstName} />}
              <Row label={t("desk.receipt.path")} value={pathLabel(prefill.path, lang)} />
              <Row label={t("desk.receipt.products")} value={names.join(", ")} />
            </dl>
            <Link href="/apply" className="btn btn-white w-full" style={{ color: "var(--ufcu-cta)" }}>
              <LockIcon />
              {t("desk.continue")}
            </Link>
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

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 fill-ufcu-navy">
      <path d="M6.3 12.2 2.4 8.3l1.2-1.2 2.7 2.7 6.1-6.1 1.2 1.2-7.3 7.3Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
      <path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3Zm1.5 5h-3V4a1.5 1.5 0 0 1 3 0v2Z" />
    </svg>
  );
}
