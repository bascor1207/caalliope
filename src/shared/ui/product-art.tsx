interface Props {
  /** "tee" et "acc" partagent la silhouette t-shirt, le reste prend le hoodie. */
  kind: string;
  color?: string;
  title?: string;
  className?: string;
}

/**
 * Placeholder d'image produit : silhouette SVG teintée par `currentColor`.
 * Remplacé par <Image> dès qu'un produit a des photos.
 */
export function ProductArt({ kind, color, title, className }: Props) {
  const isTee = kind === "tee" || kind === "acc";
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      style={color ? { color } : undefined}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {isTee ? (
        <>
          <path
            fill="currentColor"
            d="M70 28l12-6c5 10 11 14 18 14s13-4 18-14l12 6 42 18c3 1 5 4 5 7l-7 46c-1 4-5 6-9 5l-18-6-4 110c0 3-2 6-5 6H64c-3 0-5-3-5-6l-4-110-18 6c-4 1-8-1-9-5l-7-46c0-3 2-6 5-7z"
          />
          <path fill="rgba(0,0,0,.12)" d="M82 22c5 10 11 14 18 14s13-4 18-14l4 2c-4 12-12 20-22 20s-18-8-22-20z" />
          <path fill="rgba(255,255,255,.16)" d="M70 28L28 46c-3 1-5 4-5 7l7 46c1 4 5 6 9 5l7-2z" />
          <path fill="rgba(0,0,0,.07)" d="M130 28l42 18c3 1 5 4 5 7l-7 46c-1 4-5 6-9 5l-7-2z" />
          <text
            x="100"
            y="92"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontWeight="800"
            fontSize="12"
            fill="rgba(20,20,20,.55)"
            letterSpacing="-.5"
          >
            KODA
          </text>
        </>
      ) : (
        <>
          <path
            fill="currentColor"
            d="M100 14c-17 0-34 11-40 28l-8 2c-10 3-18 10-22 20L10 128c-1 3 1 7 4 8l26 9 6 70c0 4 3 7 7 7h94c4 0 7-3 7-7l6-70 26-9c3-1 5-5 4-8l-20-64c-4-10-12-17-22-20l-8-2c-6-17-23-28-40-28z"
          />
          <path fill="rgba(0,0,0,.14)" d="M100 22c-13 0-25 8-30 20 6 11 17 18 30 18s24-7 30-18c-5-12-17-20-30-20z" />
          <path fill="rgba(255,255,255,.18)" d="M60 44l-8 2c-10 3-18 10-22 20L10 128c-1 3 1 7 4 8l12 4 24-96z" />
          <path fill="rgba(0,0,0,.08)" d="M140 44l8 2c10 3 18 10 22 20l20 62c1 3-1 7-4 8l-12 4-24-96z" />
          <rect x="62" y="150" width="76" height="40" rx="8" fill="rgba(0,0,0,.09)" />
          <path d="M90 58v34M110 58v30" stroke="rgba(0,0,0,.28)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontWeight="800"
            fontSize="13"
            fill="rgba(20,20,20,.6)"
            letterSpacing="-.5"
          >
            KODA
          </text>
          <rect x="46" y="206" width="108" height="14" rx="3" fill="rgba(0,0,0,.07)" />
        </>
      )}
    </svg>
  );
}
