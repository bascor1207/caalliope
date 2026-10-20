"use client";

import { useSyncExternalStore } from "react";
import { isOptedOut, OPT_OUT_KEY } from "../domain/analytics";

const CHANGE = "koda:analytics-opt-out";

const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};
const subscribe = (l: () => void) => {
  window.addEventListener(CHANGE, l);
  window.addEventListener("storage", l);
  return () => {
    window.removeEventListener(CHANGE, l);
    window.removeEventListener("storage", l);
  };
};

interface Props {
  label: string;
  hint: string;
}

/** Case « ne pas mesurer mes visites » : l'opposition est locale au navigateur et prise en compte au prochain chargement. */
export function AnalyticsOptOut({ label, hint }: Props) {
  const optedOut = useSyncExternalStore(
    subscribe,
    () => isOptedOut(storage()),
    () => false,
  );
  const toggle = (next: boolean) => {
    const s = storage();
    if (!s) return;
    if (next) s.setItem(OPT_OUT_KEY, "off");
    else s.removeItem(OPT_OUT_KEY);
    window.dispatchEvent(new Event(CHANGE));
  };
  return (
    <label className="flex items-start gap-3 rounded-[14px] border border-line bg-white p-4 text-sm">
      <input
        type="checkbox"
        className="mt-0.5 size-4 accent-ink"
        checked={optedOut}
        onChange={(e) => toggle(e.target.checked)}
        aria-describedby="opt-out-hint"
      />
      <span>
        <b>{label}</b>
        <span id="opt-out-hint" className="mt-0.5 block text-muted">
          {hint}
        </span>
      </span>
    </label>
  );
}
