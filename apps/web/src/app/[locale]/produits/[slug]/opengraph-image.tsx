import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/kernel/locale";
import { catalogRepository, getProduct, listProducts } from "@/slices/catalog/public-server";

export const alt = "KODA Clothing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const products = await listProducts(catalogRepository, routing.defaultLocale);
  return routing.locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

/** Image Open Graph générée par produit et par locale : zéro asset à maintenir. */
export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  const product = await getProduct(catalogRepository, slug, locale);
  const hex = product?.colors[0]?.hex ?? "#BFD3C1";
  const name = product?.name ?? "KODA Clothing";
  const sub = product ? `${product.sub} · ${product.price} €` : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: `linear-gradient(135deg, #F6F1EA 0%, ${hex} 70%)`,
        padding: 72,
        fontFamily: "sans-serif",
        color: "#141414",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -3 }}>KODA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -5, lineHeight: 1 }}>{name}</div>
          <div style={{ fontSize: 34, marginTop: 20, opacity: 0.7 }}>{sub}</div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.6 }}>
          {`Drop 01 · ${locale === "fr" ? "Précommande" : "Pre-order"} · kodaclothing.fr`}
        </div>
      </div>
    </div>,
    size,
  );
}
