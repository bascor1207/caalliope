"use client";

import Image from "next/image";
import { useFormatter } from "next-intl";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ProductArt } from "@/shared/ui";
import { imageFor, type Product, pickColor } from "../domain/product";

export interface FeaturedCard {
  product: Product;
  colorKey: string;
}

/**
 * Visuel du hero. Desktop : cartes flottantes avec parallaxe souris lissée (requestAnimationFrame + interpolation,
 * transform seul, jamais de transition relancée à chaque mouvement). Mobile : rail horizontal sous le texte.
 */
export function FloatingCards({ cards }: { cards: FeaturedCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const format = useFormatter();

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer:coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = Array.from(el.querySelectorAll<HTMLElement>(".float-card-parallax"));
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let running = false;

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      layers.forEach((layer, i) => {
        const k = (3 - i) * 10;
        layer.style.transform = `translate3d(${(current.x * k).toFixed(2)}px, ${(current.y * k).toFixed(2)}px, 0)`;
      });
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      if (settled) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left - r.width / 2) / r.width;
      target.y = (e.clientY - r.top - r.height / 2) / r.height;
      wake();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      wake();
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  const items = cards.map(({ product, colorKey }) => {
    const color = pickColor(product, colorKey);
    const image = imageFor(product, color.key);
    return { product, color, image };
  });

  return (
    <>
      <div ref={ref} className="relative hidden h-[clamp(420px,60vh,640px)] md:block">
        {items.map(({ product, color, image }, i) => (
          <div
            key={`${product.id}-${color.key}`}
            className={`float-card c${i + 1}`}
            style={{ "--c": color.hex } as React.CSSProperties}
          >
            <Link
              className="float-card-parallax"
              data-track="hero.card"
              href={{ pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } }}
            >
              {image ? (
                <Image src={image.src} alt="" fill sizes="30vw" className="object-cover" priority={i === 0} />
              ) : (
                <ProductArt kind={product.type} />
              )}
              <span className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold">
                <b className="font-display">{product.name}</b> {color.name} · {format.number(product.price, "eur")}
              </span>
            </Link>
          </div>
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
            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold">
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
