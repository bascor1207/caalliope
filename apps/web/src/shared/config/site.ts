export const SITE = {
  name: "KODA Clothing",
  shortName: "KODA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kodaclothing.fr",
  email: "hello@kodaclothing.fr",
  instagram: "https://www.instagram.com/koda__clothing/",
  instagramHandle: "@koda__clothing",
  facebook: "https://www.facebook.com/kodaclothing/",
  tiktok: "https://www.tiktok.com/@kodaclothing",
  tagline: "More than clothing",
  /** Studio qui a conçu et développé le site (crédit en pied de page + métadonnées). */
  developer: { name: "GOLEM CORP", url: null as string | null },
  collectionName: "Collection",
  /**
   * Médias de marque. Les vidéos sont hébergées sur Cloudflare R2 (bucket public `kodaclothing-media`, dossier `marketing/`, trafic sortant illimité),
   * jamais dans le dépôt ni dans le bundle ; le back-office (Marketing) peut les remplacer. Logo et icône restent
   * dans public/media/ (voir public/media/README.md). `null` = la section s'affiche sans vidéo.
   */
  media: {
    storyVideo: {
      src: "https://pub-af8df0f2ece54610a0bb91f01b8e7fe1.r2.dev/marketing/koda-story.mp4",
      poster: "https://pub-af8df0f2ece54610a0bb91f01b8e7fe1.r2.dev/marketing/koda-story.jpg",
    } as {
      src: string;
      poster?: string;
    } | null,
    heroVideo: {
      src: "https://pub-af8df0f2ece54610a0bb91f01b8e7fe1.r2.dev/marketing/koda-hero.mp4",
      poster: "https://pub-af8df0f2ece54610a0bb91f01b8e7fe1.r2.dev/marketing/koda-hero.jpg",
    } as {
      src: string;
      poster?: string;
    } | null,
    /** Logo rond (photo de profil Instagram) : loader de navigation. Repli sur le logotype s'il manque. */
    logo: { src: "/media/koda-logo.png", size: 96 } as { src: string; size: number } | null,
    /** Déclinaison carrée à fond uni pour favicon et icône iOS (générée depuis le logo). */
    icon: { src: "/media/koda-icon.png" } as { src: string } | null,
  },
} as const;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();
