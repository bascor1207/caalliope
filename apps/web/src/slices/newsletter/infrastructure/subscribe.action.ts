"use server";

import { isLocale } from "@/shared/kernel/locale";
import { type SubscribeResult, type SubscribersRepository, subscribe } from "../application/subscribe";

/** Inscrits en mémoire (POC). À brancher sur Brevo / Klaviyo / Resend ensuite. */
const subscribers = new Map<string, string>();
const repo: SubscribersRepository = { add: async (email, locale) => void subscribers.set(email, locale) };

export type SubscribeFormState = SubscribeResult & { email: string };

export async function subscribeAction(
  _prev: SubscribeFormState | null,
  formData: FormData,
): Promise<SubscribeFormState> {
  const email = String(formData.get("email") ?? "");
  const locale = String(formData.get("locale") ?? "fr");
  const result = await subscribe(email, isLocale(locale) ? locale : "fr", repo);
  return { ...result, email };
}
