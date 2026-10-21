"use client";

import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  utilisateurs: "Utilisateurs",
  catalogue: "Catalogue",
  nouveau: "Nouvelle fiche",
  marketing: "Marketing",
  newsletter: "Newsletter",
  campagnes: "Campagnes",
  parametres: "Réglages",
  ia: "IA & automatisation",
};

/** Libellé d'un segment dynamique selon son parent (identifiant de fiche, de campagne…). */
const dynamicLabel = (parent: string | undefined) =>
  parent === "catalogue" ? "Fiche produit" : parent === "campagnes" ? "Campagne" : "Détail";

/** Fil d'Ariane déduit de l'URL + bouton retour vers le niveau parent (jamais vers un site externe). */
export function AdminBreadcrumb() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const crumbs = segments.map((seg, i) => ({
    href: `/${segments.slice(0, i + 1).join("/")}`,
    label: LABELS[seg] ?? dynamicLabel(segments[i - 1]),
  }));
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2].href : "/";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={parent}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm font-semibold hover:border-ink"
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        Retour
      </Link>
      <nav aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Tableau de bord
            </Link>
          </li>
          {crumbs.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              <ChevronRightIcon className="size-3.5" aria-hidden="true" />
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-ink hover:underline">
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
