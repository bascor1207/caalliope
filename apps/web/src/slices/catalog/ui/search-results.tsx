import { SearchIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/shared/kernel/locale";
import { formatMoney } from "@/shared/kernel/money";
import { Button, ProductArt } from "@/shared/ui";
import type { SearchHit } from "../domain/search";

interface Props {
  locale: Locale;
  query: string;
  hits: SearchHit[];
}

/** Page de résultats, rendue côté serveur (fonctionne sans JS, indexable sur /recherche sans paramètre). */
export async function SearchResults({ locale, query, hits }: Props) {
  const t = await getTranslations("catalog.search");
  const tags = t("tags").split("|");

  return (
    <div className="mx-auto max-w-[760px]">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-2.5 mb-6 text-[clamp(30px,4.6vw,50px)] tracking-[-0.03em]">
        {query ? (
          <>
            {t("resultsFor")} <span className="serif">« {query} »</span>
          </>
        ) : (
          <>
            {t("heading")} <span className="serif">{t("headingSerif")}</span>
          </>
        )}
      </h1>
      <form
        action=""
        role="search"
        aria-label={t("eyebrow")}
        className="mb-7 flex items-center gap-3.5 rounded-full border-[1.5px] border-line bg-white py-1.5 pr-1.5 pl-5"
      >
        <SearchIcon className="size-5 shrink-0" aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={t("placeholder")}
          aria-label={t("title")}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-lg outline-none"
        />
        <Button size="sm" type="submit">
          {t("cta")}
        </Button>
      </form>
      {!query && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={{ pathname: "/recherche", query: { q: tag } }}
              className="rounded-full border border-line px-3.5 py-2 text-[13px] hover:border-ink"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      {query && hits.length === 0 && <p className="px-4 py-9 text-center text-muted">{t("empty", { q: query })}</p>}
      {hits.map(({ product, color }) => (
        <Link
          key={`${product.id}-${color.key}`}
          href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
          className="grid grid-cols-[64px_1fr_auto] items-center gap-3.5 rounded-[14px] p-3 transition-colors hover:bg-ink/5"
        >
          <span className="grid aspect-[4/5] w-16 place-items-center rounded-[10px]" style={{ background: color.hex }}>
            <ProductArt kind={product.type} color={color.hex} className="w-[60%]" />
          </span>
          <span>
            <b className="block text-[15px]">
              {product.name} · {color.name}
            </b>
            <small className="text-xs text-muted">{product.sub}</small>
          </span>
          <span className="font-display font-bold">{formatMoney(product.price, locale)}</span>
        </Link>
      ))}
    </div>
  );
}
