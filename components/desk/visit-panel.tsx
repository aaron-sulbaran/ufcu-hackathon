"use client";
// "Your Visit So Far": the left panel that fills in as the conversation goes. It is the
// persistent place to continue, so the conversation itself never has to repeat the offer.
// Short and sticky: the way in sits at the top and stays on screen at any scroll position,
// and the visit notes under it stay to names only. The checklist lives on the eligibility card.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ApplicationPrefill, EligibilityResult, PersonaContext, ProductCard } from "@/lib/types";
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
  // The sentence comes from localStorage-hydrated context; render it only after mount so the
  // server markup (defaults) and the first client paint agree.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  const { products, eligibility, prefill } = visit;
  // The conversation owns the prefill now and writes it as it changes, so the panel only reads.

  const who =
    context.goal === "unsure"
      ? t("desk.sentence.unsure", { audience: t(`audience.${context.audience}`) })
      : t("desk.sentence", { audience: t(`audience.${context.audience}`), goal: t(`goal.${context.goal}`) });
  const lang = context.lang;
  const names =
    products && products.length > 0
      ? products.map((p) => localizeProduct(p, lang).name)
      : (prefill?.products ?? []).map((id) => {
          const product = productById(id);
          return product ? localizeProduct(product, lang).name : id;
        });
  const empty = !products && !eligibility && !prefill;

  return (
    <aside className="md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:w-80 md:shrink-0 md:self-start md:overflow-auto">
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
        <section className="promo-teal space-y-3" style={{ padding: "1.25rem" }}>
          <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700, color: "#fff" }}>
            {t("desk.ready")}
          </h3>
          {onBecome ? (
            <button
              type="button"
              onClick={onBecome}
              className="btn btn-white w-full justify-center text-center"
              style={{ color: "var(--ufcu-cta)" }}
              data-testid="panel-continue"
            >
              <LockIcon />
              <span className="min-w-0">{t("desk.continue")}</span>
            </button>
          ) : (
            <Link
              href="/apply"
              className="btn btn-white w-full justify-center text-center"
              style={{ color: "var(--ufcu-cta)" }}
              data-testid="panel-continue"
            >
              <LockIcon />
              <span className="min-w-0">{t("desk.continue")}</span>
            </Link>
          )}
        </section>

        <div className="space-y-4">
          <p className="text-base font-semibold text-ufcu-navy">{t("desk.visit")}</p>

          <section className="space-y-1">
            <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.who")}</p>
            <p className="text-sm leading-snug" suppressHydrationWarning>{mounted ? who : ""}</p>
            {prefill?.firstName && <p className="text-sm font-semibold">{prefill.firstName}</p>}
          </section>

          {empty && <p className="text-sm text-ufcu-muted">{t("desk.visit.empty")}</p>}

          {names.length > 0 && (
            <section className="space-y-1.5">
              <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.bundle")}</p>
              <ul className="space-y-1">
                {names.map((name) => (
                  <li key={name} className="text-sm leading-snug">
                    {name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </aside>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
      <path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3Zm1.5 5h-3V4a1.5 1.5 0 0 1 3 0v2Z" />
    </svg>
  );
}
