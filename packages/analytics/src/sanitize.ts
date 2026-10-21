import { type AnalyticsEvent, type EventItem, type EventProps, isEventName, type Primitive } from "./events";

export interface SanitizeOptions {
  now: () => Date;
  /** Au-delà, l'horodatage client est ignoré (remplacé par `now`). */
  maxAgeDays?: number;
  maxBatch?: number;
}

const MAX_PROPS = 16;
const MAX_STRING = 120;
const MAX_ITEMS = 30;

const primitive = (v: unknown): Primitive | undefined =>
  typeof v === "string" ? v.slice(0, MAX_STRING) : typeof v === "number" || typeof v === "boolean" ? v : undefined;

/** Lignes d'une commande : petits objets de primitives, bornés en nombre et en clés. */
const items = (v: unknown): EventItem[] | undefined => {
  if (!Array.isArray(v)) return undefined;
  const out: EventItem[] = [];
  for (const raw of v.slice(0, MAX_ITEMS)) {
    if (!raw || typeof raw !== "object") continue;
    const item: EventItem = {};
    for (const [k, x] of Object.entries(raw as Record<string, unknown>).slice(0, 8)) {
      const p = primitive(x);
      if (p !== undefined) item[k.slice(0, 40)] = p;
    }
    out.push(item);
  }
  return out;
};

/** Valide et nettoie un lot d'événements reçu du navigateur. Pure : ne touche aucun stockage. */
export function sanitizeEvents(
  payload: unknown,
  { now, maxAgeDays = 90, maxBatch = 50 }: SanitizeOptions,
): AnalyticsEvent[] {
  if (!Array.isArray(payload)) return [];
  const current = now();
  const oldest = current.getTime() - maxAgeDays * 86_400_000;
  const newest = current.getTime() + 60_000;
  const events: AnalyticsEvent[] = [];
  for (const raw of payload.slice(0, maxBatch)) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    if (!isEventName(e.name)) continue;
    const props: EventProps = {};
    if (e.props && typeof e.props === "object") {
      for (const [k, v] of Object.entries(e.props as Record<string, unknown>).slice(0, MAX_PROPS)) {
        const p = primitive(v);
        if (p !== undefined) props[k.slice(0, 40)] = p;
        else if (k === "items") {
          const list = items(v);
          if (list) props.items = list;
        }
      }
    }
    const claimed = typeof e.at === "string" ? Date.parse(e.at) : Number.NaN;
    const at = Number.isFinite(claimed) && claimed >= oldest && claimed <= newest ? new Date(claimed) : current;
    events.push({
      name: e.name,
      at: at.toISOString(),
      session: String(e.session ?? "").slice(0, 40),
      path: String(e.path ?? "/").slice(0, 200),
      locale: String(e.locale ?? "fr").slice(0, 5),
      props,
    });
  }
  return events;
}
