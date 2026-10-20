import { listSubscribers } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

/** Export CSV des inscrits actifs (derrière la session admin). */
export async function GET() {
  const rows = (await listSubscribers()).filter((s) => s.status === "subscribed");
  const csv = [
    "email;locale;source;inscrit_le",
    ...rows.map((s) => `${s.email};${s.locale};${s.source};${s.subscribed_at.slice(0, 10)}`),
  ].join("\n");
  return new Response(`\ufeff${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
