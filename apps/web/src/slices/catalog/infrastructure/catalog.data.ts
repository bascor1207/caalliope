import type { ColorSource, ProductSource } from "../domain/product-source";

/**
 * Catalogue KODA, importé depuis la boutique Shopify (scripts/import-shopify.mjs) puis
 * regroupé en trois familles déclinées par coloris. Photos : CDN Shopify.
 * Textes EN traduits à la main ; prix et matières = données boutique.
 */
export const PALETTE: Record<string, ColorSource> = {
  "vert-pastel": { key: "vert-pastel", name: { fr: "Vert pastel", en: "Pastel green" }, hex: "#BFD3C1" },
  "bleu-ciel": { key: "bleu-ciel", name: { fr: "Bleu ciel", en: "Sky blue" }, hex: "#BFD6EA" },
  "mauve-pastel": { key: "mauve-pastel", name: { fr: "Mauve pastel", en: "Pastel mauve" }, hex: "#CFC4E6" },
  rose: { key: "rose", name: { fr: "Rose", en: "Pink" }, hex: "#F0C8D0" },
  noir: { key: "noir", name: { fr: "Noir", en: "Black" }, hex: "#141414" },
  beige: { key: "beige", name: { fr: "Beige", en: "Beige" }, hex: "#E9D8B8" },
  blanc: { key: "blanc", name: { fr: "Blanc", en: "White" }, hex: "#F4F2EE" },
  "vert-olive": { key: "vert-olive", name: { fr: "Vert olive", en: "Olive green" }, hex: "#7E8B5E" },
  navy: { key: "navy", name: { fr: "Navy", en: "Navy" }, hex: "#2F3A4F" },
  violet: { key: "violet", name: { fr: "Violet", en: "Purple" }, hex: "#8E7CC3" },
};

