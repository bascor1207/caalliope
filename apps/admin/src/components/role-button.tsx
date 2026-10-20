"use client";

import { useOptimistic, useTransition } from "react";
import { setUserRole } from "@/app/actions";
import { notify } from "./toaster";

/** Bascule client ↔ admin à l'instant ; le badge suit, le serveur confirme ou annule. */
export function RoleButton({ id, role, name }: { id: string; role: "customer" | "admin"; name: string }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useOptimistic(role);
  const next = value === "admin" ? "customer" : "admin";
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${value === "admin" ? "bg-ink text-cream" : "bg-ink/6"}`}
      >
        {value === "admin" ? "admin" : "client"}
      </span>
      <button
        type="button"
        aria-busy={pending}
        onClick={() =>
          start(async () => {
            setValue(next);
            try {
              await setUserRole(id, next);
              notify(`${name} : ${next === "admin" ? "admin" : "client"}.`);
            } catch (e) {
              notify(e instanceof Error ? e.message : "Échec.", "error");
            }
          })
        }
        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold hover:border-ink"
      >
        {value === "admin" ? "Retirer admin" : "Rendre admin"}
      </button>
    </span>
  );
}
