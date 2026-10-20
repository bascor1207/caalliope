/**
 * Libellés lisibles pour les identifiants techniques remontés par la boutique
 * (attributs `data-track`, identifiants produit, chemins). L'admin n'affiche jamais une clé brute.
 */
const TRACK: Record<string, string> = {
  "hero.cta": "Accueil · bouton principal",
  "hero.story": "Accueil · « notre histoire »",
  "hero.card": "Accueil · carte produit du hero",
  "card.open": "Collection · ouverture d'une fiche",
  "card.see": "Collection · bouton « voir »",
  "pdp.size-guide": "Fiche produit · guide des tailles",
  "added.continue": "Modale panier · continuer mes achats",
  "added.view-cart": "Modale panier · voir le panier",
  "reco.product": "Modale panier · pièce complémentaire",
  "zone.action": "Bloc zone · action",
  "community.follow": "Instagram · suivre",
  "header.account": "En-tête · mon compte",
  "auth.login": "Connexion",
  "auth.signup": "Création de compte",
  "auth.logout": "Déconnexion",
};

const PRODUCTS: Record<string, string> = {
  "pull-a-capuche-koda": "Pull à capuche Koda",
  "pull-oversized": "Pull oversized",
  "t-shirt-koda": "T-shirt Koda",
  "sweat-koda": "Sweat Koda",
};

const ERRORS: Record<string, string> = {
  "invalid-email": "E-mail invalide",
  "invalid-zip": "Code postal invalide",
  "invalid-qty": "Quantité invalide",
  "empty-cart": "Panier vide",
  "unavailable-size": "Taille indisponible",
  "unavailable-color": "Coloris indisponible",
  "payment-declined": "Paiement refusé",
  network: "Erreur réseau",
  required: "Champ obligatoire manquant",
};

const LOCALES: Record<string, string> = { fr: "Français", en: "Anglais" };

/** « pull-a-capuche-koda » → « Pull a capuche koda » : lisible même sans entrée dédiée. */
const humanize = (id: string) => {
  const words = id.replace(/[._-]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : id;
};

export const trackLabel = (id: string) => TRACK[id] ?? humanize(id);
export const productLabel = (id: string) => PRODUCTS[id] ?? humanize(id);
export const errorLabel = (code: string) => ERRORS[code] ?? humanize(code);
export const localeLabel = (code: string) => LOCALES[code] ?? code.toUpperCase();

/** Applique un libellé à chaque ligne d'un classement, en fusionnant les doublons éventuels. */
export const labelled = (rows: Array<[string, number]>, label: (id: string) => string): Array<[string, number]> => {
  const out = new Map<string, number>();
  for (const [id, n] of rows) {
    const key = label(id);
    out.set(key, (out.get(key) ?? 0) + n);
  }
  return [...out].sort((a, b) => b[1] - a[1]);
};
