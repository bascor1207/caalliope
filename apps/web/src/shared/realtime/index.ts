import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const realtimeConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

const supabase = () => {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return client;
};

export interface RowChange<T = Record<string, unknown>> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Partial<T>;
  old: Partial<T>;
}

/**
 * Écoute les changements d'une table publiée dans `supabase_realtime` (une connexion WebSocket par onglet,
 * partagée entre les abonnements). Retourne la désinscription. Sans configuration : no-op.
 */
export function subscribeToTable<T = Record<string, unknown>>(
  table: string,
  onChange: (change: RowChange<T>) => void,
): () => void {
  if (!realtimeConfigured()) return () => {};
  const channel = supabase()
    .channel(`table:${table}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, (payload) =>
      onChange({
        eventType: payload.eventType,
        new: (payload.new ?? {}) as Partial<T>,
        old: (payload.old ?? {}) as Partial<T>,
      }),
    )
    .subscribe();
  return () => {
    void supabase().removeChannel(channel);
  };
}
