import products from "@/data/products.json";
import type { Lang, ProductCard } from "@/lib/types";
export const PRODUCTS = products as ProductCard[];
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

// Returns a copy of the product with name, tagline, and highlights swapped for the
// localized versions in i18n when present, falling back to the English fields.
export function localizeProduct(p: ProductCard, lang: Lang): ProductCard {
  const t = p.i18n?.[lang];
  if (!t) return p;
  return { ...p, name: t.name, tagline: t.tagline, highlights: t.highlights };
}
