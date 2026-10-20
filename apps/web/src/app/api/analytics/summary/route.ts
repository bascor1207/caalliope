import { analyticsStore, summarize } from "@/slices/analytics/public-server";

/**
 * Synthèse analytics (30 derniers jours) : utile en diagnostic et pour les tests de bout en bout.
 * Le vrai dashboard est l'application admin, qui lit le même store. Protégée par ADMIN_TOKEN.
 */
export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const auth = request.headers.get("authorization");
  if (!token || auth !== `Bearer ${token}`) return new Response("Unauthorized", { status: 401 });
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 86_400_000);
  return Response.json(summarize(await analyticsStore.read({ from, to }), { from, to }));
}
