"use client";
// Savings is not a choice, it is the membership account, so it never competes with the real
// recommendations in the card grid. It gets one slim row under them: what it is, why it is
// there, and a way out to the page. The left panel lists it too, so this shows once a visit.
import type { ProductCard as Product } from "@/lib/types";
import { useDeskT } from "@/components/desk/strings";

export function MembershipTile({ product }: { product: Product }) {
  const t = useDeskT();
  return (
    <article
      className="card-ufcu flex flex-col gap-2 text-ufcu-ink md:h-16 md:flex-row md:items-center md:gap-3"
      style={{ padding: "0.75rem 1rem" }}
      data-testid="membership-tile"
    >
      <LockIcon />
      <p className="shrink-0 text-sm font-semibold text-ufcu-navy">{t("card.membership.title")}</p>
      <p className="min-w-0 flex-1 text-sm leading-snug">{t("card.membership.body")}</p>
      <a
        href={product.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline shrink-0 self-start md:self-auto"
        style={{ padding: "6px 14px", fontSize: "0.8125rem" }}
        data-learn-id="savings"
      >
        {t("card.learn.short")}
      </a>
    </article>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-ufcu-navy">
      <path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3Zm1.5 5h-3V4a1.5 1.5 0 0 1 3 0v2Z" />
    </svg>
  );
}
