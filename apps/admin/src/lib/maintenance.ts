import { getSql, hasDatabase } from "@koda/db";

/** Remet les statistiques à zéro (événements d'usage). Les commandes, comptes et inscrits ne sont pas touchés. */
export async function resetAnalytics(): Promise<number> {
  if (!hasDatabase()) return 0;
  const rows = await getSql()<{ id: unknown }[]>`DELETE FROM analytics_events RETURNING id`;
  return rows.length;
}
