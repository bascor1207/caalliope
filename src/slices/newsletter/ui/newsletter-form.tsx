"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { eventBus } from "@/shared/event-bus";
import { Button } from "@/shared/ui";
import { subscribeAction } from "../infrastructure/subscribe.action";

/** Formulaire progressif (fonctionne sans JS). Après succès, publie `newsletter.subscribed` sur le bus. */
export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [state, action, pending] = useActionState(subscribeAction, null);

  useEffect(() => {
    if (state?.ok && state.email) eventBus.publish("newsletter.subscribed", { email: state.email });
  }, [state]);

  if (state?.ok) {
    return (
      <p role="status" className="font-display text-xl font-bold">
        {t("welcome", { name: state.name })}
      </p>
    );
  }

  return (
    <>
      <form
        action={action}
        className="mx-auto flex max-w-[520px] gap-2 rounded-[20px] bg-white/70 p-1.5 backdrop-blur-[8px] sm:rounded-full"
      >
        <input type="hidden" name="locale" value={locale} />
        <label className="sr-only" htmlFor="newsletter-email">
          {t("emailLabel")}
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder={t("placeholder")}
          autoComplete="email"
          required
          className="min-w-0 flex-1 bg-transparent px-[18px] py-3 outline-none"
        />
        <Button type="submit" disabled={pending}>
          {pending ? t("pending") : t("cta")}
        </Button>
      </form>
      <small
        role="status"
        className={state && !state.ok ? "mt-3.5 block text-xs text-danger" : "mt-3.5 block text-xs text-ink-2"}
      >
        {state && !state.ok ? t("invalid") : t("hint")}
      </small>
    </>
  );
}
