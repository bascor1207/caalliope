"use client";

import { RotateCcwIcon, ShieldCheckIcon, TruckIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import { Button, cn, Price, ProductArt, useMoney } from "@/shared/ui";
import { Lightbox } from "@/shared/ui/lightbox";
import { defaultSize, imageFor, isSizeAvailable, type Product, pickColor } from "../domain/product";

interface Props {
  product: Product;
  initialColorKey?: string;
}

/** Lit `?coloris=` dans l'URL. À rendre dans un <Suspense> ; le fallback est le configurateur sans URL. */
export function ProductConfiguratorFromUrl({ product }: { product: Product }) {
  const wanted = useSearchParams().get("coloris");
  return <ProductConfigurator product={product} initialColorKey={pickColor(product, wanted).key} />;
}

/**
 * Choix coloris + taille, galerie par coloris, visionneuse plein écran.
 * Ne connaît pas le panier : publie `catalog.product-chosen`, la slice panier décide quoi en faire.
 */
export function ProductConfigurator({ product, initialColorKey }: Props) {
  const t = useTranslations("catalog.product");
  const tc = useTranslations("common");
  const money = useMoney();
  const router = useRouter();
  const [colorKey, setColorKey] = useState(initialColorKey ?? product.colors[0].key);
  const [size, setSize] = useState<string | null>(defaultSize(product));
  const [shot, setShot] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Les autres coloris ne sont montés qu'une fois la photo active affichée : LCP d'abord, préchauffage ensuite. */
  const [warm, setWarm] = useState(false);
  const color = pickColor(product, colorKey);
  const gallery = product.images.filter((i) => i.colorKey === color.key);
  const image = gallery[shot] ?? gallery[0] ?? product.images[0];
  const firstShots = product.colors.flatMap((c) => {
    const first = imageFor(product, c.key);
    return first ? [first] : [];
  });
  const stacked = [...firstShots, ...gallery.filter((g) => !firstShots.includes(g))];

  useEffect(() => {
    eventBus.publish("catalog.product-viewed", { productId: product.id, slug: product.slug, colorKey: color.key });
  }, [product.id, product.slug, color.key]);

  const chooseColor = (key: string) => {
    setColorKey(key);
    setShot(0);
    if (size && !isSizeAvailable(product, size, key)) setSize(null);
    router.replace(
      { pathname: "/produits/[slug]", params: { slug: product.slug }, query: { coloris: key } },
      { scroll: false },
    );
  };

  const choose = () => {
    if (!size) {
      setError(t("chooseSize"));
      return;
    }
    setError(null);
    eventBus.publish("catalog.product-chosen", {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      productType: product.type,
      colorKey: color.key,
      colorName: color.name,
      colorHex: color.hex,
      imageSrc: imageFor(product, color.key)?.src,
      size,
      unitPrice: product.price,
      qty: 1,
    });
  };

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,460px)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
      <div className="grid gap-3 md:sticky md:top-[calc(var(--spacing-header)+16px)]">
        <div
          className="pdp-media relative grid aspect-[4/5] place-items-center overflow-hidden rounded-card"
          style={{ "--c": color.hex } as React.CSSProperties}
        >
          {image ? (
            <>
              {/* Première photo de chaque coloris + vues du coloris actif, montées après la photo active : switch instantané. */}
              {stacked
                .filter((img) => warm || img.src === image.src)
                .map((img) => {
                  const active = img.src === image.src;
                  return (
                    <Image
                      key={img.src}
                      src={img.src}
                      alt={active ? img.alt : ""}
                      aria-hidden={!active}
                      fill
                      priority={active}
                      fetchPriority={active ? "high" : "low"}
                      onLoad={active ? () => setWarm(true) : undefined}
                      sizes="(max-width: 768px) 100vw, 520px"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  );
                })}
              <button
                type="button"
                onClick={() => setZoom(true)}
                aria-label={t("lightbox")}
                className="group/zoom absolute inset-0 cursor-zoom-in"
              >
                <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-white/80 text-ink opacity-0 backdrop-blur transition-opacity group-hover/zoom:opacity-100 max-md:opacity-100">
                  <ZoomInIcon className="size-5" />
                </span>
              </button>
            </>
          ) : (
            <ProductArt kind={product.type} title={t("placeholderAlt", { name: product.name, color: color.name })} />
          )}
        </div>
        {gallery.length > 1 && (
          <div className="flex gap-2" role="group" aria-label={t("gallery")}>
            {gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={img.alt}
                aria-pressed={i === shot}
                onClick={() => setShot(i)}
                className={cn(
                  "relative aspect-[4/5] w-14 overflow-hidden rounded-[10px] border-[1.5px] border-line transition-colors md:w-16",
                  i === shot && "border-ink",
                )}
              >
                <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        {gallery.length > 0 && (
          <Lightbox
            images={gallery.map((g) => ({ src: g.src, alt: g.alt }))}
            index={Math.min(shot, gallery.length - 1)}
            open={zoom}
            onOpenChange={setZoom}
            onIndexChange={setShot}
            labels={{
              close: t("lightboxClose"),
              prev: t("prev"),
              next: t("next"),
              of: (current, total) => t("of", { current, total }),
              title: `${product.name} · ${color.name}`,
            }}
          />
        )}
      </div>
      <div className="grid content-start gap-5 md:gap-6">
        <div>
          <p className="eyebrow">{t("eyebrow", { sub: product.sub })}</p>
          <h1 className="mt-2 text-[clamp(30px,7vw,56px)] tracking-[-0.04em]">{product.name}</h1>
          <Price
            amount={product.price}
            compare={product.compare}
            className="mt-2.5 block font-display text-2xl font-bold"
          />
        </div>
        <p className="text-[15px] leading-relaxed text-ink-2 md:text-base">{product.description}</p>
        <div>
          <div className="mb-2.5 flex justify-between text-[13px] font-semibold">
            {t("color")} <span className="font-normal text-muted">{color.name}</span>
          </div>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label={tc("a11y.colors")}>
            {product.colors.map((c) => (
              <button
                key={c.key}
                type="button"
                className="swatch size-[30px]"
                style={{ "--sw": c.hex } as React.CSSProperties}
                aria-label={c.name}
                aria-pressed={c.key === color.key}
                onClick={() => chooseColor(c.key)}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2.5 flex justify-between text-[13px] font-semibold">
            {t("size")}
            <Link className="font-normal text-muted underline underline-offset-[3px]" href="/guide-des-tailles">
              {tc("actions.sizeGuide")}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={tc("a11y.sizes")}>
            {product.sizes.map((s) => {
              const available = isSizeAvailable(product, s, color.key);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  aria-pressed={s === size}
                  aria-label={available ? s : t("soldOut", { size: s })}
                  onClick={() => {
                    setSize(s);
                    setError(null);
                  }}
                  className={cn(
                    "min-w-[52px] rounded-[10px] border-[1.5px] border-line px-3 py-2.5 text-sm font-semibold transition-all hover:border-ink",
                    s === size && "border-ink bg-ink text-cream",
                    !available && "cursor-not-allowed line-through opacity-35",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {error && (
            <p className="mt-2 text-xs text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button type="button" onClick={choose} className="max-md:sticky max-md:bottom-3 max-md:z-40 max-md:shadow-lg">
          {t("preorder", { price: money(product.price) })}
        </Button>
        <ul className="grid gap-2 text-[13px] text-ink-2">
          <li className="flex items-center gap-2.5">
            <TruckIcon className="size-4 shrink-0" /> {t("reassure1")}
          </li>
          <li className="flex items-center gap-2.5">
            <RotateCcwIcon className="size-4 shrink-0" />
            <Link className="underline underline-offset-[3px]" href="/livraison">
              {t("reassure2")}
            </Link>
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheckIcon className="size-4 shrink-0" /> {t("reassure3")}
          </li>
        </ul>
        <p className="text-xs text-muted">{t("material", { material: product.material, sku: product.sku })}</p>
      </div>
    </div>
  );
}
