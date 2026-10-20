"use client";

import { useSyncExternalStore } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function splitRemaining(ms: number): Remaining {
  const d = Math.max(0, ms);
  return {
    days: Math.floor(d / 864e5),
    hours: Math.floor((d % 864e5) / 36e5),
    minutes: Math.floor((d % 36e5) / 6e4),
    seconds: Math.floor((d % 6e4) / 1e3),
  };
}

/** Horloge externe : un tick par seconde, snapshot serveur = null (pas de décalage d'hydratation). */
const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
const getNow = () => Math.floor(Date.now() / 1000) * 1000;
const getServerNow = () => null;

export function useRemaining(end: string): Remaining | null {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  return now === null ? null : splitRemaining(new Date(end).getTime() - now);
}

interface Props {
  end: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}

/** Compte à rebours en quatre cases. Rend des tirets tant que l'horloge client n'a pas démarré. */
export function Countdown({ end, labels }: Props) {
  const t = useRemaining(end);
  const units: Array<[string, string]> = [
    [labels.days, t ? pad(t.days) : "--"],
    [labels.hours, t ? pad(t.hours) : "--"],
    [labels.minutes, t ? pad(t.minutes) : "--"],
    [labels.seconds, t ? pad(t.seconds) : "--"],
  ];
  return (
    <div className="inline-flex items-center gap-3.5" aria-live="off">
      {units.map(([label, value], i) => (
        <span key={label} className="contents">
          {i > 0 && <span className="-mt-3.5 font-display text-[26px] opacity-30">:</span>}
          <div className="min-w-14 text-center">
            <b className="block font-display text-[30px] tracking-[-0.03em] tabular-nums">{value}</b>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</span>
          </div>
        </span>
      ))}
    </div>
  );
}
