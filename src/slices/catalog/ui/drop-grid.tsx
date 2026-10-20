"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import { Countdown, Tabs, TabsList, TabsTrigger } from "@/shared/ui";
import { useAppSelector } from "@/store/hooks";
import { selectFilterCounts, selectProductsByFilter } from "../application/catalog.slice";
import { CATALOG_FILTERS, type CatalogFilter, isCatalogFilter } from "../domain/product";
import { ProductCard } from "./product-card";

/**
 * Grille du drop. Le filtre vit dans l'URL (`?filtre=`) : partageable, et pilotable
 * par le menu ou le footer sans que ces composants connaissent la grille.
 */
export function DropGrid() {
  const t = useTranslations("catalog.drop");
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("filtre");
  const filter: CatalogFilter = isCatalogFilter(fromUrl) ? fromUrl : "all";
  const products = useAppSelector((s) => selectProductsByFilter(s, filter));
  const counts = useAppSelector(selectFilterCounts);

  const select = (value: string) => {
    if (!isCatalogFilter(value)) return;
    router.replace({ pathname: "/", query: value === "all" ? {} : { filtre: value } }, { scroll: false });
  };

  return (
    <section id="drop" aria-labelledby="drop-title" className="py-[clamp(72px,10vw,128px)]">
      <div className="container-k">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow", { drop: SITE.dropName })}</p>
            <h2 id="drop-title" className="mt-2.5 text-[clamp(36px,5.5vw,72px)] tracking-[-0.04em]">
              {t("title")} <span className="serif">{t("titleSerif")}</span>
            </h2>
          </div>
          <div>
            <p className="eyebrow mb-2.5">{t("closing")}</p>
            <Countdown
              end={SITE.dropEnd}
              labels={{ days: t("days"), hours: t("hours"), minutes: t("minutes"), seconds: t("seconds") }}
            />
          </div>
        </div>
        <Tabs value={filter} onValueChange={select} className="mb-6">
          <TabsList aria-label={t("filterLabel")}>
            {CATALOG_FILTERS.map((f) => (
              <TabsTrigger key={f} value={f}>
                {t(f)} <span>{counts[f]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5" aria-live="polite">
          {products.length === 0 && <p className="col-span-full px-5 py-[60px] text-center text-muted">{t("empty")}</p>}
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={((i % 3) + 1) as 1 | 2 | 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
