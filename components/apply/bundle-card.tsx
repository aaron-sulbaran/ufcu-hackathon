"use client";
// The bundle row in step 4: lane A's ProductCard plus the include/remove control the application needs.
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      className={`flex flex-col gap-3 rounded-2xl border p-3 transition-colors ${
        included ? "border-ufcu-primary bg-card" : "border-border bg-card opacity-75"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {locked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-ufcu-primary-subtle px-2.5 py-1 font-mono text-xs text-ufcu-primary">
            <Lock className="size-3" aria-hidden />
            {t("apply.accounts.included")}
          </span>
        ) : (
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t(included ? "apply.accounts.included" : "apply.accounts.add")}
          </span>
        )}
        {!locked && (
          <Button type="button" variant={included ? "outline" : "default"} className="h-8" onClick={onToggle}>
            {t(included ? "apply.accounts.remove" : "apply.accounts.add")}
          </Button>
        )}
      </div>

      {locked && <p className="text-sm text-ufcu-primary">{t("apply.accounts.membership")}</p>}

      <LaneAProductCard product={product} reason={reason} />
    </div>
  );
}
