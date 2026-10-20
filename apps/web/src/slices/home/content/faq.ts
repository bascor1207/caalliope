import { type Locale, type Localized, localize } from "@/shared/kernel/locale";

interface FaqItem {
  q: Localized;
  a: Localized;
}

/** Source unique de la FAQ : section visible + JSON-LD FAQPage. */
const FAQ: FaqItem[] = [
  {
    q: { fr: "Quand est-ce que je reçois ma commande ?", en: "When do I receive my order?" },
    a: {
      fr: "Expédié depuis la France. Tu reçois un mail avec le suivi dès que ton colis part.",
      en: "Shipped from France. You get a tracking email as soon as your parcel leaves.",
    },
  },
  {
    q: { fr: "Comment choisir ma taille ?", en: "How do I pick my size?" },
    a: {
      fr: "Nos hoodies ont une coupe oversize : prends ta taille habituelle pour un rendu ample, une taille en dessous pour un rendu plus ajusté. Les t-shirts ont une coupe boxy, fidèle à la taille.",
      en: "Our hoodies are oversized: take your usual size for a loose look, one size down for a closer fit. Tees are boxy and true to size.",
    },
  },
  {
    q: { fr: "Les retours sont-ils gratuits ?", en: "Are returns free?" },
    a: {
      fr: "Oui. Tu as 30 jours après réception pour retourner un article non porté, étiquettes attachées. L'étiquette de retour est offerte en France métropolitaine.",
      en: "Yes. You have 30 days after delivery to return an unworn item with tags attached. The return label is free in mainland France.",
    },
  },
  {
    q: { fr: "D'où viennent vos vêtements ?", en: "Where are your clothes made?" },
    a: {
      fr: "Coton organique et polyester recyclé certifiés. Chaque pièce est produite en petite série pour limiter les invendus.",
      en: "Certified organic cotton and recycled polyester. Every piece is made in small batches to limit unsold stock.",
    },
  },
  {
    q: { fr: "Pourquoi des petites séries ?", en: "Why small batches?" },
    a: {
      fr: "Produire en petite série nous permet de garder des prix justes, de limiter les invendus et de concentrer chaque collection sur quelques pièces travaillées à fond.",
      en: "Making small batches keeps prices fair, limits unsold stock and lets each collection focus on a few pieces done properly.",
    },
  },
];

export const faqFor = (locale: Locale) =>
  FAQ.map((item) => ({ q: localize(item.q, locale), a: localize(item.a, locale) }));

export const faqJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqFor(locale).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
