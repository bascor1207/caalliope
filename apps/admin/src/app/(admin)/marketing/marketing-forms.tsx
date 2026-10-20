"use client";

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useActionState, useState } from "react";
import { MediaUpload } from "@/components/media-upload";
import { useToastOnState } from "@/components/toaster";
import type { BannerSource, VideoMedia } from "@/lib/marketing";
import { type MarketingState, saveBannersAction, saveVideoBlock } from "./actions";

const INPUT =
  "mt-1.5 w-full rounded-[12px] border border-line bg-white px-3.5 py-2.5 text-[15px] outline-none focus-visible:border-ink";
const BTN = "rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-ink-2 disabled:opacity-50";

function Feedback({ state }: { state: MarketingState }) {
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

type Mode = "default" | "hidden" | "custom";

/** Un bloc vidéo : vidéo par défaut du code, masqué, ou vidéo envoyée (avec image d'attente). */
export function VideoBlockForm({
  block,
  current,
  defaultLabel,
  storage,
  blobs = true,
}: {
  block: "hero" | "story";
  current: VideoMedia | null | undefined;
  defaultLabel: string;
  storage: boolean;
  /** Hero seulement : formes pastel affichées. */
  blobs?: boolean;
}) {
  const [state, action, pending] = useActionState(saveVideoBlock.bind(null, block), {});
  useToastOnState(state);
  const hiddenInitially = block === "hero" ? current === null && !blobs : current === null;
  const [mode, setMode] = useState<Mode>(hiddenInitially ? "hidden" : current ? "custom" : "default");
  const [keepBlobs, setKeepBlobs] = useState(blobs);
  const [src, setSrc] = useState(current?.src ?? "");
  const [poster, setPoster] = useState(current?.poster ?? "");
  const modes: Array<[Mode, string]> = [
    ["default", defaultLabel],
    ["custom", "Ma vidéo"],
    ["hidden", block === "hero" ? "Fond uni (rien derrière)" : "Masquer le bloc"],
  ];
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="src" value={src} />
      <input type="hidden" name="poster" value={poster} />
      {block === "hero" && mode !== "hidden" && (
        <>
          <input type="hidden" name="blobs" value={keepBlobs ? "on" : "off"} />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={keepBlobs}
              onChange={(e) => setKeepBlobs(e.target.checked)}
              className="size-4 accent-ink"
            />
            Afficher les formes pastel animées {mode === "custom" ? "par-dessus la vidéo" : "derrière le titre"}
          </label>
        </>
      )}
      <div className="inline-flex flex-wrap rounded-full bg-ink/6 p-1 text-sm font-semibold">
        {modes.map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-2 transition-colors ${mode === m ? "bg-ink text-cream" : "hover:bg-ink/10"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "custom" && (
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid gap-3">
            <div className="aspect-video overflow-hidden rounded-[16px] bg-cream-2">
              {src ? (
                <video
                  src={src}
                  poster={poster || undefined}
                  controls
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="grid h-full place-items-center text-sm text-muted">Aucune vidéo</p>
              )}
            </div>
            <MediaUpload
              folder="marketing"
              accept="video/mp4,video/webm,video/quicktime"
              label={src ? "Remplacer la vidéo" : "Envoyer une vidéo"}
              onUploaded={setSrc}
            />
            {!storage && (
              <p className="text-xs text-danger">
                Stockage non configuré : SUPABASE_SERVICE_ROLE_KEY manque sur l'admin.
              </p>
            )}
            <p className="text-xs text-muted">
              MP4 (H.264) conseillé, 1080p, moins de 20 Mo : il se charge vite et joue partout, iPhone compris.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="aspect-video overflow-hidden rounded-[16px] bg-cream-2">
              {poster ? (
                // biome-ignore lint/performance/noImgElement: aperçu d'un fichier externe
                <img src={poster} alt="" className="h-full w-full object-cover" />
              ) : (
                <p className="grid h-full place-items-center text-sm text-muted">Aucune image d'attente</p>
              )}
            </div>
            <MediaUpload
              folder="marketing"
              accept="image/*"
              label={poster ? "Remplacer l'image d'attente" : "Image d'attente (poster)"}
              onUploaded={setPoster}
            />
            <p className="text-xs text-muted">
              Affichée avant le premier plan de la vidéo et sur les connexions lentes.
            </p>
          </div>
        </div>
      )}
      <div>
        <button type="submit" disabled={pending} className={BTN}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

/** Bandeau défilant : messages FR/EN, lien, période, actif, ordre. */
export function BannersForm({ initial }: { initial: BannerSource[] }) {
  const [state, action, pending] = useActionState(saveBannersAction, {});
  useToastOnState(state);
  const [items, setItems] = useState<BannerSource[]>(initial);
  const update = (i: number, patch: Partial<BannerSource>) =>
    setItems((list) => list.map((b, k) => (k === i ? { ...b, ...patch } : b)));
  const move = (i: number, dir: -1 | 1) =>
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="payload" value={JSON.stringify(items)} />
      <ul className="grid gap-3">
        {items.map((b, i) => (
          <li key={b.id || i} className="grid gap-3 rounded-[16px] border border-line p-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm font-semibold">
              Message (FR)
              <input
                value={b.message.fr}
                onChange={(e) => update(i, { message: { ...b.message, fr: e.target.value } })}
                className={INPUT}
              />
            </label>
            <label className="text-sm font-semibold">
              Message (EN)
              <input
                value={b.message.en}
                onChange={(e) => update(i, { message: { ...b.message, en: e.target.value } })}
                className={INPUT}
              />
            </label>
            <div className="flex items-end gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                aria-label="Monter"
                className="grid size-10 place-items-center rounded-full hover:bg-ink/6"
              >
                <ArrowUpIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                aria-label="Descendre"
                className="grid size-10 place-items-center rounded-full hover:bg-ink/6"
              >
                <ArrowDownIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setItems((l) => l.filter((_, k) => k !== i))}
                aria-label="Supprimer"
                className="grid size-10 place-items-center rounded-full text-danger hover:bg-danger/10"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
            <label className="text-sm font-semibold">
              Lien <span className="font-normal text-muted">· facultatif (ex. /livraison ou /#drop)</span>
              <input value={b.href ?? ""} onChange={(e) => update(i, { href: e.target.value })} className={INPUT} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                Du <span className="font-normal text-muted">· facultatif</span>
                <input
                  type="datetime-local"
                  value={b.startsAt?.slice(0, 16) ?? ""}
                  onChange={(e) =>
                    update(i, { startsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })
                  }
                  className={INPUT}
                />
              </label>
              <label className="text-sm font-semibold">
                Au
                <input
                  type="datetime-local"
                  value={b.endsAt?.slice(0, 16) ?? ""}
                  onChange={(e) =>
                    update(i, { endsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })
                  }
                  className={INPUT}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 self-end text-sm font-semibold">
              <input
                type="checkbox"
                checked={b.active}
                onChange={(e) => update(i, { active: e.target.checked })}
                className="size-4 accent-ink"
              />
              Affichée
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setItems((l) => [...l, { id: "", message: { fr: "", en: "" }, active: true, order: l.length + 1 }])
          }
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold hover:border-ink"
        >
          <PlusIcon className="size-4" aria-hidden="true" /> Ajouter un message
        </button>
        <button type="submit" disabled={pending} className={BTN}>
          {pending ? "Enregistrement…" : "Enregistrer le bandeau"}
        </button>
      </div>
      <Feedback state={state} />
    </form>
  );
}
