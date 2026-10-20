"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { getPathname } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import type { Locale } from "@/shared/kernel/locale";
import { Button, Input, Label } from "@/shared/ui";
import type { AuthErrorCode } from "../domain/user";
import { authGateway } from "./session-store";

/**
 * Changement d'e-mail du compte. Supabase envoie un lien aux deux adresses : le changement n'est effectif
 * qu'après confirmation, donc pas d'optimisme ici, mais un retour immédiat et clair.
 */
export function EmailChangeForm({ current }: { current: string }) {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<AuthErrorCode | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!email || email === current) return;
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(getPathname({ locale, href: "/compte" }))}`;
    const r = await authGateway.changeEmail(email, redirectTo);
    if (!r.ok) {
      setError(r.code);
      eventBus.publish("ui.notify", { text: t(`errors.${r.code}`), tone: "error" });
      return;
    }
    setSentTo(email);
    setOpen(false);
    eventBus.publish("ui.notify", { text: t("emailChangeSent", { email }), tone: "success" });
  };

  if (sentTo) {
    return (
      <p role="status" className="text-sm text-success">
        {t("emailChangeSent", { email: sentTo })}
      </p>
    );
  }
  if (!open) {
    return (
      <button
        type="button"
        className="text-sm font-semibold underline underline-offset-[3px]"
        onClick={() => setOpen(true)}
      >
        {t("changeEmail")}
      </button>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end" noValidate>
      <Label>
        {t("newEmail")}
        <Input name="email" type="email" autoComplete="email" required defaultValue="" />
        <span className="text-xs font-normal text-muted">{t("changeEmailHint")}</span>
      </Label>
      <div className="flex gap-2">
        <Button type="submit">{t("changeEmailCta")}</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger sm:col-span-2">
          {t(`errors.${error}`)}
        </p>
      )}
    </form>
  );
}
