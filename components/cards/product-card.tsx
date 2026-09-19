"use client";
// Product card. Lane B imports this for the account-selection step; keep the props simple.
// White site card: Montserrat title, Inter tagline, the reason on a quiet gray block.
import type { ProductCard as Product } from "@/lib/types";
import { CardCheck } from "@/components/cards/card-check";
import { SourceLink } from "@/components/cards/source-link";
import { useDeskT } from "@/components/desk/strings";
import { usePersona } from "@/lib/context";
import { localizeProduct } from "@/lib/products";

export function ProductCard({ product: rawProduct, reason }: { product: Product; reason?: string }) {
  const t = useDeskT();
  const { context } = usePersona();
  const product = localizeProduct(rawProduct, context.lang);
  // A reason may be a dictionary key (the savings line); t() passes plain text straight through.
  const why = reason ?? product.reason;
  return (
    <article className="card-ufcu flex h-full min-w-[15rem] flex-col gap-3 text-ufcu-ink" style={{ padding: "1.25rem" }}>
      <header className="space-y-1">
        <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700 }}>{product.name}</h3>
        <p className="text-sm text-ufcu-muted">{product.tagline}</p>
      </header>

      {why && <p className="rounded-lg bg-ufcu-gray-panel px-3 py-2 text-sm leading-snug">{t(why)}</p>}

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-sm font-semibold text-ufcu-navy">{t("card.opensWith")}</dt>
          <dd>{product.minToOpen}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ufcu-navy">{t("card.monthlyFee")}</dt>
          <dd>{product.monthlyFee}</dd>
        </div>
      </dl>

      <ul className="space-y-1.5 text-sm">
        {product.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex items-start gap-2">
            <CardCheck />
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-1">
        <SourceLink href={product.sourceUrl} />
      </div>
    </article>
  );
}
