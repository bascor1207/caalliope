"use server";

import { isLocale, type Locale } from "@/shared/kernel/locale";
import { search } from "../application/use-cases";
import type { SearchHit } from "../domain/search";
import { catalogRepository } from "./container";

/** Server Action de recherche : seule porte d'entrée réseau de la slice catalogue. */
export async function searchProductsAction(query: string, locale: Locale): Promise<SearchHit[]> {
  if (!isLocale(locale)) return [];
  return search(catalogRepository, String(query).slice(0, 80), locale, 8);
}
