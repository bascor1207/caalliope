import type { Metadata } from "next";
import { Sections } from "@/components/sections";
import { DEFAULT_SOCIAL, getSmtpSettings, getSocialSettings } from "@/lib/settings";
import { listFlags } from "@/lib/users";
import { FlagSwitch } from "./flag-switch";
import { MaintenanceForm, SmtpForm, SocialForm } from "./settings-forms";

export const metadata: Metadata = { title: "Réglages" };
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  "auth.email": "Connexion par e-mail et mot de passe",
  "auth.google": "Connexion avec Google",
  "auth.apple": "Connexion avec Apple",
};

/** Chaque bloc charge ses données à part : une lecture qui échoue n'emporte pas toute la page et dit pourquoi. */
async function safe<T>(
  label: string,
  load: () => Promise<T>,
  fallback: T,
): Promise<{ value: T; error: string | null }> {
  try {
    return { value: await load(), error: null };
  } catch (e) {
    const message = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error(`[admin] ${label} :`, e);
    return { value: fallback, error: message };
  }
}

function LoadError({ what, error }: { what: string; error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="mb-5 rounded-[12px] border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
      {what} : lecture impossible. <code className="break-all text-xs">{error}</code>
    </p>
  );
}

export default async function SettingsPage() {
  const [flagsR, smtpR, socialR] = await Promise.all([
    safe("feature flags", listFlags, []),
    safe("réglages SMTP", getSmtpSettings, null),
    safe("réseaux sociaux", getSocialSettings, DEFAULT_SOCIAL),
  ]);
  const flags = flagsR.value;
  const smtp = smtpR.value;
  const social = socialR.value;
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pt-5 pb-10 md:px-9 md:pt-6 md:pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Réglages</h1>
          <p className="mt-3 text-[15px] text-muted">
            Boîte d'envoi des e-mails, réseaux sociaux et fonctionnalités de la boutique, sans déploiement.
          </p>
        </div>
      </header>
      <Sections
        items={[
          {
            id: "emails",
            label: "E-mails",
            children: (
              <>
                <section className="card mt-10" aria-labelledby="smtp-title">
                  <h2 id="smtp-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Boîte d'envoi des e-mails
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Les newsletters partent de cette boîte, en ton nom. Pour l'instant : bcorre.work@gmail.com ; plus
                    tard la boîte KODA. Gmail accepte environ 500 destinataires par jour (2 000 en Google Workspace).
                  </p>
                  <LoadError what="Boîte d'envoi" error={smtpR.error} />
                  <SmtpForm current={smtp} hasPassword={Boolean(smtp?.pass)} />
                </section>
              </>
            ),
          },
          {
            id: "reseaux",
            label: "Réseaux",
            children: (
              <>
                <section className="card mt-6" aria-labelledby="social-title">
                  <h2 id="social-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Réseaux sociaux et contact
                  </h2>
                  <p className="mt-1 mb-6 text-sm text-muted">
                    Repris dans le pied de page de la boutique et ses données SEO.
                  </p>
                  <LoadError what="Réseaux sociaux" error={socialR.error} />
                  <SocialForm current={social} />
                </section>
              </>
            ),
          },
          {
            id: "fonctionnalites",
            label: "Fonctionnalités",
            children: (
              <>
                <section className="card mt-6" aria-labelledby="flags-title">
                  <h2 id="flags-title" className="mb-5 text-[19px] font-semibold tracking-[-0.02em]">
                    Fonctionnalités
                  </h2>
                  <LoadError what="Fonctionnalités" error={flagsR.error} />
                  {flags.length === 0 ? (
                    <p className="text-[15px] text-muted">Base de données absente : aucun réglage disponible.</p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {flags.map((f) => (
                        <li
                          key={f.key}
                          className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div>
                            <b className="block text-[15px]">{LABELS[f.key] ?? f.key}</b>
                            <span className="text-sm text-muted">
                              <code className="rounded bg-ink/6 px-1.5 py-0.5 text-xs">{f.key}</code> · {f.description}
                            </span>
                          </div>
                          <FlagSwitch flagKey={f.key} label={LABELS[f.key] ?? f.key} checked={f.enabled} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-6 text-sm text-muted">
                    Google et Apple exigent aussi que le fournisseur soit configuré dans Supabase (Authentication →
                    Providers). Le flag ne fait qu'afficher ou masquer le bouton sur la boutique.
                  </p>
                </section>
              </>
            ),
          },
          {
            id: "maintenance",
            label: "Maintenance",
            children: (
              <>
                <section className="card mt-6 border-danger/30" aria-labelledby="maintenance-title">
                  <h2 id="maintenance-title" className="text-[19px] font-semibold tracking-[-0.02em]">
                    Maintenance
                  </h2>
                  <p className="mt-1 mb-5 text-sm text-muted">
                    Après une phase de tests : efface les événements du tableau de bord. Commandes, comptes et inscrits
                    sont conservés.
                  </p>
                  <MaintenanceForm />
                </section>
              </>
            ),
          },
        ]}
      />
    </main>
  );
}
