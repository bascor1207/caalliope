import { setDatabaseUrlResolver } from "@koda/db";

/**
 * Démarrage du serveur Next. Sur Cloudflare Workers, la base est jointe via le binding Hyperdrive
 * (`HYPERDRIVE.connectionString`, pool et TLS côté Cloudflare) ; partout ailleurs, DATABASE_URL.
 * `getCloudflareContext` n'existe qu'au sein d'une requête servie par le Worker : hors de ce cas (build, Node),
 * il lève et on retombe sur l'environnement.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  setDatabaseUrlResolver(() => {
    try {
      const env = getCloudflareContext().env as { HYPERDRIVE?: { connectionString?: string } };
      return env.HYPERDRIVE?.connectionString || undefined;
    } catch {
      return undefined;
    }
  });
}
