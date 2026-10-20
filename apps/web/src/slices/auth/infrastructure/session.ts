import { getSql, hasDatabase } from "@koda/db";
import type { SessionUser, UserRole } from "../domain/user";
import { isSupabaseConfigured, supabaseServer } from "./supabase.server";

interface ProfileRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}

/** Utilisateur de la requête courante (cookies), avec son profil et son rôle. `null` si anonyme. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  const profile = await loadProfile(String(claims.sub), supabase);
  return {
    id: String(claims.sub),
    email: profile?.email ?? String(claims.email ?? ""),
    firstName: profile?.first_name ?? null,
    lastName: profile?.last_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    role: profile?.role ?? "customer",
  };
}

async function loadProfile(
  id: string,
  supabase: Awaited<ReturnType<typeof supabaseServer>>,
): Promise<ProfileRow | null> {
  if (hasDatabase()) {
    const rows = await getSql()<
      ProfileRow[]
    >`SELECT id, email, first_name, last_name, avatar_url, role FROM profiles WHERE id = ${id}`;
    return rows[0] ?? null;
  }
  const { data } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, avatar_url, role")
    .eq("id", id)
    .maybeSingle();
  return (data as ProfileRow | null) ?? null;
}
