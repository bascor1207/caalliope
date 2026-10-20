"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { eventBus } from "@/shared/event-bus";
import { bindAnalyticsToBus, createTracker, type Tracker } from "../application/tracker";
import { clickTarget, isOptedOut, sessionIdFrom } from "../domain/analytics";
import { beaconTransport } from "../infrastructure/beacon.transport";

const safeStorage = (kind: "sessionStorage" | "localStorage") => {
  try {
    return window[kind];
  } catch {
    return null;
  }
};

/**
 * Monte le traceur une fois par onglet : page vues à chaque navigation, faits du bus, flush à la fermeture.
 * Aucune donnée personnelle, aucun cookie : un identifiant de session en sessionStorage.
 */
const BLOCK_EVENTS = ["koda:role-changed", "koda:analytics-opt-out", "storage"];
const subscribeBlocked = (l: () => void) => {
  for (const e of BLOCK_EVENTS) window.addEventListener(e, l);
  return () => {
    for (const e of BLOCK_EVENTS) window.removeEventListener(e, l);
  };
};

export function AnalyticsProvider() {
  const pathname = usePathname();
  const locale = useLocale();
  const tracker = useRef<Tracker | null>(null);
  /* Opposition ou admin connecté : réévalué dès que la session ou la préférence change. */
  const blocked = useSyncExternalStore(
    subscribeBlocked,
    () => isOptedOut(safeStorage("localStorage")),
    () => true,
  );

  useEffect(() => {
    if (blocked) return;
    const t = createTracker(beaconTransport, {
      session: sessionIdFrom(safeStorage("sessionStorage"), () => crypto.randomUUID()),
      locale,
      path: () => window.location.pathname,
      now: () => new Date().toISOString(),
    });
    tracker.current = t;
    const unbind = bindAnalyticsToBus(eventBus, t);
    const onHide = () => {
      if (document.visibilityState === "hidden") t.flush();
    };
    /* Clics mesurés : tout élément portant `data-track="zone.action"` (CTA, cartes, bannières…). */
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? clickTarget(e.target) : null;
      if (target) t.track("click", { target });
    };
    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => {
      unbind();
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("click", onClick, { capture: true });
      t.flush();
      tracker.current = null;
    };
  }, [locale, blocked]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: une page vue par navigation (pathname déclencheur).
  useEffect(() => {
    tracker.current?.track("page_view");
  }, [pathname]);

  return null;
}
