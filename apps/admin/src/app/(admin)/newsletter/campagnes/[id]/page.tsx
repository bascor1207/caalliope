import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveTransport, transportLabel } from "@/lib/mailer";
import { getCampaign, renderOptionsFor, subscriberStats } from "@/lib/newsletter";
import { CampaignEditor } from "./editor";

export const metadata: Metadata = { title: "Campagne" };
export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [campaign, stats, transport] = await Promise.all([getCampaign(id), subscriberStats(), resolveTransport()]);
  if (!campaign) notFound();
  return (
    <main className="mx-auto w-[min(1480px,100%-40px)] py-10 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Newsletter · Campagne</p>
          <h1 className="mt-2 text-[clamp(28px,3.5vw,40px)] leading-none tracking-[-0.03em]">
            {campaign.subject || "Nouvelle campagne"}
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {stats.active} destinataire{stats.active > 1 ? "s" : ""} actif{stats.active > 1 ? "s" : ""}
            {campaign.status === "sent" ? ` · envoyée (${campaign.sent} envois, ${campaign.failed} échecs)` : ""}
            {` · ${transportLabel(transport)}`}
          </p>
        </div>
      </header>
      <CampaignEditor
        campaign={campaign}
        renderOptions={renderOptionsFor("apercu")}
        locked={campaign.status !== "draft"}
      />
    </main>
  );
}
