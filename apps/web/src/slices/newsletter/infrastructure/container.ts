import { whenDatabase } from "@koda/db";
import type { SubscribersRepository } from "../application/subscribe";
import { PostgresSubscribersRepository } from "./postgres-subscribers.repository";

/** Mémoire sans base (dev, tests), Postgres sinon ; choix à l'usage, la base n'étant connue qu'en requête sur Cloudflare. */
const inMemory = (): SubscribersRepository => {
  const memory = new Map<string, string>();
  return {
    add: async (email, locale) => void memory.set(email, locale),
    unsubscribe: async (token) => memory.delete(token),
  };
};

export const subscribersRepository: SubscribersRepository = whenDatabase(
  () => new PostgresSubscribersRepository(),
  inMemory,
);
