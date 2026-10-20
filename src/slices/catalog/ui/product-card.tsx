"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Badge, Button, cn, Price, ProductArt, Reveal } from "@/shared/ui";
import { imageFor, isDarkBadge, type Product, pickColor } from "../domain/product";

export function ProductCard({ product, delay }: { product: Product; delay?: 1 | 2 | 3 }) {
  const t = useTranslations("catalog.card");
  const [colorKey, setColorKey] = useState(product.colors[0].key);
  const color = pickColor(product, colorKey);
  const href = { pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } } as const;
  const image = imageFor(product, color.key);

  return (
    <Reveal
      as="article"
      delay={delay}
      className="group/card relative overflow-hidden rounded-card border border-line bg-white transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(20,20,20,.35)]"
    >
      <div
        className="card-media relative grid aspect-[4/5] place-items-center overflow-hidden"
        style={{ "--c": color.hex } as React.CSSProperties}
      >
        {product.badge && (
          <Badge variant={isDarkBadge(product.badge) ? "dark" : "light"} className="absolute top-3.5 left-3.5 z-2">
            {product.badge}
          </Badge>
        )}
        {image ? (
          /* Une photo par coloris, toutes montées : le switch de swatch est instantané (fondu). */
          product.colors.map((c) => {
            const shot = imageFor(product, c.key);
            if (!shot) return null;
            const active = c.key === color.key;
            return (
              <Image
                key={c.key}
                src={shot.src}
                alt={active ? shot.alt : ""}
                aria-hidden={!active}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className={cn("object-cover transition-opacity duration-300", active ? "opacity-100" : "opacity-0")}
              />
            );
          })
        ) : (
          <ProductArt kind={product.type} title={t("imageAlt", { name: product.name, color: color.name })} />
        )}
        <Link
          className="absolute inset-0 z-1"
          href={href}
          aria-label={t("open", { name: product.name, color: color.name })}
        />
        <div className="absolute inset-x-3.5 bottom-3.5 z-2 hidden translate-y-4 opacity-0 transition-[transform,opacity] duration-400 ease-expo group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 sm:block">
          <Button asChild size="sm" className="w-full">
            <Link href={href}>{t("see")}</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-2.5 p-3 sm:px-[18px] sm:pt-4 sm:pb-[18px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold tracking-[-0.01em] leading-tight sm:text-base">
              <Link href={href}>{product.name}</Link>
            </h3>
            <p className="mt-[3px] text-[13px] text-muted">{product.sub}</p>
          </div>
          <Price
            amount={product.price}
            compare={product.compare}
            className="whitespace-nowrap font-display text-base font-bold"
          />
        </div>
        <div className="relative z-2 flex gap-2" role="group" aria-label={t("colors")}>
          {product.colors.map((c) => (
            <button
              key={c.key}
              type="button"
              className={cn("swatch")}
              style={{ "--sw": c.hex } as React.CSSProperties}
              aria-label={c.name}
              aria-pressed={c.key === color.key}
              onClick={() => setColorKey(c.key)}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
