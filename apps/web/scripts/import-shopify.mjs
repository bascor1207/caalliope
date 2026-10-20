#!/usr/bin/env node
/**
 * Importe le catalogue public d'une boutique Shopify (products.json) et génère un fichier de
 * données in-memory au format de la slice catalogue (ProductSource[] + palette ColorSource),
 * avec les vraies photos (CDN Shopify).
 *
 *   node scripts/import-shopify.mjs https://kodaclothing.fr
 *   node scripts/import-shopify.mjs https://kodaclothing.fr src/slices/catalog/infrastructure/catalog.shopify.data.ts
 *
 * Ensuite : dans catalog.data.ts, remplacer (ou fusionner) PRODUCT_SOURCES / PALETTE par
 * PRODUCT_SOURCES_SHOPIFY / PALETTE_SHOPIFY, puis compléter ce que Shopify ne connaît pas :
 * traductions EN, hex des couleurs inconnues, grammage, badge.
 * Les URL CDN acceptent un suffixe de taille : ..._800x.jpg ou ?width=800.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [shop = "https://kodaclothing.fr", outArg = "src/slices/catalog/infrastructure/catalog.shopify.data.ts"] =
  process.argv.slice(2);
const out = resolve(process.cwd(), outArg);

/** Hex connus pour les noms de couleurs courants (FR/EN). Les autres sortent en #DDDDDD à compléter. */
const KNOWN_HEX = {
  sauge: "#BFD3C1",
  sage: "#BFD3C1",
  lavande: "#CFC4E6",
  lavender: "#CFC4E6",
  sable: "#E9D8B8",
  sand: "#E9D8B8",
  beige: "#E9D8B8",
  ciel: "#BFD6EA",
  sky: "#BFD6EA",
  "bleu ciel": "#BFD6EA",
  argile: "#E8B8A6",
  clay: "#E8B8A6",
  terracotta: "#E8B8A6",
  craie: "#ECE8E1",
  chalk: "#ECE8E1",
  ecru: "#ECE8E1",
  blanc: "#F6F1EA",
  white: "#F6F1EA",
  noir: "#141414",
  black: "#141414",
  gris: "#C9C5BF",
  grey: "#C9C5BF",
  gray: "#C9C5BF",
  rose: "#F0C8D0",
  pink: "#F0C8D0",
  vert: "#BFD3C1",
  green: "#BFD3C1",
  bleu: "#BFD6EA",
  blue: "#BFD6EA",
  marine: "#2F3A4F",
  navy: "#2F3A4F",
  beurre: "#F3E3A4",
  butter: "#F3E3A4",
  jaune: "#F3E3A4",
  yellow: "#F3E3A4",
};

const slugify = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const stripHtml = (html) =>
  String(html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const guessType = (p) => {
  const t = `${p.product_type} ${p.title} ${(p.tags ?? []).join(" ")}`.toLowerCase();
  if (/hoodie|sweat|capuche/.test(t)) return "hoodie";
  if (/t-?shirt|tee/.test(t)) return "tee";
  if (/pack|duo|bundle/.test(t)) return "pack";
  return "acc";
};

/** Même texte dans les deux locales : la traduction EN se fait à la main ensuite. */
const localized = (fr) => ({ fr, en: fr });

const url = `${shop.replace(/\/$/, "")}/products.json?limit=250`;
const res = await fetch(url, { headers: { accept: "application/json" } });
if (!res.ok) {
  console.error(`Échec ${res.status} sur ${url}`);
  process.exit(1);
}
const { products } = await res.json();

const palette = new Map();
const sources = products.map((p) => {
  const colorOpt = p.options?.find((o) => /couleur|color|coloris/i.test(o.name));
  const sizeOpt = p.options?.find((o) => /taille|size/i.test(o.name));
  const colorKeys = (colorOpt?.values ?? []).map((value) => {
    const key = slugify(value);
    palette.set(key, { key, name: localized(value), hex: KNOWN_HEX[value.toLowerCase()] ?? "#DDDDDD" });
    return key;
  });
  const sizes = sizeOpt?.values ?? ["TU"];
  const variantOptions = (v) => [v.option1, v.option2, v.option3];
  const soldOut = sizes.filter((s) => !p.variants.some((v) => variantOptions(v).includes(s) && v.available));
  const images = (p.images ?? []).map((img) => {
    const variant = p.variants.find((v) => v.featured_image?.id === img.id);
    const colorValue = variant ? variantOptions(variant).find((o) => colorOpt?.values.includes(o)) : undefined;
    return { src: img.src, alt: localized(img.alt ?? p.title), colorKey: colorValue ? slugify(colorValue) : undefined };
  });
  const first = p.variants[0] ?? {};
  return {
    id: p.handle,
    slug: p.handle,
    sku: first.sku || p.handle.toUpperCase(),
    type: guessType(p),
    name: localized(p.title),
    sub: localized(p.product_type || ""),
    price: Number(first.price ?? 0),
    compare: first.compare_at_price ? Number(first.compare_at_price) : undefined,
    description: localized(stripHtml(p.body_html)),
    material: localized(""),
    colorKeys,
    sizes,
    soldOut,
    images,
  };
});

const file = `// Généré par scripts/import-shopify.mjs depuis ${shop} le ${new Date().toISOString().slice(0, 10)}.
// À compléter : traductions EN, hex des couleurs en #DDDDDD, material, badge.
import type { ColorSource, ProductSource } from "../domain/product-source";

export const PALETTE_SHOPIFY: Record<string, ColorSource> = ${JSON.stringify(Object.fromEntries(palette), null, 2)};

export const PRODUCT_SOURCES_SHOPIFY: ProductSource[] = ${JSON.stringify(sources, null, 2)};
`;

await mkdir(dirname(out), { recursive: true });
await writeFile(out, file);
const imageCount = sources.reduce((n, p) => n + p.images.length, 0);
console.log(`${sources.length} produits, ${palette.size} couleurs, ${imageCount} images → ${out}`);
