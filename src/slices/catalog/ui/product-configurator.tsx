"use client";

import { RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { eventBus } from "@/shared/event-bus";
import { Button, cn, Price, ProductArt, useMoney } from "@/shared/ui";
import { defaultSize, isSizeAvailable, type Product, pickColor } from "../domain/product";

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
 * Choix coloris + taille, galerie par coloris. Ne connaît pas le panier : il publie
 * `catalog.product-chosen` sur le bus, la slice panier décide quoi en faire.
 */
export function ProductConfigurator({ product, initialColorKey }: Props) {
  const t = useTranslations("catalog.product");
  const tc = useTranslations("common");
  const money = useMoney();
  const router = useRouter();
  const [colorKey, setColorKey] = useState(initialColorKey ?? product.colors[0].key);
  const [size, setSize] = useState<string | null>(defaultSize(product));
  const [shot, setShot] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const color = pickColor(product, colorKey);
  const gallery = product.images.filter((i) => i.colorKey === color.key);
  const image = gallery[shot] ?? gallery[0] ?? product.images[0];

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
      size,
      unitPrice: product.price,
      qty: 1,
    });
  };

  return (
    <div className="grid items-start gap-12 md:grid-cols-[1.1fr_.9fr]">
      <div className="grid gap-3 md:sticky md:top-[calc(var(--spacing-header)+16px)]">
        <div
          className="pdp-media relative grid aspect-[4/5] place-items-center overflow-hidden rounded-card"
          style={{ "--c": color.hex } as React.CSSProperties}
        >
          {image ? (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
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
                  "relative aspect-[4/5] w-16 overflow-hidden rounded-[10px] border-[1.5px] border-line transition-colors",
                  i === shot && "border-ink",
                )}
              >
                <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid content-start gap-6">
        <div>
          <p className="eyebrow">{t("eyebrow", { sub: product.sub })}</p>
          <h1 className="mt-2 text-[clamp(34px,4.5vw,56px)] tracking-[-0.04em]">{product.name}</h1>
          <Price
            amount={product.price}
            compare={product.compare}
            className="mt-2.5 block font-display text-2xl font-bold"
          />
        </div>
        <p className="text-base leading-relaxed text-ink-2">{product.description}</p>
        <div>
          <div className="mb-2.5 flex justify-between text-[13px] font-semibold">
            {t("color")} <span className="font-normal text-muted">{color.name}</span>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={tc("a11y.colors")}>
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
        <Button type="button" onClick={choose}>
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
