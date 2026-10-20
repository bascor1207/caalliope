import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/config/site";

/** Tout est indexable sauf le tunnel d'achat, l'espace client, la recherche paramétrée et les routes techniques. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/commande",
          "/en/checkout",
          "/compte",
          "/en/account",
          "/connexion",
          "/en/login",
          "/inscription",
          "/en/signup",
          "/newsletter/desinscription",
          "/en/newsletter/unsubscribe",
          "/recherche?",
          "/en/search?",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
