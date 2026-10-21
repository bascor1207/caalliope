"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/ui";
import { useAppSelector } from "@/store/hooks";
import { selectFilterCounts, selectProductsByFilter } from "../application/catalog.slice";
import { CATALOG_FILTERS } from "../domain/product";
import { ProductCard } from "./product-card";
import { useUrlFilter } from "./use-url-filter";

/**
 * Grille de la collection, rendue côté serveur. Le filtre vit dans l'URL (`?filtre=`) : partageable,
 * et pilotable par le menu ou le footer sans que ces composants connaissent la grille.
 */
export function DropGrid() {
  const t = useTranslations("catalog.drop");
  const [filter, select] = useUrlFilter();
  const products = useAppSelector((s) => selectProductsByFilter(s, filter));
  const counts = useAppSelector(selectFilterCounts);

  return (
    <section id="drop" aria-labelledby="drop-title" className="py-[clamp(56px,10vw,128px)]">
      <div className="container-k">
        <div className="mb-6 md:mb-11">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="drop-title" className="mt-2.5 text-[clamp(30px,4.8vw,60px)] tracking-[-0.03em]">
            {t("title")} <span className="serif">{t("titleSerif")}</span>
          </h2>
        </div>
        {/* Filtres = boutons à bascule (pas des onglets : aucun panneau associé). */}
        <div
          role="group"
          aria-label={t("filterLabel")}
          className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mb-6 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {CATALOG_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === filter}
              onClick={() => select(f)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border-[1.5px] border-line px-4 py-2.5 font-display text-[13px] font-bold transition-[background-color,border-color,color] duration-200 hover:border-ink",
                "aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-cream",
              )}
            >
              {t(f)}
              <span className={cn("font-sans text-xs font-medium", f === filter ? "text-cream/70" : "text-muted")}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
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
