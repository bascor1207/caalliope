import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/** Proxy Next 16 (ex-middleware) : détection de locale, préfixes et chemins localisés. */
export default createMiddleware(routing);

export const config = {
  // Tout sauf les routes internes et les fichiers (sitemap.xml, robots.txt, manifest...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
