"use client";
// Product card. Lane B imports this for the account-selection step; keep the props simple.
// White site card: Montserrat title, Inter tagline, the reason on a quiet gray block.
// On the desk the card carries its own action, so joining is one click from the first
// recommendation. Pass onToggle to turn the action on; without it the card is read-only.
import type { ProductCard as Product } from "@/lib/types";
import { CardCheck } from "@/components/cards/card-check";
import { SourceLink } from "@/components/cards/source-link";
import { useDeskT } from "@/components/desk/strings";
import { usePersona } from "@/lib/context";
import { localizeProduct } from "@/lib/products";

export function ProductCard({
  product: rawProduct,
  reason,
  selected,
  onToggle,
}: {
  product: Product;
  reason?: string;
  selected?: boolean;
  onToggle?: (product: Product) => void;
}) {
  const t = useDeskT();
  const { context } = usePersona();
  const product = localizeProduct(rawProduct, context.lang);
  const why = reason ?? product.reason;
  const kindKey = `card.open.${rawProduct.kind}`;
  const kindLabel = t(kindKey);
  const openLabel = kindLabel === kindKey ? t("card.open") : kindLabel;

  return (
    <article
      className="card-ufcu flex h-full min-w-[15rem] flex-col gap-3 text-ufcu-ink"
      style={{ padding: "1.25rem", ...(selected ? { border: "2px solid var(--ufcu-navy)" } : null) }}
    >
      <header className="space-y-1">
        <h3 style={{ fontSize: "1.125rem", lineHeight: 1.35, fontWeight: 700 }}>{product.name}</h3>
        <p className="text-sm text-ufcu-muted">{product.tagline}</p>
      </header>

      {why && <p className="rounded-lg bg-ufcu-gray-panel px-3 py-2 text-sm leading-snug">{why}</p>}

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

      <div className="mt-auto space-y-3 pt-1">
        {onToggle && rawProduct.id === "savings" && (
          <p className="text-sm font-semibold text-ufcu-navy" data-product-id="savings">
            <AddedCheck />
            {t("card.included")}
          </p>
        )}
        {onToggle && rawProduct.id !== "savings" && (
          <button
            type="button"
            aria-pressed={selected ?? false}
            onClick={() => onToggle(rawProduct)}
            className={`btn w-full ${selected ? "btn-outline" : "btn-cta"}`}
            data-product-id={rawProduct.id}
          >
            {selected && <AddedCheck />}
            {selected ? t("card.added") : openLabel}
          </button>
        )}
        <SourceLink href={product.sourceUrl} />
      </div>
    </article>
  );
}

function AddedCheck() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
      <path d="M6.3 12.2 2.4 8.3l1.2-1.2 2.7 2.7 6.1-6.1 1.2 1.2-7.3 7.3Z" />
    </svg>
  );
}
