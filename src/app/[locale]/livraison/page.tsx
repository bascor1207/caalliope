import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/shared/kernel/locale";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/shared/kernel/shipping-policy";
import { localizedAlternates } from "@/shared/seo/metadata";
import { InfoPage } from "../../_shell/info-page";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.shipping" });
  return { title: t("title"), description: t("description"), alternates: localizedAlternates(locale, "/livraison") };
}

export default async function ShippingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.shipping");
  const tc = await getTranslations("common");
  const format = await getFormatter();
  return (
    <InfoPage
      locale={locale}
      pathname="/livraison"
      eyebrow={t("eyebrow")}
      title={
        <>
          {t("heading")} <span className="serif">{t("headingSerif")}</span>
        </>
      }
      breadcrumb={{ home: tc("labels.home"), name: t("title") }}
    >
      <h2>{t("shippingTitle")}</h2>
      <p>
        {t.rich("shipping1", {
          free: format.number(FREE_SHIPPING_FROM, "eur"),
          fee: format.number(SHIPPING_FEE, "eur"),
          b: (c) => <b>{c}</b>,
        })}
      </p>
      <p>{t("shipping2")}</p>
      <h2>{t("returnsTitle")}</h2>
      <ul>
        {t("returns")
          .split("|")
          .map((item) => (
            <li key={item}>{item}</li>
          ))}
      </ul>
    </InfoPage>
  );
}
