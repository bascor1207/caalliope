"use client";

import { CheckCircle2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { Button, Price, ProductArt } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addedDialogClosed,
  type LastAdded,
  opened,
  selectIsAddedDialogOpen,
  selectLastAdded,
} from "../application/cart.slice";

interface Props {
  /** Slot de recommandations, fourni par la composition root : le panier ne connaît pas le catalogue. */
  children?: (added: LastAdded, close: () => void) => ReactNode;
}

/**
 * Confirmation d'ajout + « Parfait avec ». S'ouvre à chaque `lineAdded`, remplace le toast.
 * Succès affiché en vert, en tête, sous le titre ; les recommandations suivent.
 */
export function AddedToCartDialog({ children }: Props) {
  const t = useTranslations("cart.added");
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectIsAddedDialogOpen);
  const added = useAppSelector(selectLastAdded);
  const close = () => dispatch(addedDialogClosed());
  if (!added) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-81 max-h-[92dvh] overflow-y-auto rounded-t-[28px] bg-cream p-5 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[min(760px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:p-7 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{t("eyebrow")}</p>
              <Dialog.Title className="mt-1.5 font-display text-[clamp(26px,4vw,38px)] font-extrabold leading-none tracking-[-0.04em]">
                {t("title")} <span className="serif">{t("titleSerif")}</span>
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/6"
              aria-label={t("close")}
            >
              <XIcon className="size-5" />
            </Dialog.Close>
          </div>

          <div
            role="status"
            className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-[18px] border border-success/30 bg-success/10 p-3 text-success sm:gap-4 sm:p-4"
          >
            <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-white sm:size-16">
              {added.imageSrc ? (
                <Image src={added.imageSrc} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <ProductArt kind={added.productType} color={added.colorHex} className="w-[60%]" />
              )}
            </span>
            <span className="min-w-0">
              <b className="flex items-center gap-1.5 font-display text-sm font-extrabold uppercase tracking-[0.08em]">
                <CheckCircle2Icon className="size-4 shrink-0" aria-hidden="true" />
                {t("confirmed")}
              </b>
              <span className="mt-0.5 block truncate text-[15px] text-ink">{added.name}</span>
              <span className="block text-[13px] text-ink-2">
                {t("details", { color: added.colorName, size: added.size, qty: added.qty })}
              </span>
            </span>
            <Price amount={added.unitPrice * added.qty} className="font-display text-base font-bold text-ink" />
          </div>

          {children ? <div className="mt-6">{children(added, close)}</div> : null}

          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={close} data-track="added.continue">
              {t("continue")}
            </Button>
            <Button type="button" onClick={() => dispatch(opened())} data-track="added.view-cart">
              {t("viewCart")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
