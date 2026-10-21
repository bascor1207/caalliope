#!/usr/bin/env bash
# Sauvegarde nocturne de la base Supabase vers R2 (bucket privé kodaclothing-backups, rétention 30 jours).
# Tourne dans Workers Builds (CI Cloudflare, sans root) : réseau ouvert, `wrangler` authentifié par le jeton de
# build, donc aucune clé S3 ni secret GitHub. Déclenché chaque nuit par le Worker planifié `koda-backup`.
# Variable de build attendue : SUPABASE_BACKUP_URL (rôle koda_backup, lecture seule, « Session pooler » port 5432).
#
# Deux exports par nuit :
#   1. koda-<date>.dump     : pg_dump format custom (schémas public, auth, storage), restaurable avec pg_restore.
#                            pg_dump est extrait des paquets Debian PGDG dans /tmp (pas d'installation système).
#   2. koda-<date>.json.gz  : export logique de toutes les tables (NDJSON), repli lisible si pg_dump est indisponible.
set -uo pipefail

if [ -z "${SUPABASE_BACKUP_URL:-}" ]; then
  echo "SUPABASE_BACKUP_URL absent : sauvegarde ignorée."
  exit 0
fi

STAMP="$(date -u +%Y-%m-%dT%H%MZ)"
PUT="pnpm --filter web exec wrangler r2 object put"
ok=0

# --- 1. pg_dump sans root : paquets PGDG extraits dans /tmp/pg --------------------------------------------------
install_pg_dump() {
  local codename
  codename=$(. /etc/os-release && echo "${VERSION_CODENAME:-jammy}")
  local base="https://apt.postgresql.org/pub/repos/apt"
  local index="/tmp/Packages.pgdg"
  curl -fsSL "$base/dists/${codename}-pgdg/main/binary-amd64/Packages" -o "$index" || return 1
  mkdir -p /tmp/pg
  for pkg in postgresql-client-17 libpq5; do
    local file
    file=$(awk -v p="$pkg" '$1=="Package:"{cur=$2} cur==p && $1=="Filename:"{print $2}' "$index" | sort -V | tail -1)
    [ -n "$file" ] || return 1
    curl -fsSL "$base/$file" -o "/tmp/$pkg.deb" || return 1
    dpkg-deb -x "/tmp/$pkg.deb" /tmp/pg || return 1
  done
  export LD_LIBRARY_PATH="/tmp/pg/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH:-}"
  PG_DUMP=/tmp/pg/usr/lib/postgresql/17/bin/pg_dump
  "$PG_DUMP" --version
}

if install_pg_dump; then
  DUMP="koda-$STAMP.dump"
  if "$PG_DUMP" "$SUPABASE_BACKUP_URL" --format=custom --no-owner --no-privileges \
      --schema=public --schema=auth --schema=storage --file="$DUMP"; then
    ls -la "$DUMP"
    $PUT "kodaclothing-backups/$DUMP" --file="$DUMP" --content-type application/octet-stream --remote && ok=1
    echo "pg_dump envoyé : $DUMP"
  else
    echo "pg_dump a échoué, on passe à l'export logique."
  fi
else
  echo "pg_dump indisponible dans cet environnement, export logique seul."
fi

# --- 2. Export logique NDJSON (toutes les tables lisibles) ------------------------------------------------------
JSON="koda-$STAMP.json.gz"
if SUPABASE_BACKUP_URL="$SUPABASE_BACKUP_URL" pnpm --filter @koda/db exec node scripts/backup-export.mjs | gzip -9 > "$JSON"; then
  ls -la "$JSON"
  $PUT "kodaclothing-backups/$JSON" --file="$JSON" --content-type application/gzip --remote && ok=1
  echo "export logique envoyé : $JSON"
fi

[ "$ok" = 1 ] && echo "Sauvegarde terminée." || { echo "Aucune sauvegarde n'a pu être envoyée."; exit 1; }
