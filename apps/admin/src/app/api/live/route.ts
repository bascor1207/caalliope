import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
/** Durée max d'une connexion SSE sur Vercel ; le navigateur se reconnecte tout seul ensuite. */
export const maxDuration = 300;

const KEEPALIVE_MS = 25_000;

/**
 * Flux Server-Sent Events relayant les insertions de `analytics_events` reçues de Supabase Realtime.
 * Le relais tourne côté serveur avec la clé de service : aucune clé Supabase n'atteint le navigateur,
 * et la route est derrière la session admin comme le reste (proxy.ts).
 * Sans configuration Supabase : 204, le dashboard se rabat sur un rafraîchissement périodique.
 */
export function GET(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new Response(null, { status: 204 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      const client = createClient(url, key, { auth: { persistSession: false } });
      const channel = client
        .channel("analytics-events")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "analytics_events" }, (payload) => {
          const row = payload.new as { name?: string; at?: string; path?: string };
          send("event", { name: row.name, at: row.at, path: row.path });
        })
        .subscribe((status) => send("status", { status }));
      const keepalive = setInterval(() => controller.enqueue(encoder.encode(": ping\n\n")), KEEPALIVE_MS);
      const close = () => {
        clearInterval(keepalive);
        void client.removeChannel(channel);
        try {
          controller.close();
        } catch {
          // déjà fermé
        }
      };
      request.signal.addEventListener("abort", close);
      send("status", { status: "CONNECTING" });
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
