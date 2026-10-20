/**
 * Domaine catalogue : types et règles pures. Aucune dépendance (ni React, ni Next, ni autre slice).
 */
export type ProductType = "hoodie" | "tee" | "pack" | "acc";

export interface Color {
  key: string;
  name: string;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  colorKey?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  type: ProductType;
  name: string;
  /** Sous-titre court (coupe, grammage). */
  sub: string;
  /** Prix TTC en euros. */
  price: number;
  compare?: number;
  badge?: string;
  description: string;
  material: string;
  colors: Color[];
  sizes: string[];
  soldOut: string[];
  images: ProductImage[];
}

export type CatalogFilter = "all" | "hoodie" | "tee" | "more";
export const CATALOG_FILTERS: CatalogFilter[] = ["all", "hoodie", "tee", "more"];

export const isCatalogFilter = (value: unknown): value is CatalogFilter =>
  typeof value === "string" && (CATALOG_FILTERS as string[]).includes(value);

export const matchesFilter = (product: Product, filter: CatalogFilter): boolean =>
  filter === "all" ||
  product.type === filter ||
  (filter === "more" && (product.type === "pack" || product.type === "acc"));

export const filterProducts = (products: Product[], filter: CatalogFilter): Product[] =>
  products.filter((p) => matchesFilter(p, filter));

export const countByFilter = (products: Product[]): Record<CatalogFilter, number> =>
  Object.fromEntries(CATALOG_FILTERS.map((f) => [f, filterProducts(products, f).length])) as Record<
    CatalogFilter,
    number
  >;

export const isSizeAvailable = (product: Product, size: string): boolean =>
  product.sizes.includes(size) && !product.soldOut.includes(size);

/** Coloris demandé s'il existe, sinon le premier. */
export const pickColor = (product: Product, wanted?: string | null): Color =>
  product.colors.find((c) => c.key === wanted) ?? product.colors[0];

/** Taille implicite quand il n'y en a qu'une (accessoires taille unique). */
export const defaultSize = (product: Product): string | null => (product.sizes.length === 1 ? product.sizes[0] : null);

export const imageFor = (product: Product, colorKey: string): ProductImage | undefined =>
  product.images.find((i) => i.colorKey === colorKey) ?? product.images[0];

export const relatedProducts = (products: Product[], product: Product, limit = 3): Product[] =>
  products.filter((p) => p.id !== product.id).slice(0, limit);

/** Le badge "sombre" signale une rareté (édition limitée, promo). */
export const isDarkBadge = (badge: string | undefined): boolean => !!badge && /limit|-15|%/.test(badge);
