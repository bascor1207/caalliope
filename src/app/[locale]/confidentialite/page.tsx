import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SITE } from "@/shared/config/site";
import type { Locale } from "@/shared/kernel/locale";
import { localizedAlternates } from "@/shared/seo/metadata";
import { InfoPage } from "../../_shell/info-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.privacy" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: localizedAlternates(locale, "/confidentialite"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.privacy");
  const tc = await getTranslations("common");
  return (
    <InfoPage
      locale={locale}
      pathname="/confidentialite"
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("heading")} <span className="serif">{t("headingSerif")}</span>
        </>
      }
      breadcrumb={{ home: tc("labels.home"), name: t("title") }}
    >
      <p>{t("intro")}</p>
      <h2>{t("s1")}</h2>
      <p>{t("s1Text")}</p>
      <h2>{t("s2")}</h2>
      <p>{t("s2Text")}</p>
      <h2>{t("s3")}</h2>
      <p>
        {t("s3Text")}{" "}
        <a className="underline underline-offset-[3px]" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </p>
    </InfoPage>
  );
}
