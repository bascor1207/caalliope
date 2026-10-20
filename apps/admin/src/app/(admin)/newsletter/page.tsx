import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { listSubscribers, subscriberStats } from "@/lib/newsletter";
import { removeSubscriber } from "./actions";

export const metadata: Metadata = { title: "Newsletter" };
export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default async function NewsletterPage() {
  const [stats, subscribers] = await Promise.all([subscriberStats(), listSubscribers()]);
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Newsletter</h1>
          <p className="mt-3 text-[15px] text-muted">
            Les inscrits depuis la boutique. Les campagnes partent à tous les inscrits actifs.
          </p>
        </div>
      </header>
      <section className="mt-10 grid gap-4 sm:grid-cols-3 md:gap-5" aria-label="Chiffres">
        {[
          ["Inscrits actifs", stats.active],
          ["Nouveaux sur 30 jours", stats.last30],
          ["Désinscrits", stats.total - stats.active],
        ].map(([label, value]) => (
          <div key={label} className="card">
            <p className="eyebrow">{label}</p>
            <p className="kpi-value">{value}</p>
          </div>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/newsletter/campagnes"
          className="rounded-full bg-ink px-5 py-3 font-display text-sm font-semibold text-cream"
        >
          Campagnes
        </Link>
        <a
          href="/newsletter/export"
          className="rounded-full border border-line bg-white px-5 py-3 font-display text-sm font-semibold hover:border-ink"
        >
          Exporter en CSV
        </a>
      </div>
      <section className="card mt-6 overflow-x-auto" aria-label="Inscrits">
        {subscribers.length === 0 ? (
          <p className="text-[15px] text-muted">Aucun inscrit pour l'instant.</p>
        ) : (
          <table className="w-full text-[15px]">
            <thead className="text-left text-sm text-muted">
              <tr>
                <th scope="col" className="pb-3 font-medium">
                  E-mail
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Langue
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Source
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Inscrit le
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Statut
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="py-3 pr-3 font-medium">{s.email}</td>
                  <td className="py-3 pr-3 uppercase text-muted">{s.locale}</td>
                  <td className="py-3 pr-3 text-muted">{s.source}</td>
                  <td className="py-3 pr-3 text-muted">{fmt(s.subscribed_at)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.status === "subscribed" ? "bg-success/10 text-success" : "bg-ink/6 text-muted"}`}
                    >
                      {s.status === "subscribed" ? "actif" : "désinscrit"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <form action={removeSubscriber}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmit
                        message={`Supprimer ${s.email} de la liste ? Définitif.`}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-danger hover:border-danger"
                      >
                        Supprimer
                      </ConfirmSubmit>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
