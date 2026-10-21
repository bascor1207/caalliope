"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Badge, cn, Price, ProductArt, Reveal, Skeleton } from "@/shared/ui";
import { imageFor, isDarkBadge, type Product, pickColor } from "../domain/product";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, delay }: { product: Product; delay?: 1 | 2 | 3 }) {
  const t = useTranslations("catalog.card");
  const [colorKey, setColorKey] = useState(product.colors[0].key);
  const [shot, setShot] = useState(0);
  const [hover, setHover] = useState(false);
  /** Dès que les flèches ont servi, le survol n'impose plus la seconde vue : l'utilisateur pilote. */
  const [manual, setManual] = useState(false);
  /** Les autres vues ne sont montées qu'une fois la photo visible chargée (ou en échec). */
  const [warm, setWarm] = useState(false);
  const color = pickColor(product, colorKey);
  const href = { pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: color.key } } as const;
  const gallery = product.images.filter((i) => i.colorKey === color.key);
  const hasImages = product.images.length > 0;
  /** Au survol on montre la seconde vue, tant que les flèches n'ont pas été utilisées. */
  const shown = gallery.length > 1 && hover && !manual ? 1 : Math.min(shot, Math.max(0, gallery.length - 1));
  const current = gallery[shown] ?? imageFor(product, color.key);
  /* Montées d'avance (après la photo visible) : première photo de chaque coloris + vues du coloris actif. */
  const firstShots = product.colors.flatMap((c) => {
    const first = imageFor(product, c.key);
    return first ? [first] : [];
  });
  const stacked = [...firstShots, ...gallery.filter((g) => !firstShots.includes(g))];

  const flip = (dir: 1 | -1) => {
    setManual(true);
    setShot((shown + dir + gallery.length) % gallery.length);
  };

  return (
    <Reveal as="article" delay={delay} className="group/card relative">
      {/* Le relief est sur un enfant : la révélation au scroll (transform sur l'article) ne se bat plus avec le survol. */}
      <div className="card-lift relative isolate rounded-[16px] border border-line bg-white sm:rounded-card">
        <div
          className="card-media relative grid aspect-[4/5] place-items-center overflow-hidden rounded-t-[inherit]"
          style={{ "--c": color.hex } as React.CSSProperties}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {product.badge && (
            <Badge
              variant={isDarkBadge(product.badge) ? "dark" : "light"}
              className="absolute top-2.5 left-2.5 z-2 sm:top-3.5 sm:left-3.5"
            >
              {product.badge}
            </Badge>
          )}
          {hasImages && !warm && <Skeleton className="absolute inset-0 hidden rounded-none js:block" />}
          {hasImages ? (
            stacked
              .filter((img) => warm || img.src === current?.src)
              .map((img) => {
                const active = img.src === current?.src;
                return (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={active ? img.alt : ""}
                    aria-hidden={!active}
                    fill
                    fetchPriority={active ? undefined : "low"}
                    onLoad={active ? () => setWarm(true) : undefined}
                    onError={active ? () => setWarm(true) : undefined}
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className={cn(
                      "card-shot object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                      active ? "opacity-100" : "opacity-0",
                    )}
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
            data-track="card.open"
          />
          {gallery.length > 1 && (
            /* Mobile : en bas à droite (le « + » est à gauche). Desktop : en haut à droite, la rangée d'ajout rapide occupant le bas. */
            <div className="absolute right-2 bottom-2 z-2 flex gap-1 sm:right-3 sm:bottom-3 sm:opacity-0 sm:transition-opacity sm:group-hover/card:opacity-100 sm:group-focus-within/card:opacity-100 lg:top-3 lg:bottom-auto">
              <button
                type="button"
                aria-label={t("prev")}
                onClick={() => flip(-1)}
                className="grid size-8 place-items-center rounded-full bg-white/85 text-ink backdrop-blur hover:bg-white"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                onClick={() => flip(1)}
                className="grid size-8 place-items-center rounded-full bg-white/85 text-ink backdrop-blur hover:bg-white"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          )}
          <QuickAdd product={product} colorKey={color.key} />
        </div>
        {/* Colonne bornée (minmax 0) : un nom long se coupe sur deux lignes au lieu d'élargir la carte. */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-2 p-3 sm:gap-2.5 sm:px-[18px] sm:pt-4 sm:pb-[18px]">
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              {/* Garde-fou : deux lignes maximum, puis points de suspension (noms longs sur mobile). */}
              <h3 className="line-clamp-2 min-w-0 text-[13px] font-bold tracking-[-0.01em] leading-tight [overflow-wrap:anywhere] sm:text-base">
                <Link href={href}>{product.name}</Link>
              </h3>
              <p className="mt-0.5 truncate text-xs text-muted sm:mt-[3px] sm:text-[13px]">{product.sub}</p>
            </div>
            <Price
              amount={product.price}
              compare={product.compare}
              className="whitespace-nowrap font-display text-sm font-bold sm:text-base"
            />
          </div>
          <div className="relative z-2 flex flex-wrap gap-2" role="group" aria-label={t("colors")}>
            {product.colors.map((c) => (
              <button
                key={c.key}
                type="button"
                className="swatch max-sm:size-[18px]"
                style={{ "--sw": c.hex } as React.CSSProperties}
                aria-label={c.name}
                aria-pressed={c.key === color.key}
                onClick={() => {
                  setColorKey(c.key);
                  setShot(0);
                  setManual(false);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
