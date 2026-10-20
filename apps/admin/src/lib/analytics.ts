import { type AnalyticsSummary, summarize } from "@koda/analytics";
import { createAnalyticsStoreFromEnv } from "@koda/analytics/node";

export const PERIODS = [7, 30, 90] as const;
export type Period = (typeof PERIODS)[number];

export const isPeriod = (value: unknown): value is Period => PERIODS.includes(Number(value) as Period);

const store = createAnalyticsStoreFromEnv(process.env);

/** Synthèse sur les N derniers jours (jour courant inclus), calculée à la demande depuis le store partagé. */
export async function loadSummary(days: Period): Promise<AnalyticsSummary> {
  const to = new Date();
  const from = new Date(to.getTime() - (days - 1) * 86_400_000);
  from.setUTCHours(0, 0, 0, 0);
  return summarize(await store.read({ from, to }), { from, to });
}
