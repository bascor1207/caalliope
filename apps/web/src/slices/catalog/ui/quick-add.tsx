"use client";

import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { eventBus } from "@/shared/event-bus";
import { cn, Price, useMoney } from "@/shared/ui";
import { imageFor, isSizeAvailable, type Product, pickColor } from "../domain/product";

interface Props {
  product: Product;
  colorKey: string;
}

/**
 * Ajout rapide depuis la collection : une taille, un clic, c'est dans le panier (optimiste : le store est
 * mis à jour immédiatement, le toast confirme). Desktop : rangée de tailles au survol de la photo.
 * Mobile : bouton « + » qui ouvre une feuille de tailles. Taille unique : ajout direct, sans étape.
 */
export function QuickAdd({ product, colorKey }: Props) {
  const t = useTranslations("catalog.card");
  const money = useMoney();
  const color = pickColor(product, colorKey);
  const [open, setOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const single = product.sizes.length === 1 ? product.sizes[0] : null;

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(null), 1100);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const add = (size: string) => {
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
      source: "quick",
    });
    setJustAdded(size);
    setOpen(false);
  };

  const sizeButton = (size: string, large?: boolean) => {
    const available = isSizeAvailable(product, size, color.key);
    const added = justAdded === size;
    return (
      <button
        key={size}
        type="button"
        disabled={!available}
        aria-label={available ? t("addSize", { size }) : t("soldOut", { size })}
        onClick={() => add(size)}
        data-track="card.quick-add"
        className={cn(
          "grid place-items-center rounded-full font-bold transition-[background-color,color,transform] duration-200",
          large ? "h-12 min-w-14 px-4 text-sm" : "h-8 min-w-9 px-2.5 text-xs",
          added ? "bg-success text-white" : "text-ink hover:bg-ink hover:text-cream",
          !available && "cursor-not-allowed line-through opacity-35 hover:bg-transparent hover:text-ink",
        )}
      >
        {added ? <CheckIcon className="size-4" aria-hidden="true" /> : size}
      </button>
    );
  };

  return (
    <>
      {/* Desktop : la rangée de tailles remplace le bouton « Voir » (la photo entière ouvre déjà la fiche). */}
      <div className="absolute inset-x-3 bottom-3 z-2 hidden translate-y-3 opacity-0 transition-[transform,opacity] duration-400 ease-expo group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 lg:block">
        <div
          className="flex items-center gap-1 rounded-full bg-white/92 p-1 pl-3 shadow-[0_8px_24px_-12px_rgba(20,20,20,.35)] backdrop-blur"
          role="group"
          aria-label={t("quickAdd")}
        >
          <span className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
            {t("quickAdd")}
          </span>
          {single ? (
            <button
              type="button"
              disabled={!isSizeAvailable(product, single, color.key)}
              onClick={() => add(single)}
              data-track="card.quick-add"
              className={cn(
                "ml-auto h-8 rounded-full px-3.5 text-xs font-bold transition-colors duration-200",
                justAdded ? "bg-success text-white" : "bg-ink text-cream hover:bg-ink-2",
              )}
            >
              {justAdded ? t("added") : t("add", { price: money(product.price) })}
            </button>
          ) : (
            <div className="flex flex-wrap gap-0.5">{product.sizes.map((s) => sizeButton(s))}</div>
          )}
        </div>
      </div>

      {/* Mobile : « + » sur la photo ; taille unique = ajout direct, sinon feuille de tailles. */}
      <button
        type="button"
        aria-label={t("quickAddFor", { name: product.name })}
        data-track={single ? "card.quick-add" : undefined}
        onClick={() => (single ? add(single) : setOpen(true))}
        className={cn(
          "absolute bottom-2 left-2 z-2 grid size-9 place-items-center rounded-full shadow-[0_6px_18px_-8px_rgba(20,20,20,.5)] transition-colors duration-200 lg:hidden",
          justAdded ? "bg-success text-white" : "bg-white/92 text-ink backdrop-blur",
        )}
      >
        {justAdded ? <CheckIcon className="size-4" aria-hidden="true" /> : <PlusIcon className="size-4" />}
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-80 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 z-81 rounded-t-[28px] bg-cream p-5 pb-[max(20px,env(safe-area-inset-bottom))] outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="eyebrow">{t("quickAdd")}</p>
                <Dialog.Title className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.04em]">
                  {t("chooseSize")}
                </Dialog.Title>
                <Dialog.Description className="mt-2 truncate text-sm text-ink-2">
                  {product.name} · {color.name} · <Price amount={product.price} compare={product.compare} />
                </Dialog.Description>
              </div>
              <Dialog.Close
                className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/6"
                aria-label={t("close")}
              >
                <XIcon className="size-5" />
              </Dialog.Close>
            </div>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t("sizes")}>
              {product.sizes.map((s) => (
                <span key={s} className="rounded-full border-[1.5px] border-line bg-white">
                  {sizeButton(s, true)}
                </span>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
