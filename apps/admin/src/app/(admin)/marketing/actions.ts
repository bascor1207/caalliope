"use server";

import { revalidatePath } from "next/cache";
import { type BannerSource, getMedia, saveBanners, saveMedia, type VideoMedia } from "@/lib/marketing";
import { revalidateShop } from "@/lib/settings";

export interface MarketingState {
  ok?: string;
  error?: string;
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function done(message: string): Promise<MarketingState> {
  const refreshed = await revalidateShop("settings");
  revalidatePath("/marketing");
  return { ok: refreshed ? `${message} La boutique est à jour.` : `${message} (boutique rafraîchie d'ici une heure)` };
}

/** Bloc vidéo (hero ou histoire) : « default » = fichiers du code, « hidden » = masqué, « custom » = fichiers envoyés. */
export async function saveVideoBlock(
  block: "hero" | "story",
  _prev: MarketingState,
  f: FormData,
): Promise<MarketingState> {
  const mode = str(f, "mode");
  const media = await getMedia();
  let value: VideoMedia | null | undefined;
  if (mode === "hidden") value = null;
  else if (mode === "default") value = undefined;
  else {
    const src = str(f, "src");
    if (!src) return { error: "Envoie une vidéo avant d'enregistrer." };
    value = { src, poster: str(f, "poster") || undefined };
  }
  const next = { ...media };
  if (value === undefined) delete next[block];
  else next[block] = value;
  if (block === "hero") next.heroBlobs = mode === "hidden" ? false : f.get("blobs") !== "off";
  try {
    await saveMedia(next);
  } catch (e) {
    return { error: `Enregistrement impossible : ${e instanceof Error ? e.message : String(e)}` };
  }
  return done(block === "hero" ? "Vidéo du hero enregistrée." : "Bloc vidéo enregistré.");
}

export async function saveBannersAction(_prev: MarketingState, f: FormData): Promise<MarketingState> {
  let banners: BannerSource[];
  try {
    banners = JSON.parse(str(f, "payload")) as BannerSource[];
  } catch {
    return { error: "Données illisibles." };
  }
  const clean = banners
    .filter((b) => b.message?.fr?.trim())
    .map((b, i) => ({
      id: b.id || `b-${Date.now().toString(36)}-${i}`,
      message: { fr: b.message.fr.trim(), en: (b.message.en || b.message.fr).trim() },
      href: b.href?.trim() || undefined,
      startsAt: b.startsAt || undefined,
      endsAt: b.endsAt || undefined,
      active: Boolean(b.active),
      order: i + 1,
    }));
  try {
    await saveBanners(clean);
  } catch (e) {
    return { error: `Enregistrement impossible : ${e instanceof Error ? e.message : String(e)}` };
  }
  return done("Bandeau enregistré.");
}
