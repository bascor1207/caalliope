import type { Metadata } from "next";

export const metadata: Metadata = { title: "IA & automatisation" };

const TOOLS: Array<[string, string]> = [
  ["get_analytics", "statistiques d'audience et de ventes"],
  ["list_products / get_product / upsert_product / set_product_online / delete_product", "catalogue complet"],
  ["get_palette / save_palette", "coloris"],
  ["request_media_upload", "envoi de photos et vidéos"],
  ["get_marketing / set_video_block / save_banners", "vidéos de l'accueil et bandeau"],
  ["get_social / save_social", "réseaux sociaux et contact"],
  ["newsletter_stats / list_campaigns / upsert_campaign / send_test_campaign / send_campaign", "newsletter"],
  ["list_feature_flags / set_feature_flag / list_users", "réglages et comptes"],
];

/** Mode d'emploi du serveur MCP : brancher Claude, Cursor ou ChatGPT sur le back-office. */
export default function AiPage() {
  const endpoint = `${(process.env.ADMIN_URL ?? "https://kodaclothingadmin.vercel.app").replace(/\/$/, "")}/api/mcp`;
  const configured = Boolean(process.env.MCP_TOKEN);
  const config = JSON.stringify(
    { mcpServers: { "koda-admin": { url: endpoint, headers: { Authorization: "Bearer <MCP_TOKEN>" } } } },
    null,
    2,
  );
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
      <header>
        <p className="eyebrow">KODA Clothing</p>
        <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">IA & automatisation</h1>
        <p className="mt-3 text-[15px] text-muted">
          Le back-office expose un serveur MCP : une IA peut créer des fiches, rédiger des campagnes, changer les vidéos
          ou lire les stats, avec les mêmes règles que l'interface.
        </p>
      </header>

      <section className="card mt-10">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Connexion</h2>
        <p className="mt-1 text-sm text-muted">
          Adresse du serveur : <code className="rounded bg-ink/6 px-1.5 py-0.5 text-xs">{endpoint}</code> · jeton :{" "}
          {configured ? "configuré (variable MCP_TOKEN sur Vercel)" : "absent, pose MCP_TOKEN sur Vercel"}.
        </p>
        <p className="mt-4 text-sm font-semibold">
          Claude Desktop, Claude Code, Cursor (fichier de configuration MCP) :
        </p>
        <pre className="mt-2 overflow-x-auto rounded-[12px] bg-ink p-4 text-xs leading-relaxed text-cream">
          {config}
        </pre>
        <p className="mt-4 text-sm font-semibold">Claude Code en une commande :</p>
        <pre className="mt-2 overflow-x-auto rounded-[12px] bg-ink p-4 text-xs leading-relaxed text-cream">{`claude mcp add --transport http koda-admin ${endpoint} --header "Authorization: Bearer <MCP_TOKEN>"`}</pre>
        <p className="mt-4 text-xs text-muted">
          Le jeton donne tous les droits d'administration : ne le colle que dans un outil de confiance. Pour le changer,
          remplace MCP_TOKEN sur Vercel.
        </p>
      </section>

      <section className="card mt-6">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Ce que l'IA peut faire</h2>
        <ul className="mt-4 grid gap-2 text-sm">
          {TOOLS.map(([names, label]) => (
            <li key={names} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <code className="text-xs text-ink-2">{names}</code>
              <span className="text-muted">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted">
          Exemples : « Crée une fiche pour la casquette KODA, 29,99 €, noire et beige, tailles uniques », « Rédige une
          campagne pour le drop de novembre et envoie-moi un test », « Mets la bannière Black Friday du 24 au 30 ».
        </p>
      </section>
    </main>
  );
}
