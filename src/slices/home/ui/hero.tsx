import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import { Button } from "@/shared/ui";
import { HeroCountdown } from "./hero-countdown";

/** Hero éditorial. Le visuel (cartes produits) est injecté par la page : la home ne connaît pas le catalogue. */
export async function Hero({ visual }: { visual: ReactNode }) {
  const t = await getTranslations("home.hero");
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate grid min-h-[calc(100svh-var(--spacing-header)-36px)] items-center overflow-hidden py-12"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="hero-blob -top-[25vmax] -left-[15vmax] size-[60vmax] bg-sage" />
        <div className="hero-blob -right-[10vmax] -bottom-[25vmax] size-[55vmax] bg-lavender [animation-delay:-6s]" />
        <div className="hero-blob top-[20%] right-[20%] size-[40vmax] bg-sky [animation-delay:-12s]" />
        <div className="hero-blob bottom-[10%] left-[25%] size-[35vmax] bg-clay opacity-70 [animation-delay:-3s]" />
      </div>
      <div className="hero-grain -z-10" aria-hidden="true" />
      <div className="container-k grid items-center gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-ink/6 py-2 pr-3.5 pl-2.5 text-[13px] font-medium">
            <span
              className="size-[9px] rounded-full bg-success shadow-[0_0_0_0_rgba(46,125,79,.5)] animate-pulse-dot"
              aria-hidden="true"
            />
            {t("tag", { drop: SITE.dropName })} <HeroCountdown end={SITE.dropEnd} />
          </div>
          <h1 id="hero-title" className="text-[clamp(48px,6.2vw,96px)] leading-[0.92] tracking-[-0.045em]">
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
          <p className="hero-fade mt-7 max-w-[520px] text-lg text-ink-2" data-delay="1">
            {t("sub")}
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-3" data-delay="2">
            <Button asChild>
              <Link href={{ pathname: "/", hash: "drop" }}>
                {t("cta", { drop: SITE.dropName })} <ArrowRightIcon className="size-4" strokeWidth={2.5} />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={{ pathname: "/", hash: "histoire" }}>{t("story")}</Link>
            </Button>
          </div>
          <div className="hero-fade mt-10 flex flex-wrap gap-5 sm:gap-7" data-delay="3">
            {[
              [t("meta1Value"), t("meta1")],
              [t("meta2Value"), t("meta2")],
              ["4.9 ★", t("meta3")],
            ].map(([value, label]) => (
              <div key={label}>
                <strong className="block font-display text-[22px] tracking-[-0.02em]">{value}</strong>
                <span className="text-[13px] text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="-order-1 md:order-none">{visual}</div>
      </div>
      <div
        className="scroll-hint absolute bottom-[22px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted"
        aria-hidden="true"
      >
        <i />
        {t("scroll")}
      </div>
    </section>
  );
}
