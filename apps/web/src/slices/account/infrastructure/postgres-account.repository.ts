import { getSql } from "@koda/db";
import type { AccountRepository } from "../application/ports";
import type { Address, AddressInput, ProfileInput } from "../domain/address";

interface AddressRow {
  id: string;
  label: string;
  first_name: string;
  last_name: string;
  line1: string;
  line2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
}

const toAddress = (r: AddressRow): Address => ({
  id: r.id,
  label: r.label,
  firstName: r.first_name,
  lastName: r.last_name,
  line1: r.line1,
  line2: r.line2,
  zip: r.zip,
  city: r.city,
  country: r.country,
  phone: r.phone,
  isDefault: r.is_default,
});

const COLS = "id, label, first_name, last_name, line1, line2, zip, city, country, phone, is_default";

/** Adapter Postgres (Supabase) : `profiles` pour l'identité, `addresses` pour le carnet. */
export class PostgresAccountRepository implements AccountRepository {
  async getProfile(userId: string): Promise<ProfileInput | null> {
    const [row] = await getSql()<
      { first_name: string | null; last_name: string | null; phone: string | null }[]
    >`SELECT first_name, last_name, phone FROM profiles WHERE id = ${userId}`;
    return row ? { firstName: row.first_name ?? "", lastName: row.last_name ?? "", phone: row.phone ?? "" } : null;
  }

  async updateProfile(userId: string, input: ProfileInput): Promise<void> {
    await getSql()`UPDATE profiles SET first_name = ${input.firstName}, last_name = ${input.lastName}, phone = ${input.phone}, updated_at = now() WHERE id = ${userId}`;
  }

  async listAddresses(userId: string): Promise<Address[]> {
    const rows = await getSql().unsafe<AddressRow[]>(
      `SELECT ${COLS} FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at`,
      [userId],
    );
    return rows.map(toAddress);
  }

  async saveAddress(userId: string, a: AddressInput, id?: string): Promise<Address> {
    const sql = getSql();
    const [{ count }] = await sql<
      { count: number }[]
    >`SELECT count(*)::int AS count FROM addresses WHERE user_id = ${userId}`;
    const first = count === 0;
    if (id) {
      const rows = await sql.unsafe<AddressRow[]>(
        `UPDATE addresses SET label=$3, first_name=$4, last_name=$5, line1=$6, line2=$7, zip=$8, city=$9, country=$10, phone=$11, updated_at=now()
         WHERE id = $1 AND user_id = $2 RETURNING ${COLS}`,
        [id, userId, a.label, a.firstName, a.lastName, a.line1, a.line2, a.zip, a.city, a.country, a.phone],
      );
      if (!rows[0]) throw new Error("address-not-found");
      return toAddress(rows[0]);
    }
    const rows = await sql.unsafe<AddressRow[]>(
      `INSERT INTO addresses (user_id, label, first_name, last_name, line1, line2, zip, city, country, phone, is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING ${COLS}`,
      [userId, a.label, a.firstName, a.lastName, a.line1, a.line2, a.zip, a.city, a.country, a.phone, first],
    );
    return toAddress(rows[0]);
  }

  async deleteAddress(userId: string, id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM addresses WHERE id = ${id} AND user_id = ${userId}`;
    /* Si l'adresse par défaut disparaît, la plus ancienne restante prend le relais. */
    await sql`UPDATE addresses SET is_default = true WHERE user_id = ${userId}
      AND NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = ${userId} AND is_default)
      AND id = (SELECT id FROM addresses WHERE user_id = ${userId} ORDER BY created_at LIMIT 1)`;
  }

  async setDefaultAddress(userId: string, id: string): Promise<void> {
    const sql = getSql();
    await sql`UPDATE addresses SET is_default = (id = ${id}), updated_at = now() WHERE user_id = ${userId}`;
  }
}
