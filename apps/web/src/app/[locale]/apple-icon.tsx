import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { brandLogoPng } from "@/shared/seo/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Icône iOS (écran d'accueil) : logo de marque si déposé, sinon « K » sur fond crème. */
export default async function AppleIcon() {
  const logo = await brandLogoPng();
  if (logo) return new Response(new Uint8Array(logo), { headers: { "content-type": contentType } });
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F6F1EA",
        color: "#141414",
        fontSize: 110,
        fontWeight: 900,
        fontFamily: "sans-serif",
        letterSpacing: -6,
      }}
    >
      K
    </div>,
    size,
  );
}
