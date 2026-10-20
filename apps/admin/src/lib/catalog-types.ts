/** Types du catalogue tels que stockés (miroir de `ProductSource` côté boutique). */
export type Localized = { fr: string; en: string };
export type ProductType = "hoodie" | "sweat" | "tee" | "pack" | "acc";
export const PRODUCT_TYPES: Array<[ProductType, string]> = [
  ["hoodie", "Hoodie"],
  ["sweat", "Sweat"],
  ["tee", "T-shirt"],
  ["pack", "Pack"],
  ["acc", "Accessoire"],
];

export interface ColorSource {
  key: string;
  name: Localized;
  hex: string;
}

export interface ProductImage {
  src: string;
  alt: Localized;
  colorKey?: string;
}

export interface ProductData {
  sku: string;
  type: ProductType;
  name: Localized;
  sub: Localized;
  price: number;
  compare?: number;
  badge?: Localized;
  description: Localized;
  material: Localized;
  colorKeys: string[];
  sizes: string[];
  soldOut: string[];
  soldOutByColor?: Record<string, string[]>;
  images: ProductImage[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  sort: number;
  active: boolean;
  data: ProductData;
  updatedAt: string;
}

export const emptyLocalized = (): Localized => ({ fr: "", en: "" });

export const emptyProduct = (): ProductData => ({
  sku: "",
  type: "hoodie",
  name: emptyLocalized(),
  sub: emptyLocalized(),
  price: 0,
  description: emptyLocalized(),
  material: emptyLocalized(),
  colorKeys: [],
  sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  soldOut: [],
  soldOutByColor: {},
  images: [],
});

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Vérifie le minimum vital avant d'écrire : nom FR, slug, prix, au moins un coloris et une taille. */
export function validateProduct(slug: string, data: ProductData): string[] {
  const errors: string[] = [];
  if (!data.name.fr.trim()) errors.push("Le nom (FR) est requis.");
  if (!slug) errors.push("Le slug (adresse de la fiche) est requis.");
  if (!(data.price > 0)) errors.push("Le prix doit être supérieur à 0.");
  if (data.compare !== undefined && data.compare <= data.price) errors.push("Le prix barré doit dépasser le prix.");
  if (data.colorKeys.length === 0) errors.push("Choisis au moins un coloris.");
  if (data.sizes.length === 0) errors.push("Renseigne au moins une taille.");
  for (const img of data.images)
    if (img.colorKey && !data.colorKeys.includes(img.colorKey))
      errors.push(`Une photo est liée au coloris « ${img.colorKey} » qui n'est pas sélectionné.`);
  return errors;
}
