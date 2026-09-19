import products from "@/data/products.json";
import type { ProductCard } from "@/lib/types";
export const PRODUCTS = products as ProductCard[];
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
