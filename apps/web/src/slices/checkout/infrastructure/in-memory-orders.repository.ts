import type { OrdersRepository } from "../application/ports";
import type { Order, OrderSummary } from "../domain/order";

/**
 * Commandes en mémoire : suffisant pour le POC. Sur Vercel chaque instance a sa propre
 * mémoire : à remplacer par Stripe Checkout + un stockage (KV, Postgres) avant la prod.
 */
export class InMemoryOrdersRepository implements OrdersRepository {
  private readonly orders = new Map<string, Order>();
  private counter = 1000;

  async nextRef(): Promise<string> {
    this.counter += 1;
    return `KODA-${this.counter}`;
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.ref, order);
  }

  async findByRef(ref: string): Promise<Order | null> {
    return this.orders.get(ref) ?? null;
  }

  async listForUser(userId: string, email: string): Promise<OrderSummary[]> {
    return [...this.orders.values()]
      .filter((o) => o.userId === userId || o.customer.email.toLowerCase() === email.toLowerCase())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((o) => ({
        ref: o.ref,
        status: "paid",
        total: o.total,
        currency: "EUR",
        placedAt: o.createdAt,
        source: "koda",
        lines: o.lines.map((l) => ({
          name: l.name,
          qty: l.qty,
          unitPrice: l.unitPrice,
          colorKey: l.colorKey,
          size: l.size,
        })),
      }));
  }
}
