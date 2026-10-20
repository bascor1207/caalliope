import { getSql, hasDatabase } from "@koda/db";
import type { AuthFeatures } from "../domain/user";

const DEFAULTS: AuthFeatures = { email: true, google: false, apple: false };

/** Fournisseurs activés (feature flags gérés dans l'admin). Sans base : e-mail seulement. */
export async function getAuthFeatures(): Promise<AuthFeatures> {
  if (!hasDatabase()) return DEFAULTS;
  try {
    const rows = await getSql()<
      { key: string; enabled: boolean }[]
    >`SELECT key, enabled FROM feature_flags WHERE key LIKE 'auth.%'`;
    const flags = Object.fromEntries(rows.map((r) => [r.key, r.enabled]));
    return {
      email: flags["auth.email"] ?? DEFAULTS.email,
      google: flags["auth.google"] ?? DEFAULTS.google,
      apple: flags["auth.apple"] ?? DEFAULTS.apple,
    };
  } catch (error) {
    console.error("[auth] feature flags illisibles", error);
    return DEFAULTS;
  }
}
