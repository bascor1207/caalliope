import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { breadcrumbJsonLd, localizedAlternates, pathFor } from "@/shared/seo/metadata";
import { Button, JsonLd } from "@/shared/ui";
import {
  CATEGORY_PATHS,
  CATEGORY_TYPES,
  type CategoryType,
  catalogRepository,
  filterProducts,
  itemListJsonLd,
  listProducts,
} from "@/slices/catalog/public-server";
import { ProductCard } from "@/slices/catalog/public-ui";

interface Props {
  params: Promise<{ locale: Locale }>;
}

/** Métadonnées d'une page catégorie : titre, description et alternates propres à la catégorie. */
export async function categoryMetadata({ params }: Props, type: CategoryType): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog.categories" });
  const pathname = CATEGORY_PATHS[type];
  const title = t(`${type}.title`);
  const description = t(`${type}.description`);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, pathname),
    openGraph: { type: "website", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Page catégorie indexable (hoodies, sweats, t-shirts) : H1 et texte propres, grille des pièces du type,
 * fil d'Ariane + liste de produits en JSON-LD, liens vers les autres catégories et le guide des tailles.
 */
export async function CategoryPage({ params }: Props, type: CategoryType) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tc, all] = await Promise.all([
    getTranslations("catalog.categories"),
    getTranslations("common"),
    listProducts(catalogRepository, locale),
  ]);
  const products = filterProducts(all, type);
  const pathname = CATEGORY_PATHS[type];
  const url = pathFor(locale, pathname);
  const others = CATEGORY_TYPES.filter((k) => k !== type);
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: tc("labels.home"), url: pathFor(locale, "/") },
          { name: t(`${type}.nav`), url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t(`${type}.title`),
          description: t(`${type}.description`),
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${url}`,
          mainEntity: itemListJsonLd(
            products.map((p) => ({
              product: p,
              url: pathFor(locale, "/produits/[slug]", { slug: p.slug }),
              ogImage: `${pathFor(locale, "/produits/[slug]", { slug: p.slug })}/opengraph-image`,
            })),
          ),
        }}
      />
      <nav aria-label={tc("a11y.breadcrumb")} className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-ink hover:underline">
          {tc("labels.home")}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{t(`${type}.nav`)}</span>
      </nav>
      <header className="max-w-[760px]">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2.5 text-[clamp(34px,5.5vw,64px)] tracking-[-0.03em]">
          {t(`${type}.heading`)} <span className="serif">{t(`${type}.headingSerif`)}</span>
        </h1>
        <p className="mt-5 text-base leading-[1.65] text-ink-2 md:text-lg">{t(`${type}.intro`)}</p>
      </header>
      <div className="mt-8 flex flex-wrap gap-2 md:mt-10">
        {others.map((k) => (
          <Link
            key={k}
            href={CATEGORY_PATHS[k]}
            className="rounded-full border-[1.5px] border-line px-4 py-2.5 font-display text-[13px] font-bold transition-colors hover:border-ink"
          >
            {t(`${k}.nav`)}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {products.length === 0 && <p className="col-span-full px-5 py-[60px] text-center text-muted">{t("empty")}</p>}
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={((i % 3) + 1) as 1 | 2 | 3} />
        ))}
      </div>
      <section className="mt-14 grid gap-4 rounded-card border border-line bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div>
          <h2 className="text-2xl tracking-[-0.02em]">{t(`${type}.detailTitle`)}</h2>
          <p className="mt-2 text-ink-2">{t(`${type}.detail`)}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/guide-des-tailles">{tc("actions.sizeGuide")}</Link>
        </Button>
      </section>
    </div>
  );
}
