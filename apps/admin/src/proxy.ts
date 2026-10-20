import { type NextRequest, NextResponse } from "next/server";
import { COOKIE, credentials, verifyToken } from "@/lib/auth";

/** Tout l'admin est derrière la session, sauf la page de connexion et ses ressources. */
export async function proxy(request: NextRequest) {
  const creds = credentials(process.env);
  const ok = creds ? await verifyToken(creds.secret, request.cookies.get(COOKIE)?.value) : false;
  const isLogin = request.nextUrl.pathname === "/login";
  if (!ok && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (ok && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|robots.txt).*)"],
};
