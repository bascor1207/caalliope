import { top } from "@koda/analytics";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { DailyBars } from "@/components/bars";
import { Funnel, Panel, RankTable } from "@/components/panels";
import { isPeriod, loadSummary, PERIODS, type Period } from "@/lib/analytics";
import { kpisOf } from "@/lib/kpis";
import { logout } from "./actions";

/** Toujours calculé à la demande : les chiffres lus sont ceux du store à l'instant T. */
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ jours?: string }>;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

export default async function Dashboard({ searchParams }: Props) {
  const { jours } = await searchParams;
  const period: Period = isPeriod(jours) ? (Number(jours) as Period) : 30;
  const s = await loadSummary(period);
  const kpis = kpisOf(s);
  const products = Object.keys({ ...s.productViews, ...s.addToCart }).map(
    (id) => [id, s.productViews[id] ?? 0, s.addToCart[id] ?? 0] as const,
  );

  return (
    <main className="mx-auto w-[min(1200px,100%-32px)] py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing · Admin</p>
          <h1 className="mt-1 text-[clamp(28px,4vw,40px)] font-extrabold leading-none tracking-[-0.04em]">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-muted">
            Du {fmtDate(s.range.from)} au {fmtDate(s.range.to)} · {s.events} événements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <nav aria-label="Période" className="inline-flex rounded-full bg-ink/6 p-1 text-xs font-semibold">
            {PERIODS.map((d) => (
              <Link
                key={d}
                href={`/?jours=${d}`}
                aria-current={d === period ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${d === period ? "bg-ink text-cream" : "hover:bg-ink/10"}`}
              >
                {d} jours
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2 text-xs font-semibold hover:border-ink"
            >
              <LogOutIcon className="size-3.5" aria-hidden="true" /> Déconnexion
            </button>
          </form>
        </div>
      </header>

      <section aria-label="Indicateurs clés" className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.key} className="card">
            <p className="eyebrow">{k.label}</p>
            <p className="mt-2 font-display text-[28px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">
              {k.value}
            </p>
            {k.hint && <p className="mt-2 text-xs text-muted">{k.hint}</p>}
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Pages vues par jour" hint={`${period} jours`}>
          <DailyBars points={s.daily} metric="pageViews" label="Pages vues" />
        </Panel>
        <Panel title="Commandes par jour" hint={`${period} jours`}>
          <DailyBars points={s.daily} metric="orders" label="Commandes" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Entonnoir d'achat" hint="taux par rapport à l'étape précédente">
          <Funnel
            steps={[
              { label: "Sessions", value: s.sessions },
              { label: "Fiche produit vue", value: s.funnel.productViews },
              { label: "Ajout au panier", value: s.funnel.addToCart },
              { label: "Checkout démarré", value: s.funnel.checkoutStarted },
              { label: "Commande", value: s.funnel.ordersPlaced },
            ]}
          />
        </Panel>
        <Panel title="Produits" hint="vues → ajouts panier">
          {products.length === 0 ? (
            <p className="text-sm text-muted">Aucune fiche vue sur la période.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted">
                <tr>
                  <th scope="col" className="pb-2 font-medium">
                    Produit
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Vues
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Paniers
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Taux
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, views, carts]) => (
                    <tr key={id} className="border-t border-line">
                      <td className="py-2 pr-3 font-medium">{id}</td>
                      <td className="py-2 text-right tabular-nums">{views}</td>
                      <td className="py-2 text-right tabular-nums">{carts}</td>
                      <td className="py-2 text-right tabular-nums">
                        {views ? `${Math.round((carts / views) * 100)} %` : "–"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Pages les plus vues">
          <RankTable rows={top(s.pageViews, 8)} label="Page" valueLabel="Vues" empty="Aucune page vue." />
        </Panel>
        <Panel title="Clics mesurés" hint="data-track">
          <RankTable rows={top(s.clicks, 8)} label="Élément" valueLabel="Clics" empty="Aucun clic mesuré." />
        </Panel>
        <Panel title="Frictions" hint="ce qui bloque un achat">
          <h3 className="eyebrow mb-2">Erreurs au checkout</h3>
          <RankTable
            rows={top(s.frictions.checkoutErrors, 5)}
            label="Erreur"
            valueLabel="Occurrences"
            empty="Aucune erreur."
          />
          <h3 className="eyebrow mt-5 mb-2">Recherches sans résultat</h3>
          <RankTable
            rows={top(s.searches.noResult, 5)}
            label="Requête"
            valueLabel="Fois"
            empty="Toutes les recherches ont des résultats."
          />
          <h3 className="eyebrow mt-5 mb-2">Langues des sessions</h3>
          <RankTable rows={top(s.locales, 3)} label="Langue" valueLabel="Sessions" empty="–" />
        </Panel>
      </div>
    </main>
  );
}
