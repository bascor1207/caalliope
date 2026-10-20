import { absoluteUrl, SITE } from "@/shared/config/site";
import { FREE_SHIPPING_FROM } from "@/shared/kernel/shipping-policy";
import { isSizeAvailable, type Product } from "../domain/product";

const priceValidUntil = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

const GOOGLE_CATEGORY = "Apparel & Accessories > Clothing > Shirts & Tops";

/** JSON-LD Product (schema.org). `url` et `image` sont fournis par la page, qui connaît la locale. */
export const productJsonLd = (product: Product, url: string, ogImage: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": absoluteUrl(url),
  name: product.name,
  sku: product.sku,
  brand: { "@type": "Brand", name: SITE.name },
  category: GOOGLE_CATEGORY,
  image: product.images.length ? product.images.map((i) => i.src) : [absoluteUrl(ogImage)],
  description: product.description,
  color: product.colors.map((c) => c.name).join(", "),
  material: product.material,
  size: product.sizes.join(", "),
  audience: { "@type": "PeopleAudience", suggestedGender: "unisex" },
  offers: {
    "@type": "Offer",
    url: absoluteUrl(url),
    priceCurrency: "EUR",
    price: product.price.toFixed(2),
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    priceValidUntil: priceValidUntil(),
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "EUR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "FR" },
      description: `Free shipping from ${FREE_SHIPPING_FROM} €`,
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "FR",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  },
});

export const itemListJsonLd = (items: Array<{ product: Product; url: string; ogImage: string }>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${SITE.shortName} — ${SITE.collectionName}`,
  numberOfItems: items.length,
  itemListElement: items.map(({ product, url, ogImage }, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: productJsonLd(product, url, ogImage),
  })),
});

/**
 * JSON-LD ProductGroup : une variante par coloris × taille, avec sa disponibilité réelle et ses photos.
 * C'est le balisage que Google attend pour les fiches produit à variantes (résultats enrichis, listings marchands).
 */
export const productGroupJsonLd = (product: Product, url: string, ogImage: string) => {
  const base = productJsonLd(product, url, ogImage);
  const { offers: _offers, ...group } = base;
  return {
    ...group,
    "@type": "ProductGroup",
    productGroupID: product.sku,
    variesBy: ["https://schema.org/color", "https://schema.org/size"],
    hasVariant: product.colors.flatMap((color) => {
      const images = product.images.filter((i) => i.colorKey === color.key).map((i) => i.src);
      return product.sizes.map((size) => ({
        "@type": "Product",
        sku: `${product.sku}-${color.key}-${size}`.toUpperCase(),
        name: `${product.name} ${color.name} ${size}`,
        color: color.name,
        size,
        image: images.length ? images : base.image,
        offers: {
          "@type": "Offer",
          url: `${absoluteUrl(url)}?coloris=${color.key}`,
          priceCurrency: "EUR",
          price: product.price.toFixed(2),
          availability: isSizeAvailable(product, size, color.key)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: priceValidUntil(),
          shippingDetails: base.offers.shippingDetails,
          hasMerchantReturnPolicy: base.offers.hasMerchantReturnPolicy,
        },
      }));
    }),
  };
};
