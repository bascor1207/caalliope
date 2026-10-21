"use client";

import { useEffect } from "react";

/**
 * Frontière d'erreur de l'admin : au lieu de la page blanche « This page couldn't load », on montre le message et le
 * digest (identifiant de l'erreur dans les journaux Vercel) et on propose de réessayer.
 */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[admin] erreur de page", error);
  }, [error]);
  return (
    <main className="mx-auto w-full max-w-[720px] px-5 pt-10 pb-12 md:px-9">
      <p className="eyebrow">KODA Clothing</p>
      <h1 className="mt-2 text-[clamp(28px,4vw,40px)] leading-none tracking-[-0.03em]">Cette page a planté</h1>
      <p className="mt-3 text-[15px] text-muted">
        Le serveur n'a pas pu afficher la page. Copie le détail ci-dessous pour le signaler, puis réessaie.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-[12px] bg-ink p-4 text-xs leading-relaxed text-cream">
        {`${error.name}: ${error.message}${error.digest ? `\ndigest: ${error.digest}` : ""}`}
      </pre>
      <button type="button" onClick={reset} className="btn mt-5">
        Réessayer
      </button>
    </main>
  );
}
