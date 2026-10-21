import { getPublicOrigin } from "mcp-handler";
import { CORS, protectedResourceMetadata } from "@/lib/oauth";

/** Répond à `/.well-known/oauth-protected-resource` et à la variante par chemin (`…/api/mcp`). */
export const GET = (req: Request) => Response.json(protectedResourceMetadata(getPublicOrigin(req)), { headers: CORS });
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
