import { type NextRequest, NextResponse } from "next/server";
import { COOKIE, credentials, verifyToken } from "@/lib/auth";

/**
 * Tout l'admin est derrière la session, sauf la page de connexion, ses ressources, la sonde /api/health, le MCP
 * (jeton ou OAuth) et les points d'entrée OAuth publics (métadonnées, enregistrement, jetons). /oauth/authorize reste
 * protégé : c'est l'admin connecté qui consent.
 */
export async function proxy(request: NextRequest) {
  const creds = credentials(process.env);
  const ok = creds ? await verifyToken(creds.secret, request.cookies.get(COOKIE)?.value) : false;
  const isLogin = request.nextUrl.pathname === "/login";
  if (!ok && !isLogin) {
    const url = request.nextUrl.clone();
    const wanted = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = "/login";
    url.search = "";
    // Retour là où l'on allait après connexion (consentement OAuth, lien profond…).
    if (wanted !== "/") url.searchParams.set("next", wanted);
    return NextResponse.redirect(url);
  }
  if (ok && isLogin) {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    url.pathname = "/";
    url.search = "";
    if (next?.startsWith("/") && !next.startsWith("//")) return NextResponse.redirect(new URL(next, request.url));
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|robots.txt|api/health|api/mcp|\\.well-known|oauth/register|oauth/token).*)"],
};
