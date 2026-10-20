import type { BannerSource } from "../domain/banner";

/** Bannières du bandeau au-dessus du header. À terme : éditées depuis l'espace d'administration. */
export const BANNERS: BannerSource[] = [
  {
    id: "collection",
    order: 1,
    active: true,
    message: { fr: "Nouvelle collection disponible", en: "New collection available" },
    href: "/#drop",
  },
  {
    id: "shipping",
    order: 2,
    active: true,
    message: { fr: "Livraison offerte dès 80 €", en: "Free shipping from €80" },
    href: "/livraison",
  },
  { id: "france", order: 3, active: true, message: { fr: "Expédié depuis la France", en: "Shipped from France" } },
  {
    id: "returns",
    order: 4,
    active: true,
    message: { fr: "Retours gratuits 30 jours", en: "Free 30-day returns" },
    href: "/livraison",
  },
  { id: "cotton", order: 5, active: true, message: { fr: "Coton organique certifié", en: "Certified organic cotton" } },
  {
    id: "example-scheduled",
    order: 0,
    active: false,
    startsAt: "2026-11-20T00:00:00+01:00",
    endsAt: "2026-12-01T00:00:00+01:00",
    message: { fr: "Black Friday : -20 % sur tout le site", en: "Black Friday: 20% off everything" },
  },
];
