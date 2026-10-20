import { hasDatabase } from "@koda/db";
import type { SubscribersRepository } from "../application/subscribe";
import { PostgresSubscribersRepository } from "./postgres-subscribers.repository";

/** Mémoire sans base (dev, tests), Postgres sinon. */
const memory = new Map<string, string>();
const inMemory: SubscribersRepository = {
  add: async (email, locale) => void memory.set(email, locale),
  unsubscribe: async (token) => memory.delete(token),
};

export const subscribersRepository: SubscribersRepository = hasDatabase()
  ? new PostgresSubscribersRepository()
  : inMemory;
