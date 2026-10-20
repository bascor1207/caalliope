import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/shared/kernel/locale";

export const alt = "KODA Clothing — Hoodies, sweats et t-shirts premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const headline = locale === "fr" ? "Porte ce qui te ressemble." : "Wear what feels like you.";
  const sub =
    locale === "fr"
      ? "Hoodies, sweats & t-shirts premium · Coton organique, brodé"
      : "Premium hoodies, sweats & tees · Organic cotton, embroidered";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #BFD3C1 0%, #F6F1EA 45%, #CFC4E6 100%)",
        padding: 72,
        fontFamily: "sans-serif",
        color: "#141414",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -3 }}>KODA</div>
        <div style={{ fontSize: 110, fontWeight: 900, letterSpacing: -6, lineHeight: 0.95 }}>{headline}</div>
        <div style={{ fontSize: 28, opacity: 0.65 }}>{`${sub} · kodaclothing.fr`}</div>
      </div>
    </div>,
    size,
  );
}
