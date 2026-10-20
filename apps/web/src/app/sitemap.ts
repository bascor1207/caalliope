import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { type AppPathname, routing } from "@/i18n/routing";
import { absoluteUrl } from "@/shared/config/site";
import { catalogRepository, listProducts } from "@/slices/catalog/public-server";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Une entrée par locale avec ses alternates hreflang. */
function entry(href: Href, extra: Partial<MetadataRoute.Sitemap[number]>): MetadataRoute.Sitemap {
  const urlFor = (locale: (typeof routing.locales)[number]) => absoluteUrl(getPathname({ locale, href }));
  const languages = Object.fromEntries(routing.locales.map((l) => [l, urlFor(l)]));
  return routing.locales.map((locale) => ({
    url: urlFor(locale),
    lastModified: new Date(),
    alternates: { languages },
    ...extra,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts(catalogRepository, routing.defaultLocale);
  const statics: Array<[AppPathname, Partial<MetadataRoute.Sitemap[number]>]> = [
    ["/", { changeFrequency: "weekly", priority: 1 }],
    ["/hoodies", { changeFrequency: "weekly", priority: 0.8 }],
    ["/sweats", { changeFrequency: "weekly", priority: 0.8 }],
    ["/t-shirts", { changeFrequency: "weekly", priority: 0.8 }],
    ["/guide-des-tailles", { changeFrequency: "monthly", priority: 0.5 }],
    ["/livraison", { changeFrequency: "monthly", priority: 0.4 }],
    ["/cgv", { changeFrequency: "yearly", priority: 0.2 }],
    ["/confidentialite", { changeFrequency: "yearly", priority: 0.2 }],
  ];
  return [
    ...statics.flatMap(([pathname, extra]) => entry(pathname as Href, extra)),
    ...products.flatMap((p) =>
      entry({ pathname: "/produits/[slug]", params: { slug: p.slug } }, { changeFrequency: "weekly", priority: 0.9 }),
    ),
  ];
}
