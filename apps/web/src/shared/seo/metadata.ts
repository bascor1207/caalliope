import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type AppPathname, routing } from "@/i18n/routing";
import { absoluteUrl, SITE } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";

type Href = Parameters<typeof getPathname>[0]["href"];

/** canonical + hreflang pour une route localisée. */
export function localizedAlternates(locale: Locale, href: Href): NonNullable<Metadata["alternates"]> {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(getPathname({ locale: l, href }))]));
  return {
    canonical: absoluteUrl(getPathname({ locale, href })),
    languages: { ...languages, "x-default": languages[routing.defaultLocale] },
  };
}

export const pathFor = (locale: Locale, pathname: AppPathname, params?: Record<string, string>) =>
  getPathname({ locale, href: params ? ({ pathname, params } as Href) : (pathname as Href) });

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: `${SITE.url}/`,
  logo: { "@type": "ImageObject", url: absoluteUrl("/icon"), width: 512, height: 512 },
  sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE.email,
    availableLanguage: ["fr", "en"],
  },
});

export const websiteJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: `${SITE.url}/`,
  name: SITE.name,
  inLanguage: locale === "fr" ? "fr-FR" : "en",
  publisher: { "@id": `${SITE.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absoluteUrl(pathFor(locale, "/recherche"))}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.url),
  })),
});
