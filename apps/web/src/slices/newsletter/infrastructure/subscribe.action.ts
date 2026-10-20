"use server";

import { isLocale } from "@/shared/kernel/locale";
import { type SubscribeResult, subscribe } from "../application/subscribe";
import { subscribersRepository } from "./container";

export type SubscribeFormState = (SubscribeResult | { ok: false; code: "server" }) & { email: string };

export async function subscribeAction(
  _prev: SubscribeFormState | null,
  formData: FormData,
): Promise<SubscribeFormState> {
  const email = String(formData.get("email") ?? "");
  const locale = String(formData.get("locale") ?? "fr");
  try {
    const result = await subscribe(email, isLocale(locale) ? locale : "fr", subscribersRepository);
    return { ...result, email };
  } catch (e) {
    console.error("[newsletter] subscribe", e);
    return { ok: false, code: "server", email };
  }
}
