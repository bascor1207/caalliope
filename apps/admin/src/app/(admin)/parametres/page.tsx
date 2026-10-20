import type { Metadata } from "next";
import { setFlagValue } from "@/app/actions";
import { OptimisticSwitch } from "@/components/optimistic-switch";
import { getSmtpSettings, getSocialSettings } from "@/lib/settings";
import { listFlags } from "@/lib/users";
import { SmtpForm, SocialForm } from "./settings-forms";

export const metadata: Metadata = { title: "Réglages" };
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  "auth.email": "Connexion par e-mail et mot de passe",
  "auth.google": "Connexion avec Google",
  "auth.apple": "Connexion avec Apple",
};

export default async function SettingsPage() {
  const [flags, smtp, social] = await Promise.all([listFlags(), getSmtpSettings(), getSocialSettings()]);
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-9 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Réglages</h1>
          <p className="mt-3 text-[15px] text-muted">
            Boîte d'envoi des e-mails, réseaux sociaux et fonctionnalités de la boutique, sans déploiement.
          </p>
        </div>
      </header>
      <section className="card mt-10" aria-labelledby="smtp-title">
        <h2 id="smtp-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Boîte d'envoi des e-mails
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Les newsletters partent de cette boîte, en ton nom. Pour l'instant : bcorre.work@gmail.com ; plus tard la
          boîte KODA. Gmail accepte environ 500 destinataires par jour (2 000 en Google Workspace).
        </p>
        <SmtpForm current={smtp} hasPassword={Boolean(smtp?.pass)} />
      </section>

      <section className="card mt-6" aria-labelledby="social-title">
        <h2 id="social-title" className="text-[19px] font-semibold tracking-[-0.02em]">
          Réseaux sociaux et contact
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">Repris dans le pied de page de la boutique et ses données SEO.</p>
        <SocialForm current={social} />
      </section>

      <section className="card mt-6" aria-labelledby="flags-title">
        <h2 id="flags-title" className="mb-5 text-[19px] font-semibold tracking-[-0.02em]">
          Fonctionnalités
        </h2>
        {flags.length === 0 ? (
          <p className="text-[15px] text-muted">Base de données absente : aucun réglage disponible.</p>
        ) : (
          <ul className="divide-y divide-line">
            {flags.map((f) => (
              <li key={f.key} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <b className="block text-[15px]">{LABELS[f.key] ?? f.key}</b>
                  <span className="text-sm text-muted">
                    <code className="rounded bg-ink/6 px-1.5 py-0.5 text-xs">{f.key}</code> · {f.description}
                  </span>
                </div>
                <OptimisticSwitch
                  checked={f.enabled}
                  label={LABELS[f.key] ?? f.key}
                  action={setFlagValue.bind(null, f.key)}
                  successMessage={(on) => `${LABELS[f.key] ?? f.key} : ${on ? "activé" : "désactivé"}.`}
                />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-sm text-muted">
          Google et Apple exigent aussi que le fournisseur soit configuré dans Supabase (Authentication → Providers). Le
          flag ne fait qu'afficher ou masquer le bouton sur la boutique.
        </p>
      </section>
    </main>
  );
}
