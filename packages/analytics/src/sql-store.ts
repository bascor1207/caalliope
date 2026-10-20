import type { AnalyticsEvent } from "./events";
import { isEventName } from "./events";
import type { AnalyticsStore } from "./store";

/** Exécuteur SQL minimal (requête paramétrée → lignes), implémenté par Neon en prod et PGlite en test. */
export type SqlExecutor = (text: string, params: unknown[]) => Promise<Record<string, unknown>[]>;

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS analytics_events (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  at timestamptz NOT NULL,
  session text NOT NULL,
  path text NOT NULL,
  locale text NOT NULL,
  props jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS analytics_events_at_idx ON analytics_events (at);
`;

const CHUNK = 100;
const COLUMNS = ["name", "at", "session", "path", "locale", "props"] as const;

const toEvent = (row: Record<string, unknown>): AnalyticsEvent | null => {
  if (!isEventName(row.name)) return null;
  const at = row.at instanceof Date ? row.at : new Date(String(row.at));
  const props = typeof row.props === "string" ? JSON.parse(row.props) : (row.props ?? {});
  return {
    name: row.name,
    at: at.toISOString(),
    session: String(row.session),
    path: String(row.path),
    locale: String(row.locale),
    props: props as AnalyticsEvent["props"],
  };
};

/** Store Postgres : une table append-only, lecture par période. Le schéma est créé à la première requête. */
export function createSqlStore(exec: SqlExecutor): AnalyticsStore {
  let ready: Promise<void> | null = null;
  const ensure = () => {
    ready ??= (async () => {
      for (const statement of SCHEMA_SQL.split(";")
        .map((s) => s.trim())
        .filter(Boolean))
        await exec(statement, []);
    })();
    return ready;
  };
  return {
    async append(events) {
      if (events.length === 0) return;
      await ensure();
      for (let i = 0; i < events.length; i += CHUNK) {
        const chunk = events.slice(i, i + CHUNK);
        const params: unknown[] = [];
        const rows = chunk.map((e) => {
          const base = params.length;
          params.push(e.name, e.at, e.session, e.path, e.locale, JSON.stringify(e.props));
          return `(${COLUMNS.map((_, j) => `$${base + j + 1}`).join(", ")})`;
        });
        await exec(`INSERT INTO analytics_events (${COLUMNS.join(", ")}) VALUES ${rows.join(", ")}`, params);
      }
    },
    async read(range) {
      await ensure();
      const rows = await exec(
        "SELECT name, at, session, path, locale, props FROM analytics_events WHERE at >= $1 AND at <= $2 ORDER BY at ASC LIMIT 200000",
        [range.from.toISOString(), range.to.toISOString()],
      );
      return rows.map(toEvent).filter((e): e is AnalyticsEvent => e !== null);
    },
  };
}
