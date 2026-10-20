/**
 * Gabarit d'e-mail de campagne : tableaux et styles en ligne, compatible Gmail, Outlook (desktop et web),
 * Apple Mail, Yahoo. Pur : utilisé côté serveur pour l'envoi et côté client pour la prévisualisation.
 */
export interface CampaignContent {
  subject: string;
  preheader: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string;
}

export interface RenderOptions {
  shopUrl: string;
  unsubscribeUrl: string;
  logoUrl: string;
  /** Variante sans arrondis ni dégradés (Outlook desktop ignore ces propriétés). */
  outlook?: boolean;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Corps : paragraphes séparés par une ligne vide, **gras** et liens [texte](url). */
const P_STYLE = "margin:0 0 16px;font-size:16px;line-height:1.6;color:#3a3a3a";
const H_STYLE =
  "margin:24px 0 12px;font-size:22px;line-height:1.2;font-weight:600;letter-spacing:-0.02em;color:#141414";
const LI_STYLE = "margin:0 0 8px;font-size:16px;line-height:1.6;color:#3a3a3a";
const A_STYLE = "color:#141414;text-decoration:underline";

/** Le corps vient-il de l'éditeur riche (HTML) ou de l'ancien format texte ? */
export const isRichBody = (body: string) => /<(p|h[1-6]|ul|ol|strong|em|a|br)\b/i.test(body);

/**
 * Nettoie le HTML de l'éditeur pour un e-mail : balises autorisées seulement, attributs limités à `href`,
 * styles inline (les clients mail ignorent les feuilles de style). Tout le reste est retiré, texte conservé.
 */
export function sanitizeEmailHtml(html: string): string {
  const allowed = new Set(["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "h2", "h3"]);
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (whole, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      const closing = whole.startsWith("</");
      if (!allowed.has(tag)) return "";
      if (closing) return `</${tag === "b" ? "strong" : tag === "i" ? "em" : tag}>`;
      if (tag === "br") return "<br>";
      if (tag === "a") {
        const m = attrs.match(/href\s*=\s*"([^"]*)"|href\s*=\s*'([^']*)'/i);
        const href = (m?.[1] ?? m?.[2] ?? "").trim();
        const safe = /^(https?:\/\/|mailto:)/i.test(href) ? href : "#";
        return `<a href="${esc(safe)}" style="${A_STYLE}">`;
      }
      if (tag === "p") return `<p style="${P_STYLE}">`;
      if (tag === "h2" || tag === "h3") return `<${tag} style="${H_STYLE}">`;
      if (tag === "li") return `<li style="${LI_STYLE}">`;
      if (tag === "ul" || tag === "ol") return `<${tag} style="margin:0 0 16px;padding-left:22px">`;
      if (tag === "b") return "<strong>";
      if (tag === "i") return "<em>";
      return `<${tag}>`;
    });
}

/** Texte brut depuis le HTML riche : paragraphes et listes sur des lignes, liens en « texte (url) ». */
export function richToText(html: string): string {
  return html
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, text: string) => `${text} (${href})`)
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/(p|h[1-6]|li|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Ancien format texte (paragraphes, **gras**, [lien](url)) converti en HTML simple pour l'éditeur riche. */
export function legacyToHtml(body: string): string {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p>${esc(p)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
          .replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

export function bodyToHtml(body: string): string {
  if (isRichBody(body)) return sanitizeEmailHtml(body);
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
        '<a href="$2" style="color:#141414;text-decoration:underline">$1</a>',
      )
      .replace(/\n/g, "<br>");
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3a3a3a">${inline(p)}</p>`)
    .join("");
}

export function bodyToText(c: CampaignContent, o: RenderOptions): string {
  const body = isRichBody(c.body)
    ? richToText(c.body)
    : c.body.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1 ($2)");
  return [
    c.title,
    "",
    body,
    "",
    c.ctaLabel && c.ctaUrl ? `${c.ctaLabel} : ${c.ctaUrl}` : "",
    "",
    `KODA Clothing · ${o.shopUrl}`,
    `Se désinscrire : ${o.unsubscribeUrl}`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

export function renderCampaignHtml(c: CampaignContent, o: RenderOptions): string {
  const r = (px: number) => (o.outlook ? "0" : `${px}px`);
  const font = o.outlook ? "Arial, Helvetica, sans-serif" : "'Outfit', 'Instrument Sans', Helvetica, Arial, sans-serif";
  const cta =
    c.ctaLabel && c.ctaUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0"><tr><td bgcolor="#141414" style="border-radius:${r(999)};background:#141414">
           <a href="${esc(c.ctaUrl)}" style="display:inline-block;padding:14px 26px;font-family:${font};font-size:15px;font-weight:600;color:#f6f1ea;text-decoration:none;border-radius:${r(999)}">${esc(c.ctaLabel)}</a>
         </td></tr></table>`
      : "";
  const image = c.imageUrl
    ? `<tr><td style="padding:0 0 24px"><img src="${esc(c.imageUrl)}" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border-radius:${r(20)}"></td></tr>`
    : "";
  return `<!doctype html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark">
<title>${esc(c.subject)}</title>
<style>
  @media (prefers-color-scheme: dark) { .bg { background:#1b1b1b !important } .card { background:#242424 !important } .ink { color:#f6f1ea !important } .ink2 { color:#d8d2ca !important } .muted { color:#a39e97 !important } }
  @media only screen and (max-width: 620px) { .wrap { width:100% !important } .pad { padding:24px 20px !important } }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:#f6f1ea;font-family:${font}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(c.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:#f6f1ea">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:100%">
    <tr><td style="padding:0 0 20px" align="left">
      <a href="${esc(o.shopUrl)}" style="text-decoration:none"><img src="${esc(o.logoUrl)}" width="44" height="44" alt="KODA" style="display:inline-block;vertical-align:middle;border-radius:${r(22)}"><span class="ink" style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:${font};font-size:20px;font-weight:600;letter-spacing:-0.03em;color:#141414">KODA</span></a>
    </td></tr>
    <tr><td class="card pad" bgcolor="#ffffff" style="background:#ffffff;border-radius:${r(24)};padding:36px 40px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${image}
        <tr><td><h1 class="ink" style="margin:0 0 16px;font-family:${font};font-size:30px;line-height:1.1;font-weight:600;letter-spacing:-0.025em;color:#141414">${esc(c.title)}</h1></td></tr>
        <tr><td class="ink2">${bodyToHtml(c.body)}</td></tr>
        <tr><td>${cta}</td></tr>
      </table>
    </td></tr>
    <tr><td class="muted" style="padding:24px 8px 0;font-family:${font};font-size:12px;line-height:1.6;color:#6b6661" align="center">
      KODA Clothing · More than clothing<br>
      <a href="${esc(o.unsubscribeUrl)}" class="muted" style="color:#6b6661;text-decoration:underline">Se désinscrire</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}
