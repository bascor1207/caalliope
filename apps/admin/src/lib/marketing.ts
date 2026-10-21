import type { Localized } from "./catalog-types";
import { getSetting, setSetting } from "./settings";

export interface VideoMedia {
  src: string;
  poster?: string;
}
/** `null` = bloc masqué ; `undefined` (absent) = fichiers par défaut de la boutique. */
export interface SiteMedia {
  hero?: VideoMedia | null;
  story?: VideoMedia | null;
  /** Formes pastel animées derrière le hero (true par défaut). */
  heroBlobs?: boolean;
}

export interface BannerSource {
  id: string;
  message: Localized;
  href?: string;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  order: number;
}

export const MEDIA_KEY = "media";
export const BANNERS_KEY = "banners";

export const getMedia = async (): Promise<SiteMedia> => (await getSetting<SiteMedia>(MEDIA_KEY)) ?? {};
export const saveMedia = (media: SiteMedia) => setSetting(MEDIA_KEY, media);

/** Bannières par défaut de la boutique, reprises ici tant que rien n'a été enregistré. */
export const DEFAULT_BANNERS: BannerSource[] = [
  {
    id: "collection",
    order: 1,
    active: true,
    message: { fr: "Nouvelle collection disponible", en: "New collection available" },
    href: "/#drop",
  },
  {
    id: "shipping",
    order: 2,
    active: true,
    message: { fr: "Livraison offerte dès 80 €", en: "Free shipping from €80" },
    href: "/livraison",
  },
  { id: "france", order: 3, active: true, message: { fr: "Expédié depuis la France", en: "Shipped from France" } },
  {
    id: "returns",
    order: 4,
    active: true,
    message: { fr: "Retours gratuits 30 jours", en: "Free 30-day returns" },
    href: "/livraison",
  },
  { id: "cotton", order: 5, active: true, message: { fr: "Coton organique certifié", en: "Certified organic cotton" } },
];

export const getBanners = async (): Promise<BannerSource[]> =>
  (await getSetting<BannerSource[]>(BANNERS_KEY)) ?? DEFAULT_BANNERS;
export const saveBanners = (banners: BannerSource[]) => setSetting(BANNERS_KEY, banners);

export type AnnouncementKind = "info" | "warning" | "promo";
export interface AnnouncementSource {
  kind: AnnouncementKind;
  title: Localized;
  text: Localized;
  ctaLabel?: Localized;
  ctaUrl?: string;
  code?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  version: number;
}
export const ANNOUNCEMENT_KEY = "announcement";
export const getAnnouncement = async (): Promise<AnnouncementSource | null> =>
  getSetting<AnnouncementSource>(ANNOUNCEMENT_KEY);
export const saveAnnouncement = (a: AnnouncementSource) => setSetting(ANNOUNCEMENT_KEY, a);
