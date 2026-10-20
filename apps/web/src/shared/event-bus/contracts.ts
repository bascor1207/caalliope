/**
 * Contrat des événements d'intégration entre vertical slices.
 * Seuls des types primitifs : aucune slice n'importe les types d'une autre.
 * Une slice publie ses faits, les autres s'y abonnent sans la connaître.
 */
export interface IntegrationEvents {
  /** Le catalogue : un visiteur a choisi une pièce (coloris + taille). */
  "catalog.product-chosen": {
    productId: string;
    slug: string;
    name: string;
    productType: string;
    colorKey: string;
    colorName: string;
    colorHex: string;
    /** Photo du coloris, si le produit en a une. */
    imageSrc?: string;
    size: string;
    unitPrice: number;
    qty: number;
  };
  /** Le catalogue : une fiche produit a été affichée. */
  "catalog.product-viewed": { productId: string; slug: string; colorKey: string };
  /** Le catalogue : une recherche a renvoyé des résultats (ou aucun). */
  "catalog.search-performed": { query: string; results: number };
  /** Le checkout : le formulaire de commande est affiché. */
  "checkout.started": { count: number; total: number };
  /** Le checkout : une soumission a été refusée (friction). */
  "checkout.failed": { code: string };
  /** Le panier : une ligne a été ajoutée. */
  "cart.line-added": { productId: string; name: string; colorName: string; size: string; qty: number; count: number };
  /** Quelqu'un demande l'ouverture du panier (toast, bouton...). */
  "cart.open-requested": Record<string, never>;
  /** Le panier a été vidé. */
  "cart.cleared": { reason: "order-placed" | "user" };
  /** Le checkout : une commande a été enregistrée. */
  "checkout.order-placed": { ref: string; total: number; email: string };
  /** La newsletter : un e-mail a été inscrit. */
  "newsletter.subscribed": { email: string };
}

export type EventName = keyof IntegrationEvents;
export type EventPayload<N extends EventName> = IntegrationEvents[N];
