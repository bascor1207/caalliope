"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LiveEvent {
  name: string;
  at: string;
  path?: string;
}

const LABELS: Record<string, string> = {
  page_view: "Page vue",
  click: "Clic",
  product_view: "Fiche produit",
  product_chosen: "Ajout panier",
  cart_opened: "Panier ouvert",
  search: "Recherche",
  checkout_started: "Checkout",
  checkout_failed: "Checkout refusé",
  order_placed: "Commande",
  newsletter_subscribed: "Inscription",
};

const POLL_MS = 30_000;
const REFRESH_DEBOUNCE_MS = 1_500;

/**
 * Direct du dashboard. Avec Supabase : flux SSE relayé par /api/live, les chiffres sont recalculés dès qu'un
 * événement arrive (regroupés à 1,5 s). Sans : rafraîchissement toutes les 30 s.
 */
export function LiveFeed() {
  const router = useRouter();
  const [mode, setMode] = useState<"connecting" | "live" | "polling">("connecting");
  const [recent, setRecent] = useState<LiveEvent[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const refresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), REFRESH_DEBOUNCE_MS);
    };
    let poll: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (poll) return;
      setMode("polling");
      poll = setInterval(() => router.refresh(), POLL_MS);
    };
    const source = new EventSource("/api/live");
    let opened = false;
    source.addEventListener("status", (e) => {
      const { status } = JSON.parse((e as MessageEvent).data) as { status: string };
      if (status === "SUBSCRIBED") {
        opened = true;
        setMode("live");
      }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") startPolling();
    });
    source.addEventListener("event", (e) => {
      const ev = JSON.parse((e as MessageEvent).data) as LiveEvent;
      setRecent((list) => [ev, ...list].slice(0, 6));
      refresh();
    });
    source.onerror = () => {
      // 204 (Supabase absent) ou coupure : l'EventSource se ferme ; on bascule en rafraîchissement périodique.
      if (source.readyState === EventSource.CLOSED || !opened) startPolling();
    };
    return () => {
      source.close();
      if (poll) clearInterval(poll);
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex items-center gap-3 text-xs text-muted" aria-live="polite">
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <span
          aria-hidden="true"
          className={`size-2 rounded-full ${mode === "live" ? "bg-success animate-pulse" : mode === "polling" ? "bg-sand" : "bg-line"}`}
        />
        {mode === "live" ? "En direct" : mode === "polling" ? "Rafraîchi toutes les 30 s" : "Connexion…"}
      </span>
      {recent.length > 0 && (
        <ul className="hidden items-center gap-2 md:flex" aria-label="Derniers événements">
          {recent.slice(0, 4).map((ev, i) => (
            <li key={`${ev.at}-${i}`} className="rounded-full bg-ink/6 px-2 py-0.5">
              {LABELS[ev.name] ?? ev.name}
              {ev.path ? <span className="opacity-60"> · {ev.path}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
