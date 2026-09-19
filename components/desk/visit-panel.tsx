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
  const { products, prefill } = visit;
  // The conversation owns the prefill now and writes it as it changes, so the panel only reads.

  // Rebuilt every render out of the live context, so switching the goal rewrites the sentence
  // on the next paint rather than waiting for another turn.
  const firstName = prefill?.firstName;
  const audience = t(`audience.${context.audience}`);
  const who =
    context.goal === "unsure"
      ? t("desk.sentence.unsure", { audience })
      : firstName
        ? t("desk.visit.named", { name: firstName, audience, goal: t(`goal.${context.goal}`) })
        : t("desk.sentence", { audience, goal: t(`goal.${context.goal}`) });

  const lang = context.lang;
  // The handoff carries the whole bundle (savings first); a bare turn only carries its own cards.
  const fromTurn = new Map((products ?? []).map((p) => [p.id, p]));
  const ids = prefill?.products ?? [...fromTurn.keys()];
  const seen = new Set<string>();
  const items: { id: string; name: string; tagline: string }[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const card = fromTurn.get(id) ?? productById(id);
    if (!card) continue;
    const local = localizeProduct(card, lang);
    // Savings is the membership account, so it reads as a note rather than a pitch.
    items.push({ id, name: local.name, tagline: id === "savings" ? t("desk.visit.savingsNote") : local.tagline });
  }
  // Stable sort, so savings falls to the end and everything else keeps the bundle's order.
  items.sort((a, b) => Number(a.id === "savings") - Number(b.id === "savings"));

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
        <header className="space-y-1">
          <h3 className="hidden md:block" style={{ fontSize: "1.25rem", lineHeight: 1.4 }}>
            {t("desk.visit.title")}
          </h3>
          <p className="text-sm text-ufcu-muted">{t("desk.visit.empty")}</p>
        </header>

        <section className="space-y-1">
          <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.who2")}</p>
          <p className="text-sm leading-snug" suppressHydrationWarning>
            {mounted ? who : ""}
          </p>
        </section>

        {items.length > 0 && (
          <section className="space-y-1.5">
            <p className="text-sm font-semibold text-ufcu-navy">{t("desk.visit.bundle2")}</p>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-2.5 h-px w-2 shrink-0 bg-ufcu-navy" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-ufcu-navy">{item.name}</p>
                    {item.tagline && <p className="truncate text-sm text-ufcu-muted">{item.tagline}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

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
