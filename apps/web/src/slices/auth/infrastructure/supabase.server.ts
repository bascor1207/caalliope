import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Client Supabase côté serveur (Server Components, actions, routes) porté par les cookies de session. */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
          } catch {
            // Appelé depuis un Server Component : le proxy rafraîchit déjà la session.
          }
        },
      },
    },
  );
}

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
