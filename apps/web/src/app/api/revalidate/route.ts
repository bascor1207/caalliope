import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/** Appelé par le back-office après un changement de réglage : invalide le cache du tag demandé. */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const tag = request.nextUrl.searchParams.get("tag") ?? "settings";
  if (!/^[a-z0-9-]{1,40}$/.test(tag)) return NextResponse.json({ ok: false }, { status: 400 });
  revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, tag });
}
