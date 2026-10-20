import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { routing } from "@/i18n/routing";
import { SITE } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates, organizationJsonLd, websiteJsonLd } from "@/shared/seo/metadata";
import { JsonLd, NavigationLoader } from "@/shared/ui";
import { AnalyticsProvider } from "@/slices/analytics/public-ui";
import { CartDrawer } from "@/slices/cart/public-ui";
import { catalogRepository, listProducts } from "@/slices/catalog/public-server";
import { bannersRepository, listLiveBanners } from "@/slices/marketing/public-server";
import { MarketingBar } from "@/slices/marketing/public-ui";
import { Toaster } from "@/slices/notifications/public-ui";
import { StoreProvider } from "@/store/store-provider";
import { AddedToCart } from "../_shell/added-to-cart";
import { Footer } from "../_shell/footer";
import { Header } from "../_shell/header";
import "../globals.css";

/*
 * Typo : Bricolage Grotesque pour les titres (grotesque à caractère, un peu bricolée, dans l'esprit du logo
 * dessiné à la main) et Instrument Sans pour le texte (lisible, chaleureux). Pas de serif italique.
 */
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" });

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t("title"), template: t("template") },
    description: t("description"),
    applicationName: SITE.name,
    keywords: t("keywords").split(", "),
    authors: [{ name: SITE.name }, { name: SITE.developer.name }],
    creator: SITE.developer.name,
    alternates: localizedAlternates(locale as Locale, "/"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    twitter: { card: "summary_large_image", title: t("ogTitle"), description: t("ogDescription") },
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const banners = await listLiveBanners(bannersRepository, locale);
  const products = await listProducts(catalogRepository, locale);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Active les animations uniquement si JS tourne : sans JS, tout est visible. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(locale)} />
      </head>
      <body>
        <NextIntlClientProvider>
          <StoreProvider catalog={{ locale, products }}>
            <a className="sr-only focus:not-sr-only" href="#contenu">
              {tc("a11y.skipToContent")}
            </a>
            <MarketingBar banners={banners} label={tc("a11y.announcements")} />
            <Header />
            <main id="contenu">{children}</main>
            <Footer />
            <CartDrawer />
            <AddedToCart />
            <Toaster />
            <AnalyticsProvider />
            {/* useSearchParams impose un Suspense ; le loader rend null côté serveur, rien ne bouge au premier rendu. */}
            <Suspense fallback={null}>
              <NavigationLoader label={tc("a11y.loading")} logo={SITE.media.logo} />
            </Suspense>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
