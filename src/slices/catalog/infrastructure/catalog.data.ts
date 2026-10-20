import type { ColorSource, ProductSource } from "../domain/product-source";

/**
 * Données in-memory du Drop 01, multilingues.
 * `images` vides : silhouettes SVG teintées en attendant les vraies photos (scripts/import-shopify.mjs).
 */
export const PALETTE: Record<string, ColorSource> = {
  sauge: { key: "sauge", name: { fr: "Sauge", en: "Sage" }, hex: "#BFD3C1" },
  lavande: { key: "lavande", name: { fr: "Lavande", en: "Lavender" }, hex: "#CFC4E6" },
  sable: { key: "sable", name: { fr: "Sable", en: "Sand" }, hex: "#E9D8B8" },
  ciel: { key: "ciel", name: { fr: "Ciel", en: "Sky" }, hex: "#BFD6EA" },
  argile: { key: "argile", name: { fr: "Argile", en: "Clay" }, hex: "#E8B8A6" },
  craie: { key: "craie", name: { fr: "Craie", en: "Chalk" }, hex: "#ECE8E1" },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ORGANIC_400 = { fr: "100 % coton biologique, 400 g/m²", en: "100% organic cotton, 400 gsm" };
const ORGANIC_240 = { fr: "100 % coton biologique, 240 g/m²", en: "100% organic cotton, 240 gsm" };

export const PRODUCT_SOURCES: ProductSource[] = [
  {
    id: "hoodie-origine",
    slug: "hoodie-origine",
    sku: "KD-H01",
    type: "hoodie",
    name: { fr: "Hoodie Origine", en: "Origine Hoodie" },
    sub: { fr: "Oversize · 400 g/m²", en: "Oversized · 400 gsm" },
    price: 68,
    badge: { fr: "Best-seller", en: "Best-seller" },
    description: {
      fr: "Le hoodie qu'on voulait porter tous les jours. Molleton bio 400 g/m² brossé à l'intérieur, coupe oversize épaules tombantes, logo KODA brodé poitrine.",
      en: "The hoodie we wanted to wear every day. 400 gsm organic fleece brushed inside, oversized drop-shoulder fit, embroidered KODA chest logo.",
    },
    material: ORGANIC_400,
    colorKeys: ["sauge", "lavande", "sable"],
    sizes: SIZES,
    soldOut: ["XXL"],
    images: [],
  },
  {
    id: "tee-essentiel",
    slug: "t-shirt-essentiel",
    sku: "KD-T01",
    type: "tee",
    name: { fr: "T-shirt Essentiel", en: "Essentiel Tee" },
    sub: { fr: "Boxy · 240 g/m²", en: "Boxy · 240 gsm" },
    price: 38,
    badge: { fr: "Nouveau", en: "New" },
    description: {
      fr: "Un tee lourd, boxy, qui tient ses épaules. Jersey bio 240 g/m², col côtelé qui ne se déforme pas, logo brodé.",
      en: "A heavy, boxy tee that holds its shoulders. 240 gsm organic jersey, ribbed collar that keeps its shape, embroidered logo.",
    },
    material: ORGANIC_240,
    colorKeys: ["ciel", "argile", "craie"],
    sizes: SIZES,
    soldOut: [],
    images: [],
  },
  {
    id: "hoodie-zip",
    slug: "hoodie-zip-origine",
    sku: "KD-H02",
    type: "hoodie",
    name: { fr: "Hoodie Zip Origine", en: "Origine Zip Hoodie" },
    sub: { fr: "Oversize · 400 g/m²", en: "Oversized · 400 gsm" },
    price: 78,
    badge: { fr: "Édition limitée", en: "Limited edition" },
    description: {
      fr: "La version zippée, même molleton 400 g/m², zip métal mat ton sur ton, poches plaquées.",
      en: "The zip version, same 400 gsm fleece, tonal matte metal zip, patch pockets.",
    },
    material: ORGANIC_400,
    colorKeys: ["sable", "sauge"],
    sizes: ["S", "M", "L", "XL"],
    soldOut: ["S"],
    images: [],
  },
  {
    id: "tee-ls",
    slug: "t-shirt-manches-longues",
    sku: "KD-T02",
    type: "tee",
    name: { fr: "T-shirt Manches longues", en: "Long Sleeve Tee" },
    sub: { fr: "Boxy · 240 g/m²", en: "Boxy · 240 gsm" },
    price: 44,
    description: {
      fr: "L'Essentiel en manches longues, bords-côtes aux poignets, même jersey bio 240 g/m².",
      en: "The Essentiel with long sleeves, ribbed cuffs, same 240 gsm organic jersey.",
    },
    material: ORGANIC_240,
    colorKeys: ["craie", "lavande", "ciel"],
    sizes: ["XS", "S", "M", "L", "XL"],
    soldOut: [],
    images: [],
  },
  {
    id: "pack-duo",
    slug: "pack-duo",
    sku: "KD-P01",
    type: "pack",
    name: { fr: "Pack Duo", en: "Duo Pack" },
    sub: { fr: "Hoodie + T-shirt · -15 %", en: "Hoodie + Tee · -15%" },
    price: 90,
    compare: 106,
    badge: { fr: "-15 %", en: "-15%" },
    description: {
      fr: "Le hoodie Origine et le tee Essentiel, dans les coloris de ton choix. Le combo qu'on porte nous-mêmes.",
      en: "The Origine hoodie and the Essentiel tee, in the colours of your choice. The combo we wear ourselves.",
    },
    material: { fr: "100 % coton biologique", en: "100% organic cotton" },
    colorKeys: ["sauge", "lavande", "sable"],
    sizes: ["XS", "S", "M", "L", "XL"],
    soldOut: [],
    images: [],
  },
  {
    id: "beanie",
    slug: "bonnet-cotele",
    sku: "KD-A01",
    type: "acc",
    name: { fr: "Bonnet Côtelé", en: "Ribbed Beanie" },
    sub: { fr: "Laine mérinos", en: "Merino wool" },
    price: 28,
    description: {
      fr: "Bonnet côtelé en mérinos, revers brodé. Taille unique.",
      en: "Ribbed merino beanie, embroidered cuff. One size.",
    },
    material: { fr: "100 % laine mérinos", en: "100% merino wool" },
    colorKeys: ["sauge", "argile", "craie"],
    sizes: ["TU"],
    soldOut: [],
    images: [],
  },
];
