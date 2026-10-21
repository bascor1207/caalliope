/**
 * Domaine analytics côté boutique. Les contrats d'événements et la synthèse vivent dans `@koda/analytics`
 * (partagés avec l'admin) ; ici, seules les règles propres au navigateur.
 */
export {
  type AnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsSummary,
  type EventProps,
  summarize,
} from "@koda/analytics";

const SESSION_KEY = "koda.session";

/** Identifiant de session anonyme, stocké en sessionStorage (vie de l'onglet). */
export function sessionIdFrom(storage: Pick<Storage, "getItem" | "setItem"> | null, random: () => string): string {
  const existing = storage?.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = random();
  storage?.setItem(SESSION_KEY, id);
  return id;
}

/** Cible d'un clic mesuré : l'attribut `data-track` le plus proche de l'élément cliqué. */
export function clickTarget(element: {
  closest(selector: string): { getAttribute(name: string): string | null } | null;
}): string | null {
  const target = element.closest("[data-track]");
  return target?.getAttribute("data-track") || null;
}

export const OPT_OUT_KEY = "koda.analytics";

/** Clé locale posée par la slice auth : un admin connecté n'alimente pas les statistiques. */
export const ROLE_KEY = "koda.role";

/** Navigateur de l'équipe (`?koda_internal=1` une fois, ou cookie `koda_internal=1`) : jamais compté. */
export const INTERNAL_KEY = "koda.internal";

/** Opposition à la mesure d'audience (stockée localement, jamais envoyée), admin connecté ou navigateur interne. */
export const isOptedOut = (storage: Pick<Storage, "getItem"> | null, cookie = ""): boolean =>
  storage?.getItem(OPT_OUT_KEY) === "off" ||
  storage?.getItem(ROLE_KEY) === "admin" ||
  storage?.getItem(INTERNAL_KEY) === "1" ||
  /(?:^|;\s*)koda_internal=1(?:;|$)/.test(cookie);

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
}

const ATTRIBUTION_KEY = "koda.source";

/**
 * Provenance de la session, figée au premier chargement (premier contact) : utm_* de l'URL et referrer.
 * Renvoie `{ attribution, isNew }` ; `isNew` déclenche l'événement `session_start`.
 */
export function attributionFrom(
  storage: Pick<Storage, "getItem" | "setItem"> | null,
  search: string,
  referrer: string,
  host: string,
): { attribution: Attribution; isNew: boolean } {
  const existing = storage?.getItem(ATTRIBUTION_KEY);
  if (existing) {
    try {
      return { attribution: JSON.parse(existing) as Attribution, isNew: false };
    } catch {
      /* valeur illisible : on recalcule */
    }
  }
  const params = new URLSearchParams(search);
  let ref = "";
  try {
    const u = referrer ? new URL(referrer) : null;
    ref = u && u.hostname !== host ? u.origin : "";
  } catch {
    ref = "";
  }
  const attribution: Attribution = {
    source: (params.get("utm_source") ?? "").slice(0, 60),
    medium: (params.get("utm_medium") ?? "").slice(0, 60),
    campaign: (params.get("utm_campaign") ?? "").slice(0, 80),
    referrer: ref,
  };
  storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return { attribution, isNew: true };
}
