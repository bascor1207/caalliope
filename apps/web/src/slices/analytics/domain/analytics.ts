/**
 * Domaine analytics côté boutique. Les contrats d'événements et la synthèse vivent dans `@koda/analytics`
 * (partagés avec l'admin) ; ici, seules les règles propres au navigateur.
 */
export {
  type AnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsSummary,
  type EventProps,
  summarize,
} from "@koda/analytics";

const SESSION_KEY = "koda.session";

/** Identifiant de session anonyme, stocké en sessionStorage (vie de l'onglet). */
export function sessionIdFrom(storage: Pick<Storage, "getItem" | "setItem"> | null, random: () => string): string {
  const existing = storage?.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = random();
  storage?.setItem(SESSION_KEY, id);
  return id;
}

/** Cible d'un clic mesuré : l'attribut `data-track` le plus proche de l'élément cliqué. */
export function clickTarget(element: {
  closest(selector: string): { getAttribute(name: string): string | null } | null;
}): string | null {
  const target = element.closest("[data-track]");
  return target?.getAttribute("data-track") || null;
}

export const OPT_OUT_KEY = "koda.analytics";

/** Opposition à la mesure d'audience (stockée localement, jamais envoyée). */
export const isOptedOut = (storage: Pick<Storage, "getItem"> | null): boolean =>
  storage?.getItem(OPT_OUT_KEY) === "off";
