"use client";

import { useActionState } from "react";
import { resetAnalyticsAction, type SettingsState, saveSmtp, saveSocial, sendSmtpTest } from "@/app/actions";
import { useToastOnState } from "@/components/toaster";
import type { SmtpSettings, SocialSettings } from "@/lib/settings";

const INPUT =
  "mt-1.5 w-full rounded-[12px] border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-ink";
const BTN = "rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-2 disabled:opacity-50";
const GHOST =
  "rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-ink disabled:opacity-50";

function Feedback({ state }: { state: SettingsState }) {
  if (!state.ok && !state.error) return null;
  return (
    <p
      role="status"
      className={`mt-4 rounded-[12px] px-3.5 py-2.5 text-sm ${state.error ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}
    >
      {state.error ?? state.ok}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={INPUT}
      />
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

/** Boîte d'envoi : identifiants SMTP de la boîte KODA (ou de la boîte du prestataire en attendant). */
export function SmtpForm({ current, hasPassword }: { current: SmtpSettings | null; hasPassword: boolean }) {
  const [state, action, pending] = useActionState(saveSmtp, {});
  useToastOnState(state);
  const [testState, testAction, testing] = useActionState(sendSmtpTest, {});
  useToastOnState(testState);
  return (
    <div className="grid gap-6">
      <form action={action} className="grid gap-4 sm:grid-cols-2">
        <Field label="Serveur SMTP" name="host" defaultValue={current?.host ?? "smtp.gmail.com"} required />
        <Field label="Port" name="port" type="number" defaultValue={current?.port ?? 465} hint="465 (SSL) ou 587" />
        <Field
          label="Identifiant"
          name="user"
          type="email"
          defaultValue={current?.user ?? ""}
          placeholder="bcorre.work@gmail.com"
          required
        />
        <Field
          label="Mot de passe"
          name="pass"
          type="password"
          placeholder={hasPassword ? "•••••••• (inchangé si vide)" : ""}
          hint="Gmail : mot de passe d'application (compte Google → Sécurité → Validation en deux étapes → Mots de passe des applications), jamais le mot de passe du compte."
          required={!hasPassword}
        />
        <div className="sm:col-span-2">
          <Field
            label="Expéditeur affiché"
            name="from"
            defaultValue={current?.from ?? "KODA Clothing <bcorre.work@gmail.com>"}
            hint="Format « Nom <adresse> ». Gmail impose l'adresse du compte (ou un alias « Envoyer en tant que » validé)."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={pending} className={BTN}>
            {pending ? "Vérification…" : "Vérifier et enregistrer"}
          </button>
          <span className="text-xs text-muted">
            Le mot de passe est chiffré en base. La connexion est testée avant l'enregistrement.
          </span>
        </div>
        <div className="sm:col-span-2">
          <Feedback state={state} />
        </div>
      </form>
      <form action={testAction} className="flex flex-wrap items-end gap-3 border-t border-line pt-5">
        <label className="min-w-[260px] flex-1 text-sm font-semibold">
          Envoyer un e-mail de test à
          <input name="to" type="email" required placeholder="toi@exemple.fr" className={INPUT} />
        </label>
        <button type="submit" disabled={testing || !hasPassword} className={GHOST}>
          {testing ? "Envoi…" : "Envoyer le test"}
        </button>
        <div className="basis-full">
          <Feedback state={testState} />
        </div>
      </form>
    </div>
  );
}

export function SocialForm({ current }: { current: SocialSettings }) {
  const [state, action, pending] = useActionState(saveSocial, {});
  useToastOnState(state);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Instagram"
        name="instagram"
        defaultValue={current.instagram}
        placeholder="https://www.instagram.com/…"
      />
      <Field label="TikTok" name="tiktok" defaultValue={current.tiktok} placeholder="https://www.tiktok.com/@…" />
      <Field
        label="Facebook"
        name="facebook"
        defaultValue={current.facebook}
        placeholder="https://www.facebook.com/…"
      />
      <Field label="YouTube" name="youtube" defaultValue={current.youtube} placeholder="https://www.youtube.com/@…" />
      <div className="sm:col-span-2">
        <Field
          label="E-mail de contact"
          name="email"
          type="email"
          defaultValue={current.email}
          hint="Lien « Contact » du pied de page et de la page confidentialité."
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className={BTN}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <span className="text-xs text-muted">Un champ vide masque le réseau sur la boutique.</span>
      </div>
      <div className="sm:col-span-2">
        <Feedback state={state} />
      </div>
    </form>
  );
}

/** Remise à zéro des statistiques, avec confirmation. */
export function MaintenanceForm() {
  const [state, action, pending] = useActionState(resetAnalyticsAction, {});
  useToastOnState(state);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm("Effacer toutes les statistiques (pages vues, clics, parcours) ? Les commandes et comptes restent.")
        )
          e.preventDefault();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-danger px-5 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10 disabled:opacity-50"
      >
        {pending ? "Effacement…" : "Remettre les statistiques à zéro"}
      </button>
      <Feedback state={state} />
    </form>
  );
}
