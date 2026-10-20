import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@koda/analytics", "@koda/db"],
  /* Production : SWC retire les console.log / warn / info des bundles (les nôtres et ceux des dépendances). */
  compiler: { removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false },
  images: {
    // Loader global : les photos Shopify sont servies par leur CDN (resize + WebP/AVIF négociés),
    // le reste par l'optimiseur Next. Voir src/shared/ui/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/shared/ui/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default withNextIntl(nextConfig);
