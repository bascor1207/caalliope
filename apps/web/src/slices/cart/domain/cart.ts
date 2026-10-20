import { type Totals, totalsFor } from "@/shared/kernel/shipping-policy";

/** Domaine panier : pur, primitives uniquement (aucun type du catalogue). */
export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  productType: string;
  colorKey: string;
  colorName: string;
  colorHex: string;
  imageSrc?: string;
  size: string;
  unitPrice: number;
  qty: number;
}

export type NewCartLine = Omit<CartLine, "key" | "qty">;

export interface Cart {
  lines: CartLine[];
}

export const MAX_QTY = 10;

export const emptyCart = (): Cart => ({ lines: [] });

export const lineKey = (line: Pick<CartLine, "productId" | "colorKey" | "size">): string =>
  `${line.productId}|${line.colorKey}|${line.size}`;

const clampQty = (qty: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));

export function addLine(cart: Cart, line: NewCartLine, qty = 1): Cart {
  const key = lineKey(line);
  const existing = cart.lines.find((l) => l.key === key);
  if (existing) {
    return { lines: cart.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + qty) } : l)) };
  }
  return { lines: [...cart.lines, { ...line, key, qty: clampQty(qty) }] };
}

export const setQty = (cart: Cart, key: string, qty: number): Cart => ({
  lines: cart.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(qty) } : l)).filter((l) => l.qty > 0),
});

export const removeLine = (cart: Cart, key: string): Cart => ({ lines: cart.lines.filter((l) => l.key !== key) });

export const countOf = (cart: Cart): number => cart.lines.reduce((n, l) => n + l.qty, 0);

export const totalsOf = (cart: Cart): Totals => totalsFor(cart.lines);
