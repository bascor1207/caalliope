"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { eventBus } from "@/shared/event-bus";
import { bindAnalyticsToBus, createTracker, type Tracker } from "../application/tracker";
import { attributionFrom, clickTarget, INTERNAL_KEY, isOptedOut, sessionIdFrom } from "../domain/analytics";
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
    () => isOptedOut(safeStorage("localStorage"), document.cookie),
    () => true,
  );

  /* `?koda_internal=1` une fois : ce navigateur (équipe, tests) est exclu des statistiques pour de bon. */
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("koda_internal")) return;
    const value = new URLSearchParams(window.location.search).get("koda_internal");
    const storage = safeStorage("localStorage");
    if (value === "0") storage?.removeItem(INTERNAL_KEY);
    else storage?.setItem(INTERNAL_KEY, "1");
    window.dispatchEvent(new Event("koda:analytics-opt-out"));
  }, []);

  useEffect(() => {
    if (blocked) return;
    const t = createTracker(beaconTransport, {
      session: sessionIdFrom(safeStorage("sessionStorage"), () => crypto.randomUUID()),
      locale,
      path: () => window.location.pathname,
      now: () => new Date().toISOString(),
    });
    tracker.current = t;
    /* Provenance : figée au premier contact de la session, envoyée une fois (session_start). */
    const { attribution, isNew } = attributionFrom(
      safeStorage("sessionStorage"),
      window.location.search,
      document.referrer,
      window.location.hostname,
    );
    if (isNew) t.track("session_start", { ...attribution });
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
