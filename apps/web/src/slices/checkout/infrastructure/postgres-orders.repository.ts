import { getSql } from "@koda/db";
import type { OrdersRepository } from "../application/ports";
import type { Order, OrderStatus, OrderSummary } from "../domain/order";

interface OrderRow {
  ref: string;
  status: OrderStatus;
  total: string | number;
  currency: string;
  placed_at: Date | string;
  source: "koda" | "shopify";
  lines: unknown;
  customer: unknown;
  payment: string | null;
  subtotal: string | number;
  shipping: string | number;
}

/** Commandes dans Postgres (Supabase), table `orders` partagée avec l'admin et la migration Shopify. */
export class PostgresOrdersRepository implements OrdersRepository {
  async nextRef(): Promise<string> {
    const [row] = await getSql()<{ n: string }[]>`SELECT nextval('orders_ref_seq') AS n`;
    return `KODA-${row?.n ?? Date.now()}`;
  }

  async save(order: Order): Promise<void> {
    const sql = getSql();
    await sql`
      INSERT INTO orders (ref, user_id, email, status, currency, subtotal, shipping, total, payment, payment_ref, customer, lines, source, placed_at)
      VALUES (${order.ref}, ${order.userId ?? null}, ${order.customer.email}, 'paid', 'EUR', ${order.subtotal}, ${order.shipping},
              ${order.total}, ${order.payment}, ${order.paymentRef ?? null}, ${sql.json(order.customer as never)},
              ${sql.json(order.lines as never)}, 'koda', ${order.createdAt})`;
  }

  async findByRef(ref: string): Promise<Order | null> {
    const [row] = await getSql()<OrderRow[]>`SELECT * FROM orders WHERE ref = ${ref}`;
    if (!row) return null;
    return {
      ref: row.ref,
      customer: row.customer as Order["customer"],
      payment: (row.payment ?? "card") as Order["payment"],
      lines: row.lines as Order["lines"],
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      total: Number(row.total),
      createdAt: new Date(row.placed_at).toISOString(),
    };
  }

  async listForUser(userId: string, email: string): Promise<OrderSummary[]> {
    const rows = await getSql()<OrderRow[]>`
      SELECT ref, status, total, currency, placed_at, source, lines FROM orders
      WHERE user_id = ${userId} OR lower(email) = lower(${email})
      ORDER BY placed_at DESC LIMIT 100`;
    return rows.map((row) => ({
      ref: row.ref,
      status: row.status,
      total: Number(row.total),
      currency: row.currency,
      placedAt: new Date(row.placed_at).toISOString(),
      source: row.source,
      lines: (Array.isArray(row.lines) ? row.lines : []) as OrderSummary["lines"],
    }));
  }
}
