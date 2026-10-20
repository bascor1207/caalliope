#!/usr/bin/env node
/**
 * Importe le catalogue public d'une boutique Shopify (products.json) et génère
 * un fichier de données in-memory avec les vraies photos (CDN Shopify).
 *
 *   node scripts/import-shopify.mjs https://kodaclothing.fr
 *   node scripts/import-shopify.mjs https://kodaclothing.fr src/modules/catalog/infrastructure/catalog.shopify.data.ts
 *
 * Ensuite : importer PRODUCTS_SHOPIFY dans catalog.data.ts (ou dans le container)
 * et compléter les champs que Shopify ne connaît pas (material, badge, soldOut).
 * Les URL CDN acceptent un suffixe de taille : ..._800x.jpg ou ?width=800.
 */
import { writeFile } from "node:fs/promises";

const [shop = "https://kodaclothing.fr", out = "src/modules/catalog/infrastructure/catalog.shopify.data.ts"] =
  process.argv.slice(2);

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const guessType = (p) => {
  const t = `${p.product_type} ${p.title} ${p.tags?.join(" ") ?? ""}`.toLowerCase();
  if (/hoodie|sweat|capuche/.test(t)) return "hoodie";
  if (/t-?shirt|tee/.test(t)) return "tee";
  if (/pack|duo|bundle/.test(t)) return "pack";
  return "acc";
};

const res = await fetch(`${shop.replace(/\/$/, "")}/products.json?limit=250`, {
  headers: { accept: "application/json" },
});
if (!res.ok) {
  console.error(`Échec ${res.status} sur ${shop}/products.json`);
  process.exit(1);
}
const { products } = await res.json();

const colorKeys = new Map();
const mapped = products.map((p) => {
  const colorOpt = p.options?.find((o) => /couleur|color|coloris/i.test(o.name));
  const sizeOpt = p.options?.find((o) => /taille|size/i.test(o.name));
  const colors = (colorOpt?.values ?? []).map((v) => {
    const k = slugify(v);
    colorKeys.set(k, v);
    return k;
  });
  const sizes = sizeOpt?.values ?? ["TU"];
  const soldOut = sizes.filter(
    (s) => !p.variants.some((v) => [v.option1, v.option2, v.option3].includes(s) && v.available),
  );
  const images = p.images.map((img) => {
    const variant = p.variants.find((v) => v.featured_image?.id === img.id);
    const colorValue = variant
      ? [variant.option1, variant.option2, variant.option3].find((o) => colorOpt?.values.includes(o))
      : undefined;
    return { src: img.src, alt: img.alt ?? p.title, color: colorValue ? slugify(colorValue) : undefined };
  });
  return {
    id: p.handle,
    slug: p.handle,
    sku: p.variants[0]?.sku || p.handle.toUpperCase(),
    type: guessType(p),
    name: p.title,
    sub: p.product_type || "",
    price: Number(p.variants[0]?.price ?? 0),
    compare: p.variants[0]?.compare_at_price ? Number(p.variants[0].compare_at_price) : undefined,
    description:
      p.body_html
        ?.replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim() ?? "",
    material: "",
    colors,
    sizes,
    soldOut,
    images,
  };
});

const colorsTs = [...colorKeys]
  .map(
    ([k, name]) =>
      `  ${JSON.stringify(k)}: { key: ${JSON.stringify(k)}, name: ${JSON.stringify(name)}, hex: "#DDDDDD" },`,
  )
  .join("\n");
const file = `// Généré par scripts/import-shopify.mjs depuis ${shop} le ${new Date().toISOString().slice(0, 10)}.
// Compléter : hex des couleurs, material, badge. Ajouter les nouvelles clés de couleur au type ColorKey.
import type { Product } from "../domain/product";

export const COLORS_SHOPIFY = {
${colorsTs}
} as const;

export const PRODUCTS_SHOPIFY = ${JSON.stringify(mapped, null, 2)} as unknown as Product[];
`;
await writeFile(out, file);
console.log(
  `${mapped.length} produits, ${colorKeys.size} couleurs, ${mapped.reduce((n, p) => n + p.images.length, 0)} images → ${out}`,
);
