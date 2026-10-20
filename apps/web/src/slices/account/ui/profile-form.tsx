"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { eventBus } from "@/shared/event-bus";
import { Button, Input, Label, PhoneInput } from "@/shared/ui";
import type { ProfileInput } from "../domain/address";
import { type ProfileState, updateProfileAction } from "../infrastructure/actions";

/** Informations personnelles : prénom, nom, téléphone. L'e-mail reste celui du compte. */
export function ProfileForm({ profile, email }: { profile: ProfileInput; email: string }) {
  const t = useTranslations("account");
  /* Optimiste : le toast « Enregistré » part à l'envoi ; un échec serveur le corrige aussitôt. */
  const [state, action, pending] = useActionState<ProfileState, FormData>(async (prev, f) => {
    eventBus.publish("ui.notify", { text: t("saved"), tone: "success" });
    const r = await updateProfileAction(prev, f);
    if (r.errors || r.denied) eventBus.publish("ui.notify", { text: t("notSaved"), tone: "error" });
    return r;
  }, {});
  const err = (k: keyof ProfileInput) =>
    state.errors?.[k] ? <span className="text-xs text-danger">{t(`errors.${state.errors[k]}`)}</span> : null;
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <Label>
        {t("firstName")}
        <Input
          name="firstName"
          autoComplete="given-name"
          defaultValue={profile.firstName}
          aria-invalid={!!state.errors?.firstName}
        />
        {err("firstName")}
      </Label>
      <Label>
        {t("lastName")}
        <Input
          name="lastName"
          autoComplete="family-name"
          defaultValue={profile.lastName}
          aria-invalid={!!state.errors?.lastName}
        />
        {err("lastName")}
      </Label>
      <Label>
        {t("email")}
        <Input value={email} readOnly className="bg-cream-2 text-muted" />
        <span className="text-xs font-normal text-muted">{t("emailHint")}</span>
      </Label>
      <Label>
        {t("phone")}
        <PhoneInput name="phone" defaultValue={profile.phone} aria-invalid={!!state.errors?.phone} />
        {err("phone")}
      </Label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state.ok && !pending && (
          <span role="status" className="text-sm font-semibold text-success">
            {t("saved")}
          </span>
        )}
      </div>
    </form>
  );
}
