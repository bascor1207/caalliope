import { sanitizeEvents } from "@koda/analytics";
import { analyticsStore } from "./container";

/** Valide et nettoie un lot d'événements reçu du navigateur avant de l'écrire dans le store. */
export async function ingest(payload: unknown): Promise<number> {
  const events = sanitizeEvents(payload, { now: () => new Date() });
  if (events.length) await analyticsStore.append(events);
  return events.length;
}
