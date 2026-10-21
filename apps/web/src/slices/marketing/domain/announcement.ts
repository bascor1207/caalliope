import type { Locale, Localized } from "@/shared/kernel/locale";
import { localize } from "@/shared/kernel/locale";

export type AnnouncementKind = "info" | "warning" | "promo";

/** Annonce plein écran (modale) éditée dans le back-office : avertissement, promo, nouveauté… */
export interface AnnouncementSource {
  kind: AnnouncementKind;
  title: Localized;
  text: Localized;
  ctaLabel?: Localized;
  ctaUrl?: string;
  /** Code promo mis en avant (copiable). */
  code?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  /** Changer la version la réaffiche à ceux qui l'avaient fermée. */
  version: number;
}

export interface Announcement {
  id: string;
  kind: AnnouncementKind;
  title: string;
  text: string;
  ctaLabel?: string;
  ctaUrl?: string;
  code?: string;
}

export const isAnnouncementLive = (a: AnnouncementSource | null, now: Date): boolean =>
  Boolean(a?.active && a.title.fr) &&
  (!a?.startsAt || new Date(a.startsAt) <= now) &&
  (!a?.endsAt || new Date(a.endsAt) > now);

/** Projette l'annonce pour une locale ; l'identifiant change avec la version (clé « déjà vue »). */
export function resolveAnnouncement(a: AnnouncementSource, locale: Locale): Announcement {
  return {
    id: `v${a.version}`,
    kind: a.kind,
    title: localize(a.title, locale),
    text: localize(a.text, locale),
    ctaLabel: a.ctaLabel?.fr ? localize(a.ctaLabel, locale) : undefined,
    ctaUrl: a.ctaUrl || undefined,
    code: a.code || undefined,
  };
}
