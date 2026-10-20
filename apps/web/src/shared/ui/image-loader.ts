import type { ImageLoaderProps } from "next/image";

const SHOPIFY_CDN = /^https:\/\/cdn\.shopify\.com\//;

/**
 * Loader `next/image` global.
 *
 * Photos Shopify : le CDN redimensionne lui-même (`width`) et sert WebP / AVIF selon
 * l'en-tête Accept du navigateur. Aucune passe par l'optimiseur Vercel : pas de quota
 * consommé, un saut réseau de moins, et un cache CDN déjà chaud.
 *
 * Tout le reste (fichiers de `public/`) est servi tel quel : avec un loader custom, Next désactive
 * son optimiseur `/_next/image`, qui répondrait 404. Les assets locaux sont déjà aux bonnes dimensions.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (SHOPIFY_CDN.test(src)) {
    const url = new URL(src);
    // Le CDN n'agrandit jamais au-delà de l'original ; on plafonne pour éviter des URL 3840 inutiles.
    url.searchParams.set("width", String(Math.min(width, 2048)));
    return url.toString();
  }
  void quality;
  return src;
}
