import type { AnalyticsSummary } from "@koda/analytics";

export interface Kpi {
  key: string;
  label: string;
  value: string;
  hint?: string;
}

const pct = (num: number, den: number) => (den > 0 ? `${((num / den) * 100).toFixed(1).replace(".", ",")} %` : "–");
const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const int = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/** Les indicateurs de tête du dashboard, dérivés de la synthèse. Pur. */
export function kpisOf(s: AnalyticsSummary): Kpi[] {
  const pageViews = Object.values(s.pageViews).reduce((a, b) => a + b, 0);
  const clicks = Object.values(s.clicks).reduce((a, b) => a + b, 0);
  return [
    { key: "sessions", label: "Sessions", value: int(s.sessions) },
    {
      key: "pageViews",
      label: "Pages vues",
      value: int(pageViews),
      hint: s.sessions ? `${(pageViews / s.sessions).toFixed(1).replace(".", ",")} / session` : undefined,
    },
    {
      key: "productViews",
      label: "Fiches produit vues",
      value: int(s.funnel.productViews),
      hint: pct(s.funnel.productViews, s.sessions) + " des sessions",
    },
    {
      key: "addToCart",
      label: "Ajouts panier",
      value: int(s.funnel.addToCart),
      hint: pct(s.funnel.addToCart, s.funnel.productViews) + " des fiches vues",
    },
    {
      key: "orders",
      label: "Commandes",
      value: int(s.funnel.ordersPlaced),
      hint: pct(s.funnel.ordersPlaced, s.funnel.checkoutStarted) + " des checkouts",
    },
    {
      key: "conversion",
      label: "Conversion",
      value: pct(s.funnel.ordersPlaced, s.sessions),
      hint: "commandes / sessions",
    },
    {
      key: "revenue",
      label: "Chiffre d'affaires",
      value: eur(s.revenue),
      hint: s.funnel.ordersPlaced ? `panier moyen ${eur(s.revenue / s.funnel.ordersPlaced)}` : undefined,
    },
    {
      key: "clicks",
      label: "Clics mesurés",
      value: int(clicks),
      hint: `${int(s.frictions.searchesWithoutResult)} recherches sans résultat`,
    },
  ];
}
