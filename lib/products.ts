import products from "@/data/products.json";
import type { Lang, ProductCard } from "@/lib/types";
export const PRODUCTS = products as ProductCard[];
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

// Returns a copy of the product with its text swapped for the localized versions when present,
// falling back to the English fields. A card from a tool result may carry no i18n block, so the
// catalog entry with the same id supplies it.
export function localizeProduct(p: ProductCard, lang: Lang): ProductCard {
  const t = (p.i18n ?? productById(p.id)?.i18n)?.[lang];
  if (!t) return p;
  return {
    ...p,
    name: t.name,
    tagline: t.tagline,
    highlights: t.highlights,
    minToOpen: t.minToOpen ?? p.minToOpen,
    monthlyFee: t.monthlyFee ?? p.monthlyFee,
  };
}
