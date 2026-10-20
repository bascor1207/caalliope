import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = /^sb-.*-auth-token/;

/**
 * Rafraîchit la session Supabase dans le proxy, uniquement si un cookie de session existe :
 * les visiteurs anonymes (l'immense majorité) ne coûtent rien.
 */
export async function refreshSession(request: NextRequest, response: NextResponse): Promise<void> {
  if (!request.cookies.getAll().some((c) => SESSION_COOKIE.test(c.name))) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getClaims();
}
