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
   * Médias de marque, à déposer dans public/media/ (voir public/media/README.md).
   * `null` = la section s'affiche sans vidéo.
   */
  media: {
    storyVideo: { src: "/media/koda-story.mp4", poster: "/media/koda-story.jpg" } as {
      src: string;
      poster?: string;
    } | null,
    heroVideo: null as { src: string; poster?: string } | null,
  },
} as const;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();
