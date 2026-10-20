import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPalette, listCatalog } from "@/lib/catalog";
import { PRODUCT_TYPES } from "@/lib/catalog-types";
import { ImportForm, PaletteForm, ProductRowActions } from "./catalogue-forms";

export const metadata: Metadata = { title: "Catalogue" };
export const dynamic = "force-dynamic";

const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
const typeLabel = (t: string) => PRODUCT_TYPES.find(([k]) => k === t)?.[1] ?? t;

export default async function CataloguePage() {
  const [products, palette] = await Promise.all([listCatalog(), getPalette()]);
  const colors = Object.values(palette);
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Catalogue</h1>
          <p className="mt-3 text-[15px] text-muted">
            {products.length} fiche{products.length > 1 ? "s" : ""} · {products.filter((p) => p.active).length} en ligne
            · {colors.length} coloris
          </p>
        </div>
        <Link
          href="/catalogue/nouveau"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-2"
        >
          <PlusIcon className="size-4" aria-hidden="true" /> Nouvelle fiche
        </Link>
      </header>

      {products.length === 0 ? (
        <section className="card mt-10" aria-label="Import">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Démarrer avec le catalogue actuel</h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            La boutique affiche pour l'instant les fiches écrites dans le code. Importe-les ici une fois : elles
            deviennent modifiables, et la boutique lit la base.
          </p>
          <ImportForm />
        </section>
      ) : (
        <section className="card mt-10 overflow-x-auto" aria-label="Fiches produit">
          <table className="w-full text-[15px]">
            <thead className="text-left text-sm text-muted">
              <tr>
                <th scope="col" className="pb-3 font-medium">
                  Produit
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Type
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Prix
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Coloris
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Photos
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Statut
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Ordre
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="py-3 pr-3">
                    <Link href={`/catalogue/${p.id}`} className="flex items-center gap-3 font-medium hover:underline">
                      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-cream-2">
                        {p.data.images[0] ? (
                          // biome-ignore lint/performance/noImgElement: vignette d'un fichier externe
                          <img src={p.data.images[0].src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-muted">–</span>
                        )}
                      </span>
                      <span>
                        {p.data.name.fr}
                        <span className="block text-xs font-normal text-muted">/{p.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 pr-3">{typeLabel(p.data.type)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">
                    {eur(p.data.price)}
                    {p.data.compare ? (
                      <span className="ml-1.5 text-xs text-muted line-through">{eur(p.data.compare)}</span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-3">
                    <span className="flex gap-1">
                      {p.data.colorKeys.map((k) => (
                        <span
                          key={k}
                          title={palette[k]?.name.fr ?? k}
                          className="size-4 rounded-full border border-line"
                          style={{ background: palette[k]?.hex ?? "#ccc" }}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">{p.data.images.length}</td>
                  <td className="py-3 pr-3">
                    <ProductRowActions
                      id={p.id}
                      active={p.active}
                      first={i === 0}
                      last={i === products.length - 1}
                      only="toggle"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <ProductRowActions
                      id={p.id}
                      active={p.active}
                      first={i === 0}
                      last={i === products.length - 1}
                      only="move"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="card mt-6" aria-labelledby="palette-title">
        <h2 id="palette-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Palette de coloris
        </h2>
        <p className="mt-1 mb-5 text-sm text-muted">
          Les coloris disponibles pour toutes les fiches : nom affiché, couleur de la pastille et du fond de carte.
        </p>
        <PaletteForm initial={colors} />
      </section>
    </main>
  );
}
