"use client";

import { useSyncExternalStore } from "react";
import { type CatalogFilter, isCatalogFilter } from "../domain/product";

const PARAM = "filtre";
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
};

const read = (): CatalogFilter => {
  const value = new URLSearchParams(window.location.search).get(PARAM);
  return isCatalogFilter(value) ? value : "all";
};

/**
 * Filtre de la collection porté par l'URL (`?filtre=`), partageable, sans `useSearchParams` :
 * la grille reste dans le HTML statique (SEO, LCP) et se met à jour après hydratation.
 * `history.replaceState` est synchronisé avec le routeur Next (App Router).
 */
export function useUrlFilter(): [CatalogFilter, (next: CatalogFilter) => void] {
  const filter = useSyncExternalStore(subscribe, read, (): CatalogFilter => "all");
  const set = (next: CatalogFilter) => {
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, next);
    window.history.replaceState(window.history.state, "", url);
    for (const l of listeners) l();
  };
  return [filter, set];
}
