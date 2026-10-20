"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { getPathname, Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { Button, cn, Input, Label, startNavigation } from "@/shared/ui";
import type { AuthErrorCode, AuthFeatures, OAuthProvider } from "../domain/user";
import { authGateway, sessionActions } from "./session-store";

interface Props {
  features: AuthFeatures;
}

const callbackUrl = (locale: Locale) =>
  `${window.location.origin}/auth/callback?next=${encodeURIComponent(getPathname({ locale, href: "/compte" }))}`;

function ProviderButtons({ features, onError }: { features: AuthFeatures; onError: (code: AuthErrorCode) => void }) {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const providers: OAuthProvider[] = (["google", "apple"] as const).filter((p) => features[p]);
  if (providers.length === 0) return null;
  const go = async (provider: OAuthProvider) => {
    const result = await authGateway.signInWithProvider(provider, callbackUrl(locale));
    if (!result.ok) onError(result.code);
  };
  return (
    <div className="grid gap-2.5">
      {providers.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="ghost"
          onClick={() => go(provider)}
          data-track={`auth.${provider}`}
        >
          {provider === "google" ? <GoogleMark /> : <AppleMark />}
          {t(`with.${provider}`)}
        </Button>
      ))}
      {features.email && (
        <p className="my-1 flex items-center gap-3 text-xs text-muted before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
          {t("or")}
        </p>
      )}
    </div>
  );
}

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"
    />
    <path
      fill="currentColor"
      d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
      opacity=".8"
    />
    <path fill="currentColor" d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.5Z" opacity=".6" />
    <path
      fill="currentColor"
      d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"
      opacity=".7"
    />
  </svg>
);
const AppleMark = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16.4 12.6c0-2.4 2-3.5 2-3.6a4.3 4.3 0 0 0-3.3-1.8c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8A4.5 4.5 0 0 0 5 9.5c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .8 2-1.1 2.8-2.3c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.8-1-2.8-3.6ZM14.2 5.7c.6-.8 1.1-1.9 1-3a4.2 4.2 0 0 0-2.8 1.5c-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z"
    />
  </svg>
);

/** Connexion : e-mail + mot de passe, Google et Apple selon les feature flags. */
export function LoginForm({ features }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const result = await authGateway.signIn(String(form.get("email")), String(form.get("password")));
    setPending(false);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    await sessionActions.refresh();
    startNavigation();
    router.push("/compte");
    router.refresh();
  };

  return (
    <div className="grid gap-5">
      <ProviderButtons features={features} onError={setError} />
      {features.email && (
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <Label>
            {t("email")}
            <Input name="email" type="email" autoComplete="email" required />
          </Label>
          <Label>
            {t("password")}
            <Input name="password" type="password" autoComplete="current-password" required minLength={8} />
          </Label>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {t(`errors.${error}`)}
            </p>
          )}
          <Button type="submit" disabled={pending} data-track="auth.login">
            {pending ? t("pending") : t("login")}
          </Button>
        </form>
      )}
      <p className="text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href="/inscription" className="font-semibold text-ink underline underline-offset-[3px]">
          {t("signupLink")}
        </Link>
      </p>
    </div>
  );
}

/** Inscription : prénom, nom, e-mail, mot de passe. Confirmation par e-mail (réglage Supabase par défaut). */
export function SignupForm({ features }: Props) {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const result = await authGateway.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      firstName: String(form.get("firstName")).trim(),
      lastName: String(form.get("lastName")).trim(),
      redirectTo: callbackUrl(locale),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.code);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="rounded-[18px] border border-success/30 bg-success/10 p-5 text-success">
        <b className="block">{t("checkEmailTitle")}</b>
        <span className="mt-1 block text-sm text-ink-2">{t("checkEmail")}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <ProviderButtons features={features} onError={setError} />
      {features.email && (
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label>
              {t("firstName")}
              <Input name="firstName" autoComplete="given-name" required />
            </Label>
            <Label>
              {t("lastName")}
              <Input name="lastName" autoComplete="family-name" required />
            </Label>
          </div>
          <Label>
            {t("email")}
            <Input name="email" type="email" autoComplete="email" required />
          </Label>
          <Label>
            {t("password")}
            <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
            <span className="text-xs font-normal text-muted">{t("passwordHint")}</span>
          </Label>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {t(`errors.${error}`)}
            </p>
          )}
          <Button type="submit" disabled={pending} data-track="auth.signup">
            {pending ? t("pending") : t("signup")}
          </Button>
        </form>
      )}
      <p className={cn("text-sm text-muted")}>
        {t("hasAccount")}{" "}
        <Link href="/connexion" className="font-semibold text-ink underline underline-offset-[3px]">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
