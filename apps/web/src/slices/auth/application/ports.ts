import type { AuthErrorCode, OAuthProvider, SessionUser } from "../domain/user";

export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode };

/** Port client : comment le navigateur s'authentifie (Supabase aujourd'hui). */
export interface AuthGateway {
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    redirectTo: string;
  }): Promise<AuthResult>;
  signInWithProvider(provider: OAuthProvider, redirectTo: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  /** Utilisateur courant et abonnement aux changements de session. */
  currentUser(): Promise<SessionUser | null>;
  onChange(listener: () => void): () => void;
}
