import type { OrdersRepository } from "../application/ports";
import type { Order } from "../domain/order";

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
}
