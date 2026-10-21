#!/usr/bin/env bash
# Sauvegarde nocturne de la base Supabase vers R2 (bucket privé kodaclothing-backups, rétention 30 jours).
# Tourne dans Workers Builds (CI Cloudflare) : réseau ouvert, `wrangler` authentifié par le jeton de build,
# donc aucune clé S3 ni secret GitHub. Déclenché chaque nuit par le Worker planifié `koda-backup`.
# Variable de build attendue : SUPABASE_BACKUP_URL (rôle koda_backup, lecture seule, « Session pooler » port 5432).
set -euo pipefail

if [ -z "${SUPABASE_BACKUP_URL:-}" ]; then
  echo "SUPABASE_BACKUP_URL absent : sauvegarde ignorée."
  exit 0
fi

echo "Installation de pg_dump 17…"
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' 2>/dev/null \
  || sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | (sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg 2>/dev/null || gpg --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg)
(sudo apt-get update -qq && sudo apt-get install -y -qq postgresql-client-17) 2>/dev/null || (apt-get update -qq && apt-get install -y -qq postgresql-client-17)
PG_DUMP=$(ls /usr/lib/postgresql/*/bin/pg_dump | sort -V | tail -1)

FILE="koda-$(date -u +%Y-%m-%dT%H%MZ).dump"
echo "Export de la base → $FILE"
"$PG_DUMP" "$SUPABASE_BACKUP_URL" --format=custom --no-owner --no-privileges \
  --schema=public --schema=auth --schema=storage --file="$FILE"
ls -la "$FILE"

echo "Envoi vers R2…"
pnpm --filter web exec wrangler r2 object put "kodaclothing-backups/$FILE" --file="$FILE" \
  --content-type application/octet-stream --remote
rm -f "$FILE"
echo "Sauvegarde terminée : $FILE"
