"use client";
// Product card. Lane B imports this for the account-selection step; keep the props simple.
// White site card: Montserrat title, Inter tagline, the reason on a quiet gray block.
// On the desk the card carries its own action, so the secure application is one click from the
// first recommendation. Pass onOpen to turn that action on; without it the card is read-only
// and keeps only its "Learn more" link out to ufcu.org.
import type { ProductCard as Product } from "@/lib/types";
import { CardCheck } from "@/components/cards/card-check";
import { useDeskT } from "@/components/desk/strings";
import { usePersona } from "@/lib/context";
import { localizeProduct } from "@/lib/products";

export function ProductCard({
  product: rawProduct,
  reason,
  onOpen,
}: {
  product: Product;
  reason?: string;
  onOpen?: (product: Product) => void;
}) {
  const t = useDeskT();
  const { context } = usePersona();
  const product = localizeProduct(rawProduct, context.lang);
  // A reason may be a dictionary key (the savings line); t() passes plain text straight through.
  const why = reason ?? product.reason;
  // The button says the account's own name: you open an account, start a loan, apply for a card.
  const name = product.name;
  const openLabel =
    rawProduct.kind === "loan"
      ? t("card.start.named", { name })
      : rawProduct.kind === "credit_card"
        ? t("card.apply.named", { name })
        : rawProduct.kind === "business"
          ? t("card.open.business.named", { name })
          : t("card.open.named", { name });

  return (
    <article
      className="card-ufcu flex h-full min-w-[15rem] flex-col gap-3 text-ufcu-ink"
      style={{ padding: "1.25rem" }}
    >
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

      <div className="mt-auto space-y-2 pt-1">
        {onOpen && rawProduct.id === "savings" && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ufcu-navy" data-product-id="savings">
            <IncludedCheck />
            {t("card.included")}
          </p>
        )}
        {onOpen && rawProduct.id !== "savings" && (
          <button
            type="button"
            onClick={() => onOpen(rawProduct)}
            className="btn btn-cta w-full"
            data-product-id={rawProduct.id}
          >
            {openLabel}
          </button>
        )}
        <a
          href={product.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline w-full"
          data-learn-id={rawProduct.id}
        >
          {t("card.learn", { name })}
        </a>
      </div>
    </article>
  );
}

function IncludedCheck() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 fill-current">
      <path d="M6.3 12.2 2.4 8.3l1.2-1.2 2.7 2.7 6.1-6.1 1.2 1.2-7.3 7.3Z" />
    </svg>
  );
}
