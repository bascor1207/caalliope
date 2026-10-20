"use client";

import Image from "next/image";
import { useFormatter } from "next-intl";
import { type MouseEvent, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ProductArt } from "@/shared/ui";
import { imageFor, type Product, pickColor } from "../domain/product";

export interface FeaturedCard {
  product: Product;
  colorKey: string;
}

/**
 * Visuel du hero. Desktop : cartes flottantes avec parallaxe souris.
 * Mobile : rail horizontal à défilement, sous le texte, pour ne rien chevaucher.
 */
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

  const items = cards.map(({ product, colorKey }) => {
    const color = pickColor(product, colorKey);
    const image = imageFor(product, color.key);
    return { product, color, image };
  });

  return (
    <>
      <div
        ref={ref}
        onMouseMove={onMove}
        className="relative hidden h-[clamp(420px,60vh,640px)] [perspective:1200px] md:block"
      >
        {items.map(({ product, color, image }, i) => (
          <Link
            key={`${product.id}-${color.key}`}
            className={`float-card c${i + 1}`}
            data-track="hero.card"
            href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
            style={{ "--c": color.hex } as React.CSSProperties}
          >
            {image ? (
              <Image src={image.src} alt="" fill sizes="30vw" className="object-cover" priority={i === 0} />
            ) : (
              <ProductArt kind={product.type} />
            )}
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-semibold backdrop-blur-[8px]">
              <b className="font-display">{product.name}</b> {color.name} · {format.number(product.price, "eur")}
            </div>
          </Link>
        ))}
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {items.map(({ product, color, image }, i) => (
          <Link
            key={`${product.id}-${color.key}`}
            href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
            className="relative aspect-[4/5] w-[62vw] shrink-0 snap-center overflow-hidden rounded-[18px]"
            data-track="hero.card"
            style={{ background: color.hex }}
          >
            {image ? (
              <Image src={image.src} alt="" fill sizes="62vw" className="object-cover" priority={i === 0} />
            ) : (
              <ProductArt kind={product.type} color={color.hex} className="absolute inset-0 m-auto w-[62%]" />
            )}
            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold backdrop-blur-[8px]">
              <b className="truncate font-display">{product.name}</b>
              <span className="shrink-0">{format.number(product.price, "eur")}</span>
              <span className="sr-only">, {color.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
