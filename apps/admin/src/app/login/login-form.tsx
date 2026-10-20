"use client";

import { useActionState, useState } from "react";
import { type LoginState, loginWithAccount, loginWithMasterPassword } from "../actions";

const MESSAGES: Record<NonNullable<LoginState["error"]>, string> = {
  password: "Mot de passe incorrect.",
  credentials: "E-mail ou mot de passe incorrect.",
  "not-admin": "Ce compte existe mais n'a pas le rôle admin. Un admin peut te le donner dans Utilisateurs.",
  config: "Supabase ou ADMIN_PASSWORD / ADMIN_SECRET ne sont pas configurés sur ce déploiement.",
};

const input =
  "rounded-[12px] border-[1.5px] border-line bg-cream px-3.5 py-3 text-base font-normal outline-none focus:border-ink";

export function LoginForm({ supabase }: { supabase: boolean }) {
  const [account, accountAction, accountPending] = useActionState(loginWithAccount, { error: null });
  const [master, masterAction, masterPending] = useActionState(loginWithMasterPassword, { error: null });
  const [showMaster, setShowMaster] = useState(!supabase);

  return (
    <div className="mt-6 grid gap-6">
      {supabase && (
        <form action={accountAction} className="grid gap-3">
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor="email">
            E-mail
            <input id="email" name="email" type="email" autoComplete="email" required className={input} />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor="password">
            Mot de passe
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-invalid={account.error === "credentials" || undefined}
              aria-describedby={account.error ? "login-error" : undefined}
              className={input}
            />
          </label>
          {account.error && (
            <p id="login-error" role="alert" className="text-sm text-danger">
              {MESSAGES[account.error]}
            </p>
          )}
          <button
            type="submit"
            disabled={accountPending}
            className="mt-1 rounded-full bg-ink px-5 py-3 font-display text-sm font-semibold text-cream transition-opacity disabled:opacity-60"
          >
            {accountPending ? "Connexion…" : "Se connecter"}
          </button>
          <p className="text-xs text-muted">
            Compte créé sur la boutique, avec le rôle admin.{" "}
            <button type="button" className="underline" onClick={() => setShowMaster((v) => !v)}>
              Accès de secours
            </button>
          </p>
        </form>
      )}
      {showMaster && (
        <form action={masterAction} className="grid gap-3 rounded-[16px] border border-line bg-cream/60 p-4">
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor="master">
            Mot de passe maître
            <input
              id="master"
              name="password"
              type="password"
              autoComplete="off"
              required
              aria-invalid={master.error === "password" || undefined}
              className={input}
            />
          </label>
          {master.error && (
            <p role="alert" className="text-sm text-danger">
              {MESSAGES[master.error]}
            </p>
          )}
          <button
            type="submit"
            disabled={masterPending}
            className="rounded-full border border-ink px-5 py-2.5 font-display text-sm font-semibold transition-opacity disabled:opacity-60"
          >
            {masterPending ? "Connexion…" : "Entrer"}
          </button>
        </form>
      )}
    </div>
  );
}
