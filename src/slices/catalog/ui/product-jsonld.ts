import { absoluteUrl, SITE } from "@/shared/config/site";
import { FREE_SHIPPING_FROM } from "@/shared/kernel/shipping-policy";
import type { Product } from "../domain/product";

/** JSON-LD Product (schema.org). `url` et `image` sont fournis par la page, qui connaît la locale. */
export const productJsonLd = (product: Product, url: string, ogImage: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": absoluteUrl(url),
  name: product.name,
  sku: product.sku,
  brand: { "@type": "Brand", name: SITE.name },
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
    priceValidUntil: "2026-12-31",
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
