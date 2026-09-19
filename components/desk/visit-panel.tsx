"use client";
// "Your Visit So Far": the left panel that fills in as the conversation goes. It is the
// persistent place to continue, so the conversation itself never has to repeat the offer.
// Gray side panel per DESIGN.md, with the handoff as the site's teal promo card.
import Link from "next/link";
import { useState } from "react";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard } from "@/lib/types";
import { pathLabel } from "@/lib/ai/eligibility";
import { localizeProduct, productById } from "@/lib/products";
import { useDeskT } from "@/components/desk/strings";

export interface Visit {
  products: ProductCard[] | null;
  eligibility: EligibilityResult | null;
  prefill: ApplicationPrefill | null;
}

export function VisitPanel({
  context,
  visit,
  onBecome,
}: {
  context: PersonaContext;
  visit: Visit;
  onBecome?: () => void;
}) {
  const t = useDeskT();
  const [open, setOpen] = useState(false);
  const { products, eligibility, prefill } = visit;
  // The conversation owns the prefill now and writes it as it changes, so the panel only reads.

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
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="panel-gray flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
          style={{ padding: "0.75rem 1rem" }}
        >
          <span className="font-heading text-base font-bold text-ufcu-navy">{t("desk.visit.title")}</span>
          <span className="text-sm font-semibold text-ufcu-link">
            {prefill ? t("desk.visit.ready") : open ? t("desk.visit.hide") : t("desk.visit.show")}
          </span>
        </button>
        {onBecome && (
          <button type="button" onClick={onBecome} className="btn btn-cta shrink-0">
            {t("desk.become")}
          </button>
        )}
      </div>

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
            <dl className="flex flex-col text-sm text-white" style={{ gap: "0.75rem" }}>
              {prefill.firstName && <Row label={t("desk.receipt.name")} value={prefill.firstName} />}
              <Row label={t("desk.receipt.path")} value={pathLabel(prefill.path, lang)} />
              <Row label={t("desk.receipt.products")} value={names.join(", ")} />
            </dl>
            <Link
              href="/apply"
              className="btn btn-white w-full justify-center text-center"
              style={{ color: "var(--ufcu-cta)" }}
            >
              <LockIcon />
              <span className="min-w-0">{t("desk.continue")}</span>
            </Link>
          </section>
        )}
      </div>
    </aside>
  );
}

// Stacked, not side by side: a long account list wrapped under a hanging indent read like a
// nested menu. Label on its own line, value beneath it, wrapping to the panel's own left edge.
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold" style={{ fontSize: "0.8125rem", lineHeight: 1.4 }}>
        {label}
      </dt>
      <dd className="ml-0 leading-snug">{value}</dd>
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
