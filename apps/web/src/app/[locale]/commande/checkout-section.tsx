"use client";

import { selectCartTotals, selectLines } from "@/slices/cart/public-store";
import { CheckoutForm, type CheckoutLineView } from "@/slices/checkout/public-ui";
import { useAppSelector } from "@/store/hooks";

/**
 * Composition panier → checkout : la page projette les lignes du panier dans la vue
 * attendue par le checkout. Les deux slices ne s'importent jamais l'une l'autre.
 */
export function CheckoutSection() {
  const lines = useAppSelector(selectLines);
  const totals = useAppSelector(selectCartTotals);
  const view: CheckoutLineView[] = lines.map((l) => ({
    productId: l.productId,
    colorKey: l.colorKey,
    size: l.size,
    qty: l.qty,
    name: l.name,
    productType: l.productType,
    colorName: l.colorName,
    colorHex: l.colorHex,
    imageSrc: l.imageSrc,
    unitPrice: l.unitPrice,
  }));
  return <CheckoutForm lines={view} totals={totals} />;
}
