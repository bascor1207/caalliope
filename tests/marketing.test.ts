import { describe, expect, it } from "vitest";
import { liveBanners } from "@/slices/marketing/domain/banner";

const base = { message: { fr: "FR", en: "EN" }, active: true, order: 1 };

describe("bannières marketing", () => {
  it("ne diffuse que les bannières actives dans leur fenêtre, triées, dans la bonne langue", () => {
    const now = new Date("2026-11-25T12:00:00Z");
    const banners = liveBanners(
      [
        { ...base, id: "b", order: 2 },
        { ...base, id: "a", order: 1, message: { fr: "Bonjour", en: "Hello" } },
        { ...base, id: "off", active: false },
        { ...base, id: "past", endsAt: "2026-11-01T00:00:00Z" },
        { ...base, id: "future", startsAt: "2026-12-01T00:00:00Z" },
        { ...base, id: "window", order: 0, startsAt: "2026-11-20T00:00:00Z", endsAt: "2026-12-01T00:00:00Z" },
      ],
      "en",
      now,
    );
    expect(banners.map((b) => b.id)).toEqual(["window", "a", "b"]);
    expect(banners[1].message).toBe("Hello");
  });
});
