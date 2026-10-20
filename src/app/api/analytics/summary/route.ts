import { analyticsSink, summarize } from "@/slices/analytics/public-server";

/**
 * Synthèse analytics pour le futur dashboard d'administration.
 * Protégée par un jeton (ADMIN_TOKEN) en attendant la vraie authentification de l'admin.
 */
export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const auth = request.headers.get("authorization");
  if (!token || auth !== `Bearer ${token}`) return new Response("Unauthorized", { status: 401 });
  return Response.json(summarize(await analyticsSink.readAll()));
}
