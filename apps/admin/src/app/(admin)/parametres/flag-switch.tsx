"use client";

import { setFlagValue } from "@/app/actions";
import { OptimisticSwitch } from "@/components/optimistic-switch";

/**
 * Interrupteur d'un feature flag. Composant client : l'action serveur et le message de succès sont construits ici,
 * pas dans la page serveur (Next refuse de passer une fonction, même une action liée, d'un composant serveur
 * à un composant client).
 */
export function FlagSwitch({ flagKey, label, checked }: { flagKey: string; label: string; checked: boolean }) {
  return (
    <OptimisticSwitch
      checked={checked}
      label={label}
      action={(next) => setFlagValue(flagKey, next)}
      successMessage={(on) => `${label} : ${on ? "activé" : "désactivé"}.`}
    />
  );
}
