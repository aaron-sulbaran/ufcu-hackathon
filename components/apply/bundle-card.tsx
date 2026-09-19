"use client";
// The bundle row in step 4: lane A's ProductCard plus the include/remove control the application needs.
import { Lock } from "lucide-react";
import { ProductCard as LaneAProductCard } from "@/components/cards/product-card";
import { useApplyT } from "@/lib/apply/strings";
import { usePersona } from "@/lib/context";
import { localizeProduct } from "@/lib/products";
import type { ProductCard } from "@/lib/types";

export function BundleCard({
  product: rawProduct,
  reason,
  locked = false,
  included,
  onToggle,
}: {
  product: ProductCard;
  reason?: string;
  locked?: boolean;
  included: boolean;
  onToggle: () => void;
}) {
  const t = useApplyT();
  const { context } = usePersona();
  const product = localizeProduct(rawProduct, context.lang);
  return (
    <div
      className={`card-ufcu flex flex-col gap-3 border-2 p-4 transition-colors ${
        included ? "border-ufcu-navy" : "border-ufcu-gray-line opacity-80"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {locked ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ufcu-navy px-3 py-1 text-xs font-semibold text-white">
            <Lock className="size-3" aria-hidden />
            {t("apply.accounts.memberPill")}
          </span>
        ) : (
          <span className="text-sm font-semibold text-ufcu-navy">
            {t(included ? "apply.accounts.included" : "apply.accounts.add")}
          </span>
        )}
        {!locked && (
          <button type="button" className={`btn ${included ? "btn-outline" : "btn-cta"}`} onClick={onToggle}>
            {t(included ? "apply.accounts.remove" : "apply.accounts.add")}
          </button>
        )}
      </div>

      {locked && <p className="text-sm text-ufcu-ink">{t("apply.accounts.membership")}</p>}

      <LaneAProductCard product={product} reason={reason} />
    </div>
  );
}
