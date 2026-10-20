import { hasDatabase } from "@koda/db";
import type { AccountRepository } from "../application/ports";
import { InMemoryAccountRepository } from "./in-memory-account.repository";
import { PostgresAccountRepository } from "./postgres-account.repository";

/** Composition root (serveur) : Postgres dès que DATABASE_URL est posée, sinon mémoire. */
export const accountRepository: AccountRepository = hasDatabase()
  ? new PostgresAccountRepository()
  : new InMemoryAccountRepository();
