import { top } from "@koda/analytics";
import Link from "next/link";
import { DailyBars } from "@/components/bars";
import { LiveFeed } from "@/components/live-feed";
import { Funnel, Panel, RankTable } from "@/components/panels";
import { Sections } from "@/components/sections";
import { isPeriod, loadSummary, PERIODS, type Period } from "@/lib/analytics";
import { kpisOf } from "@/lib/kpis";
import { errorLabel, labelled, localeLabel, productLabel, trackLabel } from "@/lib/labels";
import { shopUrl } from "@/lib/newsletter";

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
  const colors = Object.values(s.colors)
    .sort((a, b) => b.units - a.units || b.addToCart - a.addToCart || b.views - a.views)
    .slice(0, 12);
  const sources = Object.entries(s.sources).sort(
    (a, b) => b[1].revenue - a[1].revenue || b[1].sessions - a[1].sessions,
  );
  const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
  const soldOutLabel = (key: string) => {
    const [productId, colorKey, size] = key.split("|");
    return `${productLabel(productId)} · ${colorKey} · ${size}`;
  };
  const sizeLabel = (key: string) => {
    const [productId, size] = key.split("|");
    return `${productLabel(productId)} · ${size}`;
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
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
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`${shopUrl()}/?koda_internal=1`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm"
            title="Ouvre la boutique en marquant ce navigateur comme interne : ses visites ne seront plus comptées."
          >
            Exclure mon navigateur
          </a>
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
      <Sections
        items={[
          {
            id: "essentiel",
            label: "Essentiel",
            children: (
              <>
                <section aria-label="Indicateurs clés" className="mt-10">
                  <div className="grid grid-cols-2 gap-3 md:gap-5 xl:grid-cols-4">
                    {kpis.map((k) => (
                      <div key={k.key} className="card max-md:p-4">
                        <p className="eyebrow">{k.label}</p>
                        <p className="kpi-value">{k.value}</p>
                        <p className="mt-3 text-sm text-muted">{k.hint}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted">
                    Une visite = un passage sur la boutique. Les pourcentages sont des parts de visites (une même visite
                    peut ouvrir plusieurs fiches : on la compte une fois).
                  </p>
                </section>
              </>
            ),
          },
          {
            id: "courbes",
            label: "Courbes",
            children: (
              <>
                <div className="mt-8 grid gap-5 md:gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <Panel title="Pages vues par jour" hint={`${period} jours`}>
                    <DailyBars points={s.daily} metric="pageViews" label="Pages vues" />
                  </Panel>
                  <Panel title="Commandes par jour" hint={`${period} jours`}>
                    <DailyBars points={s.daily} metric="orders" label="Commandes" />
                  </Panel>
                </div>
              </>
            ),
          },
          {
            id: "parcours",
            label: "Parcours & produits",
            children: (
              <>
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
              </>
            ),
          },
          {
            id: "ventes",
            label: "Ventes & réassort",
            children: (
              <>
                <div className="mt-8 grid gap-5 md:gap-6 lg:grid-cols-2">
                  <Panel title="Par coloris" hint="fiches vues, ajouts au panier et commandes : la base des réassorts">
                    {colors.length === 0 ? (
                      <p className="text-[15px] text-muted">Aucune donnée par coloris sur la période.</p>
                    ) : (
                      <table className="w-full text-[15px]">
                        <thead className="text-left text-sm text-muted">
                          <tr>
                            <th scope="col" className="pb-2 font-medium">
                              Produit · coloris
                            </th>
                            <th scope="col" className="pb-2 text-right font-medium">
                              Vues
                            </th>
                            <th scope="col" className="pb-2 text-right font-medium">
                              Ajouts
                            </th>
                            <th scope="col" className="pb-2 text-right font-medium">
                              Commandes
                            </th>
                            <th scope="col" className="pb-2 text-right font-medium">
                              Conversion
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {colors.map((c) => (
                            <tr key={`${c.productId}|${c.colorKey}`} className="border-t border-line">
                              <td className="py-3 pr-3 font-medium">
                                {productLabel(c.productId)} <span className="text-muted">· {c.colorKey}</span>
                              </td>
                              <td className="py-3 text-right tabular-nums">{c.views}</td>
                              <td className="py-3 text-right tabular-nums">{c.addToCart}</td>
                              <td className="py-3 text-right tabular-nums">{c.units}</td>
                              <td className="py-3 text-right tabular-nums">
                                {c.views ? `${Math.round((c.orders / c.views) * 100)} %` : "–"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </Panel>
                  <Panel title="Demande non servie" hint="clics sur une taille épuisée : ce qu'il faut réassortir">
                    <RankTable
                      rows={top(s.soldOutClicks, 10).map(([k, v]) => [soldOutLabel(k), v])}
                      label="Produit · coloris · taille"
                      valueLabel="Clics"
                      empty="Aucun clic sur une rupture."
                    />
                    <h3 className="eyebrow mt-7 mb-3">Tailles ajoutées au panier</h3>
                    <RankTable
                      rows={Object.entries(s.sizes)
                        .map(([k, v]) => [sizeLabel(k), v.addToCart] as [string, number])
                        .filter(([, v]) => v > 0)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)}
                      label="Produit · taille"
                      valueLabel="Ajouts"
                      empty="Aucun ajout."
                    />
                  </Panel>
                  <Panel title="Panier" hint="valeur et composition des commandes">
                    <dl className="grid grid-cols-2 gap-4 text-[15px] sm:grid-cols-4">
                      <div>
                        <dt className="text-sm text-muted">Panier moyen</dt>
                        <dd className="mt-1 font-display text-2xl font-bold">{eur(s.baskets.averageBasket)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">Articles / commande</dt>
                        <dd className="mt-1 font-display text-2xl font-bold">{s.baskets.itemsPerOrder || "–"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">Commandes multi-articles</dt>
                        <dd className="mt-1 font-display text-2xl font-bold">
                          {s.baskets.orders ? `${Math.round(s.baskets.multiItemShare * 100)} %` : "–"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted">Paniers ouverts · retraits</dt>
                        <dd className="mt-1 font-display text-2xl font-bold">
                          {s.cart.views} · {s.cart.removals}
                        </dd>
                      </div>
                    </dl>
                    <h3 className="eyebrow mt-7 mb-3">Codes promo</h3>
                    <RankTable
                      rows={Object.entries(s.promos).map(
                        ([k, v]) => [`${k} (${eur(v.revenue)})`, v.orders] as [string, number],
                      )}
                      label="Code"
                      valueLabel="Commandes"
                      empty="Aucun code promo utilisé."
                    />
                  </Panel>
                  <Panel title="D'où viennent les ventes" hint="utm_source, sinon site d'origine, sinon direct">
                    <table className="w-full text-[15px]">
                      <thead className="text-left text-sm text-muted">
                        <tr>
                          <th scope="col" className="pb-2 font-medium">
                            Source
                          </th>
                          <th scope="col" className="pb-2 text-right font-medium">
                            Visites
                          </th>
                          <th scope="col" className="pb-2 text-right font-medium">
                            Commandes
                          </th>
                          <th scope="col" className="pb-2 text-right font-medium">
                            CA
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sources.map(([name, v]) => (
                          <tr key={name} className="border-t border-line">
                            <td className="py-3 pr-3 font-medium">{name}</td>
                            <td className="py-3 text-right tabular-nums">{v.sessions}</td>
                            <td className="py-3 text-right tabular-nums">{v.orders}</td>
                            <td className="py-3 text-right tabular-nums">{eur(v.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {Object.keys(s.campaigns).length > 0 && (
                      <>
                        <h3 className="eyebrow mt-7 mb-3">Campagnes (utm_campaign)</h3>
                        <RankTable
                          rows={Object.entries(s.campaigns).map(
                            ([k, v]) => [`${k} (${eur(v.revenue)})`, v.sessions] as [string, number],
                          )}
                          label="Campagne"
                          valueLabel="Visites"
                          empty="–"
                        />
                      </>
                    )}
                    <h3 className="eyebrow mt-7 mb-3">Inscriptions newsletter</h3>
                    <RankTable
                      rows={top(s.newsletterSignups, 5)}
                      label="Origine"
                      valueLabel="Inscrits"
                      empty="Aucune inscription."
                    />
                  </Panel>
                </div>
              </>
            ),
          },
          {
            id: "pages",
            label: "Pages, clics & frictions",
            children: (
              <>
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
                    <RankTable
                      rows={labelled(top(s.locales, 3), localeLabel)}
                      label="Langue"
                      valueLabel="Visites"
                      empty="–"
                    />
                  </Panel>
                </div>
              </>
            ),
          },
        ]}
      />
    </main>
  );
}
