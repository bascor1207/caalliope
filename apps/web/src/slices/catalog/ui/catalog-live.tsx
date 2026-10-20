"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Locale } from "@/shared/kernel/locale";
import { subscribeToTable } from "@/shared/realtime";
import { useAppDispatch } from "@/store/hooks";
import { catalogApi } from "../application/catalog.api";

interface Version {
  id: "catalog" | "settings";
  version: number;
}

const DEBOUNCE_MS = 600;
/** Laisse au back-office le temps d'invalider le cache serveur avant de redemander les pages rendues côté serveur. */
const SERVER_REFRESH_MS = 1500;

/**
 * Temps réel : chaque écriture en base (fiches, réglages) incrémente `catalog_versions` ;
 * ce composant l'écoute et relance en tâche de fond la lecture du catalogue (RTK Query → store)
 * puis un rafraîchissement doux des composants serveur. Rien ne bloque, rien ne clignote.
 * En onglet caché la connexion est coupée ; au retour, une relecture rattrape ce qui a été manqué.
 */
export function CatalogLive({ locale }: { locale: Locale }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const timers = useRef<{ client?: number; server?: number }>({});
  const seen = useRef<Record<string, number>>({});

  useEffect(() => {
    const refetchCatalog = () => {
      window.clearTimeout(timers.current.client);
      timers.current.client = window.setTimeout(() => {
        dispatch(catalogApi.util.invalidateTags(["Products"]));
        dispatch(catalogApi.endpoints.products.initiate({ locale }, { forceRefetch: true }));
      }, DEBOUNCE_MS);
    };
    const refreshServer = () => {
      window.clearTimeout(timers.current.server);
      timers.current.server = window.setTimeout(() => router.refresh(), SERVER_REFRESH_MS);
    };
    const onChange = (id: string, version: number) => {
      if (seen.current[id] === version) return;
      const first = seen.current[id] === undefined;
      seen.current[id] = version;
      if (first) return;
      if (id === "catalog") refetchCatalog();
      refreshServer();
    };

    let unsubscribe: (() => void) | null = null;
    const connect = () => {
      if (unsubscribe) return;
      unsubscribe = subscribeToTable<Version>("catalog_versions", (c) => {
        if (c.new.id && typeof c.new.version === "number") onChange(c.new.id, Number(c.new.version));
      });
    };
    const disconnect = () => {
      unsubscribe?.();
      unsubscribe = null;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        connect();
        /* Des changements ont pu passer pendant l'absence : une relecture, sans bloquer. */
        refetchCatalog();
      } else disconnect();
    };
    connect();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      disconnect();
      window.clearTimeout(timers.current.client);
      window.clearTimeout(timers.current.server);
    };
  }, [dispatch, router, locale]);

  return null;
}
