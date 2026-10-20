import { routing } from "@/i18n/routing";
import { absoluteUrl, SITE } from "@/shared/config/site";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/shared/kernel/shipping-policy";
import { pathFor } from "@/shared/seo/metadata";
import { catalogRepository, isSizeAvailable, listProducts } from "@/slices/catalog/public-server";

export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TYPE_LABEL: Record<string, string> = {
  hoodie: "Hoodies",
  sweat: "Sweats",
  tee: "T-shirts",
  pack: "Packs",
  acc: "Accessoires",
};

/**
 * Flux produits Google Merchant Center (fiches gratuites dans l'onglet Shopping) : un article par coloris × taille,
 * regroupés par `item_group_id`, disponibilité réelle, photos par coloris. À déclarer dans Merchant Center → Flux.
 */
export async function GET() {
  const locale = routing.defaultLocale;
  const products = await listProducts(catalogRepository, locale);
  const items = products.flatMap((p) =>
    p.colors.flatMap((color) => {
      const images = p.images.filter((i) => i.colorKey === color.key).map((i) => i.src);
      const [main, ...extra] = images.length ? images : p.images.map((i) => i.src);
      if (!main) return [];
      const link = `${absoluteUrl(pathFor(locale, "/produits/[slug]", { slug: p.slug }))}?coloris=${color.key}`;
      return p.sizes.map(
        (size) => `
    <item>
      <g:id>${esc(`${p.sku}-${color.key}-${size}`.toUpperCase())}</g:id>
      <g:item_group_id>${esc(p.sku)}</g:item_group_id>
      <g:title>${esc(`${p.name} ${color.name} · ${size}`)}</g:title>
      <g:description>${esc(p.description)}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(main)}</g:image_link>${extra.map((src) => `\n      <g:additional_image_link>${esc(src)}</g:additional_image_link>`).join("")}
      <g:availability>${isSizeAvailable(p, size, color.key) ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.price.toFixed(2)} EUR</g:price>${p.compare ? `\n      <g:sale_price>${p.price.toFixed(2)} EUR</g:sale_price>` : ""}
      <g:brand>${esc(SITE.name)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Shirts &amp; Tops</g:google_product_category>
      <g:product_type>${esc(TYPE_LABEL[p.type] ?? p.type)}</g:product_type>
      <g:gender>unisex</g:gender>
      <g:age_group>adult</g:age_group>
      <g:color>${esc(color.name)}</g:color>
      <g:size>${esc(size)}</g:size>
      <g:material>${esc(p.material)}</g:material>
      <g:shipping><g:country>FR</g:country><g:price>${SHIPPING_FEE.toFixed(2)} EUR</g:price></g:shipping>
      <g:shipping><g:country>FR</g:country><g:min_handling_time>0</g:min_handling_time><g:price>0.00 EUR</g:price><g:min_transit_time>1</g:min_transit_time><g:region>Livraison offerte dès ${FREE_SHIPPING_FROM} €</g:region></g:shipping>
    </item>`,
      );
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${esc(SITE.url)}</link>
    <description>${esc(SITE.tagline)}</description>${items.join("")}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
