"use client";

import type { AuthGateway } from "../application/ports";
import { authErrorCode, type SessionUser, type UserRole } from "../domain/user";
import { supabaseBrowser } from "./supabase.browser";

/** Adapter Supabase du port d'authentification, côté navigateur. */
export const supabaseAuthGateway: AuthGateway = {
  async signIn(email, password) {
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    return error ? { ok: false, code: authErrorCode(error.message) } : { ok: true };
  },
  async signUp({ email, password, firstName, lastName, redirectTo }) {
    const { error } = await supabaseBrowser().auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName }, emailRedirectTo: redirectTo },
    });
    return error ? { ok: false, code: authErrorCode(error.message) } : { ok: true };
  },
  async signInWithProvider(provider, redirectTo) {
    const { error } = await supabaseBrowser().auth.signInWithOAuth({ provider, options: { redirectTo } });
    return error ? { ok: false, code: authErrorCode(error.message) } : { ok: true };
  },
  async signOut() {
    await supabaseBrowser().auth.signOut();
  },
  async currentUser() {
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, first_name, last_name, avatar_url, role")
      .eq("id", user.id)
      .maybeSingle();
    const p = profile as {
      email: string;
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
      role: UserRole;
    } | null;
    const session: SessionUser = {
      id: user.id,
      email: p?.email ?? user.email ?? "",
      firstName: p?.first_name ?? null,
      lastName: p?.last_name ?? null,
      avatarUrl: p?.avatar_url ?? null,
      role: p?.role ?? "customer",
    };
    return session;
  },
  onChange(listener) {
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => listener());
    return () => data.subscription.unsubscribe();
  },
};
