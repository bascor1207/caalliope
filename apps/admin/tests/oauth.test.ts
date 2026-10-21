import { describe, expect, it } from "vitest";
import {
  b64url,
  type CodePayload,
  issueCode,
  issueTokens,
  pkceMatches,
  readAccessToken,
  readClient,
  readRefreshToken,
  registerClient,
  verify,
} from "@/lib/oauth";

const secret = "test-secret";
const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk".repeat(2).slice(0, 64);
const challenge = async () => b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));

describe("OAuth sans état", () => {
  it("enregistre un client avec ses URIs https, et refuse les autres", async () => {
    const client = await registerClient(secret, {
      client_name: "Claude",
      redirect_uris: ["https://claude.ai/api/mcp/auth_callback", "http://evil.example/cb", "http://localhost:3000/cb"],
    });
    expect(client.redirect_uris).toEqual(["https://claude.ai/api/mcp/auth_callback", "http://localhost:3000/cb"]);
    const read = await readClient(secret, client.client_id);
    expect(read?.name).toBe("Claude");
    expect(await readClient("other-secret", client.client_id)).toBeNull();
    await expect(registerClient(secret, { redirect_uris: ["http://evil.example/cb"] })).rejects.toThrow();
  });

  it("code → PKCE → jetons d'accès et de rafraîchissement", async () => {
    const { client_id } = await registerClient(secret, { redirect_uris: ["https://claude.ai/cb"] });
    const code = await issueCode(secret, {
      client_id,
      redirect_uri: "https://claude.ai/cb",
      code_challenge: await challenge(),
    });
    const payload = await verify<CodePayload>(secret, code, "code");
    expect(payload?.client).toBe(client_id);
    expect(await pkceMatches(verifier, payload?.challenge ?? "")).toBe(true);
    expect(await pkceMatches(`${verifier.slice(0, -1)}x`, payload?.challenge ?? "")).toBe(false);

    const tokens = await issueTokens(secret, client_id, "admin");
    expect((await readAccessToken(secret, tokens.access_token))?.scope).toBe("admin");
    expect(await readAccessToken(secret, tokens.refresh_token)).toBeNull();
    expect((await readRefreshToken(secret, tokens.refresh_token))?.client).toBe(client_id);
  });

  it("expire les codes et les jetons, et rejette toute signature altérée", async () => {
    const { client_id } = await registerClient(secret, { redirect_uris: ["https://claude.ai/cb"] });
    const now = Date.now();
    const code = await issueCode(secret, { client_id, redirect_uri: "https://claude.ai/cb", code_challenge: "c" }, now);
    expect(await verify(secret, code, "code", now + 6 * 60_000)).toBeNull();
    const tokens = await issueTokens(secret, client_id, "admin", now);
    expect(await verify(secret, tokens.access_token, "access", now + 2 * 3600_000)).toBeNull();
    expect(await verify(secret, `${tokens.access_token.slice(0, -2)}zz`, "access", now)).toBeNull();
  });
});
