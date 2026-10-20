import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone } from "@/shared/kernel/phone";

describe("téléphone", () => {
  it("normalise un numéro français en E.164", () => {
    expect(normalizePhone("0652599271")).toBe("+33652599271");
    expect(normalizePhone("652599271")).toBe("+33652599271");
    expect(normalizePhone("06 52 59 92 71")).toBe("+33652599271");
    expect(normalizePhone("0033652599271")).toBe("+33652599271");
    expect(normalizePhone("+33 6 52 59 92 71")).toBe("+33652599271");
    expect(normalizePhone("")).toBe("");
  });
  it("garde un indicatif étranger", () => {
    expect(normalizePhone("+44 7700 900123")).toBe("+447700900123");
  });
  it("affiche avec l'indicatif et des groupes lisibles", () => {
    expect(formatPhone("0652599271")).toBe("+33 6 52 59 92 71");
    expect(formatPhone("+33652599271")).toBe("+33 6 52 59 92 71");
    expect(formatPhone("+447700900123")).toBe("+44 7700 900 123");
  });
});
