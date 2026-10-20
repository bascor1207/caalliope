/** Règle métier partagée entre panier et checkout : livraison offerte dès un seuil. */
export const FREE_SHIPPING_FROM = 80;
export const SHIPPING_FEE = 4.9;

export const shippingFor = (subtotal: number): number =>
  subtotal <= 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

export interface Totals {
  subtotal: number;
  shipping: number;
  total: number;
}

export const totalsFor = (lines: ReadonlyArray<{ qty: number; unitPrice: number }>): Totals => {
  const subtotal = round(lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0));
  const shipping = shippingFor(subtotal);
  return { subtotal, shipping, total: round(subtotal + shipping) };
};

const round = (n: number) => Math.round(n * 100) / 100;
