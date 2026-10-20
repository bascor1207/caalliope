import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { AnalyticsEvent } from "./events";
import { type AnalyticsStore, inRange } from "./store";

/**
 * Fichier JSON Lines (développement) : append-only, lisible en parallèle par la boutique et l'admin
 * lancées sur la même machine. Jamais utilisé en production (système de fichiers éphémère sur Vercel).
 */
export function createFileStore(file: string): AnalyticsStore {
  return {
    async append(events) {
      if (events.length === 0) return;
      await mkdir(dirname(file), { recursive: true });
      await appendFile(file, `${events.map((e) => JSON.stringify(e)).join("\n")}\n`, "utf8");
    },
    async read(range) {
      const text = await readFile(file, "utf8").catch(() => "");
      const events: AnalyticsEvent[] = [];
      for (const line of text.split("\n")) {
        if (!line) continue;
        try {
          events.push(JSON.parse(line) as AnalyticsEvent);
        } catch {
          // ligne tronquée (écriture en cours) : ignorée
        }
      }
      return events.filter((e) => inRange(e, range));
    },
  };
}
