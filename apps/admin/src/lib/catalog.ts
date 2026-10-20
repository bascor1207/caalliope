import { getSql, hasDatabase } from "@koda/db";
import type { CatalogProduct, ColorSource, ProductData } from "./catalog-types";
import { getSetting, setSetting } from "./settings";

interface Row {
  id: string;
  slug: string;
  sort: number;
  active: boolean;
  data: ProductData;
  updated_at: Date | string;
}

const toProduct = (r: Row): CatalogProduct => ({
  id: r.id,
  slug: r.slug,
  sort: r.sort,
  active: r.active,
  data: r.data,
  updatedAt: new Date(r.updated_at).toISOString(),
});

export async function listCatalog(): Promise<CatalogProduct[]> {
  if (!hasDatabase()) return [];
  const rows = await getSql()<
    Row[]
  >`SELECT id, slug, sort, active, data, updated_at FROM catalog_products ORDER BY sort, created_at`;
  return rows.map(toProduct);
}

export async function getCatalogProduct(id: string): Promise<CatalogProduct | null> {
  if (!hasDatabase()) return null;
  const [row] = await getSql()<
    Row[]
  >`SELECT id, slug, sort, active, data, updated_at FROM catalog_products WHERE id = ${id}`;
  return row ? toProduct(row) : null;
}

export async function slugTaken(slug: string, exceptId: string): Promise<boolean> {
  const [row] = await getSql()<
    { id: string }[]
  >`SELECT id FROM catalog_products WHERE slug = ${slug} AND id <> ${exceptId}`;
  return Boolean(row);
}

export async function saveCatalogProduct(p: Omit<CatalogProduct, "updatedAt">): Promise<void> {
  await getSql()`INSERT INTO catalog_products (id, slug, sort, active, data, updated_at)
    VALUES (${p.id}, ${p.slug}, ${p.sort}, ${p.active}, ${JSON.stringify(p.data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, sort = EXCLUDED.sort, active = EXCLUDED.active, data = EXCLUDED.data, updated_at = now()`;
}

export async function setProductActive(id: string, active: boolean): Promise<void> {
  await getSql()`UPDATE catalog_products SET active = ${active}, updated_at = now() WHERE id = ${id}`;
}

export async function deleteCatalogProduct(id: string): Promise<void> {
  await getSql()`DELETE FROM catalog_products WHERE id = ${id}`;
}

/** Déplace un produit d'un cran dans l'ordre d'affichage (les positions sont renumérotées). */
export async function moveProduct(id: string, dir: -1 | 1): Promise<void> {
  const list = await listCatalog();
  const i = list.findIndex((p) => p.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  const sql = getSql();
  for (const [k, p] of list.entries()) await sql`UPDATE catalog_products SET sort = ${k} WHERE id = ${p.id}`;
}

export const PALETTE_KEY = "catalog.palette";

export async function getPalette(): Promise<Record<string, ColorSource>> {
  return (await getSetting<Record<string, ColorSource>>(PALETTE_KEY)) ?? {};
}

export async function savePalette(palette: Record<string, ColorSource>): Promise<void> {
  await setSetting(PALETTE_KEY, palette);
}

/** Import initial : reprend le catalogue écrit dans le code de la boutique (une fois, quand la table est vide). */
export async function importFromShop(): Promise<{ products: number; colors: number }> {
  const base = process.env.SHOP_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) throw new Error("SHOP_URL et REVALIDATE_SECRET sont requis pour importer.");
  const res = await fetch(`${base.replace(/\/$/, "")}/api/catalog/sources`, {
    headers: { authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`La boutique a répondu ${res.status}.`);
  const { palette, products } = (await res.json()) as {
    palette: Record<string, ColorSource>;
    products: Array<ProductData & { id: string; slug: string }>;
  };
  await savePalette(palette);
  for (const [i, { id, slug, ...data }] of products.entries()) {
    await saveCatalogProduct({ id, slug, sort: i, active: true, data });
  }
  return { products: products.length, colors: Object.keys(palette).length };
}
