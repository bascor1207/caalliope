import { type NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/shared/kernel/locale";
import { catalogRepository } from "@/slices/catalog/public-server";

/** Catalogue frais (sans cache) : relu par les navigateurs quand la base change (temps réel). */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("locale") ?? "fr";
  const locale = isLocale(raw) ? raw : "fr";
  const products = await (catalogRepository.listProductsFresh?.(locale) ?? catalogRepository.listProducts(locale));
  return NextResponse.json({ products }, { headers: { "cache-control": "no-store" } });
}
