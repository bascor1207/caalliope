/**
 * Domaine analytics : événements de mesure et leur synthèse. Pur.
 * Les événements sont des faits d'usage (page vue, produit vu, ajout panier, friction...).
 */
export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "product_chosen"
  | "cart_opened"
  | "search"
  | "checkout_started"
  | "checkout_failed"
  | "order_placed"
  | "newsletter_subscribed";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  /** Horodatage ISO côté client. */
  at: string;
  /** Identifiant de session anonyme (pas de cookie tiers, pas de donnée personnelle). */
  session: string;
  path: string;
  locale: string;
  props: Record<string, string | number | boolean>;
}

export interface AnalyticsSummary {
  events: number;
  sessions: number;
  pageViews: Record<string, number>;
  productViews: Record<string, number>;
  addToCart: Record<string, number>;
  searches: { total: number; noResult: Record<string, number> };
  funnel: { productViews: number; addToCart: number; checkoutStarted: number; ordersPlaced: number };
  /** Frictions : ce qui bloque un achat. */
  frictions: { checkoutErrors: Record<string, number>; searchesWithoutResult: number };
}

const bump = (map: Record<string, number>, key: string) => {
  map[key] = (map[key] ?? 0) + 1;
};

/** Agrège une liste d'événements en synthèse exploitable par un dashboard. */
export function summarize(events: AnalyticsEvent[]): AnalyticsSummary {
  const s: AnalyticsSummary = {
    events: events.length,
    sessions: new Set(events.map((e) => e.session)).size,
    pageViews: {},
    productViews: {},
    addToCart: {},
    searches: { total: 0, noResult: {} },
    funnel: { productViews: 0, addToCart: 0, checkoutStarted: 0, ordersPlaced: 0 },
    frictions: { checkoutErrors: {}, searchesWithoutResult: 0 },
  };
  for (const e of events) {
    switch (e.name) {
      case "page_view":
        bump(s.pageViews, e.path);
        break;
      case "product_view":
        bump(s.productViews, String(e.props.productId));
        s.funnel.productViews += 1;
        break;
      case "product_chosen":
        bump(s.addToCart, String(e.props.productId));
        s.funnel.addToCart += 1;
        break;
      case "search":
        s.searches.total += 1;
        if (Number(e.props.results) === 0) {
          bump(s.searches.noResult, String(e.props.query));
          s.frictions.searchesWithoutResult += 1;
        }
        break;
      case "checkout_started":
        s.funnel.checkoutStarted += 1;
        break;
      case "checkout_failed":
        bump(s.frictions.checkoutErrors, String(e.props.code));
        break;
      case "order_placed":
        s.funnel.ordersPlaced += 1;
        break;
      default:
        break;
    }
  }
  return s;
}

const SESSION_KEY = "koda.session";

/** Identifiant de session anonyme, stocké en sessionStorage (vie de l'onglet). */
export function sessionIdFrom(storage: Pick<Storage, "getItem" | "setItem"> | null, random: () => string): string {
  const existing = storage?.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = random();
  storage?.setItem(SESSION_KEY, id);
  return id;
}
