import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/shared/config/site";

const read = async (src: string | undefined) => {
  if (!src || !src.endsWith(".png")) return null;
  try {
    return await readFile(join(process.cwd(), "public", src));
  } catch {
    return null;
  }
};

/**
 * Icône de marque pour favicon et écran d'accueil : `koda-icon.png` (fond uni bleu ciel, lettres grandes,
 * lisible en 16 px), à défaut le logo rond, à défaut `null` et les routes génèrent le « K ».
 */
export async function brandLogoPng(): Promise<Buffer | null> {
  return (await read(SITE.media.icon?.src)) ?? (await read(SITE.media.logo?.src));
}
