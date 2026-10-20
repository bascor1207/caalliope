"use client";

import { useFormatter } from "next-intl";
import { type MouseEvent, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ProductArt } from "@/shared/ui";
import { type Product, pickColor } from "../domain/product";

export interface FeaturedCard {
  product: Product;
  colorKey: string;
}

/** Cartes flottantes du hero : parallaxe souris, chaque carte mène à sa fiche produit. */
export function FloatingCards({ cards }: { cards: FeaturedCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const format = useFormatter();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer:coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    el.querySelectorAll<HTMLElement>(".float-card").forEach((c, i) => {
      const k = (3 - i) * 8;
      c.style.setProperty("--x", `${x * k}px`);
      c.style.setProperty("--y", `${y * k}px`);
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="relative h-[300px] md:h-[clamp(420px,60vh,640px)] [perspective:1200px]"
    >
      {cards.map(({ product, colorKey }, i) => {
        const color = pickColor(product, colorKey);
        return (
          <Link
            key={`${product.id}-${color.key}`}
            className={`float-card c${i + 1}`}
            href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
            style={{ "--c": color.hex } as React.CSSProperties}
            aria-label={`${product.name} ${color.name}, ${format.number(product.price, "eur")}`}
          >
            <ProductArt kind={product.type} />
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-semibold backdrop-blur-[8px]">
              <b className="font-display">{product.name}</b> {color.name} · {format.number(product.price, "eur")}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
