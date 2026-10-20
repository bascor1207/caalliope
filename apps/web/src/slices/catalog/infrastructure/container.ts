import { hasDatabase } from "@koda/db";
import type { CatalogRepository } from "../application/ports";
import { InMemoryCatalogRepository } from "./in-memory-catalog.repository";
import { PostgresCatalogRepository } from "./postgres-catalog.repository";

/** Composition root de la slice (serveur) : catalogue édité en base dès que DATABASE_URL est posée, sinon le code. */
export const catalogRepository: CatalogRepository = hasDatabase()
  ? new PostgresCatalogRepository()
  : new InMemoryCatalogRepository();
