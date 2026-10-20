"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "./cn";

/* ---------- État partagé : une navigation est-elle en cours ? ---------- */
const listeners = new Set<() => void>();
let pending = false;
const emit = () => {
  for (const l of listeners) l();
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** À appeler avant un `router.push` programmatique (recherche, fin de commande) : les liens sont détectés seuls. */
export function startNavigation() {
  if (pending) return;
  pending = true;
  emit();
}
export function endNavigation() {
  if (!pending) return;
  pending = false;
  emit();
}

const SHOW_AFTER_MS = 120;
const MIN_VISIBLE_MS = 400;
const SAFETY_MS = 10_000;

const sameDocument = (href: string) => {
  const target = new URL(href, window.location.href);
  if (target.origin !== window.location.origin) return false;
  return target.pathname === window.location.pathname && target.search === window.location.search;
};

/** Clic sur un lien interne qui va changer de page (pas d'ancre, pas de nouvel onglet, pas de modificateur). */
const isInternalNavigation = (e: MouseEvent): boolean => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  const anchor = e.target instanceof Element ? e.target.closest("a[href]") : null;
  if (!anchor || anchor.getAttribute("target") === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href") ?? "";
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin && !sameDocument(href);
  } catch {
    return false;
  }
};

interface Props {
  label: string;
  logo: { src: string; size: number } | null;
}

/**
 * Loader global de navigation : voile opaque crème, logo animé au centre. N'apparaît qu'au-delà de 120 ms
 * (pas de flash sur les pages instantanées), reste au moins 400 ms une fois visible, disparaît au changement d'URL.
 */
export function NavigationLoader({ label, logo }: Props) {
  const isPending = useSyncExternalStore(
    subscribe,
    () => pending,
    () => false,
  );
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [visible, setVisible] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  // Fin de navigation : l'URL a changé.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname et search sont les déclencheurs.
  useEffect(() => {
    endNavigation();
  }, [pathname, search]);

  // Début de navigation : clic sur un lien interne, ou retour arrière.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isInternalNavigation(e)) startNavigation();
    };
    const onPop = () => startNavigation();
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  // Visibilité : délai avant affichage, durée minimale, garde-fou.
  useEffect(() => {
    if (isPending) {
      const show = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
      const safety = setTimeout(endNavigation, SAFETY_MS);
      return () => {
        clearTimeout(show);
        clearTimeout(safety);
      };
    }
    const hide = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);
    return () => clearTimeout(hide);
  }, [isPending]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-100 grid place-items-center bg-cream transition-opacity duration-300 ease-expo",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="relative grid size-[190px] place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-ink/10 border-t-ink animate-[spin_1.4s_linear_infinite]"
        />
        {logo && !logoFailed ? (
          <Image
            src={logo.src}
            alt=""
            width={logo.size}
            height={logo.size}
            priority={false}
            onError={() => setLogoFailed(true)}
            className="rounded-full object-cover animate-breathe"
          />
        ) : (
          <span className="inline-flex items-center gap-2 font-display text-[30px] font-bold tracking-[-0.06em] animate-breathe">
            <i aria-hidden="true" className="size-3 rounded-full bg-sage animate-pulse-dot" />
            KODA
          </span>
        )}
      </div>
      {visible && <span className="sr-only">{label}</span>}
    </div>
  );
}
