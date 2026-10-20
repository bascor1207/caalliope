import { describeStoreFromEnv } from "@koda/analytics/node";
import { loadSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/**
 * Santé du dashboard : le store répond-il ? Hors session admin (voir proxy.ts) pour permettre une sonde externe ;
 * ne renvoie que l'état, jamais de données ni de détail d'infrastructure.
 */
export async function GET() {
  const store = describeStoreFromEnv(process.env);
  try {
    const s = await loadSummary(7);
    return Response.json({
      ok: true,
      store,
      events7d: s.events,
      realtime: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
  } catch (error) {
    console.error("[health] store indisponible", error);
    const message = error instanceof Error ? error.message.slice(0, 160) : "unknown";
    return Response.json({ ok: false, store, error: message }, { status: 503 });
  }
}
