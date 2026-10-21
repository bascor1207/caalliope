import { credentials } from "@/lib/auth";
import { CORS, type CodePayload, issueTokens, pkceMatches, readClient, readRefreshToken, verify } from "@/lib/oauth";

const fail = (error: string, description?: string, status = 400) =>
  Response.json({ error, error_description: description }, { status, headers: CORS });

async function params(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return (await req.json()) as Record<string, string>;
  const form = await req.formData();
  return Object.fromEntries(Array.from(form.entries()).map(([k, v]) => [k, String(v)]));
}

/** Échange code → jetons (PKCE obligatoire) et rafraîchissement. Réponses au format RFC 6749. */
export async function POST(req: Request) {
  const creds = credentials(process.env);
  if (!creds) return fail("server_error", "ADMIN_SECRET manquant", 500);
  let p: Record<string, string>;
  try {
    p = await params(req);
  } catch {
    return fail("invalid_request");
  }

  if (p.grant_type === "authorization_code") {
    const code = await verify<CodePayload>(creds.secret, p.code, "code");
    if (!code) return fail("invalid_grant", "Code expiré ou invalide.");
    if (p.client_id && p.client_id !== code.client) return fail("invalid_grant", "client_id inattendu.");
    if (p.redirect_uri && p.redirect_uri !== code.redirect) return fail("invalid_grant", "redirect_uri inattendue.");
    if (!p.code_verifier || !(await pkceMatches(p.code_verifier, code.challenge))) {
      return fail("invalid_grant", "PKCE : code_verifier incorrect.");
    }
    if (!(await readClient(creds.secret, code.client))) return fail("invalid_client", undefined, 401);
    return Response.json(await issueTokens(creds.secret, code.client, code.scope), { headers: CORS });
  }

  if (p.grant_type === "refresh_token") {
    const refresh = await readRefreshToken(creds.secret, p.refresh_token);
    if (!refresh) return fail("invalid_grant", "refresh_token expiré ou invalide.");
    if (p.client_id && p.client_id !== refresh.client) return fail("invalid_grant", "client_id inattendu.");
    return Response.json(await issueTokens(creds.secret, refresh.client, refresh.scope), { headers: CORS });
  }

  return fail("unsupported_grant_type");
}
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
