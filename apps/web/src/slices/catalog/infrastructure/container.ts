import { whenDatabase } from "@koda/db";
import type { CatalogRepository } from "../application/ports";
import { InMemoryCatalogRepository } from "./in-memory-catalog.repository";
import { PostgresCatalogRepository } from "./postgres-catalog.repository";

/**
 * Composition root de la slice (serveur) : catalogue édité en base dès que Postgres est joignable, sinon le code.
 * Choix fait à l'usage (et non au chargement du module), car sur Cloudflare la base n'est connue qu'en requête.
 */
export const catalogRepository: CatalogRepository = whenDatabase<CatalogRepository>(
  () => new PostgresCatalogRepository(),
  () => new InMemoryCatalogRepository(),
);
