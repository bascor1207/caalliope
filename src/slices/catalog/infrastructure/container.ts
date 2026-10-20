import type { CatalogRepository } from "../application/ports";
import { InMemoryCatalogRepository } from "./in-memory-catalog.repository";

/** Composition root de la slice (serveur). Remplacer l'implémentation ici, rien d'autre ne change. */
export const catalogRepository: CatalogRepository = new InMemoryCatalogRepository();
