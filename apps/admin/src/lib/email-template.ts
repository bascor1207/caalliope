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
export function bodyToHtml(body: string): string {
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
  const body = c.body.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, "$1 ($2)");
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
