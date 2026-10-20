import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import { Button } from "@/shared/ui";

/**
 * Hero éditorial. Le visuel (cartes produits) est injecté par la page : la home ne connaît pas le catalogue.
 * Si `SITE.media.heroVideo` est renseigné, la vidéo joue en fond sous les blobs pastel.
 */
export async function Hero({ visual }: { visual: ReactNode }) {
  const t = await getTranslations("home.hero");
  const video = SITE.media.heroVideo;
  const stats: Array<[string, string]> = [
    [t("meta1Value"), t("meta1")],
    [t("meta2Value"), t("meta2")],
    [t("meta3Value"), t("meta3")],
  ];
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate grid items-center overflow-hidden py-10 md:min-h-[calc(100svh-var(--spacing-header)-36px)] md:py-12"
    >
      {video && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          tabIndex={-1}
        />
      )}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="hero-blob -top-[25vmax] -left-[15vmax] size-[60vmax] bg-sage" />
        <div className="hero-blob -right-[10vmax] -bottom-[25vmax] size-[55vmax] bg-lavender [animation-delay:-6s]" />
        <div className="hero-blob top-[20%] right-[20%] size-[40vmax] bg-sky [animation-delay:-12s]" />
        <div className="hero-blob bottom-[10%] left-[25%] size-[35vmax] bg-clay opacity-70 [animation-delay:-3s]" />
      </div>
      <div className="hero-grain -z-10" aria-hidden="true" />
      <div className="container-k grid items-center gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)] md:gap-10">
        <div className="relative min-w-0">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full bg-ink/6 py-2 pr-3.5 pl-2.5 text-[12px] font-medium md:mb-7 md:text-[13px]">
            <span
              className="size-[9px] rounded-full bg-success shadow-[0_0_0_0_rgba(46,125,79,.5)] animate-pulse-dot"
              aria-hidden="true"
            />
            {t("tag")}
          </div>
          <h1 id="hero-title" className="text-[clamp(44px,6.2vw,96px)] leading-[0.92] tracking-[-0.045em]">
            <span className="hero-line">
              <span>{t("line1")}</span>
            </span>
            <span className="hero-line">
              <span className="serif text-[1.05em] text-ink-2">{t("line2")}</span>
            </span>
            <span className="hero-line">
              <span>{t("line3")}</span>
            </span>
          </h1>
          <p className="hero-fade mt-5 max-w-[520px] text-base text-ink-2 md:mt-7 md:text-lg" data-delay="1">
            {t("sub")}
          </p>
          <div className="hero-fade mt-7 flex flex-wrap gap-3 md:mt-9" data-delay="2">
            <Button asChild>
              <Link href={{ pathname: "/", hash: "drop" }}>
                {t("cta")} <ArrowRightIcon className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={{ pathname: "/", hash: "histoire" }}>{t("story")}</Link>
            </Button>
          </div>
          <div className="hero-fade mt-8 flex flex-wrap gap-5 md:mt-10 md:gap-7" data-delay="3">
            {stats.map(([value, label]) => (
              <div key={label}>
                <strong className="block font-display text-xl tracking-[-0.02em] md:text-[22px]">{value}</strong>
                <span className="text-[12px] text-muted md:text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 min-w-0 md:mt-0">{visual}</div>
      </div>
      <div
        className="scroll-hint absolute bottom-[22px] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted md:flex"
        aria-hidden="true"
      >
        <i />
        {t("scroll")}
      </div>
    </section>
  );
}
