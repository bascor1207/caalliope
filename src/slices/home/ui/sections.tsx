import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";
import { Button, Reveal } from "@/shared/ui";
import { faqFor } from "../content/faq";
import { FaqAccordion } from "./faq-accordion";

const SWATCHES = ["bg-sage", "bg-lavender", "bg-sky", "bg-clay", "bg-sand", "bg-butter"];

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
    <span key={key} className="inline-flex items-center gap-10">
      {items.map(([label, serif], i) => (
        <span key={label} className="inline-flex items-center gap-10">
          {serif ? <em className="serif text-muted">{label}</em> : label}
          <i className={`inline-block size-[0.7em] rounded-full ${SWATCHES[i]}`} />
        </span>
      ))}
    </span>
  );
  return (
    <div className="overflow-hidden border-y border-line bg-cream-2 py-[18px]" aria-hidden="true">
      <div className="marquee-track gap-10 font-display text-[clamp(20px,3vw,34px)] font-bold tracking-[-0.02em] animate-marquee-slow">
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
      className="story-glow relative mx-4 overflow-hidden rounded-[44px] bg-ink py-[clamp(72px,10vw,128px)] text-cream"
    >
      <div className="container-k grid items-center gap-14 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-cream/55">{t("eyebrow")}</p>
          <h2 id="story-title" className="mt-3.5 text-[clamp(40px,6vw,88px)] leading-[0.95] tracking-[-0.045em]">
            {t("title1")} <span className="serif text-sage">{t("titleSerif")}</span>
            <br />
            {t("title2")}
          </h2>
          <p className="mt-6 max-w-[520px] text-[19px] leading-relaxed text-cream/78">{t("lead")}</p>
        </Reveal>
        <ul className="grid gap-3.5">
          {values.map((n) => (
            <Reveal
              key={n}
              as="li"
              delay={n}
              className="grid grid-cols-[56px_1fr] items-start gap-[18px] rounded-card border border-cream/10 bg-cream/6 p-6 transition-[background-color,transform] duration-400 ease-expo hover:translate-x-1.5 hover:bg-cream/10"
            >
              <span className="serif text-[40px] leading-none text-sage">0{n}</span>
              <div>
                <h3 className="mb-1.5 text-xl">{t(`v${n}Title`)}</h3>
                <p className="text-[15px] text-cream/70">{t(`v${n}`)}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Specs() {
  const t = await getTranslations("home.specs");
  const rows = ["fabric", "fit", "details", "making", "care"] as const;
  return (
    <section aria-labelledby="specs-title" className="py-[clamp(72px,10vw,128px)]">
      <div className="container-k grid items-center gap-12 md:grid-cols-[1.1fr_.9fr]">
        <Reveal className="relative grid aspect-square place-items-center overflow-hidden rounded-card bg-linear-145 from-sand to-clay">
          <div className="spec-ring size-[60%]" />
          <div className="spec-ring size-[80%] [animation-direction:reverse] [animation-duration:9s]" />
          <div className="spec-ring size-full [animation-duration:13s]" />
          <div className="text-center font-display text-[clamp(60px,10vw,120px)] font-extrabold leading-none tracking-[-0.06em]">
            330
            <small className="serif block text-[0.25em] text-ink-2">{t("big")}</small>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="specs-title" className="mt-3 text-[clamp(34px,4.5vw,56px)]">
            {t("title")} <span className="serif">{t("titleSerif")}</span>
          </h2>
          <ul className="mt-7 border-t border-line">
            {rows.map((row) => (
              <li key={row} className="grid gap-1.5 border-b border-line py-[18px] sm:grid-cols-[140px_1fr] sm:gap-4">
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
    <section aria-labelledby="ugc-title" className="pb-[clamp(72px,10vw,128px)]">
      <div className="container-k">
        <Reveal className="mb-11 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 id="ugc-title" className="mt-2.5 text-[clamp(36px,5.5vw,72px)] tracking-[-0.04em]">
              {t("title")} <span className="serif">{t("titleSerif")}</span>
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href={SITE.instagram} rel="noopener" target="_blank">
              {t("follow", { handle: SITE.instagramHandle })}
            </a>
          </Button>
        </Reveal>
        <Reveal className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6" delay={1} aria-label={t("aria")}>
          {posts.map(([handle, bg], i) => (
            <div
              key={handle}
              className={`ugc-tile relative grid aspect-[4/5] place-items-end overflow-hidden rounded-sm p-3 text-xs font-semibold text-ink/70 ${bg} ${i % 2 === 0 ? "translate-y-[18px]" : ""}`}
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
    <section id="faq" aria-labelledby="faq-title" className="pb-[clamp(72px,10vw,128px)]">
      <div className="container-k">
        <Reveal className="mx-auto max-w-[820px]">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 id="faq-title" className="mt-3 mb-7 text-[clamp(34px,4.5vw,56px)]">
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
      className="relative mx-4 overflow-hidden rounded-[44px] bg-linear-135 from-lavender via-sky to-sage py-[clamp(72px,10vw,128px)]"
    >
      <Reveal className="container-k max-w-[760px] text-center">
        <p className="eyebrow text-ink-2">{t("eyebrow")}</p>
        <h2 id="news-title" className="mt-3.5 text-[clamp(36px,6vw,80px)] leading-[0.95] tracking-[-0.045em]">
          {t("title")} <span className="serif">{t("titleSerif")}</span>
        </h2>
        <p className="mx-auto my-5 mb-8 max-w-[520px] text-lg text-ink-2">{t("text")}</p>
        {children}
      </Reveal>
    </section>
  );
}
