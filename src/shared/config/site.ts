export const SITE = {
  name: "KODA Clothing",
  shortName: "KODA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kodaclothing.fr",
  email: "hello@kodaclothing.fr",
  instagram: "https://www.instagram.com/kodaclothingcompany/",
  instagramHandle: "@kodaclothingcompany",
  facebook: "https://www.facebook.com/kodaclothing/",
  tiktok: "https://www.tiktok.com/@kodaclothing",
  /** Clôture des précommandes du drop (placeholder). */
  dropEnd: "2026-11-01T20:00:00+01:00",
  dropName: "Drop 01",
} as const;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();
