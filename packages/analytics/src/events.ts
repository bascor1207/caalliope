/**
 * Contrats des événements d'usage, partagés entre la boutique (émetteur) et l'admin (lecteur).
 * Aucune donnée personnelle : un identifiant de session anonyme, un chemin, une locale, des propriétés primitives.
 */
export const EVENT_NAMES = [
  "page_view",
  "click",
  "product_view",
  "product_chosen",
  "cart_opened",
  "search",
  "checkout_started",
  "checkout_failed",
  "order_placed",
  "newsletter_subscribed",
  "page_error",
] as const;

export type AnalyticsEventName = (typeof EVENT_NAMES)[number];

export type EventProps = Record<string, string | number | boolean>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  /** Horodatage ISO 8601. */
  at: string;
  /** Identifiant de session anonyme (sessionStorage côté client). */
  session: string;
  path: string;
  locale: string;
  props: EventProps;
}

export const isEventName = (value: unknown): value is AnalyticsEventName =>
  typeof value === "string" && (EVENT_NAMES as readonly string[]).includes(value);
