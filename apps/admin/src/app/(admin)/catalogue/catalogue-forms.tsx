"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useActionState, useOptimistic, useState, useTransition } from "react";
import { notify, useToastOnState } from "@/components/toaster";
import type { ColorSource } from "@/lib/catalog-types";
import {
  type CatalogState,
  importCatalogAction,
  moveProductAction,
  savePaletteAction,
  setProductOnline,
} from "./actions";

const INPUT =
  "mt-1.5 w-full rounded-[12px] border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-ink";
const BTN = "rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-2 disabled:opacity-50";

export function Feedback({ state }: { state: CatalogState }) {
  if (!state.ok && !state.errors?.length) return null;
  return (
    <div
      role="status"
      className={`mt-4 rounded-[12px] px-3.5 py-2.5 text-sm ${state.errors?.length ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}
    >
      {state.errors?.length ? (
        <ul className="list-disc pl-4">
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : (
        state.ok
      )}
    </div>
  );
}

export function ImportForm() {
  const [state, action, pending] = useActionState(importCatalogAction, {});
  useToastOnState(state);
  return (
    <form action={action}>
      <button type="submit" disabled={pending} className={BTN}>
        {pending ? "Import…" : "Importer le catalogue de la boutique"}
      </button>
      <Feedback state={state} />
    </form>
  );
}

export function ProductRowActions({
  id,
  active,
  first,
  last,
  only,
}: {
  id: string;
  active: boolean;
  first: boolean;
  last: boolean;
  only: "toggle" | "move";
}) {
  if (only === "toggle") return <OnlineToggle id={id} active={active} />;
  return (
    <span className="inline-flex gap-1">
      <form action={moveProductAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="up" />
        <button
          type="submit"
          disabled={first}
          aria-label="Monter"
          className="grid size-9 place-items-center rounded-full hover:bg-ink/6 disabled:opacity-30"
        >
          <ArrowUpIcon className="size-4" />
        </button>
      </form>
      <form action={moveProductAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="dir" value="down" />
        <button
          type="submit"
          disabled={last}
          aria-label="Descendre"
          className="grid size-9 place-items-center rounded-full hover:bg-ink/6 disabled:opacity-30"
        >
          <ArrowDownIcon className="size-4" />
        </button>
      </form>
    </span>
  );
}

export function PaletteForm({ initial }: { initial: ColorSource[] }) {
  const [state, action, pending] = useActionState(savePaletteAction, {});
  useToastOnState(state);
  const [colors, setColors] = useState<ColorSource[]>(initial);
  const update = (i: number, patch: Partial<ColorSource>) =>
    setColors((l) => l.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="payload" value={JSON.stringify(colors)} />
      <ul className="grid gap-2">
        {colors.map((c, i) => (
          <li
            key={c.key || i}
            className="grid items-end gap-3 rounded-[14px] border border-line p-3 sm:grid-cols-[auto_1fr_1fr_140px_auto]"
          >
            <label className="grid justify-items-center text-xs font-semibold text-muted">
              Teinte
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#cccccc"}
                onChange={(e) => update(i, { hex: e.target.value.toUpperCase() })}
                className="mt-1 size-10 cursor-pointer rounded-full border-0 bg-transparent p-0"
                aria-label={`Couleur de ${c.name.fr || "ce coloris"}`}
              />
            </label>
            <label className="text-sm font-semibold">
              Nom (FR)
              <input
                value={c.name.fr}
                onChange={(e) => update(i, { name: { ...c.name, fr: e.target.value } })}
                className={INPUT}
              />
            </label>
            <label className="text-sm font-semibold">
              Nom (EN)
              <input
                value={c.name.en}
                onChange={(e) => update(i, { name: { ...c.name, en: e.target.value } })}
                className={INPUT}
              />
            </label>
            <label className="text-sm font-semibold">
              Hex
              <input
                value={c.hex}
                onChange={(e) => update(i, { hex: e.target.value })}
                className={`${INPUT} font-mono uppercase`}
              />
            </label>
            <button
              type="button"
              onClick={() => setColors((l) => l.filter((_, k) => k !== i))}
              aria-label={`Supprimer ${c.name.fr}`}
              className="grid size-10 place-items-center rounded-full text-danger hover:bg-danger/10"
            >
              <Trash2Icon className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setColors((l) => [...l, { key: "", name: { fr: "", en: "" }, hex: "#BFD6EA" }])}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:border-ink"
        >
          <PlusIcon className="size-4" aria-hidden="true" /> Ajouter un coloris
        </button>
        <button type="submit" disabled={pending} className={BTN}>
          {pending ? "Enregistrement…" : "Enregistrer la palette"}
        </button>
        <span className="text-xs text-muted">Un coloris supprimé disparaît des fiches qui l'utilisent.</span>
      </div>
      <Feedback state={state} />
    </form>
  );
}

/** Statut en ligne / hors ligne : bascule à l'instant, le serveur confirme (toast) ou annule. */
function OnlineToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  const [value, setValue] = useOptimistic(active);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-busy={pending}
      aria-label={value ? "Retirer de la boutique" : "Mettre en ligne"}
      onClick={() =>
        start(async () => {
          const next = !value;
          setValue(next);
          try {
            await setProductOnline(id, next);
            notify(next ? "Fiche en ligne sur la boutique." : "Fiche retirée de la boutique.");
          } catch (e) {
            notify(e instanceof Error ? e.message : "Échec.", "error");
          }
        })
      }
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${value ? "bg-success/10 text-success" : "bg-ink/6 text-muted"}`}
    >
      <span className={`size-2 rounded-full ${value ? "bg-success" : "bg-muted"}`} aria-hidden="true" />
      {value ? "En ligne" : "Hors ligne"}
    </button>
  );
}
