import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/kernel/locale";

/**
 * Routage i18n : `/` en français (sans préfixe), `/en/...` en anglais.
 * Les chemins sont localisés pour le SEO ; les dossiers de `app/[locale]` portent la version française.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/produits/[slug]": { fr: "/produits/[slug]", en: "/products/[slug]" },
    "/recherche": { fr: "/recherche", en: "/search" },
    "/commande": { fr: "/commande", en: "/checkout" },
    "/commande/confirmation": { fr: "/commande/confirmation", en: "/checkout/confirmation" },
    "/guide-des-tailles": { fr: "/guide-des-tailles", en: "/size-guide" },
    "/livraison": { fr: "/livraison", en: "/shipping" },
    "/cgv": { fr: "/cgv", en: "/terms" },
    "/confidentialite": { fr: "/confidentialite", en: "/privacy" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
