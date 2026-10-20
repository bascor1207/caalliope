import { getSql, hasDatabase } from "@koda/db";

export type Role = "customer" | "admin";

export interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: Role;
  created_at: string;
  orders: number;
}

/** Rôle d'un utilisateur Supabase (table profiles). `null` si inconnu ou base absente. */
export async function roleOf(userId: string): Promise<Role | null> {
  if (!hasDatabase()) return null;
  const [row] = await getSql()<{ role: Role }[]>`SELECT role FROM profiles WHERE id = ${userId}`;
  return row?.role ?? null;
}

export async function listUsers(limit = 200): Promise<UserRow[]> {
  if (!hasDatabase()) return [];
  const rows = await getSql()<UserRow[]>`
    SELECT p.id, p.email, p.first_name, p.last_name, p.role, p.created_at,
           (SELECT count(*) FROM orders o WHERE o.user_id = p.id OR lower(o.email) = lower(p.email))::int AS orders
    FROM profiles p ORDER BY p.created_at DESC LIMIT ${limit}`;
  return rows.map((r) => ({ ...r, created_at: new Date(r.created_at).toISOString() }));
}

export async function setRole(userId: string, role: Role): Promise<void> {
  await getSql()`UPDATE profiles SET role = ${role}, updated_at = now() WHERE id = ${userId}`;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

export async function listFlags(): Promise<FeatureFlag[]> {
  if (!hasDatabase()) return [];
  return getSql()<FeatureFlag[]>`SELECT key, enabled, description FROM feature_flags ORDER BY key`;
}

export async function setFlag(key: string, enabled: boolean): Promise<void> {
  await getSql()`UPDATE feature_flags SET enabled = ${enabled}, updated_at = now() WHERE key = ${key}`;
}
