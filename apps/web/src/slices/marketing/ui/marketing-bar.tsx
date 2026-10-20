import { Link } from "@/i18n/navigation";
import type { Banner } from "../domain/banner";

/** Espace marketing au-dessus du header : marquee des bannières actives. Rendu serveur, zéro JS. */
export function MarketingBar({ banners, label }: { banners: Banner[]; label: string }) {
  if (banners.length === 0) return null;
  const items = [...banners, ...banners];
  return (
    <div
      className="flex h-9 items-center overflow-hidden whitespace-nowrap bg-ink text-[12px] font-medium uppercase tracking-[0.04em] text-cream md:text-[12.5px]"
      role="region"
      aria-label={label}
    >
      <div className="marquee-track gap-12 pl-6 animate-marquee" aria-hidden="true">
        {items.map((b, i) => (
          <span key={`${b.id}-${i}`} className="after:ml-12 after:opacity-50 after:content-['✦']">
            {b.href ? (
              // biome-ignore lint/suspicious/noExplicitAny: chemin interne libre (contenu éditable), hors typage strict des pathnames.
              <Link
                href={b.href as any}
                className="hover:underline hover:underline-offset-4"
                tabIndex={-1}
                data-track={`marketing.${b.id}`}
              >
                {b.message}
              </Link>
            ) : (
              b.message
            )}
          </span>
        ))}
      </div>
      <p className="sr-only">{banners.map((b) => b.message).join(". ")}.</p>
    </div>
  );
}
