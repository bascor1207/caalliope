import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { refreshSession } from "./slices/auth/public-server";

const intl = createMiddleware(routing);

/**
 * Proxy Next 16 (ex-middleware) : locale et chemins localisés (next-intl), puis rafraîchissement de la session
 * Supabase si un cookie de session existe (les anonymes ne coûtent rien). Les pages restent statiques.
 */
export default async function proxy(request: NextRequest) {
  const response = intl(request);
  await refreshSession(request, response);
  return response;
}

export const config = {
  // Tout sauf les routes internes et les fichiers (sitemap.xml, robots.txt, manifest...).
  matcher: "/((?!api|_next|_vercel|auth/|.*\\..*).*)",
};
