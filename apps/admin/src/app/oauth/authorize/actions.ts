"use server";

import { redirect } from "next/navigation";
import { credentials } from "@/lib/auth";
import { issueCode, readClient, SCOPE } from "@/lib/oauth";

export interface AuthorizeRequest {
  client_id: string;
  redirect_uri: string;
  state?: string;
  code_challenge: string;
  code_challenge_method?: string;
  scope?: string;
  response_type?: string;
}

/** Vérifie la demande d'autorisation ; renvoie le client ou la raison du refus. */
export async function inspectAuthorizeRequest(q: AuthorizeRequest) {
  const creds = credentials(process.env);
  if (!creds) return { ok: false as const, error: "Serveur non configuré (ADMIN_SECRET)." };
  const client = await readClient(creds.secret, q.client_id);
  if (!client) return { ok: false as const, error: "Client inconnu : l'application doit d'abord s'enregistrer." };
  if (!client.redirects.includes(q.redirect_uri)) {
    return { ok: false as const, error: "URI de redirection non enregistrée pour ce client." };
  }
  if (q.response_type && q.response_type !== "code")
    return { ok: false as const, error: "response_type non pris en charge." };
  if (!q.code_challenge || (q.code_challenge_method ?? "S256") !== "S256") {
    return { ok: false as const, error: "PKCE (S256) est obligatoire." };
  }
  return { ok: true as const, client };
}

const back = (q: AuthorizeRequest, params: Record<string, string>) => {
  const url = new URL(q.redirect_uri);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (q.state) url.searchParams.set("state", q.state);
  return url.toString();
};

/** L'admin connecté accepte : code signé (5 min), retour chez le client avec `code` et `state`. */
export async function approveAuthorization(formData: FormData) {
  const q = Object.fromEntries(
    (
      [
        "client_id",
        "redirect_uri",
        "state",
        "code_challenge",
        "code_challenge_method",
        "scope",
        "response_type",
      ] as const
    ).map((k) => [k, String(formData.get(k) ?? "")]),
  ) as unknown as AuthorizeRequest;
  const check = await inspectAuthorizeRequest(q);
  if (!check.ok) redirect(`/oauth/authorize?error=${encodeURIComponent(check.error)}`);
  const creds = credentials(process.env);
  if (!creds) redirect("/oauth/authorize?error=config");
  const code = await issueCode(creds.secret, {
    client_id: q.client_id,
    redirect_uri: q.redirect_uri,
    code_challenge: q.code_challenge,
    scope: SCOPE,
  });
  redirect(back(q, { code }));
}

export async function denyAuthorization(formData: FormData) {
  const redirect_uri = String(formData.get("redirect_uri") ?? "");
  const state = String(formData.get("state") ?? "");
  if (!redirect_uri) redirect("/");
  redirect(back({ client_id: "", redirect_uri, state, code_challenge: "" }, { error: "access_denied" }));
}
