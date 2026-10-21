import { getSql, hasDatabase } from "@koda/db";
import { unstable_cache } from "next/cache";
import { SITE } from "@/shared/config/site";
import type { AnnouncementSource } from "../domain/announcement";
import type { BannerSource } from "../domain/banner";
import type { SocialLinks } from "../domain/social";
import { BANNERS } from "./banners.data";

/* À incrémenter quand la forme des réglages change : le cache de données Vercel survit aux déploiements. */
const CACHE_VERSION = "v2";

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
    const [row] = await getSql()<{ value: unknown }[]>`SELECT value FROM site_settings WHERE key = ${key}`;
    const v = row?.value;
    if (typeof v === "string") return JSON.parse(v) as T;
    return (v as T) ?? null;
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
  ["site-settings-social", CACHE_VERSION],
  { tags: ["settings"], revalidate: 3600 },
);

export interface VideoMedia {
  src: string;
  poster?: string;
}
export interface SiteMedia {
  /** Vidéo de fond du hero (null = blobs pastel seuls). */
  hero: VideoMedia | null;
  /** Bloc vidéo de marque sur l'accueil (null = section masquée). */
  story: VideoMedia | null;
  /** Formes pastel animées derrière le hero. */
  heroBlobs: boolean;
}

const toVideo = (v: Partial<VideoMedia> | null | undefined, fallback: VideoMedia | null): VideoMedia | null => {
  if (v === null) return null;
  if (!v?.src) return fallback;
  return { src: v.src, poster: v.poster || undefined };
};

/** Vidéos de l'accueil, éditées dans le back-office (Marketing). Repli : fichiers de `public/media`. */
export const getSiteMedia = unstable_cache(
  async (): Promise<SiteMedia> => {
    const stored = await readSetting<{
      hero?: Partial<VideoMedia> | null;
      story?: Partial<VideoMedia> | null;
      heroBlobs?: boolean;
    }>("media");
    return {
      hero: toVideo(stored?.hero, SITE.media.heroVideo),
      story: toVideo(stored?.story, SITE.media.storyVideo),
      heroBlobs: stored?.heroBlobs ?? true,
    };
  },
  ["site-settings-media", CACHE_VERSION],
  { tags: ["settings"], revalidate: 3600 },
);

/** Bannières du bandeau, éditées dans le back-office. Repli : celles du code. */
export const getBanners = unstable_cache(
  async (): Promise<BannerSource[]> => (await readSetting<BannerSource[]>("banners")) ?? BANNERS,
  ["site-settings-banners", CACHE_VERSION],
  { tags: ["settings"], revalidate: 3600 },
);

/** Annonce (modale) éditée dans le back-office. `null` tant qu'aucune n'est enregistrée. */
export const getAnnouncement = unstable_cache(
  async (): Promise<AnnouncementSource | null> => readSetting<AnnouncementSource>("announcement"),
  ["site-settings-announcement", CACHE_VERSION],
  { tags: ["settings"], revalidate: 3600 },
);
