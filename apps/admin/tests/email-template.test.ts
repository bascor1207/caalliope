import { describe, expect, it } from "vitest";
import { bodyToHtml, isRichBody, legacyToHtml, richToText, sanitizeEmailHtml } from "@/lib/email-template";

describe("e-mail riche", () => {
  it("ne garde que les balises sûres, avec des styles inline", () => {
    const html = sanitizeEmailHtml(
      '<p>Salut <strong>toi</strong> <script>alert(1)</script><span onclick="x">ok</span> <a href="javascript:evil()" target="_blank">lien</a></p>',
    );
    expect(html).not.toContain("script");
    expect(html).not.toContain("onclick");
    expect(html).toContain('<p style="');
    expect(html).toContain("<strong>toi</strong>");
    expect(html).toContain('<a href="#" style=');
    expect(html).toContain("ok");
  });
  it("garde les liens https et convertit b/i en strong/em", () => {
    expect(sanitizeEmailHtml('<b>x</b><i>y</i><a href="https://koda.fr">z</a>')).toBe(
      '<strong>x</strong><em>y</em><a href="https://koda.fr" style="color:#141414;text-decoration:underline">z</a>',
    );
  });
  it("détecte l'ancien format texte et le convertit", () => {
    expect(isRichBody("Bonjour **toi**")).toBe(false);
    expect(legacyToHtml("Bonjour **toi**\n\n[Voir](https://koda.fr)")).toBe(
      '<p>Bonjour <strong>toi</strong></p><p><a href="https://koda.fr">Voir</a></p>',
    );
    expect(bodyToHtml("Bonjour **toi**")).toContain("<strong>toi</strong>");
  });
  it("produit un texte brut lisible", () => {
    expect(
      richToText('<p>Salut <strong>toi</strong></p><ul><li>Un</li><li><a href="https://k.fr">Deux</a></li></ul>'),
    ).toBe("Salut toi\n• Un\n• Deux (https://k.fr)");
  });
});
