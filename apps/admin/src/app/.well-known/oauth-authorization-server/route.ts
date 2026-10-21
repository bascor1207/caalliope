import { getPublicOrigin } from "mcp-handler";
import { authorizationServerMetadata, CORS } from "@/lib/oauth";

export const GET = (req: Request) =>
  Response.json(authorizationServerMetadata(getPublicOrigin(req)), { headers: CORS });
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
