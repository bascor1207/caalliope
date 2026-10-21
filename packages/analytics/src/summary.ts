import type { AnalyticsEvent, EventItem } from "./events";

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

/** Vues, ajouts et commandes d'un produit dans un coloris : la base des décisions de drop et de réassort. */
export interface ColorStats {
  productId: string;
  colorKey: string;
  views: number;
  addToCart: number;
  orders: number;
  units: number;
}

/** Visites, commandes et chiffre d'affaires attribués à une source (utm_source ou referrer). */
export interface SourceStats {
  sessions: number;
  orders: number;
  revenue: number;
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
  /** Par produit et coloris (clé `productId|colorKey`). */
  colors: Record<string, ColorStats>;
  /** Tailles choisies puis ajoutées au panier, par produit (clé `productId|size`). */
  sizes: Record<string, { selected: number; addToCart: number }>;
  /** Clics sur une taille ou un coloris épuisé (clé `productId|colorKey|size`) : la demande non servie. */
  soldOutClicks: Record<string, number>;
  /** Panier : ouvertures, retraits, et retraits par produit. */
  cart: { views: number; removals: number; removalsByProduct: Record<string, number> };
  /** Commandes : panier moyen, articles par commande, part des commandes à plusieurs articles. */
  baskets: { orders: number; averageBasket: number; itemsPerOrder: number; multiItemShare: number; discount: number };
  /** Provenance des visites et des ventes (utm_source, à défaut domaine du referrer, sinon « direct »). */
  sources: Record<string, SourceStats>;
  campaigns: Record<string, SourceStats>;
  /** Codes promo utilisés : commandes, chiffre d'affaires et remise accordée. */
  promos: Record<string, { orders: number; revenue: number; discount: number }>;
  /** Inscriptions newsletter par origine (pied de page, modale, « préviens-moi »…). */
  newsletterSignups: Record<string, number>;
}

const bump = (map: Record<string, number>, key: string, by = 1) => {
  map[key] = (map[key] ?? 0) + by;
};

const dayOf = (iso: string) => iso.slice(0, 10);
const str = (v: unknown, fallback = "?") => (v === undefined || v === null || v === "" ? fallback : String(v));
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

