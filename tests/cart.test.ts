import { describe, expect, it } from "vitest";
import { addLine, countOf, emptyCart, type NewCartLine, removeLine, setQty, totalsOf } from "@/slices/cart/domain/cart";

const hoodie: NewCartLine = {
  productId: "pull-a-capuche-koda",
  slug: "pull-a-capuche-koda",
  name: "Pull à capuche Koda",
  productType: "hoodie",
  colorKey: "bleu-ciel",
  colorName: "Bleu ciel",
  colorHex: "#BFD6EA",
  size: "M",
  unitPrice: 68,
};

describe("domaine panier", () => {
  it("fusionne les lignes identiques et calcule les totaux avec livraison offerte dès 80 €", () => {
    let cart = addLine(emptyCart(), hoodie);
    cart = addLine(cart, hoodie);
    cart = addLine(cart, { ...hoodie, size: "L" });
    expect(cart.lines).toHaveLength(2);
    expect(countOf(cart)).toBe(3);
    expect(totalsOf(cart)).toEqual({ subtotal: 204, shipping: 0, total: 204 });
  });

  it("facture la livraison sous le seuil", () => {
    const cart = addLine(emptyCart(), { ...hoodie, unitPrice: 38 });
    expect(totalsOf(cart)).toEqual({ subtotal: 38, shipping: 4.9, total: 42.9 });
  });

  it("plafonne la quantité et supprime une ligne à zéro", () => {
    let cart = addLine(emptyCart(), hoodie, 15);
    expect(cart.lines[0].qty).toBe(10);
    cart = setQty(cart, cart.lines[0].key, 0);
    expect(cart.lines).toHaveLength(0);
    cart = removeLine(addLine(emptyCart(), hoodie), "nope");
    expect(cart.lines).toHaveLength(1);
  });
});
