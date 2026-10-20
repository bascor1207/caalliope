import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { brandLogoPng } from "@/shared/seo/brand-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Favicon : le logo de marque s'il est déposé (public/media/koda-logo.png), sinon un « K » généré. */
export default async function Icon() {
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
        background: "#141414",
        color: "#F6F1EA",
        borderRadius: 110,
        fontSize: 300,
        fontWeight: 900,
        fontFamily: "sans-serif",
        letterSpacing: -20,
      }}
    >
      K
    </div>,
    size,
  );
}
