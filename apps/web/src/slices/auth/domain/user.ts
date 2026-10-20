/** Domaine auth : l'utilisateur tel que le site le connaît. Pur, primitives uniquement. */
export type UserRole = "customer" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

export const isAdmin = (user: SessionUser | null | undefined): boolean => user?.role === "admin";

export const displayName = (user: Pick<SessionUser, "firstName" | "lastName" | "email">): string =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

export type OAuthProvider = "google" | "apple";

/** Fournisseurs de connexion activables par feature flag (admin). */
export interface AuthFeatures {
  email: boolean;
  google: boolean;
  apple: boolean;
}

export type AuthErrorCode =
  | "invalid-credentials"
  | "email-taken"
  | "weak-password"
  | "email-not-confirmed"
  | "provider-disabled"
  | "unknown";

/** Traduit un message d'erreur Supabase en code métier (les messages sont en anglais et instables). */
export const authErrorCode = (message: string | undefined): AuthErrorCode => {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return "invalid-credentials";
  if (m.includes("already registered") || m.includes("already been registered")) return "email-taken";
  if (m.includes("password") && (m.includes("weak") || m.includes("at least"))) return "weak-password";
  if (m.includes("email not confirmed")) return "email-not-confirmed";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) return "provider-disabled";
  return "unknown";
};
