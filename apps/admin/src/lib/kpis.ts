import type { AnalyticsSummary } from "@koda/analytics";

export interface Kpi {
  key: string;
  label: string;
  value: string;
  /** Lecture en une phrase : ce que le chiffre veut dire, sans jargon. */
  hint: string;
}

const pct = (num: number, den: number) => (den > 0 ? `${((num / den) * 100).toFixed(1).replace(".", ",")} %` : "–");
const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const int = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const plural = (n: number, one: string, many: string) => (n > 1 ? many : one);

/**
 * Les indicateurs de tête du dashboard, dérivés de la synthèse. Pur.
 * Une « visite » = une session (un passage sur le site). Tous les taux sont des parts de visites,
 * calculés sur les sessions distinctes (`reached`), jamais sur le nombre d'événements : ils ne dépassent pas 100 %.
 */
export function kpisOf(s: AnalyticsSummary): Kpi[] {
  const pageViews = Object.values(s.pageViews).reduce((a, b) => a + b, 0);
  const clicks = Object.values(s.clicks).reduce((a, b) => a + b, 0);
  const r = s.reached;
  return [
    {
      key: "sessions",
      label: "Visites",
      value: int(s.sessions),
      hint: `${plural(s.sessions, "passage", "passages")} sur la boutique sur la période`,
    },
    {
      key: "pageViews",
      label: "Pages vues",
      value: int(pageViews),
      hint: s.sessions ? `${(pageViews / s.sessions).toFixed(1).replace(".", ",")} pages par visite en moyenne` : "–",
    },
    {
      key: "productViews",
      label: "Fiches produit ouvertes",
      value: int(s.funnel.productViews),
      hint: `${pct(r.productViews, s.sessions)} des visites ouvrent au moins une fiche`,
    },
    {
      key: "addToCart",
      label: "Ajouts au panier",
      value: int(s.funnel.addToCart),
      hint: `${pct(r.addToCart, r.productViews)} des visites avec fiche vue ajoutent un article`,
    },
    {
      key: "orders",
      label: "Commandes",
      value: int(s.funnel.ordersPlaced),
      hint: `${pct(r.ordersPlaced, r.checkoutStarted)} des paiements démarrés sont allés au bout`,
    },
    {
      key: "conversion",
      label: "Taux de conversion",
      value: pct(r.ordersPlaced, s.sessions),
      hint: "part des visites qui finissent par une commande",
    },
    {
      key: "revenue",
      label: "Chiffre d'affaires",
      value: eur(s.revenue),
      hint: s.funnel.ordersPlaced
        ? `panier moyen ${eur(s.revenue / s.funnel.ordersPlaced)}`
        : "aucune commande sur la période",
    },
    {
      key: "clicks",
      label: "Clics mesurés",
      value: int(clicks),
      hint: `${int(s.frictions.searchesWithoutResult)} ${plural(s.frictions.searchesWithoutResult, "recherche", "recherches")} sans résultat`,
    },
  ];
}
