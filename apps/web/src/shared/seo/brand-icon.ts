import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/shared/config/site";

/**
 * Logo de marque déposé dans public/ (voir public/media/README.md), lu au build pour les icônes.
 * `null` si le fichier manque : les routes d'icône génèrent alors le « K » par défaut.
 */
export async function brandLogoPng(): Promise<Buffer | null> {
  const logo = SITE.media.logo;
  if (!logo || !logo.src.endsWith(".png")) return null;
  try {
    return await readFile(join(process.cwd(), "public", logo.src));
  } catch {
    return null;
  }
}
