import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");
  const cols = [
    {
      title: t("shop"),
      links: [
        [tc("labels.drop"), { pathname: "/", hash: "drop" }],
        [t("hoodies"), { pathname: "/", query: { filtre: "hoodie" }, hash: "drop" }],
        [t("tees"), { pathname: "/", query: { filtre: "tee" }, hash: "drop" }],
        [t("sweats"), { pathname: "/", query: { filtre: "sweat" }, hash: "drop" }],
        [tc("actions.sizeGuide"), "/guide-des-tailles"],
      ],
    },
    {
      title: t("brand"),
      links: [
        [t("story"), { pathname: "/", hash: "histoire" }],
        [t("faq"), { pathname: "/", hash: "faq" }],
      ],
      external: [
        ["Instagram", SITE.instagram],
        ["TikTok", SITE.tiktok],
      ],
    },
    {
      title: t("info"),
      links: [
        [t("shipping"), "/livraison"],
        [t("terms"), "/cgv"],
        [t("privacy"), "/confidentialite"],
      ],
      external: [[t("contact"), `mailto:${SITE.email}`]],
    },
  ] as const;

  return (
    <footer className="px-0 pt-[72px] pb-8">
      <div className="container-k">
        <div className="grid gap-8 border-b border-line pb-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link
              className="inline-flex items-center gap-2 font-display text-[26px] font-extrabold tracking-[-0.06em]"
              href="/"
            >
              <span
                className="size-2 rounded-full bg-sage shadow-[0_0_0_4px_rgba(191,211,193,.35)]"
                aria-hidden="true"
              />
              KODA
            </Link>
            <p className="mt-3 max-w-[320px] text-sm text-ink-2">{t("tagline")}</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-4 text-xs tracking-[0.16em]">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:underline hover:underline-offset-4">
                      {label}
                    </Link>
                  </li>
                ))}
                {"external" in col &&
                  col.external.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        rel="noopener"
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        className="hover:underline hover:underline-offset-4"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-6 text-xs text-muted">
          <span>{t("rights", { year: new Date().getFullYear() })}</span>
          <span>{t("payment")}</span>
        </div>
        <p className="mt-2 text-xs text-muted">
          {t.rich("credit", {
            name: SITE.developer.name,
            dev: (chunks) =>
              SITE.developer.url ? (
                <a
                  href={SITE.developer.url}
                  rel="noopener"
                  target="_blank"
                  className="font-semibold text-ink-2 hover:underline hover:underline-offset-4"
                >
                  {chunks}
                </a>
              ) : (
                <b className="font-semibold text-ink-2">{chunks}</b>
              ),
          })}
        </p>
        <div className="giant mt-12" aria-hidden="true">
          KODA
        </div>
      </div>
    </footer>
  );
}
