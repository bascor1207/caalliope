import { NextResponse } from "next/server";
import { supabaseServer } from "@/slices/auth/public-server";

/** Retour OAuth (Google, Apple) et confirmation d'e-mail : échange du code contre une session en cookies. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/compte";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/compte";
  const host = request.headers.get("x-forwarded-host");
  const base = host && process.env.NODE_ENV === "production" ? `https://${host}` : origin;
  if (code) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${base}${next}`);
  }
  return NextResponse.redirect(`${base}/connexion?erreur=callback`);
}
