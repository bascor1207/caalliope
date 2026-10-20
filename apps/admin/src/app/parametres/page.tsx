import type { Metadata } from "next";
import { toggleFlag } from "@/app/actions";
import { AdminNav } from "@/components/nav";
import { listFlags } from "@/lib/users";

export const metadata: Metadata = { title: "Réglages" };
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  "auth.email": "Connexion par e-mail et mot de passe",
  "auth.google": "Connexion avec Google",
  "auth.apple": "Connexion avec Apple",
};

export default async function SettingsPage() {
  const flags = await listFlags();
  return (
    <main className="mx-auto w-[min(1360px,100%-40px)] py-10 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KODA Clothing · Admin</p>
          <h1 className="mt-2 text-[clamp(30px,4vw,44px)] leading-none tracking-[-0.03em]">Réglages</h1>
          <p className="mt-3 text-[15px] text-muted">
            Feature flags : activer ou couper une fonctionnalité de la boutique sans déploiement.
          </p>
        </div>
        <AdminNav current="/parametres" />
      </header>
      <section className="card mt-10" aria-label="Feature flags">
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
                <form action={toggleFlag} className="flex items-center gap-3">
                  <input type="hidden" name="key" value={f.key} />
                  <input type="hidden" name="enabled" value={f.enabled ? "false" : "true"} />
                  <span className={`text-sm font-semibold ${f.enabled ? "text-success" : "text-muted"}`}>
                    {f.enabled ? "Activé" : "Désactivé"}
                  </span>
                  <button
                    type="submit"
                    role="switch"
                    aria-checked={f.enabled}
                    aria-label={`${LABELS[f.key] ?? f.key} : ${f.enabled ? "désactiver" : "activer"}`}
                    className={`relative h-7 w-12 rounded-full transition-colors ${f.enabled ? "bg-success" : "bg-ink/20"}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-1 size-5 rounded-full bg-white transition-[left] ${f.enabled ? "left-6" : "left-1"}`}
                    />
                  </button>
                </form>
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
