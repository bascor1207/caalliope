import { type Locale, type Localized, localize } from "@/shared/kernel/locale";

/**
 * Domaine marketing : messages affichés dans l'espace au-dessus du header.
 * Contenu éditable (futur espace d'administration), jamais codé en dur dans l'UI.
 */
export interface BannerSource {
  id: string;
  message: Localized;
  /** Lien optionnel (chemin interne ou URL). */
  href?: string;
  /** Fenêtre de diffusion optionnelle, ISO 8601. */
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  /** Ordre d'affichage, croissant. */
  order: number;
}

export interface Banner {
  id: string;
  message: string;
  href?: string;
}

export const isLive = (banner: BannerSource, now: Date): boolean =>
  banner.active &&
  (!banner.startsAt || new Date(banner.startsAt) <= now) &&
  (!banner.endsAt || new Date(banner.endsAt) > now);

/** Bannières diffusables maintenant, dans l'ordre, résolues pour une locale. Fonction pure. */
export function liveBanners(sources: BannerSource[], locale: Locale, now: Date): Banner[] {
  return sources
    .filter((b) => isLive(b, now))
    .sort((a, b) => a.order - b.order)
    .map((b) => ({ id: b.id, message: localize(b.message, locale), href: b.href }));
}
