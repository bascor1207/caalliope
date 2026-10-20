import { type NextRequest, NextResponse } from "next/server";
import { PALETTE, PRODUCT_SOURCES } from "@/slices/catalog/public-server";

/** Catalogue tel qu'écrit dans le code : sert d'import initial au back-office (protégé par le même secret). */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ palette: PALETTE, products: PRODUCT_SOURCES });
}
