"use client";

/** Dernier filet : le layout racine lui-même a cassé. Pas d'i18n ni de design system ici, par construction. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f6f1ea", color: "#141414", margin: 0 }}>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.6 }}>Oups</p>
          <h1 style={{ fontSize: 40, lineHeight: 1.05, margin: "12px 0 16px" }}>Quelque chose a cassé.</h1>
          <p style={{ opacity: 0.8 }}>Réessaie dans un instant. Si ça continue, écris-nous : on répare vite.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "14px 24px",
              borderRadius: 999,
              background: "#141414",
              color: "#f6f1ea",
              border: 0,
              fontWeight: 600,
            }}
          >
            Réessayer
          </button>
          {error.digest && <p style={{ marginTop: 32, fontSize: 12, opacity: 0.5 }}>Réf. {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
