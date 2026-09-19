"use client";
// Product card. Lane B imports this for the account-selection step; keep the props simple.
import type { ProductCard as Product } from "@/lib/types";
import { SourceLink } from "@/components/cards/source-link";
import { useDeskT } from "@/components/desk/strings";

export function ProductCard({ product, reason }: { product: Product; reason?: string }) {
  const t = useDeskT();
  const why = reason ?? product.reason;
  return (
    <article className="flex h-full min-w-[15rem] flex-col gap-3 rounded-xl border border-ufcu-primary-subtle bg-white p-4 text-ufcu-primary shadow-sm">
      <header className="space-y-1">
        <h3 className="font-heading text-lg leading-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
      </header>

      {why && (
        <p className="rounded-lg bg-ufcu-secondary-subtle px-3 py-2 text-sm leading-snug">{why}</p>
      )}

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t("card.opensWith")}</dt>
          <dd className="font-semibold">{product.minToOpen}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t("card.monthlyFee")}</dt>
          <dd className="font-semibold">{product.monthlyFee}</dd>
        </div>
      </dl>

      <ul className="space-y-1 text-sm">
        {product.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden="true" className="text-ufcu-accent-darker">
              +
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-1">
        <SourceLink href={product.sourceUrl} />
      </div>
    </article>
  );
}
