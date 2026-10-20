import { getFormatter, getTranslations } from "next-intl/server";
import type { OrderSummary } from "../domain/order";

/** Historique des commandes d'un client : site et Shopify, du plus récent au plus ancien. */
export async function OrderHistory({ orders }: { orders: OrderSummary[] }) {
  const t = await getTranslations("checkout.history");
  const format = await getFormatter();
  if (orders.length === 0) {
    return <div className="rounded-card border border-line bg-white p-6 text-sm text-muted">{t("empty")}</div>;
  }
  return (
    <ul className="grid gap-3">
      {orders.map((order) => (
        <li key={order.ref} className="rounded-card border border-line bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <b className="font-display text-lg">{order.ref}</b>
              <span className="ml-3 text-sm text-muted">
                {format.dateTime(new Date(order.placedAt), { day: "numeric", month: "long", year: "numeric" })}
                {order.source === "shopify" ? ` · ${t("fromShopify")}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-ink/6 px-2.5 py-1 text-xs font-semibold">
                {t(`status.${order.status}`)}
              </span>
              <b className="font-display">{format.number(order.total, "eur")}</b>
            </div>
          </div>
          <ul className="mt-3 grid gap-1 text-sm text-ink-2">
            {order.lines.map((line, i) => (
              <li key={`${order.ref}-${i}`} className="flex justify-between gap-3">
                <span>
                  {line.name}
                  {line.size ? ` · ${line.size}` : ""} × {line.qty}
                </span>
                <span className="tabular-nums">{format.number(line.unitPrice * line.qty, "eur")}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
