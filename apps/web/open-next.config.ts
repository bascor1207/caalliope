import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

/**
 * Boutique sur Cloudflare Workers (plan gratuit) via OpenNext.
 * Cache ISR dans R2, file de revalidation et cache des tags dans des Durable Objects (SQLite, gratuits) :
 * `revalidateTag("catalog")` depuis l'admin continue de fonctionner comme sur Vercel.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  enableCacheInterception: true,
});
