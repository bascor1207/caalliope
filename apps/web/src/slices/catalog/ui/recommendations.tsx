"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Price, ProductArt } from "@/shared/ui";
import { useAppSelector } from "@/store/hooks";
import { selectProducts } from "../application/catalog.slice";
import { complementaryProducts, imageFor, pickColor } from "../domain/product";

interface Props {
  productId: string;
  colorKey: string;
  /** Appelé quand l'utilisateur part vers une fiche (la modale hôte se ferme). */
  onNavigate?: () => void;
}

/** Pièces complémentaires à un article, lues dans le cache catalogue. */
export function Recommendations({ productId, colorKey, onNavigate }: Props) {
  const t = useTranslations("catalog.recommendations");
  const products = useAppSelector(selectProducts);
  const suggestions = complementaryProducts(products, productId, colorKey);
  if (suggestions.length === 0) return null;
  return (
    <section aria-labelledby="reco-title">
      <h3 id="reco-title" className="font-display text-lg font-extrabold tracking-[-0.02em]">
        {t("title")} <span className="serif font-normal">{t("titleSerif")}</span>
      </h3>
      <ul className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {suggestions.map(({ product, colorKey: key }) => {
          const color = pickColor(product, key);
          const image = imageFor(product, color.key);
          return (
            <li key={`${product.id}-${color.key}`}>
              <Link
                href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
                onClick={onNavigate}
                data-track="reco.product"
                className="group/reco block rounded-[16px] border border-line bg-white p-1.5 transition-[transform,box-shadow] duration-400 ease-expo hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-24px_rgba(20,20,20,.4)]"
              >
                <span
                  className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[12px]"
                  style={{ background: color.hex }}
                >
                  {image ? (
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 30vw, 220px"
                      className="object-cover"
                    />
                  ) : (
                    <ProductArt kind={product.type} color={color.hex} className="w-[60%]" />
                  )}
                </span>
                <span className="block px-1.5 pt-2 pb-1">
                  <b className="block truncate text-[13px] leading-tight">{product.name}</b>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted">
                    <span className="truncate">{color.name}</span>
                    <Price amount={product.price} className="shrink-0 font-display font-bold text-ink" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
