/**
 * Domaine catalogue : types et règles pures. Aucune dépendance (ni React, ni Next, ni autre slice).
 */
export type ProductType = "hoodie" | "sweat" | "tee" | "pack" | "acc";

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
  /** Tailles épuisées quel que soit le coloris. */
  soldOut: string[];
  /** Tailles épuisées pour un coloris donné. */
  soldOutByColor: Record<string, string[]>;
  images: ProductImage[];
}

export type CatalogFilter = "all" | "hoodie" | "sweat" | "tee";

/** Catégories indexables (une page par type de pièce), avec leur chemin interne. */
export type CategoryType = "hoodie" | "sweat" | "tee";
export const CATEGORY_PATHS: Record<CategoryType, "/hoodies" | "/sweats" | "/t-shirts"> = {
  hoodie: "/hoodies",
  sweat: "/sweats",
  tee: "/t-shirts",
};
export const CATEGORY_TYPES = Object.keys(CATEGORY_PATHS) as CategoryType[];
export const CATALOG_FILTERS: CatalogFilter[] = ["all", "hoodie", "sweat", "tee"];

export const isCatalogFilter = (value: unknown): value is CatalogFilter =>
  typeof value === "string" && (CATALOG_FILTERS as string[]).includes(value);

export const matchesFilter = (product: Product, filter: CatalogFilter): boolean =>
  filter === "all" || product.type === filter;

export const filterProducts = (products: Product[], filter: CatalogFilter): Product[] =>
  products.filter((p) => matchesFilter(p, filter));

export const countByFilter = (products: Product[]): Record<CatalogFilter, number> =>
  Object.fromEntries(CATALOG_FILTERS.map((f) => [f, filterProducts(products, f).length])) as Record<
    CatalogFilter,
    number
  >;

export const isSizeAvailable = (product: Product, size: string, colorKey?: string): boolean =>
  product.sizes.includes(size) &&
  !product.soldOut.includes(size) &&
  !(colorKey && product.soldOutByColor[colorKey]?.includes(size));

/** Coloris demandé s'il existe, sinon le premier. */
export const pickColor = (product: Product, wanted?: string | null): Color =>
  product.colors.find((c) => c.key === wanted) ?? product.colors[0];

/** Taille implicite quand il n'y en a qu'une (accessoires taille unique). */
export const defaultSize = (product: Product): string | null => (product.sizes.length === 1 ? product.sizes[0] : null);

export const imageFor = (product: Product, colorKey: string): ProductImage | undefined =>
  product.images.find((i) => i.colorKey === colorKey) ?? product.images[0];

export const relatedProducts = (products: Product[], product: Product, limit = 3): Product[] =>
  products.filter((p) => p.id !== product.id).slice(0, limit);

export interface Suggestion {
  product: Product;
  colorKey: string;
}

/**
 * « Parfait avec » : pièces complémentaires à un article (autres types d'abord, puis le reste),
 * dans le même coloris quand il existe, sinon le premier coloris disponible.
 */
export const complementaryProducts = (
  products: Product[],
  productId: string,
  colorKey: string,
  limit = 3,
): Suggestion[] => {
  const current = products.find((p) => p.id === productId);
  const others = products.filter((p) => p.id !== productId);
  const ordered = current
    ? [...others.filter((p) => p.type !== current.type), ...others.filter((p) => p.type === current.type)]
    : others;
  return ordered.slice(0, limit).map((product) => ({
    product,
    colorKey: product.colors.some((c) => c.key === colorKey) ? colorKey : product.colors[0].key,
  }));
};

/** Le badge "sombre" signale une rareté (édition limitée, promo). */
export const isDarkBadge = (badge: string | undefined): boolean => !!badge && /limit|-15|%/.test(badge);
