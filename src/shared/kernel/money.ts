import type { Locale } from "./locale";

const formatters: Partial<Record<Locale, Intl.NumberFormat>> = {};

/** Formatage monétaire hors React (serveur, tests). Dans l'UI, préférer useFormatter() de next-intl. */
export const formatMoney = (amount: number, locale: Locale): string => {
  formatters[locale] ??= new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
  });
  return formatters[locale].format(amount);
};
