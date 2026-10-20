"use client";

import { useActionState, useMemo, useState } from "react";
import { useToastOnState } from "@/components/toaster";
import { bodyToText, type CampaignContent, type RenderOptions, renderCampaignHtml } from "@/lib/email-template";
import type { Campaign } from "@/lib/newsletter";
import { type EditorState, launchCampaign, saveCampaign, sendTestCampaign } from "../../actions";

type ClientKey = "gmail" | "outlook" | "apple" | "text";
const CLIENTS: Array<{ key: ClientKey; label: string; width: number; note: string }> = [
  {
    key: "gmail",
    label: "Gmail",
    width: 760,
    note: "Gmail web : largeur 600 px, polices web ignorées, mode sombre selon le réglage du compte.",
  },
  {
    key: "outlook",
    label: "Outlook",
    width: 760,
    note: "Outlook Windows : pas d'arrondis ni d'images de fond, Arial. C'est la variante la plus stricte.",
  },
  {
    key: "apple",
    label: "Apple Mail",
    width: 390,
    note: "iPhone : 390 px de large, mode sombre système, polices web respectées.",
  },
  {
    key: "text",
    label: "Texte brut",
    width: 760,
    note: "Version texte envoyée en parallèle, lue par certains clients et les filtres anti-spam.",
  },
];

const input =
  "rounded-[12px] border-[1.5px] border-line bg-cream px-3.5 py-3 text-base outline-none focus:border-ink disabled:opacity-60";

