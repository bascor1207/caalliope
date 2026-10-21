import { whenDatabase } from "@koda/db";
import type { AccountRepository } from "../application/ports";
import { InMemoryAccountRepository } from "./in-memory-account.repository";
import { PostgresAccountRepository } from "./postgres-account.repository";

/** Composition root (serveur) : Postgres dès que la base est joignable (choix à l'usage), sinon mémoire. */
export const accountRepository: AccountRepository = whenDatabase(
  () => new PostgresAccountRepository(),
  () => new InMemoryAccountRepository(),
);
