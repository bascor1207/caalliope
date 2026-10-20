"use client";

import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Tone = "success" | "error";
interface Toast {
  id: number;
  text: string;
  tone: Tone;
}

/* Petit store module : n'importe quel composant client appelle notify(), le Toaster s'abonne. */
const listeners = new Set<(t: Toast) => void>();
let seq = 0;
export function notify(text: string, tone: Tone = "success") {
  const toast = { id: ++seq, text, tone };
  for (const l of listeners) l(toast);
}

/** Toast automatique à chaque réponse d'action serveur (`ok` / `error` / `errors` / `message`+`kind`). */
export function useToastOnState(state: {
  ok?: string;
  error?: string;
  errors?: string[];
  message?: string | null;
  kind?: "ok" | "error" | null;
}) {
  const last = useRef(state);
  useEffect(() => {
    if (state === last.current) return;
    last.current = state;
    if (state.ok) notify(state.ok, "success");
    else if (state.error) notify(state.error, "error");
    else if (state.errors?.length) notify(state.errors[0], "error");
    else if (state.message && state.kind) notify(state.message, state.kind === "ok" ? "success" : "error");
  }, [state]);
}

const TTL = 3800;

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const add = (t: Toast) => {
      setToasts((l) => [...l.slice(-2), t]);
      setTimeout(() => setToasts((l) => l.filter((x) => x.id !== t.id)), TTL);
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-60 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex max-w-[560px] items-center gap-2.5 rounded-full px-[18px] py-3 text-sm font-medium shadow-[0_20px_50px_-20px_rgba(20,20,20,.45)] ${t.tone === "error" ? "bg-danger text-white" : "bg-ink text-cream"}`}
        >
          {t.tone === "error" ? (
            <XCircleIcon className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2Icon className="size-4 shrink-0" aria-hidden="true" />
          )}
          {t.text}
        </div>
      ))}
    </div>
  );
}
