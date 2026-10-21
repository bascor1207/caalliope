import { getSql, hasDatabase } from "@koda/db";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Sonde : base joignable ? Protégée par REVALIDATE_SECRET ; ne renvoie jamais d'identifiant complet. */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ ok: true }, { status: 200 });
  const ctx = (globalThis as Record<symbol, unknown>)[Symbol.for("__cloudflare-context__")] as
    | { env?: { HYPERDRIVE?: { connectionString?: string } } }
    | undefined;
  const hyperdrive = ctx?.env?.HYPERDRIVE?.connectionString;
  const info: Record<string, unknown> = {
    hasDatabase: hasDatabase(),
    hyperdrive: hyperdrive ? hyperdrive.replace(/\/\/([^:]+):[^@]+@/, "//$1:***@") : null,
    databaseUrlEnv: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/\/\/([^:]+):[^@]+@/, "//$1:***@")
      : null,
  };
  try {
    const started = Date.now();
    const [row] = await getSql()<
      { n: string; user: string }[]
    >`SELECT count(*)::text AS n, current_user AS user FROM catalog_products`;
    info.query = { products: Number(row?.n), user: row?.user, ms: Date.now() - started };
  } catch (error) {
    info.error = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }
  return NextResponse.json(info, { headers: { "cache-control": "no-store" } });
}
