import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates } from "@/shared/seo/metadata";
import { catalogRepository, search } from "@/slices/catalog/public-server";
import { SearchResults, SearchTracker } from "@/slices/catalog/public-ui";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ locale }, { q }] = await Promise.all([params, searchParams]);
  const t = await getTranslations({ locale, namespace: "catalog.search" });
  return {
    title: q ? t("resultsTitle", { q }) : t("title"),
    robots: { index: !q, follow: true },
    alternates: localizedAlternates(locale, "/recherche"),
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ locale }, { q = "" }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const query = q.trim().slice(0, 80);
  const hits = await search(catalogRepository, query, locale);
  return (
    <div className="container-k pt-10 pb-[clamp(72px,10vw,128px)]">
      <SearchTracker query={query} results={hits.length} />
      <SearchResults locale={locale} query={query} hits={hits} />
    </div>
  );
}
