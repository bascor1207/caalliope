import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@koda/analytics"],
  images: {
    // Loader global : les photos Shopify sont servies par leur CDN (resize + WebP/AVIF négociés),
    // le reste par l'optimiseur Next. Voir src/shared/ui/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/shared/ui/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default withNextIntl(nextConfig);
