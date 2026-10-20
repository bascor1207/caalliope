"use client";

import { useActionState } from "react";
import { type LoginState, login } from "../actions";

const MESSAGES: Record<NonNullable<LoginState["error"]>, string> = {
  password: "Mot de passe incorrect.",
  config: "ADMIN_PASSWORD et ADMIN_SECRET ne sont pas configurés sur ce déploiement.",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: null });
  return (
    <form action={action} className="mt-6 grid gap-3">
      <label className="grid gap-1.5 text-sm font-semibold" htmlFor="password">
        Mot de passe
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error === "password" || undefined}
          aria-describedby={state.error ? "login-error" : undefined}
          className="rounded-[12px] border-[1.5px] border-line bg-cream px-3.5 py-3 text-base font-normal outline-none focus:border-ink"
        />
      </label>
      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {MESSAGES[state.error]}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-ink px-5 py-3 font-display text-sm font-bold text-cream transition-opacity disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
