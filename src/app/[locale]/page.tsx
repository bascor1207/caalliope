import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import type { Locale } from "@/shared/kernel/locale";
import { breadcrumbJsonLd, pathFor } from "@/shared/seo/metadata";
import { JsonLd } from "@/shared/ui";
import { catalogRepository, itemListJsonLd, listProducts } from "@/slices/catalog/public-server";
import { CatalogHydrator, DropGrid, FloatingCards } from "@/slices/catalog/public-ui";
import { faqJsonLd } from "@/slices/home/public-server";
import {
  BrandVideoSection,
  Community,
  Faq,
  Hero,
  NewsletterSection,
  Specs,
  Story,
  ValuesMarquee,
} from "@/slices/home/public-ui";
import { NewsletterForm } from "@/slices/newsletter/public-ui";

interface Props {
  params: Promise<{ locale: Locale }>;
}

/** Page d'accueil : composition root. Elle seule connaît toutes les slices. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const products = await listProducts(catalogRepository, locale);
  const byId = (id: string) => products.find((p) => p.id === id) ?? products[0];
  const featured = [
    { product: byId("pull-a-capuche-koda"), colorKey: "bleu-ciel" },
    { product: byId("pull-a-capuche-koda"), colorKey: "rose" },
    { product: byId("t-shirt-koda"), colorKey: "vert-pastel" },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tc("labels.home"), url: pathFor(locale, "/") },
          { name: tc("labels.drop"), url: `${pathFor(locale, "/")}#drop` },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          products.map((p) => ({
            product: p,
            url: pathFor(locale, "/produits/[slug]", { slug: p.slug }),
            ogImage: `${pathFor(locale, "/produits/[slug]", { slug: p.slug })}/opengraph-image`,
          })),
        )}
      />
      <JsonLd data={faqJsonLd(locale)} />
      <CatalogHydrator locale={locale} products={products} />
      <Hero visual={<FloatingCards cards={featured} />} />
      <ValuesMarquee />
      <Suspense fallback={<section id="drop" className="min-h-[60vh]" />}>
        <DropGrid />
      </Suspense>
      <Story />
      <BrandVideoSection />
      <Specs />
      <Community />
      <Faq locale={locale} />
      <NewsletterSection>
        <NewsletterForm />
      </NewsletterSection>
    </>
  );
}
