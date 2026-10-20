import { top } from "@koda/analytics";
import Link from "next/link";
import { DailyBars } from "@/components/bars";
import { LiveFeed } from "@/components/live-feed";
import { Funnel, Panel, RankTable } from "@/components/panels";
import { isPeriod, loadSummary, PERIODS, type Period } from "@/lib/analytics";
import { kpisOf } from "@/lib/kpis";
import { errorLabel, labelled, localeLabel, productLabel, trackLabel } from "@/lib/labels";

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
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] font-extrabold leading-none tracking-[-0.04em]">
            Tableau de bord
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            Du {fmtDate(s.range.from)} au {fmtDate(s.range.to)} · {s.events} événements
          </p>
          <div className="mt-2">
            <LiveFeed />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <nav aria-label="Période" className="inline-flex rounded-full bg-ink/6 p-1 text-sm font-semibold">
            {PERIODS.map((d) => (
              <Link
                key={d}
                href={`/?jours=${d}`}
                aria-current={d === period ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-2 transition-colors sm:px-4 ${d === period ? "bg-ink text-cream" : "hover:bg-ink/10"}`}
              >
                {d} jours
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section aria-label="Indicateurs clés" className="mt-10">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.key} className="card">
              <p className="eyebrow">{k.label}</p>
              <p className="kpi-value">{k.value}</p>
              <p className="mt-3 text-sm text-muted">{k.hint}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Une visite = un passage sur la boutique. Les pourcentages sont des parts de visites (une même visite peut
          ouvrir plusieurs fiches : on la compte une fois).
        </p>
      </section>

      <div className="mt-8 grid gap-5 md:gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Pages vues par jour" hint={`${period} jours`}>
          <DailyBars points={s.daily} metric="pageViews" label="Pages vues" />
        </Panel>
        <Panel title="Commandes par jour" hint={`${period} jours`}>
          <DailyBars points={s.daily} metric="orders" label="Commandes" />
        </Panel>
      </div>

      <div className="mt-8 grid gap-5 md:gap-6 lg:grid-cols-2">
        <Panel title="Parcours d'achat" hint="visites ayant atteint chaque étape">
          <Funnel
            steps={[
              { label: "Visites", value: s.sessions },
              { label: "Fiche produit ouverte", value: s.reached.productViews },
              { label: "Article ajouté au panier", value: s.reached.addToCart },
              { label: "Paiement démarré", value: s.reached.checkoutStarted },
              { label: "Commande passée", value: s.reached.ordersPlaced },
            ]}
          />
        </Panel>
        <Panel title="Produits" hint="fiches ouvertes et ajouts au panier">
          {products.length === 0 ? (
            <p className="text-[15px] text-muted">Aucune fiche vue sur la période.</p>
          ) : (
            <table className="w-full text-[15px]">
              <thead className="text-left text-sm text-muted">
                <tr>
                  <th scope="col" className="pb-2 font-medium">
                    Produit
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Fiches ouvertes
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Ajouts panier
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Ajouts / fiches
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, views, carts]) => (
                    <tr key={id} className="border-t border-line">
                      <td className="py-3 pr-3 font-medium">{productLabel(id)}</td>
                      <td className="py-3 text-right tabular-nums">{views}</td>
                      <td className="py-3 text-right tabular-nums">{carts}</td>
                      <td className="py-3 text-right tabular-nums">
                        {views ? `${Math.round((carts / views) * 100)} %` : "–"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>

      <div className="mt-8 grid gap-5 md:gap-6 lg:grid-cols-3">
        <Panel title="Pages les plus vues">
          <RankTable rows={top(s.pageViews, 8)} label="Page" valueLabel="Vues" empty="Aucune page vue." />
        </Panel>
        <Panel title="Clics mesurés" hint="boutons et liens suivis">
          <RankTable
            rows={labelled(top(s.clicks, 12), trackLabel).slice(0, 8)}
            label="Élément"
            valueLabel="Clics"
            empty="Aucun clic mesuré."
          />
        </Panel>
        <Panel title="Frictions" hint="ce qui freine un achat">
          <h3 className="eyebrow mb-3">Erreurs au checkout</h3>
          <RankTable
            rows={labelled(top(s.frictions.checkoutErrors, 8), errorLabel).slice(0, 5)}
            label="Erreur"
            valueLabel="Occurrences"
            empty="Aucune erreur."
          />
          <h3 className="eyebrow mt-7 mb-3">Recherches sans résultat</h3>
          <RankTable
            rows={top(s.searches.noResult, 5)}
            label="Requête"
            valueLabel="Fois"
            empty="Toutes les recherches ont des résultats."
          />
          <h3 className="eyebrow mt-7 mb-3">Pages en erreur (hors 404)</h3>
          <RankTable
            rows={top(s.frictions.pageErrors, 5)}
            label="Page"
            valueLabel="Erreurs"
            empty="Aucune page en erreur."
          />
          <h3 className="eyebrow mt-7 mb-3">Langues des visites</h3>
          <RankTable rows={labelled(top(s.locales, 3), localeLabel)} label="Langue" valueLabel="Visites" empty="–" />
        </Panel>
      </div>
    </main>
  );
}