const daysBetween = (range: DateRange): string[] => {
  const days: string[] = [];
  const cursor = new Date(Date.UTC(range.from.getUTCFullYear(), range.from.getUTCMonth(), range.from.getUTCDate()));
  while (cursor.getTime() <= range.to.getTime()) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

const colorStat = (map: Record<string, ColorStats>, productId: string, colorKey: string): ColorStats => {
  const key = `${productId}|${colorKey}`;
  map[key] ??= { productId, colorKey, views: 0, addToCart: 0, orders: 0, units: 0 };
  return map[key];
};

const sourceStat = (map: Record<string, SourceStats>, key: string): SourceStats => {
  map[key] ??= { sessions: 0, orders: 0, revenue: 0 };
  return map[key];
};

/** Source d'une session : utm_source, sinon le domaine du referrer, sinon « direct ». */
export const sourceOf = (props: Record<string, unknown>): string => {
  const utm = str(props.source ?? props.utm_source, "");
  if (utm) return utm.toLowerCase();
  const referrer = str(props.referrer, "");
  if (!referrer) return "direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 40);
  }
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
    colors: {},
    sizes: {},
    soldOutClicks: {},
    cart: { views: 0, removals: 0, removalsByProduct: {} },
    baskets: { orders: 0, averageBasket: 0, itemsPerOrder: 0, multiItemShare: 0, discount: 0 },
    sources: {},
    campaigns: {},
    promos: {},
    newsletterSignups: {},
  };
  const perDay = new Map<string, { pageViews: number; sessions: Set<string>; orders: number }>();
  for (const day of daysBetween(effective)) perDay.set(day, { pageViews: 0, sessions: new Set(), orders: 0 });
  const sessionLocale = new Map<string, string>();
  const sessionSource = new Map<string, { source: string; campaign: string }>();
  const reached = {
    productViews: new Set<string>(),
    addToCart: new Set<string>(),
    checkoutStarted: new Set<string>(),
    ordersPlaced: new Set<string>(),
  };
  let orderItems = 0;
  let multiItemOrders = 0;

  /* 1. La provenance de chaque session : premier événement qui la porte (session_start, ou n'importe lequel). */
  for (const e of sorted) {
    if (sessionSource.has(e.session)) continue;
    if (e.name === "session_start" || e.props.source !== undefined || e.props.referrer !== undefined) {
      sessionSource.set(e.session, {
        source: sourceOf(e.props),
        campaign: str(e.props.campaign ?? e.props.utm_campaign, ""),
      });
    }
  }
  const attribution = (session: string) => sessionSource.get(session) ?? { source: "direct", campaign: "" };

  for (const e of sorted) {
    const day = perDay.get(dayOf(e.at));
    day?.sessions.add(e.session);
    if (!sessionLocale.has(e.session)) sessionLocale.set(e.session, e.locale);
    switch (e.name) {
      case "page_view":
        bump(s.pageViews, e.path);
        if (day) day.pageViews += 1;
        break;
      case "click":
        bump(s.clicks, str(e.props.target));
        break;
      case "product_view": {
        const productId = str(e.props.productId);
        bump(s.productViews, productId);
        s.funnel.productViews += 1;
        reached.productViews.add(e.session);
        if (e.props.colorKey) colorStat(s.colors, productId, str(e.props.colorKey)).views += 1;
        break;
      }
      case "size_selected": {
        const key = `${str(e.props.productId)}|${str(e.props.size)}`;
        s.sizes[key] ??= { selected: 0, addToCart: 0 };
        s.sizes[key].selected += 1;
        break;
      }
      case "soldout_click":
        bump(s.soldOutClicks, `${str(e.props.productId)}|${str(e.props.colorKey)}|${str(e.props.size)}`);
        break;
      case "product_chosen":
      case "add_to_cart": {
        const productId = str(e.props.productId);
        bump(s.addToCart, productId);
        s.funnel.addToCart += 1;
        reached.addToCart.add(e.session);
        if (e.props.colorKey) colorStat(s.colors, productId, str(e.props.colorKey)).addToCart += 1;
        if (e.props.size) {
          const key = `${productId}|${str(e.props.size)}`;
          s.sizes[key] ??= { selected: 0, addToCart: 0 };
          s.sizes[key].addToCart += 1;
        }
        break;
      }
      case "remove_from_cart":
        s.cart.removals += 1;
        bump(s.cart.removalsByProduct, str(e.props.productId));
        break;
      case "cart_opened":
      case "cart_view":
        s.cart.views += 1;
        break;
      case "search":
        s.searches.total += 1;
        if (Number(e.props.results) === 0) {
          bump(s.searches.noResult, str(e.props.query));
          s.frictions.searchesWithoutResult += 1;
        }
        break;
      case "checkout_started":
        s.funnel.checkoutStarted += 1;
        reached.checkoutStarted.add(e.session);
        break;
      case "checkout_failed":
        bump(s.frictions.checkoutErrors, str(e.props.code));
        break;
      case "page_error":
        bump(s.frictions.pageErrors, e.path);
        s.frictions.pageErrorCount += 1;
        break;
      case "order_placed": {
        const total = num(e.props.total);
        s.funnel.ordersPlaced += 1;
        reached.ordersPlaced.add(e.session);
        s.revenue += total;
        s.baskets.orders += 1;
        s.baskets.discount += num(e.props.discount);
        if (day) day.orders += 1;
        const items = Array.isArray(e.props.items) ? (e.props.items as EventItem[]) : [];
        const units = items.reduce((n, i) => n + (num(i.qty) || 1), 0);
        orderItems += units;
        if (items.length > 1 || units > 1) multiItemOrders += 1;
        for (const item of items) {
          const stat = colorStat(s.colors, str(item.productId), str(item.colorKey));
          stat.orders += 1;
          stat.units += num(item.qty) || 1;
        }
        const promo = str(e.props.promoCode, "");
        if (promo) {
          s.promos[promo] ??= { orders: 0, revenue: 0, discount: 0 };
          s.promos[promo].orders += 1;
          s.promos[promo].revenue += total;
          s.promos[promo].discount += num(e.props.discount);
        }
        const a = attribution(e.session);
        const src = sourceStat(s.sources, a.source);
        src.orders += 1;
        src.revenue += total;
        if (a.campaign) {
          const c = sourceStat(s.campaigns, a.campaign);
          c.orders += 1;
          c.revenue += total;
        }
        break;
      }
      case "newsletter_subscribed":
      case "newsletter_signup":
        bump(s.newsletterSignups, str(e.props.source, "footer"));
        break;
      default:
        break;
    }
  }
  for (const locale of sessionLocale.values()) bump(s.locales, locale);
  for (const session of new Set(events.map((e) => e.session))) {
    const a = attribution(session);
    sourceStat(s.sources, a.source).sessions += 1;
    if (a.campaign) sourceStat(s.campaigns, a.campaign).sessions += 1;
  }
  s.reached = {
    productViews: reached.productViews.size,
    addToCart: reached.addToCart.size,
    checkoutStarted: reached.checkoutStarted.size,
    ordersPlaced: reached.ordersPlaced.size,
  };
  if (s.baskets.orders > 0) {
    s.baskets.averageBasket = Math.round((s.revenue / s.baskets.orders) * 100) / 100;
    s.baskets.itemsPerOrder = Math.round((orderItems / s.baskets.orders) * 100) / 100;
    s.baskets.multiItemShare = Math.round((multiItemOrders / s.baskets.orders) * 1000) / 1000;
  }
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
