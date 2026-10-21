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
    /** `quick` = ajout rapide depuis la collection (toast, pas de modale). */
    source?: "pdp" | "quick";
  };
  /** Le catalogue : la sélection courante de la fiche produit (coloris, taille) a changé. */
  "catalog.selection-changed": {
    productId: string;
    slug: string;
    name: string;
    colorKey: string;
    colorName: string;
    size: string | null;
    unitPrice: number;
    imageSrc?: string;
  };
  /** Le catalogue : une fiche produit a été affichée. */
  "catalog.product-viewed": { productId: string; slug: string; colorKey: string };
  /** Le catalogue : une taille a été choisie sur la fiche. */
  "catalog.size-selected": { productId: string; colorKey: string; size: string };
  /** Le catalogue : clic sur une taille épuisée (demande non servie, signal de réassort). */
  "catalog.soldout-clicked": { productId: string; colorKey: string; size: string };
  /** Le catalogue : une recherche a renvoyé des résultats (ou aucun). */
  "catalog.search-performed": { query: string; results: number };
  /** Retour visuel générique (toast) demandé par une slice. */
  "ui.notify": { text: string; tone: "success" | "error" };
  /** Une page a planté côté rendu (error boundary). */
  "app.error-caught": { digest: string; message: string };
  /** Le checkout : le formulaire de commande est affiché. */
  "checkout.started": { count: number; total: number };
  /** Le checkout : une soumission a été refusée (friction). */
  "checkout.failed": { code: string };
  /** Le panier : une ligne a été ajoutée. */
  "cart.line-added": {
    productId: string;
    name: string;
    colorName: string;
    size: string;
    qty: number;
    count: number;
    /** Ajout rapide depuis la collection : à confirmer par un toast plutôt qu'une modale. */
    quick: boolean;
  };
  /** Le panier : une ligne a été retirée (ou sa quantité ramenée à zéro). */
  "cart.line-removed": { productId: string; colorKey: string; size: string; qty: number };
  /** Quelqu'un demande l'ouverture du panier (toast, bouton...). */
  "cart.open-requested": Record<string, never>;
  /** Le panier a été vidé. */
  "cart.cleared": { reason: "order-placed" | "user" };
  /** Le checkout : une commande a été enregistrée. */
  "checkout.order-placed": {
    ref: string;
    total: number;
    subtotal: number;
    shipping: number;
    discount: number;
    promoCode?: string;
    email: string;
    items: Array<{ productId: string; colorKey: string; size: string; qty: number; price: number }>;
    /** Achat express (Apple Pay / Google Pay depuis la fiche) : le panier n'est pas concerné. */
    express?: boolean;
  };
  /** La newsletter : un e-mail a été inscrit. */
  "newsletter.subscribed": { email: string; source: string };
}

export type EventName = keyof IntegrationEvents;
export type EventPayload<N extends EventName> = IntegrationEvents[N];
