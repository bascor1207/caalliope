import { type Locale, type Localized, localize } from "@/shared/kernel/locale";
import type { Color, Product, ProductType } from "./product";

/** Couleur telle que stockée : nom traduit, hex unique. */
export interface ColorSource {
  key: string;
  name: Localized;
  hex: string;
}

/** Produit tel que stocké : champs textuels traduits, couleurs par clé. */
export interface ProductSource {
  id: string;
  slug: string;
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
  images: Array<{ src: string; alt: Localized; colorKey?: string }>;
}

export const resolveColor = (source: ColorSource, locale: Locale): Color => ({
  key: source.key,
  name: localize(source.name, locale),
  hex: source.hex,
});

/** Projette une source multilingue en Product pour une locale. Fonction pure. */
export function resolveProduct(source: ProductSource, palette: Record<string, ColorSource>, locale: Locale): Product {
  return {
    id: source.id,
    slug: source.slug,
    sku: source.sku,
    type: source.type,
    name: localize(source.name, locale),
    sub: localize(source.sub, locale),
    price: source.price,
    compare: source.compare,
    badge: source.badge ? localize(source.badge, locale) : undefined,
    description: localize(source.description, locale),
    material: localize(source.material, locale),
    colors: source.colorKeys.flatMap((key) => (palette[key] ? [resolveColor(palette[key], locale)] : [])),
    sizes: source.sizes,
    soldOut: source.soldOut,
    images: source.images.map((i) => ({ src: i.src, alt: localize(i.alt, locale), colorKey: i.colorKey })),
  };
}
