"use client";

import { useRef } from "react";
import type { Locale } from "@/shared/kernel/locale";
import { useAppStore } from "@/store/hooks";
import { catalogHydrated } from "../application/catalog.slice";
import type { Product } from "../domain/product";

/** Pousse le catalogue rendu côté serveur dans le cache RTK, une fois, avant le premier rendu enfant. */
export function CatalogHydrator({ locale, products }: { locale: Locale; products: Product[] }) {
  const store = useAppStore();
  const done = useRef(false);
  if (!done.current) {
    store.dispatch(catalogHydrated({ locale, products }));
    done.current = true;
  }
  return null;
}
