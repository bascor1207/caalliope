/** Kernel partagé : primitives pures, sans dépendance. */
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/** Texte traduit dans toutes les locales supportées. */
export type Localized<T = string> = Record<Locale, T>;

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const localize = <T>(value: Localized<T>, locale: Locale): T => value[locale] ?? value[DEFAULT_LOCALE];
