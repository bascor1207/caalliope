import { describe, expect, it } from "vitest";
import { credentials, issueToken, safeEqual, verifyToken } from "../src/lib/auth";

describe("session admin", () => {
  it("signe et vérifie un jeton, refuse un jeton altéré ou expiré", async () => {
    const token = await issueToken("secret", 1_000_000_000_000);
    expect(await verifyToken("secret", token, 1_000_000_000_000)).toBe(true);
    expect(await verifyToken("autre", token, 1_000_000_000_000)).toBe(false);
    expect(await verifyToken("secret", `${token}x`, 1_000_000_000_000)).toBe(false);
    expect(await verifyToken("secret", token, 1_000_000_000_000 + 8 * 86_400_000)).toBe(false);
    expect(await verifyToken("secret", undefined)).toBe(false);
  });

  it("compare à temps constant et n'a pas de mot de passe par défaut en production", () => {
    expect(safeEqual("koda", "koda")).toBe(true);
    expect(safeEqual("koda", "kodb")).toBe(false);
    expect(credentials({ NODE_ENV: "production" })).toBeNull();
    expect(credentials({ NODE_ENV: "development" })?.password).toBe("koda");
    expect(credentials({ ADMIN_PASSWORD: "p", ADMIN_SECRET: "s", NODE_ENV: "production" })).toEqual({
      password: "p",
      secret: "s",
    });
  });
});
