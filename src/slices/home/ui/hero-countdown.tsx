"use client";

import { useTranslations } from "next-intl";
import { useRemaining } from "@/shared/ui";

export function HeroCountdown({ end }: { end: string }) {
  const t = useTranslations("home.hero");
  const r = useRemaining(end);
  return <span>{r ? t("closesIn", { days: r.days, hours: String(r.hours).padStart(2, "0") }) : t("closesSoon")}</span>;
}
