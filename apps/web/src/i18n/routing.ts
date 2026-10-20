import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/kernel/locale";

/**
 * Routage i18n : `/` en français (sans préfixe), `/en/...` en anglais, sans détection automatique.
 * Les chemins sont localisés pour le SEO ; les dossiers de `app/[locale]` portent la version française.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  /** Pas de redirection selon Accept-Language ni cookie : `/` sert toujours le français (domaine .fr, Googlebot). */
  localeDetection: false,
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
    "/connexion": { fr: "/connexion", en: "/login" },
    "/inscription": { fr: "/inscription", en: "/signup" },
    "/compte": { fr: "/compte", en: "/account" },
    "/newsletter/desinscription": { fr: "/newsletter/desinscription", en: "/newsletter/unsubscribe" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
