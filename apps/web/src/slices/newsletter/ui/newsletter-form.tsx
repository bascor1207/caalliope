"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { eventBus } from "@/shared/event-bus";
import { Button } from "@/shared/ui";
import { displayName, isValidEmail, normalizeEmail } from "../domain/subscription";
import { type SubscribeFormState, subscribeAction } from "../infrastructure/subscribe.action";

/**
 * Formulaire progressif (fonctionne sans JS). Rendu optimiste : dès l'envoi d'un e-mail valide, le message
 * de bienvenue s'affiche et le toast part ; si le serveur refuse, on revient au formulaire avec l'erreur.
 */
export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [optimistic, setOptimistic] = useState<string | null>(null);
  const [state, action, pending] = useActionState<SubscribeFormState | null, FormData>(async (prev, formData) => {
    const email = normalizeEmail(String(formData.get("email") ?? ""));
    if (isValidEmail(email)) {
      setOptimistic(displayName(email));
      eventBus.publish("newsletter.subscribed", { email });
    }
    try {
      const result = await subscribeAction(prev, formData);
      if (!result.ok) {
        setOptimistic(null);
        eventBus.publish("ui.notify", { text: t("invalid"), tone: "error" });
      }
      return result;
    } catch {
      setOptimistic(null);
      eventBus.publish("ui.notify", { text: t("failed"), tone: "error" });
      return { ok: false, code: "invalid-email", email };
    }
  }, null);

  const name = state?.ok ? state.name : optimistic;
  if (name) {
    return (
      <p role="status" className="font-display text-xl font-bold">
        {t("welcome", { name })}
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
