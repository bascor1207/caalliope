import type { Metadata } from "next";
import Link from "next/link";
import { listCampaigns } from "@/lib/newsletter";
import { newCampaign, removeCampaign } from "../actions";

export const metadata: Metadata = { title: "Campagnes" };
export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const STATUS = { draft: "Brouillon", sending: "En cours", sent: "Envoyée" } as const;

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Campagnes</h1>
          <p className="mt-3 text-[15px] text-muted">
            Un e-mail par drop. Rédige, prévisualise dans Gmail, Outlook et Apple Mail, teste, envoie.
          </p>
        </div>
      </header>
      <form action={newCampaign} className="mt-8">
        <button type="submit" className="rounded-full bg-ink px-5 py-3 font-display text-sm font-semibold text-cream">
          Nouvelle campagne
        </button>
      </form>
      <section className="card mt-6 overflow-x-auto" aria-label="Campagnes">
        {campaigns.length === 0 ? (
          <p className="text-[15px] text-muted">Aucune campagne. Crée la première.</p>
        ) : (
          <table className="w-full text-[15px]">
            <thead className="text-left text-sm text-muted">
              <tr>
                <th scope="col" className="pb-3 font-medium">
                  Objet
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Statut
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Envoyés
                </th>
                <th scope="col" className="pb-3 font-medium">
                  Date
                </th>
                <th scope="col" className="pb-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="py-3 pr-3 font-medium">
                    <Link href={`/newsletter/campagnes/${c.id}`} className="underline underline-offset-4">
                      {c.subject || "(sans objet)"}
                    </Link>
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === "sent" ? "bg-success/10 text-success" : c.status === "sending" ? "bg-sand" : "bg-ink/6"}`}
                    >
                      {STATUS[c.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">
                    {c.sent}
                    {c.failed ? ` (${c.failed} échecs)` : ""}
                  </td>
                  <td className="py-3 pr-3 text-muted">{fmt(c.sentAt ?? c.createdAt)}</td>
                  <td className="py-3 text-right">
                    {c.status === "draft" && (
                      <form action={removeCampaign}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-danger hover:text-danger"
                        >
                          Supprimer
                        </button>
                      </form>
                    )}
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
