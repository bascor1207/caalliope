import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";
import { Button, Reveal } from "@/shared/ui";
import { faqFor } from "../content/faq";
import { BrandVideo } from "./brand-video";
import { FaqAccordion } from "./faq-accordion";

const SWATCHES = ["bg-sage", "bg-lavender", "bg-sky", "bg-clay", "bg-sand", "bg-butter"];
const SECTION = "py-[clamp(56px,10vw,128px)]";

export async function ValuesMarquee() {
  const t = await getTranslations("home.marquee");
  const items: Array<[string, boolean]> = [
    [t("quality"), false],
    [t("authenticity"), false],
    [t("respect"), false],
    [t("friendship"), true],
    [t("cotton"), false],
    [t("smallBatch"), false],
  ];
  const row = (key: string) => (
    <span key={key} className="inline-flex items-center gap-8 md:gap-10">
      {items.map(([label, serif], i) => (
        <span key={label} className="inline-flex items-center gap-8 md:gap-10">
          {serif ? <em className="serif text-ink-2">{label}</em> : label}
          <i className={`inline-block size-[0.7em] rounded-full ${SWATCHES[i]}`} />
        </span>
      ))}
    </span>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-cream-2 py-3.5 md:py-[18px]" aria-hidden="true">
      <div className="marquee-track gap-8 font-display text-[clamp(18px,3vw,34px)] font-bold tracking-[-0.02em] animate-marquee-slow md:gap-10">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

export async function Story() {
  const t = await getTranslations("home.story");
  const values = [1, 2, 3] as const;
  return (
    <section
      id="histoire"
      aria-labelledby="story-title"
      className={`story-glow relative mx-3 overflow-hidden rounded-[28px] bg-ink text-cream md:mx-4 md:rounded-[44px] ${SECTION}`}
    >
      <div className="container-k grid items-center gap-9 md:grid-cols-2 md:gap-14">
        <Reveal>
          <p className="eyebrow text-cream/55">{t("eyebrow")}</p>
          <h2 id="story-title" className="mt-3.5 text-[clamp(32px,5.2vw,72px)] leading-[1] tracking-[-0.03em]">
            {t("title1")} <span className="serif text-sage">{t("titleSerif")}</span>
            <br />
            {t("title2")}
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-cream/78 md:mt-6 md:text-[19px]">
            {t("lead")}
          </p>
        </Reveal>
        <ul className="grid gap-3 md:gap-3.5">
          {values.map((n) => (
            <Reveal
              key={n}
              as="li"
              delay={n}
              className="grid grid-cols-[44px_1fr] items-start gap-3.5 rounded-[18px] border border-cream/10 bg-cream/6 p-4 transition-[background-color,transform] duration-400 ease-expo hover:translate-x-1.5 hover:bg-cream/10 md:grid-cols-[56px_1fr] md:gap-[18px] md:rounded-card md:p-6"
            >
              <span className="serif text-[32px] leading-none text-sage md:text-[40px]">0{n}</span>
              <div>
                <h3 className="mb-1.5 text-lg md:text-xl">{t(`v${n}Title`)}</h3>
                <p className="text-sm text-cream/70 md:text-[15px]">{t(`v${n}`)}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Vidéo de marque (macro broderie) : plein cadre, texte en surimpression. Se replie si le fichier manque. */
export async function BrandVideoSection() {
  const t = await getTranslations("home.video");
  const video = SITE.media.storyVideo;
  if (!video) return null;
  return (
    <section aria-labelledby="video-title" className="pt-[clamp(56px,10vw,128px)]">
      <div className="container-k">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sand md:aspect-[21/9] md:rounded-card">
          <BrandVideo src={video.src} poster={video.poster} className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden="true" />
          <div className="absolute right-5 bottom-5 left-5 text-cream md:right-10 md:bottom-10 md:left-10">
            <p className="eyebrow text-cream/70">{t("eyebrow")}</p>
            <h2 id="video-title" className="mt-2 text-[clamp(28px,4.4vw,56px)] leading-[1] tracking-[-0.03em]">
              {t("title")} <span className="serif">{t("titleSerif")}</span>
            </h2>
            <p className="mt-3 max-w-[460px] text-sm text-cream/80 md:text-base">{t("text")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export async function Specs() {
  const t = await getTranslations("home.specs");
  const rows = ["fabric", "fit", "details", "making", "care"] as const;
  return (
    <section aria-labelledby="specs-title" className={SECTION}>
      <div className="container-k grid items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-12">
        <Reveal className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[28px] bg-linear-145 from-sand to-clay md:aspect-square md:rounded-card">
          <div className="spec-ring size-[60%]" />
          <div className="spec-ring size-[80%] [animation-direction:reverse] [animation-duration:9s]" />
          <div className="spec-ring size-full [animation-duration:13s]" />
          <div className="text-center font-display text-[clamp(60px,10vw,120px)] font-bold leading-none tracking-[-0.06em]">
            330
            <small className="serif block text-[0.25em] text-ink-2">{t("big")}</small>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="specs-title" className="mt-3 text-[clamp(28px,4vw,50px)]">
            {t("title")} <span className="serif">{t("titleSerif")}</span>
          </h2>
          <ul className="mt-6 border-t border-line md:mt-7">
            {rows.map((row) => (
              <li
                key={row}
                className="grid gap-1 border-b border-line py-3.5 text-[15px] sm:grid-cols-[140px_1fr] sm:gap-4 md:py-[18px] md:text-base"
              >
                <b className="eyebrow pt-[3px]">{t(row)}</b>
                <span>{t(`${row}Text`)}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export async function Community() {
  const t = await getTranslations("home.community");
  const posts: Array<[string, string]> = [
    ["@lea.m", "bg-sage"],
    ["@tomdrv", "bg-lavender"],
    ["@inès.k", "bg-sky"],
    ["@mathis_", "bg-sand"],
    ["@chloe.rr", "bg-clay"],
    ["@yanisb", "bg-chalk"],
  ];
  return (
    <section aria-labelledby="ugc-title" className="pb-[clamp(56px,10vw,128px)]">
      <div className="container-k">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-11 md:gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="ugc-title" className="mt-2.5 text-[clamp(30px,4.8vw,60px)] tracking-[-0.03em]">
              {t("title")} <span className="serif">{t("titleSerif")}</span>
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href={SITE.instagram} rel="noopener" target="_blank" data-track="community.follow">
              {t("follow", { handle: SITE.instagramHandle })}
            </a>
          </Button>
        </Reveal>
        <Reveal
          className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden"
          delay={1}
          role="region"
          aria-label={t("aria")}
          tabIndex={0}
        >
          {posts.map(([handle, bg], i) => (
            <div
              key={handle}
              className={`ugc-tile relative grid aspect-[4/5] w-[42vw] shrink-0 snap-start place-items-end overflow-hidden rounded-sm p-3 text-xs font-semibold text-ink/70 md:w-auto ${bg} ${i % 2 === 0 ? "md:translate-y-[18px]" : ""}`}
            >
              <span className="relative">{handle}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export async function Faq({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.faq");
  return (
    <section id="faq" aria-labelledby="faq-title" className="pb-[clamp(56px,10vw,128px)]">
      <div className="container-k">
        <Reveal className="mx-auto max-w-[820px]">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="faq-title" className="mt-3 mb-5 text-[clamp(28px,4vw,50px)] md:mb-7">
            {t("title")} <span className="serif">{t("titleSerif")}</span>
          </h2>
          <FaqAccordion items={faqFor(locale)} />
          <p className="mt-5 text-sm text-muted">
            {t("sizeQuestion")}{" "}
            <Link className="underline underline-offset-[3px]" href="/guide-des-tailles">
              {t("sizeLink")}
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export async function NewsletterSection({ children }: { children: ReactNode }) {
  const t = await getTranslations("home.newsletter");
  return (
    <section
      aria-labelledby="news-title"
      className={`relative mx-3 overflow-hidden rounded-[28px] bg-linear-135 from-lavender via-sky to-sage md:mx-4 md:rounded-[44px] ${SECTION}`}
    >
      <Reveal className="container-k max-w-[760px] text-center">
        <p className="eyebrow text-ink-2">{t("eyebrow")}</p>
        <h2 id="news-title" className="mt-3.5 text-[clamp(30px,5.2vw,64px)] leading-[1] tracking-[-0.03em]">
          {t("title")} <span className="serif">{t("titleSerif")}</span>
        </h2>
        <p className="mx-auto my-5 mb-7 max-w-[520px] text-base text-ink-2 md:mb-8 md:text-lg">{t("text")}</p>
        {children}
      </Reveal>
    </section>
  );
}
