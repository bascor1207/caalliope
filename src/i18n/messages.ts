import type { Locale } from "@/shared/kernel/locale";

/** Un fichier JSON par espace fonctionnel ; `common` porte l'accessibilité, les actions et les labels génériques. */
export const MESSAGE_NAMESPACES = [
  "common",
  "meta",
  "header",
  "footer",
  "home",
  "catalog",
  "cart",
  "checkout",
  "newsletter",
  "pages",
  "notifications",
] as const;

export type MessageNamespace = (typeof MESSAGE_NAMESPACES)[number];

export async function loadMessages(locale: Locale): Promise<Record<MessageNamespace, Record<string, unknown>>> {
  const entries = await Promise.all(
    MESSAGE_NAMESPACES.map(async (ns) => [ns, (await import(`../../messages/${locale}/${ns}.json`)).default] as const),
  );
  return Object.fromEntries(entries) as Record<MessageNamespace, Record<string, unknown>>;
}
