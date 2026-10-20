import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/shared/config/site";
import { SocialIcon } from "@/shared/ui";
import { activeNetworks, getSocialLinks } from "@/slices/marketing/public-server";

const NETWORK_LABELS = { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", youtube: "YouTube" } as const;

/**
 * Pied de page. Les réseaux et l'e-mail de contact viennent du back-office (repli : config du site).
 * Mobile : marque + réseaux en tête, puis les colonnes de liens côte à côte (pas une longue pile).
 */
export async function Footer() {
  const [t, tc, social] = await Promise.all([getTranslations("footer"), getTranslations("common"), getSocialLinks()]);
  const networks = activeNetworks(social);
  const cols = [
    {
      title: t("shop"),
      links: [
        [tc("labels.drop"), { pathname: "/", hash: "drop" }],
        [t("hoodies"), "/hoodies"],
        [t("sweats"), "/sweats"],
        [t("tees"), "/t-shirts"],
        [tc("actions.sizeGuide"), "/guide-des-tailles"],
      ],
    },
    {
      title: t("brand"),
      links: [
        [t("story"), { pathname: "/", hash: "histoire" }],
        [t("faq"), { pathname: "/", hash: "faq" }],
      ],
    },
    {
      title: t("info"),
      links: [
        [t("shipping"), "/livraison"],
        [t("terms"), "/cgv"],
        [t("privacy"), "/confidentialite"],
      ],
    },
  ] as const;

  return (
    <footer className="px-0 pt-14 pb-8 md:pt-[72px]">
      <div className="container-k">
        <div className="grid gap-10 border-b border-line pb-10 md:pb-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8">
          <div className="flex flex-col gap-5">
            <Link
              className="inline-flex items-center gap-2 font-display text-[26px] font-bold tracking-[-0.06em]"
              href="/"
            >
              <span
                className="size-2 rounded-full bg-sage shadow-[0_0_0_4px_rgba(191,211,193,.35)]"
                aria-hidden="true"
              />
              KODA
            </Link>
            <p className="max-w-[360px] text-sm text-ink-2">{t("tagline")}</p>
            <ul className="flex flex-wrap items-center gap-2" aria-label={t("follow")}>
              {networks.map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    rel="noopener"
                    target="_blank"
                    aria-label={NETWORK_LABELS[network]}
                    data-track={`footer.${network}`}
                    className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    <SocialIcon network={network} className="size-[18px]" />
                  </a>
                </li>
              ))}
              {social.email && (
                <li>
                  <a
                    href={`mailto:${social.email}`}
                    className="inline-flex h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    {t("contact")}
                  </a>
                </li>
              )}
            </ul>
          </div>
          {/* Mobile : Boutique à gauche, Marque + Infos empilées à droite ; dès sm : trois colonnes. */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {cols.map((col, i) => {
              const block = (
                <div key={col.title}>
                  <h2 className="eyebrow mb-4 text-xs tracking-[0.16em]">{col.title}</h2>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="hover:underline hover:underline-offset-4">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
              if (i === 1) return null;
              if (i === 2) {
                const brand = cols[1];
                return (
                  <div key="side" className="grid gap-8 sm:contents">
                    <div>
                      <h2 className="eyebrow mb-4 text-xs tracking-[0.16em]">{brand.title}</h2>
                      <ul className="space-y-2.5 text-sm">
                        {brand.links.map(([label, href]) => (
                          <li key={label}>
                            <Link href={href} className="hover:underline hover:underline-offset-4">
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {block}
                  </div>
                );
              }
              return block;
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-6 text-xs text-muted sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3">
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
        <div className="giant mt-10 md:mt-12" aria-hidden="true">
          KODA
        </div>
      </div>
    </footer>
  );
}
