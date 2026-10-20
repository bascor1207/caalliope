import type { MetadataRoute } from "next";
import { SITE } from "@/shared/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: "Hoodies & t-shirts premium, nés d'une amitié.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F1EA",
    theme_color: "#F6F1EA",
    lang: "fr",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
