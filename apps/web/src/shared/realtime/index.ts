import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseBrowser } from "@/shared/supabase/browser";

export const realtimeConfigured = isSupabaseConfigured;

export interface RowChange<T = Record<string, unknown>> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Partial<T>;
  old: Partial<T>;
}

/**
 * Écoute les changements d'une table publiée dans `supabase_realtime`, sur le client Supabase partagé
 * (une seule connexion WebSocket par onglet). Retourne la désinscription. Sans configuration : no-op.
 */
export function subscribeToTable<T = Record<string, unknown>>(
  table: string,
  onChange: (change: RowChange<T>) => void,
): () => void {
  if (!realtimeConfigured()) return () => {};
  const supabase = supabaseBrowser();
  const channel = supabase
    .channel(`table:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) =>
        onChange({
          eventType: payload.eventType,
          new: (payload.new ?? {}) as Partial<T>,
          old: (payload.old ?? {}) as Partial<T>,
        }),
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
