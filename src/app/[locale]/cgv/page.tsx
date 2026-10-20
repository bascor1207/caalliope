import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates } from "@/shared/seo/metadata";
import { InfoPage } from "../../_shell/info-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.terms" });
  return { title: t("title"), description: t("description"), alternates: localizedAlternates(locale, "/cgv") };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.terms");
  const tc = await getTranslations("common");
  return (
    <InfoPage
      locale={locale}
      pathname="/cgv"
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("heading")} <span className="serif">{t("headingSerif")}</span>
        </>
      }
      breadcrumb={{ home: tc("labels.home"), name: t("title") }}
    >
      <p>{t("intro")}</p>
      {(["s1", "s2", "s3", "s4"] as const).map((s) => (
        <div key={s} className="contents">
          <h2>{t(s)}</h2>
          <p>{t(`${s}Text`)}</p>
        </div>
      ))}
    </InfoPage>
  );
}