export function CampaignEditor({
  campaign,
  renderOptions,
  locked,
}: {
  campaign: Campaign;
  renderOptions: RenderOptions;
  locked: boolean;
}) {
  const [content, setContent] = useState<CampaignContent>({
    subject: campaign.subject,
    preheader: campaign.preheader,
    title: campaign.title,
    body: campaign.body,
    ctaLabel: campaign.ctaLabel,
    ctaUrl: campaign.ctaUrl,
    imageUrl: campaign.imageUrl,
  });
  const [client, setClient] = useState<ClientKey>("gmail");
  const [dark, setDark] = useState(false);
  const [saveState, save, saving] = useActionState(saveCampaign.bind(null, campaign.id), {
    message: null,
    kind: null,
  } as EditorState);
  const [testState, test, testing] = useActionState(sendTestCampaign.bind(null, campaign.id), {
    message: null,
    kind: null,
  } as EditorState);
  const [sendState, send, sending] = useActionState(launchCampaign.bind(null, campaign.id), {
    message: null,
    kind: null,
  } as EditorState);
  useToastOnState(saveState);
  useToastOnState(testState);
  useToastOnState(sendState);
  const set = (k: keyof CampaignContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent((c) => ({ ...c, [k]: e.target.value }));

  const html = useMemo(
    () => renderCampaignHtml(content, { ...renderOptions, outlook: client === "outlook" }),
    [content, renderOptions, client],
  );
  const text = useMemo(() => bodyToText(content, renderOptions), [content, renderOptions]);
  const current = CLIENTS.find((c) => c.key === client) ?? CLIENTS[0];
  const srcdoc =
    dark && client !== "outlook"
      ? html.replace(
          "<head>",
          "<head><style>:root{color-scheme:dark}body,.bg{background:#1b1b1b!important}.card{background:#242424!important}.ink{color:#f6f1ea!important}.ink2,.ink2 p{color:#d8d2ca!important}.muted,.muted a{color:#a39e97!important}</style>",
        )
      : html;
  const feedback = [saveState, testState, sendState].find((s) => s.message);

  return (
    <form className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
      <div className="card grid content-start gap-4">
        <h2 className="text-[19px] tracking-[-0.02em]">Contenu</h2>
        <label className="grid gap-1.5 text-sm font-semibold">
          Objet
          <input
            name="subject"
            value={content.subject}
            onChange={set("subject")}
            disabled={locked}
            className={input}
            required
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Pré-en-tête <span className="font-normal text-muted">(aperçu sous l'objet dans la boîte de réception)</span>
          <input
            name="preheader"
            value={content.preheader}
            onChange={set("preheader")}
            disabled={locked}
            className={input}
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Titre
          <input name="title" value={content.title} onChange={set("title")} disabled={locked} className={input} />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Image <span className="font-normal text-muted">(URL, optionnelle)</span>
          <input
            name="imageUrl"
            value={content.imageUrl}
            onChange={set("imageUrl")}
            disabled={locked}
            className={input}
            placeholder="https://…"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Texte{" "}
          <span className="font-normal text-muted">
            (paragraphes séparés par une ligne vide, **gras**, [lien](https://…))
          </span>
          <textarea
            name="body"
            value={content.body}
            onChange={set("body")}
            disabled={locked}
            rows={9}
            className={`${input} resize-y font-sans`}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold">
            Bouton
            <input
              name="ctaLabel"
              value={content.ctaLabel}
              onChange={set("ctaLabel")}
              disabled={locked}
              className={input}
              placeholder="Découvrir la collection"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Lien du bouton
            <input
              name="ctaUrl"
              value={content.ctaUrl}
              onChange={set("ctaUrl")}
              disabled={locked}
              className={input}
              placeholder="https://kodaclothing.fr"
            />
          </label>
        </div>
        {!locked && (
          <>
            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <button
                type="submit"
                formAction={save}
                disabled={saving}
                className="rounded-full border border-ink px-5 py-2.5 font-display text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Enregistrer le brouillon"}
              </button>
            </div>
            <div className="grid gap-2 border-t border-line pt-4">
              <label className="grid gap-1.5 text-sm font-semibold">
                E-mail de test
                <input name="testTo" type="email" className={input} placeholder="toi@kodaclothing.fr" />
              </label>
              <button
                type="submit"
                formAction={test}
                disabled={testing}
                className="justify-self-start rounded-full border border-line bg-white px-5 py-2.5 font-display text-sm font-semibold hover:border-ink disabled:opacity-60"
              >
                {testing ? "Envoi…" : "M'envoyer un test"}
              </button>
            </div>
            <div className="border-t border-line pt-4">
              <button
                type="submit"
                formAction={send}
                disabled={sending}
                onClick={(e) => {
                  if (
                    !window.confirm("Envoyer cette campagne à tous les inscrits actifs ? Cette action est définitive.")
                  )
                    e.preventDefault();
                }}
                className="rounded-full bg-ink px-5 py-3 font-display text-sm font-semibold text-cream disabled:opacity-60"
              >
                {sending ? "Envoi en cours…" : "Envoyer à tous les inscrits"}
              </button>
            </div>
          </>
        )}
        {feedback?.message && (
          <p role="status" className={`text-sm ${feedback.kind === "error" ? "text-danger" : "text-success"}`}>
            {feedback.message}
          </p>
        )}
      </div>

      <div className="card grid content-start gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[19px] tracking-[-0.02em]">Prévisualisation</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="tablist"
              aria-label="Client mail"
              className="inline-flex rounded-full bg-ink/6 p-1 text-sm font-semibold"
            >
              {CLIENTS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={client === c.key}
                  onClick={() => setClient(c.key)}
                  className={`rounded-full px-3 py-1.5 ${client === c.key ? "bg-ink text-cream" : "hover:bg-ink/10"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
                disabled={client === "outlook" || client === "text"}
                className="accent-ink"
              />{" "}
              Mode sombre
            </label>
          </div>
        </div>
        <p className="text-sm text-muted">{current.note} Simulation fidèle du gabarit, pas un rendu réel du client.</p>
        <div className="overflow-auto rounded-[18px] border border-line bg-ink/4 p-4">
          <div
            className={`mx-auto overflow-hidden rounded-[14px] border border-line ${client === "apple" ? "rounded-[36px] border-[6px] border-ink" : ""}`}
            style={{ width: current.width, maxWidth: "100%" }}
          >
            <ClientChrome client={client} subject={content.subject} preheader={content.preheader} dark={dark} />
            {client === "text" ? (
              <pre className="m-0 whitespace-pre-wrap bg-white p-5 font-mono text-[13px] leading-relaxed text-ink">
                {text}
              </pre>
            ) : (
              <iframe
                title={`Aperçu ${current.label}`}
                srcDoc={srcdoc}
                sandbox=""
                className="block w-full bg-white"
                style={{ height: client === "apple" ? 700 : 760, colorScheme: dark ? "dark" : "light" }}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

/** Habillage du client mail autour de l'e-mail : barre d'objet et expéditeur, comme en boîte de réception. */
function ClientChrome({
  client,
  subject,
  preheader,
  dark,
}: {
  client: ClientKey;
  subject: string;
  preheader: string;
  dark: boolean;
}) {
  if (client === "text") return null;
  const bg = dark ? "bg-[#202124] text-[#e8eaed]" : "bg-white text-ink";
  if (client === "apple") {
    return (
      <div className={`${bg} border-b border-black/10 px-5 pt-8 pb-3`}>
        <p className="text-xs text-muted">{"< Boîte de réception"}</p>
        <p className="mt-2 text-[15px] font-semibold">KODA Clothing</p>
        <p className="text-sm text-muted">À : moi</p>
        <p className="mt-2 text-[17px] font-semibold leading-tight">{subject || "Objet"}</p>
      </div>
    );
  }
  return (
    <div className={`${bg} border-b border-black/10 px-6 py-4`}>
      <p className="text-[20px] font-normal">{subject || "Objet"}</p>
      <div className="mt-2 flex items-center gap-3 text-sm">
        <span className="grid size-9 place-items-center rounded-full bg-sky font-semibold">K</span>
        <span>
          <b className="font-semibold">KODA Clothing</b>{" "}
          <span className="text-muted">&lt;hello@kodaclothing.fr&gt;</span>
          <br />
          <span className="text-muted">à moi</span>
        </span>
      </div>
      {client === "gmail" && preheader && <p className="mt-2 truncate text-xs text-muted">{preheader}</p>}
    </div>
  );
}
