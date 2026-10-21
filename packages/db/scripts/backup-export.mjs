// Export logique de la base (NDJSON sur stdout) : une ligne {"table":"schema.table","row":{...}} par enregistrement,
// précédée d'une ligne d'en-tête par table avec ses colonnes et leurs types. Repli lisible et restaurable par script
// quand pg_dump n'est pas disponible. Lecture seule (rôle koda_backup).
import postgres from "postgres";

const url = process.env.SUPABASE_BACKUP_URL;
if (!url) {
  console.error("SUPABASE_BACKUP_URL absent");
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false, idle_timeout: 5, connect_timeout: 20 });
const SCHEMAS = ["public", "auth", "storage"];
const SKIP = new Set(["auth.schema_migrations", "auth.audit_log_entries", "storage.migrations"]);
const out = (obj) => process.stdout.write(`${JSON.stringify(obj)}\n`);

try {
  const tables = await sql`
    SELECT table_schema AS schema, table_name AS name
    FROM information_schema.tables
    WHERE table_schema = ANY(${SCHEMAS}) AND table_type = 'BASE TABLE'
    ORDER BY table_schema, table_name`;
  out({ meta: { exportedAt: new Date().toISOString(), schemas: SCHEMAS, tables: tables.length } });
  for (const t of tables) {
    const full = `${t.schema}.${t.name}`;
    if (SKIP.has(full)) continue;
    const columns = await sql`
      SELECT column_name AS name, data_type AS type
      FROM information_schema.columns WHERE table_schema = ${t.schema} AND table_name = ${t.name}
      ORDER BY ordinal_position`;
    out({ table: full, columns });
    let count = 0;
    try {
      const cursor = sql`SELECT * FROM ${sql(t.schema)}.${sql(t.name)}`.cursor(500);
      for await (const rows of cursor) {
        for (const row of rows) {
          out({ table: full, row });
          count += 1;
        }
      }
    } catch (error) {
      out({ table: full, error: String(error?.message ?? error) });
    }
    console.error(`${full}: ${count} lignes`);
  }
} finally {
  await sql.end();
}
