"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteCatalogProduct,
  getPalette,
  importFromShop,
  moveProduct,
  saveCatalogProduct,
  savePalette,
  setProductActive,
  slugTaken,
} from "@/lib/catalog";
import { type ColorSource, type ProductData, slugify, validateProduct } from "@/lib/catalog-types";
import { revalidateShop } from "@/lib/settings";

export interface CatalogState {
  ok?: string;
  errors?: string[];
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function refreshed(message: string): Promise<CatalogState> {
  const ok = await revalidateShop("catalog");
  revalidatePath("/catalogue");
  return { ok: ok ? `${message} La boutique est à jour.` : `${message} (boutique rafraîchie d'ici 5 min)` };
}

/** Enregistre une fiche (création si l'identifiant est nouveau). Le payload est le JSON construit par l'éditeur. */
export async function saveProductAction(id: string, _prev: CatalogState, f: FormData): Promise<CatalogState> {
  let data: ProductData;
  try {
    data = JSON.parse(str(f, "payload")) as ProductData;
  } catch {
    return { errors: ["Données illisibles."] };
  }
  const slug = slugify(str(f, "slug") || data.name.fr);
  const errors = validateProduct(slug, data);
  if (errors.length > 0) return { errors };
  const finalId = id === "nouveau" ? slug : id;
  if (await slugTaken(slug, finalId)) return { errors: ["Ce slug est déjà utilisé par une autre fiche."] };
  try {
    await saveCatalogProduct({
      id: finalId,
      slug,
      sort: Number(str(f, "sort") || 0),
      active: f.get("active") === "on",
      data: {
        ...data,
        sku: data.sku.trim(),
        compare: data.compare && data.compare > 0 ? data.compare : undefined,
        badge: data.badge?.fr?.trim() ? data.badge : undefined,
        soldOutByColor: Object.fromEntries(Object.entries(data.soldOutByColor ?? {}).filter(([, v]) => v.length > 0)),
      },
    });
  } catch (e) {
    return { errors: [`Enregistrement impossible : ${e instanceof Error ? e.message : String(e)}`] };
  }
  const state = await refreshed("Fiche enregistrée.");
  if (id === "nouveau") redirect(`/catalogue/${finalId}`);
  revalidatePath(`/catalogue/${finalId}`);
  return state;
}

export async function toggleProductAction(f: FormData): Promise<void> {
  const id = str(f, "id");
  if (id) await setProductActive(id, f.get("active") === "true");
  await revalidateShop("catalog");
  revalidatePath("/catalogue");
}

/** Variante appelée par l'interrupteur optimiste de la liste. */
export async function setProductOnline(id: string, active: boolean): Promise<void> {
  if (!id) return;
  await setProductActive(id, active);
  await revalidateShop("catalog");
  revalidatePath("/catalogue");
}

export async function moveProductAction(f: FormData): Promise<void> {
  const id = str(f, "id");
  if (id) await moveProduct(id, f.get("dir") === "up" ? -1 : 1);
  await revalidateShop("catalog");
  revalidatePath("/catalogue");
}

export async function deleteProductAction(f: FormData): Promise<void> {
  const id = str(f, "id");
  if (id) await deleteCatalogProduct(id);
  await revalidateShop("catalog");
  revalidatePath("/catalogue");
  redirect("/catalogue");
}

export async function importCatalogAction(_prev: CatalogState, _f: FormData): Promise<CatalogState> {
  try {
    const r = await importFromShop();
    return refreshed(`${r.products} produits et ${r.colors} coloris importés.`);
  } catch (e) {
    return { errors: [e instanceof Error ? e.message : String(e)] };
  }
}

/** Palette : un coloris = clé stable, nom FR/EN, couleur hex. */
export async function savePaletteAction(_prev: CatalogState, f: FormData): Promise<CatalogState> {
  let colors: ColorSource[];
  try {
    colors = JSON.parse(str(f, "payload")) as ColorSource[];
  } catch {
    return { errors: ["Données illisibles."] };
  }
  const palette: Record<string, ColorSource> = {};
  for (const c of colors) {
    const key = slugify(c.key || c.name.fr);
    if (!key || !c.name.fr.trim()) continue;
    if (!/^#[0-9a-f]{6}$/i.test(c.hex)) return { errors: [`Couleur « ${c.name.fr} » : hex invalide (${c.hex}).`] };
    palette[key] = {
      key,
      name: { fr: c.name.fr.trim(), en: (c.name.en || c.name.fr).trim() },
      hex: c.hex.toUpperCase(),
    };
  }
  try {
    await savePalette(palette);
  } catch (e) {
    return { errors: [`Enregistrement impossible : ${e instanceof Error ? e.message : String(e)}`] };
  }
  return refreshed("Palette enregistrée.");
}

export async function currentPalette() {
  return getPalette();
}
