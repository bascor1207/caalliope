"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { eventBus } from "@/shared/event-bus";
import { bindAnalyticsToBus, createTracker, type Tracker } from "../application/tracker";
import { sessionIdFrom } from "../domain/analytics";
import { beaconTransport } from "../infrastructure/beacon.transport";

const safeStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Monte le traceur une fois par onglet : page vues à chaque navigation, faits du bus, flush à la fermeture.
 * Aucune donnée personnelle, aucun cookie : un identifiant de session en sessionStorage.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const locale = useLocale();
  const tracker = useRef<Tracker | null>(null);

  useEffect(() => {
    const t = createTracker(beaconTransport, {
      session: sessionIdFrom(safeStorage(), () => crypto.randomUUID()),
      locale,
      path: () => window.location.pathname,
      now: () => new Date().toISOString(),
    });
    tracker.current = t;
    const unbind = bindAnalyticsToBus(eventBus, t);
    const onHide = () => {
      if (document.visibilityState === "hidden") t.flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      unbind();
      document.removeEventListener("visibilitychange", onHide);
      t.flush();
      tracker.current = null;
    };
  }, [locale]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: une page vue par navigation (pathname déclencheur).
  useEffect(() => {
    tracker.current?.track("page_view");
  }, [pathname]);

  return null;
}
