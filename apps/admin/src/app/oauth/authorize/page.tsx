import type { Metadata } from "next";
import { type AuthorizeRequest, approveAuthorization, denyAuthorization, inspectAuthorizeRequest } from "./actions";

export const metadata: Metadata = { title: "Autoriser un assistant", robots: { index: false } };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<Partial<AuthorizeRequest> & { error?: string }>;
}

/**
 * Écran de consentement OAuth : l'admin (déjà connecté, le proxy l'impose) autorise un assistant IA
 * (claude.ai, ChatGPT, Cursor…) à piloter le back-office via le MCP.
 */
export default async function AuthorizePage({ searchParams }: Props) {
  const q = await searchParams;
  const request: AuthorizeRequest = {
    client_id: q.client_id ?? "",
    redirect_uri: q.redirect_uri ?? "",
    state: q.state,
    code_challenge: q.code_challenge ?? "",
    code_challenge_method: q.code_challenge_method,
    scope: q.scope,
    response_type: q.response_type,
  };
  const check = q.error ? { ok: false as const, error: q.error } : await inspectAuthorizeRequest(request);
  const host = (() => {
    try {
      return new URL(request.redirect_uri).hostname;
    } catch {
      return "";
    }
  })();

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="card w-full max-w-[460px] p-7">
        <p className="eyebrow">KODA Clothing · MCP</p>
        <h1 className="mt-2 text-[28px] tracking-[-0.03em]">Autoriser un assistant</h1>
        {check.ok ? (
          <>
            <p className="mt-3 text-[15px] text-ink-2">
              <b>{check.client.name}</b>
              {host ? <span className="text-muted"> ({host})</span> : null} demande à gérer le back-office : catalogue,
              marketing, newsletter, réglages et statistiques, avec les mêmes droits que toi.
            </p>
            <p className="mt-2 text-sm text-muted">
              L'accès dure 30 jours puis se renouvelle tout seul tant que tu ne changes pas ADMIN_SECRET.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <form action={denyAuthorization}>
                <input type="hidden" name="redirect_uri" value={request.redirect_uri} />
                <input type="hidden" name="state" value={request.state ?? ""} />
                <button type="submit" className="btn-ghost w-full">
                  Refuser
                </button>
              </form>
              <form action={approveAuthorization}>
                {(Object.entries(request) as [string, string | undefined][]).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v ?? ""} />
                ))}
                <button type="submit" className="btn w-full">
                  Autoriser
                </button>
              </form>
            </div>
          </>
        ) : (
          <p className="mt-3 rounded-[12px] bg-danger/10 p-3 text-sm text-danger" role="alert">
            {check.error}
          </p>
        )}
      </div>
    </main>
  );
}
