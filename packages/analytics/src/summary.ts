import type { AnalyticsEvent } from "./events";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DailyPoint {
  /** AAAA-MM-JJ (UTC). */
  day: string;
  pageViews: number;
  sessions: number;
  orders: number;
}

export interface AnalyticsSummary {
  range: { from: string; to: string };
  events: number;
  sessions: number;
  pageViews: Record<string, number>;
  productViews: Record<string, number>;
  addToCart: Record<string, number>;
  clicks: Record<string, number>;
  locales: Record<string, number>;
  searches: { total: number; noResult: Record<string, number> };
  /** Nombre d'événements par étape (une session peut en produire plusieurs). */
  funnel: { productViews: number; addToCart: number; checkoutStarted: number; ordersPlaced: number };
  /** Sessions distinctes ayant atteint chaque étape : c'est la base des taux (toujours ≤ sessions). */
  reached: { productViews: number; addToCart: number; checkoutStarted: number; ordersPlaced: number };
  /** Frictions : ce qui bloque un achat. */
  frictions: {
    checkoutErrors: Record<string, number>;
    searchesWithoutResult: number;
    /** Pages en erreur (hors 404), par chemin. */
    pageErrors: Record<string, number>;
    pageErrorCount: number;
  };
  revenue: number;
  daily: DailyPoint[];
}

const bump = (map: Record<string, number>, key: string, by = 1) => {
  map[key] = (map[key] ?? 0) + by;
};

const dayOf = (iso: string) => iso.slice(0, 10);

const daysBetween = (range: DateRange): string[] => {
  const days: string[] = [];
  const cursor = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), range.from.getUTCDate()));
  while (cursor.getTime() <= range.to.getTime()) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

/** Agrège une liste d'événements en synthèse exploitable par un dashboard. Pure. */
export function summarize(events: AnalyticsEvent[], range?: DateRange): AnalyticsSummary {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));
  const effective: DateRange = range ?? {
    from: new Date(sorted[0]?.at ?? Date.now()),
    to: new Date(sorted.at(-1)?.at ?? Date.now()),
  };
  const s: AnalyticsSummary = {
    range: { from: effective.from.toISOString(), to: effective.to.toISOString() },
    events: events.length,
    sessions: new Set(events.map((e) => e.session)).size,
    pageViews: {},
    productViews: {},
    addToCart: {},
    clicks: {},
    locales: {},
    searches: { total: 0, noResult: {} },
    funnel: { productViews: 0, addToCart: 0, checkoutStarted: 0, ordersPlaced: 0 },
    reached: { productViews: 0, addToCart: 0, checkoutStarted: 0, ordersPlaced: 0 },
    frictions: { checkoutErrors: {}, searchesWithoutResult: 0, pageErrors: {}, pageErrorCount: 0 },
    revenue: 0,
    daily: [],
  };
  const perDay = new Map<string, { pageViews: number; sessions: Set<string>; orders: number }>();
  for (const day of daysBetween(effective)) perDay.set(day, { pageViews: 0, sessions: new Set(), orders: 0 });
  const sessionLocale = new Map<string, string>();
  const reached = {
    productViews: new Set<string>(),
    addToCart: new Set<string>(),
    checkoutStarted: new Set<string>(),
    ordersPlaced: new Set<string>(),
  };

  for (const e of events) {
    const day = perDay.get(dayOf(e.at));
    day?.sessions.add(e.session);
    if (!sessionLocale.has(e.session)) sessionLocale.set(e.session, e.locale);
    switch (e.name) {
      case "page_view":
        bump(s.pageViews, e.path);
        if (day) day.pageViews += 1;
        break;
      case "click":
        bump(s.clicks, String(e.props.target ?? "?"));
        break;
      case "product_view":
        bump(s.productViews, String(e.props.productId));
        s.funnel.productViews += 1;
        reached.productViews.add(e.session);
        break;
      case "product_chosen":
        bump(s.addToCart, String(e.props.productId));
        s.funnel.addToCart += 1;
        reached.addToCart.add(e.session);
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
        reached.checkoutStarted.add(e.session);
        break;
      case "checkout_failed":
        bump(s.frictions.checkoutErrors, String(e.props.code));
        break;
      case "page_error":
        bump(s.frictions.pageErrors, e.path);
        s.frictions.pageErrorCount += 1;
        break;
      case "order_placed":
        s.funnel.ordersPlaced += 1;
        reached.ordersPlaced.add(e.session);
        s.revenue += Number(e.props.total) || 0;
        if (day) day.orders += 1;
        break;
      default:
        break;
    }
  }
  for (const locale of sessionLocale.values()) bump(s.locales, locale);
  s.reached = {
    productViews: reached.productViews.size,
    addToCart: reached.addToCart.size,
    checkoutStarted: reached.checkoutStarted.size,
    ordersPlaced: reached.ordersPlaced.size,
  };
  s.daily = [...perDay].map(([day, d]) => ({
    day,
    pageViews: d.pageViews,
    sessions: d.sessions.size,
    orders: d.orders,
  }));
  return s;
}

/** Les N premières entrées d'un compteur, triées par valeur décroissante. */
export const top = (map: Record<string, number>, n = 8): Array<[string, number]> =>
  Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
