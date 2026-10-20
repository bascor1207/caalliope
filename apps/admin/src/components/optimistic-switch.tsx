"use client";

import { useOptimistic, useTransition } from "react";
import { notify } from "./toaster";

interface Props {
  checked: boolean;
  label: string;
  onLabel?: string;
  offLabel?: string;
  /** Action serveur : reçoit la nouvelle valeur. Lance une erreur pour annuler. */
  action: (next: boolean) => Promise<void>;
  successMessage?: (next: boolean) => string;
}

/**
 * Interrupteur à rendu optimiste : bascule à l'instant, l'action serveur suit ;
 * en cas d'échec l'état revient et un toast l'explique.
 */
export function OptimisticSwitch({
  checked,
  label,
  onLabel = "Activé",
  offLabel = "Désactivé",
  action,
  successMessage,
}: Props) {
  const [pending, start] = useTransition();
  const [value, setValue] = useOptimistic(checked);
  const toggle = () =>
    start(async () => {
      const next = !value;
      setValue(next);
      try {
        await action(next);
        if (successMessage) notify(successMessage(next));
      } catch (e) {
        notify(e instanceof Error ? e.message : "Échec de l'enregistrement.", "error");
      }
    });
  return (
    <span className="inline-flex items-center gap-3">
      <span className={`text-sm font-semibold ${value ? "text-success" : "text-muted"}`}>
        {value ? onLabel : offLabel}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={`${label} : ${value ? "désactiver" : "activer"}`}
        aria-busy={pending}
        onClick={toggle}
        className={`relative h-7 w-12 rounded-full transition-colors ${value ? "bg-success" : "bg-ink/20"}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1 size-5 rounded-full bg-white transition-[left] ${value ? "left-6" : "left-1"}`}
        />
      </button>
    </span>
  );
}
