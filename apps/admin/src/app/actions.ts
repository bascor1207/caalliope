"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, credentials, issueToken, SESSION_SECONDS, safeEqual } from "@/lib/auth";
import { supabaseConfigured, supabaseServer } from "@/lib/supabase";
import { type Role, roleOf, setFlag, setRole } from "@/lib/users";

export interface LoginState {
  error: "config" | "password" | "credentials" | "not-admin" | null;
}

async function openSession() {
  const creds = credentials(process.env);
  if (!creds) return false;
  const jar = await cookies();
  jar.set(COOKIE, await issueToken(creds.secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return true;
}

/** Connexion par compte Supabase : l'e-mail doit avoir le rôle admin dans `profiles`. */
export async function loginWithAccount(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!supabaseConfigured()) return { error: "config" };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "credentials" };
  const role = await roleOf(data.user.id);
  if (role !== "admin") {
    await supabase.auth.signOut();
    return { error: "not-admin" };
  }
  if (!(await openSession())) return { error: "config" };
  redirect("/");
}

/** Accès de secours : mot de passe maître (ADMIN_PASSWORD), tant que l'équipe n'a pas de compte admin. */
export async function loginWithMasterPassword(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const creds = credentials(process.env);
  if (!creds) return { error: "config" };
  if (!safeEqual(String(formData.get("password") ?? ""), creds.password)) return { error: "password" };
  await openSession();
  redirect("/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
  if (supabaseConfigured()) {
    const supabase = await supabaseServer();
    await supabase.auth.signOut().catch(() => undefined);
  }
  redirect("/login");
}

export async function toggleFlag(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  const enabled = formData.get("enabled") === "true";
  if (key) await setFlag(key, enabled);
  revalidatePath("/parametres");
}

export async function changeRole(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : ("customer" as Role);
  if (id) await setRole(id, role);
  revalidatePath("/utilisateurs");
}
