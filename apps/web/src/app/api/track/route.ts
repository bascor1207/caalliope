import { ingest } from "@/slices/analytics/public-server";

/** Réception des événements analytics (sendBeacon / fetch keepalive). Pas de cookie, pas d'auth : données anonymes. */
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const accepted = await ingest(payload);
  return Response.json({ accepted }, { status: 202 });
}
