import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

/** Client Supabase serveur (cookies) pour l'authentification de l'admin. */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (toSet) => {
          try {
            for (const { name, value, options } of toSet) store.set(name, value, options);
          } catch {
            // Server Component : ignoré
          }
        },
      },
    },
  );
}
