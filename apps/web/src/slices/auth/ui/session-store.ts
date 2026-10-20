"use client";

import { useSyncExternalStore } from "react";
import type { AuthGateway } from "../application/ports";
import { isAdmin, type SessionUser } from "../domain/user";
import { supabaseAuthGateway } from "../infrastructure/auth.gateway";
import { isSupabaseConfigured } from "../infrastructure/supabase.browser";

export type SessionState =
  | { status: "loading"; user: null }
  | { status: "anonymous"; user: null }
  | { status: "authenticated"; user: SessionUser };

/** Clé locale lue par la mesure d'audience : un admin connecté n'envoie pas de données. */
export const ROLE_KEY = "koda.role";
export const ROLE_CHANGED = "koda:role-changed";

const LOADING: SessionState = { status: "loading", user: null };
const ANONYMOUS: SessionState = { status: "anonymous", user: null };
let state: SessionState = LOADING;
let started = false;
const listeners = new Set<() => void>();
const gateway: AuthGateway = supabaseAuthGateway;

const emit = () => {
  for (const l of listeners) l();
};

const rememberRole = (user: SessionUser | null) => {
  try {
    if (isAdmin(user)) window.localStorage.setItem(ROLE_KEY, "admin");
    else window.localStorage.removeItem(ROLE_KEY);
    window.dispatchEvent(new Event(ROLE_CHANGED));
  } catch {
    // stockage indisponible
  }
};

async function load() {
  if (!isSupabaseConfigured()) {
    state = ANONYMOUS;
    emit();
    return;
  }
  const user = await gateway.currentUser();
  state = user ? { status: "authenticated", user } : ANONYMOUS;
  rememberRole(user);
  emit();
}

function start() {
  if (started) return;
  started = true;
  // Sans configuration Supabase (dev, tests) : anonyme, et on ne touche jamais au client.
  if (!isSupabaseConfigured()) {
    state = ANONYMOUS;
    queueMicrotask(emit);
    return;
  }
  void load();
  gateway.onChange(() => void load());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  start();
  return () => listeners.delete(l);
};

/** Session côté client, partagée par tous les composants, résolue une fois par onglet. */
export function useSession(): SessionState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => LOADING,
  );
}

export const sessionActions = {
  refresh: load,
  signOut: async () => {
    await gateway.signOut();
    await load();
  },
};

export { gateway as authGateway };
