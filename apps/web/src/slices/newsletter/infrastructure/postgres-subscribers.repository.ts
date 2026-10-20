import { getSql } from "@koda/db";
import type { Locale } from "@/shared/kernel/locale";
import type { SubscribersRepository } from "../application/subscribe";

/** Inscrits newsletter dans Postgres (Supabase), table partagée avec les campagnes de l'admin. */
export class PostgresSubscribersRepository implements SubscribersRepository {
  async add(email: string, locale: Locale): Promise<void> {
    await getSql()`
      INSERT INTO newsletter_subscribers (email, locale, status, source)
      VALUES (${email}, ${locale}, 'subscribed', 'site')
      ON CONFLICT (lower(email)) DO UPDATE
        SET status = 'subscribed', unsubscribed_at = NULL, locale = EXCLUDED.locale,
            subscribed_at = CASE WHEN newsletter_subscribers.status = 'unsubscribed' THEN now() ELSE newsletter_subscribers.subscribed_at END`;
  }

  async unsubscribe(token: string): Promise<boolean> {
    const rows = await getSql()<{ id: string }[]>`
      UPDATE newsletter_subscribers SET status = 'unsubscribed', unsubscribed_at = now()
      WHERE token = ${token} RETURNING id`;
    return rows.length > 0;
  }
}
