import { credentials } from "@/lib/auth";
import { CORS, registerClient } from "@/lib/oauth";

/** Enregistrement dynamique d'un client (RFC 7591) : claude.ai l'appelle avant la première connexion. */
export async function POST(req: Request) {
  const creds = credentials(process.env);
  if (!creds) return Response.json({ error: "server_error" }, { status: 500, headers: CORS });
  let body: { client_name?: string; redirect_uris?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_client_metadata" }, { status: 400, headers: CORS });
  }
  const redirect_uris = Array.isArray(body.redirect_uris) ? body.redirect_uris.map(String) : [];
  try {
    const client = await registerClient(creds.secret, { client_name: body.client_name, redirect_uris });
    return Response.json(
      {
        ...client,
        client_id_issued_at: Math.floor(Date.now() / 1000),
        token_endpoint_auth_method: "none",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
      },
      { status: 201, headers: CORS },
    );
  } catch {
    return Response.json(
      { error: "invalid_redirect_uri", error_description: "redirect_uris doit contenir au moins une URL https." },
      { status: 400, headers: CORS },
    );
  }
}
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
