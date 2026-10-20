import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";
import { breadcrumbJsonLd, localizedAlternates, pathFor } from "@/shared/seo/metadata";
import { Button, JsonLd } from "@/shared/ui";
import {
  catalogRepository,
  getProduct,
  getProductWithRelated,
  listProducts,
  productJsonLd,
} from "@/slices/catalog/public-server";
import { ProductCard, ProductConfigurator, ProductConfiguratorFromUrl } from "@/slices/catalog/public-ui";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const products = await listProducts(catalogRepository, routing.defaultLocale);
  return routing.locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "catalog.product" });
  const product = await getProduct(catalogRepository, slug, locale);
  if (!product) return { title: t("notFound") };
  const format = await getFormatter({ locale });
  const href = { pathname: "/produits/[slug]", params: { slug } } as const;
  const title = `${product.name} — ${product.sub}`;
  const description = t("metaDescription", {
    description: product.description,
    colors: product.colors.map((c) => c.name).join(", "),
    price: format.number(product.price, "eur"),
  });
  const ogImage = absoluteUrl(`${pathFor(locale, "/produits/[slug]", { slug })}/opengraph-image`);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, href),
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Page statique par locale et par produit ; `?coloris=` est lu côté client. */
export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const result = await getProductWithRelated(catalogRepository, slug, locale);
  if (!result) notFound();
  const { product, related } = result;
  const t = await getTranslations("catalog.product");
  const tc = await getTranslations("common");
  const url = pathFor(locale, "/produits/[slug]", { slug });

  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <JsonLd data={productJsonLd(product, url, `${url}/opengraph-image`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tc("labels.home"), url: pathFor(locale, "/") },
          { name: tc("labels.drop"), url: `${pathFor(locale, "/")}#drop` },
          { name: product.name, url },
        ])}
      />
      <nav className="mb-7 flex flex-wrap gap-2 text-[13px] text-muted" aria-label={tc("a11y.breadcrumb")}>
        <Link href="/" className="hover:text-ink">
          {tc("labels.home")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={{ pathname: "/", hash: "drop" }} className="hover:text-ink">
          {tc("labels.drop")}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <Suspense fallback={<ProductConfigurator product={product} />}>
        <ProductConfiguratorFromUrl product={product} />
      </Suspense>
      <section className="mt-24" aria-labelledby="related-title">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("relatedEyebrow")}</p>
            <h2 id="related-title" className="mt-2.5 text-[clamp(30px,4vw,48px)] tracking-[-0.04em]">
              {t("relatedTitle")} <span className="serif">{t("relatedSerif")}</span>
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={{ pathname: "/", hash: "drop" }}>{tc("actions.allDrop")}</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={(i + 1) as 1 | 2 | 3} />
          ))}
        </div>
      </section>
    </div>
  );
}
