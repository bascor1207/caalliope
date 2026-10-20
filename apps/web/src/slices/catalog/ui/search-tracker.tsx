"use client";

import { useEffect } from "react";
import { eventBus } from "@/shared/event-bus";

/** La page /recherche est rendue côté serveur : ce composant publie le fait « recherche effectuée » au montage. */
export function SearchTracker({ query, results }: { query: string; results: number }) {
  useEffect(() => {
    if (query) eventBus.publish("catalog.search-performed", { query, results });
  }, [query, results]);
  return null;
}
