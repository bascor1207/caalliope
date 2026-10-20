import type { Locale } from "@/shared/kernel/locale";
import { displayName, isValidEmail, normalizeEmail } from "../domain/subscription";

export interface SubscribersRepository {
  add(email: string, locale: Locale): Promise<void>;
}

export type SubscribeResult = { ok: true; name: string } | { ok: false; code: "invalid-email" };

export async function subscribe(
  rawEmail: string,
  locale: Locale,
  repo: SubscribersRepository,
): Promise<SubscribeResult> {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) return { ok: false, code: "invalid-email" };
  await repo.add(email, locale);
  return { ok: true, name: displayName(email) };
}
