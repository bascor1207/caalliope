import type { ImageLoaderProps } from "next/image";

const SHOPIFY_CDN = /^https:\/\/cdn\.shopify\.com\//;

/**
 * Loader `next/image` global.
 *
 * Photos Shopify : le CDN redimensionne lui-même (`width`) et sert WebP / AVIF selon
 * l'en-tête Accept du navigateur. Aucune passe par l'optimiseur Vercel : pas de quota
 * consommé, un saut réseau de moins, et un cache CDN déjà chaud.
 *
 * Tout le reste passe par l'optimiseur Next (`/_next/image`), qui encode en AVIF / WebP.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (SHOPIFY_CDN.test(src)) {
    const url = new URL(src);
    // Le CDN n'agrandit jamais au-delà de l'original ; on plafonne pour éviter des URL 3840 inutiles.
    url.searchParams.set("width", String(Math.min(width, 2048)));
    return url.toString();
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
