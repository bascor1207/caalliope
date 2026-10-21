/**
 * Contrats des événements d'usage, partagés entre la boutique (émetteur) et l'admin (lecteur).
 * Aucune donnée personnelle : un identifiant de session anonyme, un chemin, une locale, des propriétés primitives.
 * Les anciens noms (`product_chosen`, `cart_opened`, `newsletter_subscribed`) restent acceptés pour l'historique.
 */
export const EVENT_NAMES = [
  "page_view",
  "session_start",
  "click",
  "product_view",
  "size_selected",
  "soldout_click",
  "product_chosen",
  "add_to_cart",
  "remove_from_cart",
  "cart_opened",
  "cart_view",
  "search",
  "checkout_started",
  "checkout_failed",
  "order_placed",
  "newsletter_subscribed",
  "newsletter_signup",
  "page_error",
] as const;

export type AnalyticsEventName = (typeof EVENT_NAMES)[number];

export type Primitive = string | number | boolean;
/** Une ligne d'une commande (`order_placed.items`). */
export type EventItem = Record<string, Primitive>;
export type EventProps = Record<string, Primitive | EventItem[]>;

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
