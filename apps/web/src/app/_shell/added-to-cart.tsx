"use client";

import { AddedToCartDialog } from "@/slices/cart/public-ui";
import { Recommendations } from "@/slices/catalog/public-ui";

/** Composition : la modale du panier reçoit les pièces complémentaires du catalogue sans connaître la slice. */
export function AddedToCart() {
  return (
    <AddedToCartDialog>
      {(added, close) => <Recommendations productId={added.productId} colorKey={added.colorKey} onNavigate={close} />}
    </AddedToCartDialog>
  );
}
