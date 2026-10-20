"use client";

import { useFormatter } from "next-intl";

/** Prix formaté selon la locale (format `eur` déclaré dans i18n/request.ts). */
export function useMoney() {
  const format = useFormatter();
  return (amount: number) => format.number(amount, "eur");
}

export function Price({ amount, compare, className }: { amount: number; compare?: number; className?: string }) {
  const money = useMoney();
  return (
    <span className={className}>
      {compare && <s className="mr-1.5 font-medium opacity-40">{money(compare)}</s>}
      {money(amount)}
    </span>
  );
}
