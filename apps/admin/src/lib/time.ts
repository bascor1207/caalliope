/**
 * Dates saisies dans le back-office (`<input type="datetime-local">`, sans fuseau) : elles sont toujours lues en
 * heure de Paris, quel que soit le serveur (Vercel tourne en UTC) ou le navigateur.
 */
export const ADMIN_TIME_ZONE = "Europe/Paris";

const parts = (date: Date) => {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: ADMIN_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const map = Object.fromEntries(f.formatToParts(date).map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
};

/** ISO (UTC) → valeur « YYYY-MM-DDTHH:mm » pour un champ datetime-local, en heure de Paris. */
export const toParisLocal = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : parts(d);
};

/** « YYYY-MM-DDTHH:mm » saisi en heure de Paris → ISO UTC (gère l'heure d'été). Une date déjà en ISO/UTC est gardée. */
export const fromParisLocal = (local?: string | null): string | undefined => {
  if (!local) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(local);
  if (!m) {
    const d = new Date(local);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  const [, y, mo, d, h, mi] = m.map(Number);
  let guess = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 3; i += 1) {
    const seen = parts(new Date(guess));
    if (seen === local.slice(0, 16)) break;
    const [sy, smo, sd, sh, smi] = seen.split(/[-T:]/).map(Number);
    guess -= Date.UTC(sy, smo - 1, sd, sh, smi) - Date.UTC(y, mo - 1, d, h, mi);
  }
  return new Date(guess).toISOString();
};