export const PRODUCT_SOURCES: ProductSource[] = [
  {
    id: "pull-a-capuche-koda",
    slug: "pull-a-capuche-koda",
    sku: "KODA-HOODIE",
    type: "hoodie",
    name: {
      fr: "Pull à capuche Koda",
      en: "Koda Hoodie",
    },
    sub: {
      fr: "Oversized · 330 g/m²",
      en: "Oversized · 330 gsm",
    },
    price: 69.99,
    badge: {
      fr: "Signature",
      en: "Signature",
    },
    description: {
      fr: "Une coupe travaillée, parfaitement choisie : il tombe juste, structure la silhouette et s'adapte à toutes les morphologies. Douceur remarquable, tenue impeccable, résistance durable. Capuche à cordons ronds, manches montées, bords-côte aux manches et en bas, intérieur gratté. Mannequin 1m75 porte du S, mannequin 1m85 porte du M.",
      en: "A considered cut that sits just right, shapes the silhouette and suits every body type. Remarkably soft, holds its shape, built to last. Hood with round drawcords, set-in sleeves, ribbed cuffs and hem, brushed inside. Model 1m75 wears S, model 1m85 wears M.",
    },
    material: {
      fr: "70 % coton organique certifié, 30 % polyester recyclé certifié, 330 g/m²",
      en: "70% certified organic cotton, 30% certified recycled polyester, 330 gsm",
    },
    colorKeys: ["bleu-ciel", "rose", "beige", "blanc", "navy", "violet"],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    soldOut: [],
    soldOutByColor: {
      rose: ["2XL"],
    },
    images: [
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/bleucielmannequin.png?v=1775043014",
        alt: {
          fr: "Pull à capuche Koda bleu ciel",
          en: "Koda hoodie sky blue",
        },
        colorKey: "bleu-ciel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/61979d1e-7334-4c95-8687-cf606edc3cac.jpg?v=1775045298",
        alt: {
          fr: "Pull à capuche Koda bleu ciel (vue 2)",
          en: "Koda hoodie sky blue (view 2)",
        },
        colorKey: "bleu-ciel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage24avr.2026a21_13_42.png?v=1777055463",
        alt: {
          fr: "Pull à capuche Koda rose",
          en: "Koda hoodie pink",
        },
        colorKey: "rose",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_24_avr._2026_a_21_29_54.png?v=1777055473",
        alt: {
          fr: "Pull à capuche Koda rose (vue 2)",
          en: "Koda hoodie pink (view 2)",
        },
        colorKey: "rose",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026_23_31_43.png?v=1777412883",
        alt: {
          fr: "Pull à capuche Koda beige",
          en: "Koda hoodie beige",
        },
        colorKey: "beige",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026_23_26_33.png?v=1777412919",
        alt: {
          fr: "Pull à capuche Koda beige (vue 2)",
          en: "Koda hoodie beige (view 2)",
        },
        colorKey: "beige",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026_23_02_39.png?v=1777412983",
        alt: {
          fr: "Pull à capuche Koda blanc",
          en: "Koda hoodie white",
        },
        colorKey: "blanc",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026_23_24_18.png?v=1777412986",
        alt: {
          fr: "Pull à capuche Koda blanc (vue 2)",
          en: "Koda hoodie white (view 2)",
        },
        colorKey: "blanc",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage29avr.2026_00_04_43.png?v=1777413919",
        alt: {
          fr: "Pull à capuche Koda navy",
          en: "Koda hoodie navy",
        },
        colorKey: "navy",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026_23_56_08.png?v=1777413924",
        alt: {
          fr: "Pull à capuche Koda navy (vue 2)",
          en: "Koda hoodie navy (view 2)",
        },
        colorKey: "navy",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage30mars2026_20_04_43.png?v=1774893990",
        alt: {
          fr: "Pull à capuche Koda violet",
          en: "Koda hoodie purple",
        },
        colorKey: "violet",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage30mars2026_20_06_16.png?v=1774893990",
        alt: {
          fr: "Pull à capuche Koda violet (vue 2)",
          en: "Koda hoodie purple (view 2)",
        },
        colorKey: "violet",
      },
    ],
  },
  {
    id: "pull-oversized",
    slug: "pull-oversized",
    sku: "KODA-SWEAT",
    type: "sweat",
    name: {
      fr: "Pull oversized",
      en: "Oversized Sweatshirt",
    },
    sub: {
      fr: "Col rond · 300 g/m²",
      en: "Crew neck · 300 gsm",
    },
    price: 49.99,
    description: {
      fr: "Le pull oversized, coupe ample, style décontracté. Confort et douceur grâce à sa taille ample, pour une tenue avec laquelle on se sent bien. Col rond, taille et manches avec bords-côte, épaules tombantes, intérieur gratté. Unisexe. Mannequin 1m75 porte du S, mannequin 1m85 porte du M.",
      en: "The oversized sweatshirt: loose cut, relaxed style. Comfort and softness thanks to its generous fit, for an outfit you feel good in. Crew neck, ribbed hem and cuffs, drop shoulders, brushed inside. Unisex. Model 1m75 wears S, model 1m85 wears M.",
    },
    material: {
      fr: "65 % coton, 35 % polyester recyclé certifié, 300 g/m²",
      en: "65% cotton, 35% certified recycled polyester, 300 gsm",
    },
    colorKeys: ["beige", "blanc", "vert-olive", "noir"],
    sizes: ["XS", "S", "M", "L", "XL"],
    soldOut: [],
    soldOutByColor: {},
    images: [
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_5_juil._2026_a_23_14_42.png?v=1783286108",
        alt: {
          fr: "Pull oversized beige",
          en: "Oversized sweatshirt beige",
        },
        colorKey: "beige",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage28avr.2026a23_33_02.jpg?v=1777412126",
        alt: {
          fr: "Pull oversized beige (vue 2)",
          en: "Oversized sweatshirt beige (view 2)",
        },
        colorKey: "beige",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_21_34.png?v=1781288774",
        alt: {
          fr: "Pull oversized blanc",
          en: "Oversized sweatshirt white",
        },
        colorKey: "blanc",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage29avr.2026a14_10_09_35c018ba-13c3-438e-aafc-7a2574557dc5.jpg?v=1777464995",
        alt: {
          fr: "Pull oversized blanc (vue 2)",
          en: "Oversized sweatshirt white (view 2)",
        },
        colorKey: "blanc",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_22_45.png?v=1781288735",
        alt: {
          fr: "Pull oversized vert olive",
          en: "Oversized sweatshirt olive green",
        },
        colorKey: "vert-olive",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage29avr.2026a14_20_57_8028050f-ca20-4e87-a3a5-6c4e1d6e3ae8.jpg?v=1777465472",
        alt: {
          fr: "Pull oversized vert olive (vue 2)",
          en: "Oversized sweatshirt olive green (view 2)",
        },
        colorKey: "vert-olive",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_19_43.png?v=1781288446",
        alt: {
          fr: "Pull oversized noir",
          en: "Oversized sweatshirt black",
        },
        colorKey: "noir",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPTImage29avr.2026a14_30_25.jpg?v=1777466021",
        alt: {
          fr: "Pull oversized noir (vue 2)",
          en: "Oversized sweatshirt black (view 2)",
        },
        colorKey: "noir",
      },
    ],
  },
  {
    id: "t-shirt-koda",
    slug: "t-shirt-koda",
    sku: "KODA-TSHIRT",
    type: "tee",
    name: {
      fr: "T-shirt Koda",
      en: "Koda Tee",
    },
    sub: {
      fr: "Légèrement oversized · 180 g/m²",
      en: "Slightly oversized · 180 gsm",
    },
    price: 34.99,
    description: {
      fr: "Une coupe travaillée, parfaitement choisie : il tombe juste, structure la silhouette et s'adapte naturellement à toutes les morphologies. Douceur remarquable, tenue impeccable, résistance durable. Taille unisexe, coupe légèrement oversized : prends une taille en dessous de ta taille habituelle pour un rendu plus ajusté. Mannequin 1m75 porte du S, mannequin 1m85 porte du M.",
      en: "A considered cut that sits just right, shapes the silhouette and suits every body type. Remarkably soft, holds its shape, built to last. Unisex sizing, slightly oversized fit: go one size down from your usual size for a closer fit. Model 1m75 wears S, model 1m85 wears M.",
    },
    material: {
      fr: "60 % coton, 40 % polyester, 180 g/m²",
      en: "60% cotton, 40% polyester, 180 gsm",
    },
    colorKeys: ["vert-pastel", "bleu-ciel", "mauve-pastel", "rose", "noir"],
    sizes: ["XS", "S", "M", "L", "XL"],
    soldOut: [],
    soldOutByColor: {},
    images: [
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/kodavertpastel.png?v=1783811016",
        alt: {
          fr: "T-shirt Koda vert pastel",
          en: "Koda tee pastel green",
        },
        colorKey: "vert-pastel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_19_37_47.png?v=1781287508",
        alt: {
          fr: "T-shirt Koda vert pastel (vue 2)",
          en: "Koda tee pastel green (view 2)",
        },
        colorKey: "vert-pastel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_08_42.png?v=1781287745",
        alt: {
          fr: "T-shirt Koda bleu ciel",
          en: "Koda tee sky blue",
        },
        colorKey: "bleu-ciel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/kodableupastel.png?v=1783591026",
        alt: {
          fr: "T-shirt Koda bleu ciel (vue 2)",
          en: "Koda tee sky blue (view 2)",
        },
        colorKey: "bleu-ciel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/kodamauvepastel.png?v=1783811062",
        alt: {
          fr: "T-shirt Koda mauve pastel",
          en: "Koda tee pastel mauve",
        },
        colorKey: "mauve-pastel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_03_26.png?v=1781287848",
        alt: {
          fr: "T-shirt Koda mauve pastel (vue 2)",
          en: "Koda tee pastel mauve (view 2)",
        },
        colorKey: "mauve-pastel",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_12_juin_2026_a_20_13_29.png?v=1781288029",
        alt: {
          fr: "T-shirt Koda rose",
          en: "Koda tee pink",
        },
        colorKey: "rose",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/kodarosepastel.png?v=1783591053",
        alt: {
          fr: "T-shirt Koda rose (vue 2)",
          en: "Koda tee pink (view 2)",
        },
        colorKey: "rose",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/ChatGPT_Image_18_juin_2026_a_20_59_59.png?v=1781809224",
        alt: {
          fr: "T-shirt Koda noir",
          en: "Koda tee black",
        },
        colorKey: "noir",
      },
      {
        src: "https://cdn.shopify.com/s/files/1/0939/9871/1162/files/kodanoir.png?v=1783590957",
        alt: {
          fr: "T-shirt Koda noir (vue 2)",
          en: "Koda tee black (view 2)",
        },
        colorKey: "noir",
      },
    ],
  },
];
