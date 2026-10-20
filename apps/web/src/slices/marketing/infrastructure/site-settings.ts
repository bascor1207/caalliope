import { getSql, hasDatabase } from "@koda/db";
import { unstable_cache } from "next/cache";
import { SITE } from "@/shared/config/site";
import type { SocialLinks } from "../domain/social";

const DEFAULTS: SocialLinks = {
  instagram: SITE.instagram,
  tiktok: SITE.tiktok,
  facebook: SITE.facebook,
  youtube: "",
  email: SITE.email,
};

async function readSetting<T>(key: string): Promise<T | null> {
  if (!hasDatabase()) return null;
  try {
    const [row] = await getSql()<{ value: T }[]>`SELECT value FROM site_settings WHERE key = ${key}`;
    return row?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Réglages édités dans le back-office (`site_settings`), mis en cache une heure et invalidés à la demande
 * par le back-office via /api/revalidate (tag `settings`). Sans base : valeurs du fichier de config.
 */
export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLinks> => ({ ...DEFAULTS, ...((await readSetting<Partial<SocialLinks>>("social")) ?? {}) }),
  ["site-settings-social"],
  { tags: ["settings"], revalidate: 3600 },
);
