import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { breadcrumbJsonLd, pathFor } from "@/shared/seo/metadata";
import { JsonLd } from "@/shared/ui";
import { catalogRepository, itemListJsonLd, listProducts } from "@/slices/catalog/public-server";
import { DropGrid, FloatingCards } from "@/slices/catalog/public-ui";
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
import { getSiteMedia, getSocialLinks, handleOf } from "@/slices/marketing/public-server";
import { NewsletterForm } from "@/slices/newsletter/public-ui";

interface Props {
  params: Promise<{ locale: Locale }>;
}

/** Page d'accueil : composition root. Elle seule connaît toutes les slices. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");
  const [products, media, social] = await Promise.all([
    listProducts(catalogRepository, locale),
    getSiteMedia(),
    getSocialLinks(),
  ]);
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
      <Hero visual={<FloatingCards cards={featured} />} video={media.hero} blobs={media.heroBlobs} />
      <ValuesMarquee />
      <DropGrid />
      <Story />
      <BrandVideoSection video={media.story} />
      <Specs />
      <Community instagram={social.instagram} handle={handleOf(social.instagram)} />
      <Faq locale={locale} />
      <NewsletterSection>
        <NewsletterForm source="home" />
      </NewsletterSection>
    </>
  );
}
