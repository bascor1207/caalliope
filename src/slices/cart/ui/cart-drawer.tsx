"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FREE_SHIPPING_FROM } from "@/shared/kernel/shipping-policy";
import { Button, Price, ProductArt, Sheet, SheetContent, SheetDescription, SheetTitle, useMoney } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closed,
  lineRemoved,
  opened,
  qtySet,
  selectCartCount,
  selectCartTotals,
  selectIsCartOpen,
  selectLines,
} from "../application/cart.slice";
import { MAX_QTY } from "../domain/cart";

export function CartDrawer() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const money = useMoney();
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectLines);
  const count = useAppSelector(selectCartCount);
  const totals = useAppSelector(selectCartTotals);
  const isOpen = useAppSelector(selectIsCartOpen);
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_FROM) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(open ? opened() : closed())}>
      <SheetContent side="right" closeLabel={t("close")}>
        <div className="flex items-center justify-between border-b border-line px-[22px] py-5">
          <SheetTitle className="font-display text-[22px] font-extrabold tracking-[-0.02em]">
            {t("title")} {count > 0 && <span className="serif">({count})</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">{t("note")}</SheetDescription>
        </div>
        <div className="flex-1 overflow-auto px-[22px] py-2">
          {lines.length === 0 ? (
            <div className="py-[60px] text-center text-muted">
              <p className="font-display text-xl font-bold text-ink">{t("emptyTitle")}</p>
              <p className="mt-2">{t("emptyText")}</p>
              <Button asChild variant="ghost" size="sm" className="mt-5">
                <Link href={{ pathname: "/", hash: "drop" }} onClick={() => dispatch(closed())}>
                  {tc("actions.seeDrop")}
                </Link>
              </Button>
            </div>
          ) : (
            lines.map((l) => (
              <div
                key={l.key}
                className="grid grid-cols-[72px_1fr_auto] items-center gap-3.5 border-b border-line py-4"
              >
                <div
                  className="grid aspect-[4/5] w-[72px] place-items-center overflow-hidden rounded-[10px]"
                  style={{ background: l.colorHex }}
                >
                  <ProductArt kind={l.productType} color={l.colorHex} className="w-[60%]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">
                    <Link
                      href={{ pathname: "/produits/[slug]", params: { slug: l.slug }, query: { coloris: l.colorKey } }}
                      onClick={() => dispatch(closed())}
                    >
                      {l.name}
                    </Link>
                  </h4>
                  <p className="mt-0.5 text-xs text-muted">
                    {l.colorName} · {l.size}
                  </p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      className="grid size-7 place-items-center"
                      aria-label={t("minus")}
                      onClick={() => dispatch(qtySet({ key: l.key, qty: l.qty - 1 }))}
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-[13px] font-semibold tabular-nums">{l.qty}</span>
                    <button
                      type="button"
                      className="grid size-7 place-items-center"
                      aria-label={t("plus")}
                      disabled={l.qty >= MAX_QTY}
                      onClick={() => dispatch(qtySet({ key: l.key, qty: l.qty + 1 }))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <Price amount={l.unitPrice * l.qty} className="font-display font-bold" />
                  <button
                    type="button"
                    className="mt-1.5 block text-xs text-muted underline underline-offset-[3px]"
                    onClick={() => dispatch(lineRemoved({ key: l.key }))}
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="grid gap-3 border-t border-line bg-cream-2 px-[22px] pt-[18px] pb-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
            <i
              className="block h-full bg-ink transition-[width] duration-600 ease-expo"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[13px] text-ink-2">
            {totals.subtotal >= FREE_SHIPPING_FROM
              ? t("freeUnlocked")
              : totals.subtotal > 0
                ? t.rich("freeRemaining", { amount: money(FREE_SHIPPING_FROM - totals.subtotal), b: (c) => <b>{c}</b> })
                : t("freeFrom", { amount: money(FREE_SHIPPING_FROM) })}
          </p>
          <div className="flex justify-between font-display text-lg font-bold">
            <span>{tc("labels.total")}</span>
            <span>{money(totals.total)}</span>
          </div>
          <Button asChild disabled={count === 0} className={count === 0 ? "pointer-events-none opacity-50" : undefined}>
            <Link href="/commande" onClick={() => dispatch(closed())} aria-disabled={count === 0}>
              {t("checkout")}
            </Link>
          </Button>
          <small className="text-center text-xs text-muted">{t("note")}</small>
        </div>
      </SheetContent>
    </Sheet>
  );
}
